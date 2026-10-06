import { NextRequest } from 'next/server';
import { requireAdmin } from '@/lib/middleware/admin.middleware';
import { handleError } from '@/lib/utils/errors';
import { createClient } from '@supabase/supabase-js';

const MIGRATION_KEY = 'image_migration';
const BACKUP_KEY = 'image_migration_backup';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

function needsMigration(image: unknown): boolean {
  return typeof image === 'string' && image.startsWith('data:');
}

function dataUriToBlob(dataUri: string): { blob: Blob; ext: string; type: string } {
  const match = dataUri.match(/^data:([^;,]+)(;base64)?,(.*)$/s);
  if (!match) {
    throw new Error('Invalid data URI');
  }
  const type = match[1] || 'image/jpeg';
  const isBase64 = !!match[2];
  const payload = match[3];
  const base64 = isBase64 ? payload : btoa(unescape(encodeURIComponent(payload)));
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  const ext = (type.split('/')[1] || 'jpg').replace('jpeg', 'jpg').split('+')[0];
  return { blob: new Blob([bytes], { type }), ext, type };
}

async function getSupabase() {
  if (!url || !serviceRoleKey) return null;
  return createClient(url, serviceRoleKey);
}

async function getSetting(supabase: any, key: string) {
  const { data } = await supabase.from('settings').select('value').eq('key', key).maybeSingle();
  return data?.value ?? null;
}

async function setSetting(supabase: any, key: string, value: any) {
  const { data: existing } = await supabase.from('settings').select('key').eq('key', key).maybeSingle();
  if (existing) {
    await supabase.from('settings').update({ value }).eq('key', key);
  } else {
    await supabase.from('settings').insert({ key, value });
  }
}

export async function GET(request: NextRequest) {
  try {
    await requireAdmin(request);
    const supabase = await getSupabase();
    if (!supabase) return Response.json({ error: 'Storage not configured' }, { status: 503 });

    const { data: products, error } = await supabase.from('products').select('id, name, image, background_image').order('sort_order');
    if (error) throw error;

    const pending: any[] = [];
    let pendingBytes = 0;
    for (const p of products) {
      for (const field of ['image', 'background_image']) {
        const value = p[field];
        if (!needsMigration(value)) continue;
        const bytes = Math.round(new Blob([value]).size / 1024);
        pendingBytes += bytes;
        pending.push({ product_id: p.id, name: p.name, field, bytes });
      }
    }

    const migration = (await getSetting(supabase, MIGRATION_KEY)) ?? [];
    const appliedCount = migration.filter((m: any) => m.status === 'applied').length;

    return Response.json({
      pendingCount: pending.length,
      pendingBytes,
      pending,
      migratedCount: migration.length,
      appliedCount,
      nonDataProducts: products.filter((p: any) => p.image && !needsMigration(p.image)).length,
    });
  } catch (error) {
    return handleError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await requireAdmin(request);
    const body = await request.json().catch(() => ({}));
    const { phase } = body as { phase: 'scan' | 'run' | 'apply' | 'rollback' };

    const supabase = await getSupabase();
    if (!supabase) return Response.json({ error: 'Storage not configured' }, { status: 503 });

    if (!supabase.storage) return Response.json({ error: 'Storage unavailable' }, { status: 503 });

    const { error: bucketError } = await supabase.storage.getBucket('product-images');
    if (bucketError?.message?.includes('not found')) {
      const { error: createError } = await supabase.storage.createBucket('product-images', { public: true });
      if (createError) return Response.json({ error: `Bucket creation failed: ${createError.message}` }, { status: 500 });
    }

    if (phase === 'run' || phase === 'scan') {
      const migration = (await getSetting(supabase, MIGRATION_KEY)) ?? [];

      const { data: products, error } = await supabase.from('products').select('id, name, image, background_image').order('sort_order');
      if (error) throw error;

      const results: any[] = [];
      for (const p of products) {
        for (const field of ['image', 'background_image']) {
          const value = p[field];
          if (!needsMigration(value)) continue;
          const existing = migration.find((m: any) => m.product_id === p.id && m.field === field);
          if (existing?.status === 'applied' || existing?.new_url) {
            results.push({ product_id: p.id, field, skipped: true, url: existing.new_url });
            continue;
          }

          let newUrl = existing?.new_url;
          let uploaded = false;
          if (!newUrl) {
            const { blob, ext, type } = dataUriToBlob(value as string);
            const fileName = `product-${p.id}-${field}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}.${ext}`;
            const { data: uploadData, error: uploadError } = await supabase.storage
              .from('product-images')
              .upload(fileName, blob, { upsert: true, contentType: type });
            if (uploadError) return Response.json({ error: `Upload ${p.id}/${field} failed: ${uploadError.message}` }, { status: 500 });
            const { data: urlData } = supabase.storage.from('product-images').getPublicUrl(uploadData.path);
            newUrl = urlData.publicUrl;
            uploaded = true;
          }

          const record = {
            product_id: p.id,
            field,
            new_url: newUrl,
            old_hash: `${(value as string).length}-${(value as string).slice(-16)}`,
            status: 'queued' as const,
            migrated_at: uploaded ? new Date().toISOString() : existing?.migrated_at,
          };

          const idx = migration.findIndex((m: any) => m.product_id === p.id && m.field === field);
          if (idx >= 0) migration[idx] = record;
          else migration.push(record);

          results.push({ product_id: p.id, field, url: newUrl, uploaded });
        }
      }

      const pruned = migration.filter((m: any) => m.status !== 'applied' || true);
      await setSetting(supabase, MIGRATION_KEY, pruned);

      return Response.json({ ok: true, phase, results, migratedCount: pruned.filter((m: any) => m.new_url).length });
    }

    if (phase === 'apply') {
      const migration = (await getSetting(supabase, MIGRATION_KEY)) ?? [];
      const queued = migration.filter((m: any) => m.status !== 'applied' && m.new_url);
      if (queued.length === 0) {
        return Response.json({ ok: true, applied: 0, message: 'Nothing to apply. Run migration first.' });
      }

      const backup = (await getSetting(supabase, BACKUP_KEY)) ?? [];

      const applied: any[] = [];
      for (const record of queued) {
        const { data: product, error: fetchError } = await supabase
          .from('products')
          .select('id, image, background_image')
          .eq('id', record.product_id)
          .maybeSingle();
        if (fetchError) continue;

        const oldValue = product?.[record.field];
        if (typeof oldValue === 'string' && oldValue.startsWith('data:')) {
          if (!backup.find((b: any) => b.product_id === record.product_id && b.field === record.field)) {
            backup.push({ product_id: record.product_id, field: record.field, old_value: oldValue, backed_up_at: new Date().toISOString() });
          }
        }

        const { error: updateError } = await supabase
          .from('products')
          .update({ [record.field]: record.new_url })
          .eq('id', record.product_id);
        if (updateError) continue;

        record.status = 'applied';
        record.applied_at = new Date().toISOString();
        applied.push({ product_id: record.product_id, field: record.field, url: record.new_url });
      }

      await setSetting(supabase, MIGRATION_KEY, migration);
      await setSetting(supabase, BACKUP_KEY, backup);

      return Response.json({ ok: true, phase, applied: applied.length, applied });
    }

    if (phase === 'rollback') {
      const backup = (await getSetting(supabase, BACKUP_KEY)) ?? [];
      if (backup.length === 0) {
        return Response.json({ ok: true, rolledBack: 0, message: 'No backups to roll back.' });
      }
      const migration = (await getSetting(supabase, MIGRATION_KEY)) ?? [];
      const rolledBack: any[] = [];
      for (const record of backup) {
        const { error: updateError } = await supabase
          .from('products')
          .update({ [record.field]: record.old_value })
          .eq('id', record.product_id);
        if (updateError) continue;
        const m = migration.find((x: any) => x.product_id === record.product_id && x.field === record.field);
        if (m) m.status = 'rolled_back';
        rolledBack.push({ product_id: record.product_id, field: record.field });
      }
      await setSetting(supabase, MIGRATION_KEY, migration);
      return Response.json({ ok: true, phase, rolledBack: rolledBack.length });
    }

    return Response.json({ error: 'Unknown phase' }, { status: 400 });
  } catch (error) {
    return handleError(error);
  }
}