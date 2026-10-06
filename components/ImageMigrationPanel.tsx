"use client"

import { useState, useCallback } from 'react'
import { Package, UploadCloud, CheckCircle2, RotateCcw, RefreshCw } from 'lucide-react'
import { toast } from 'sonner'

interface ScanResult {
  pendingCount: number
  pendingBytes: number
  migratedCount: number
  appliedCount: number
  pending: { product_id: number; name: string; field: string; bytes: number }[]
}

function fmtKB(bytes: number): string {
  if (bytes < 1024) return `${bytes} KB`
  return `${(bytes / 1024).toFixed(1)} MB`
}

export default function ImageMigrationPanel() {
  const [scan, setScan] = useState<ScanResult | null>(null)
  const [busy, setBusy] = useState(false)

  const authHeaders = useCallback(async (): Promise<Record<string, string>> => {
    const { supabase } = await import('@/lib/supabase')
    const { data } = await supabase.auth.getSession()
    return { Authorization: `Bearer ${data.session?.access_token}` }
  }, [])

  const run = async (phase: 'scan' | 'run' | 'apply' | 'rollback') => {
    setBusy(true)
    try {
      const headers = await authHeaders()
      const res = await fetch('/api/admin/migrate-images', {
        method: 'POST',
        headers: { ...headers, 'Content-Type': 'application/json' },
        body: JSON.stringify({ phase }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data.error || 'Request failed')

      if (phase === 'scan') {
        const scanRes = await fetch('/api/admin/migrate-images', { headers })
        const scanData = await scanRes.json().catch(() => null)
        setScan(scanData)
      } else if (phase === 'run' || phase === 'apply') {
        setScan(prev => prev && { ...prev, appliedCount: prev.appliedCount >= 0 && phase === 'apply' ? data.applied ?? prev.appliedCount : prev.appliedCount })
        const scanRes = await fetch('/api/admin/migrate-images', { headers })
        const scanData = await scanRes.json().catch(() => null)
        setScan(scanData)
      }

      if (phase === 'run') toast.success(`Uploaded ${data.results?.length ?? 0} image(s) to storage. Ready to apply.`)
      if (phase === 'apply') toast.success(`Applied ${data.applied ?? 0} product image(s). Optimized images now serve from CDN.`)
      if (phase === 'rollback') toast.success(`Rolled back ${data.rolledBack ?? 0} product image(s).`)
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Request failed')
    }
    setBusy(false)
  }

  return (
    <div className="glass-card rounded-xl p-6 mt-10">
      <div className="flex items-center gap-3 mb-2">
        <UploadCloud className="w-6 h-6 text-primary" />
        <h2 className="font-serif text-xl text-foreground">Image Migration</h2>
        <span className="text-xs text-muted-foreground">Move base64 product images to Supabase Storage (2-phase)</span>
      </div>
      <p className="text-base text-muted-foreground mb-5">
        Products with images stored as base64 make the homepage ~15 MB. Migrating them to storage cuts page weight to
        ~150 KB and speeds up every load — the biggest single SEO win.
      </p>

      <div className="flex flex-wrap gap-3 mb-6">
        <button
          onClick={() => run('scan')}
          disabled={busy}
          className="flex items-center gap-2 px-5 py-2.5 border border-border/50 text-muted-foreground rounded-lg text-sm tracking-[0.1em] hover:border-primary/40 transition-colors disabled:opacity-50 cursor-pointer"
        >
          <RefreshCw className="w-4 h-4" /> SCAN
        </button>
        <button
          onClick={() => run('run')}
          disabled={busy}
          className="flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm tracking-[0.1em] hover:bg-primary/90 transition-colors disabled:opacity-50 cursor-pointer"
        >
          <UploadCloud className="w-4 h-4" /> PHASE 1 — UPLOAD TO STORAGE
        </button>
        <button
          onClick={() => run('apply')}
          disabled={busy}
          className="flex items-center gap-2 px-5 py-2.5 bg-primary/85 text-primary-foreground rounded-lg text-sm tracking-[0.1em] hover:bg-primary/90 transition-colors disabled:opacity-50 cursor-pointer"
          title="Point products to the CDN URLs. Original base64 is backed up in settings before overwrite — nothing is lost."
        >
          <CheckCircle2 className="w-4 h-4" /> PHASE 2 — APPLY URLS
        </button>
        <button
          onClick={() => run('rollback')}
          disabled={busy}
          className="flex items-center gap-2 px-5 py-2.5 border border-destructive/40 text-destructive rounded-lg text-sm tracking-[0.1em] hover:bg-destructive/10 transition-colors disabled:opacity-50 cursor-pointer"
          title="Restore original base64 images from backup."
        >
          <RotateCcw className="w-4 h-4" /> ROLLBACK
        </button>
      </div>

      {busy && <p className="text-sm text-muted-foreground animate-pulse">Working…</p>}

      {scan && (
        <div className="grid sm:grid-cols-4 gap-3 mb-4">
          <div className="p-4 rounded-lg border border-border/30 bg-background/40">
            <p className="text-2xl font-serif text-foreground">{scan.pendingCount}</p>
            <p className="text-xs text-muted-foreground">Base64 images to migrate</p>
          </div>
          <div className="p-4 rounded-lg border border-border/30 bg-background/40">
            <p className="text-2xl font-serif text-foreground">{fmtKB(scan.pendingBytes)}</p>
            <p className="text-xs text-muted-foreground">Total weight to remove</p>
          </div>
          <div className="p-4 rounded-lg border border-border/30 bg-background/40">
            <p className="text-2xl font-serif text-foreground">{scan.migratedCount}</p>
            <p className="text-xs text-muted-foreground">Migrated to storage</p>
          </div>
          <div className="p-4 rounded-lg border border-border/30 bg-background/40">
            <p className="text-2xl font-serif text-foreground">{scan.appliedCount}</p>
            <p className="text-xs text-muted-foreground">Applied to products</p>
          </div>
        </div>
      )}

      {scan && scan.pending.length > 0 && (
        <div className="max-h-60 overflow-auto rounded-lg border border-border/30">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-muted-foreground border-b border-border/30">
                <th className="px-4 py-2">Product</th>
                <th className="px-4 py-2">Field</th>
                <th className="px-4 py-2">Size</th>
              </tr>
            </thead>
            <tbody>
              {scan.pending.map((p, i) => (
                <tr key={i} className="border-b border-border/10 last:border-0">
                  <td className="px-4 py-2 text-foreground">{p.name}</td>
                  <td className="px-4 py-2 text-muted-foreground">{p.field}</td>
                  <td className="px-4 py-2 text-muted-foreground">{fmtKB(p.bytes)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {scan && scan.pendingCount === 0 && scan.migratedCount === 0 && (
        <div className="flex items-center gap-3 text-muted-foreground">
          <Package className="w-5 h-5" />
          <p className="text-sm">No base64 product images found — all good.</p>
        </div>
      )}
    </div>
  )
}