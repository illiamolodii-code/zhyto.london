"use client"

import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { useLanguage } from '@/components/language-context'
import { toast } from 'sonner'
import { Instagram, Check, Copy } from 'lucide-react'

interface InstagramOrderModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  message: string
}

const INSTAGRAM_LINK = 'https://ig.me/m/zhyto.london'

export function InstagramOrderModal({ open, onOpenChange, message }: InstagramOrderModalProps) {
  const { t } = useLanguage()
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message)
      setCopied(true)
      toast.success(t.checkout.orderCopied)
      setTimeout(() => setCopied(false), 2500)
    } catch {
      // fallback: select text in the textarea
      const ta = document.getElementById('ig-order-message') as HTMLTextAreaElement | null
      if (ta) {
        ta.focus()
        ta.select()
      }
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-background border-border/30 sm:max-w-md max-h-[100dvh] sm:max-h-[90vh] flex flex-col p-4 sm:p-6 max-sm:max-w-full max-sm:rounded-none max-sm:left-0 max-sm:right-0 max-sm:bottom-0 max-sm:top-auto max-sm:translate-y-0 max-sm:translate-x-0 overflow-x-hidden gap-2">
        <DialogHeader>
          <DialogTitle className="font-serif text-2xl tracking-[0.1em] text-foreground text-center">
            {t.checkout.orderMessageTitle}
          </DialogTitle>
        </DialogHeader>

        <p className="text-[14px] text-muted-foreground text-center leading-relaxed">
          {t.checkout.instagramDone}
        </p>

        <textarea
          id="ig-order-message"
          readOnly
          value={message}
          onClick={e => (e.target as HTMLTextAreaElement).select()}
          className="w-full bg-transparent border border-border/50 rounded-lg px-4 py-3 text-[14px] text-foreground leading-relaxed min-h-[180px] focus:border-primary outline-none resize-none"
        />

        <div className="flex flex-col gap-3 pt-1">
          <Button
            type="button"
            variant="outline"
            onClick={handleCopy}
            className="w-full text-[15px] tracking-[0.15em] rounded-none border-border/50 py-4"
          >
            {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
            {copied ? t.checkout.orderCopied : t.checkout.copyOrder}
          </Button>

          <a
            href={INSTAGRAM_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center gap-3 py-4 text-[16px] tracking-[0.2em] rounded-none bg-primary text-primary-foreground hover:bg-primary/90 gold-glow"
          >
            <Instagram className="w-5 h-5" />
            {t.checkout.openInstagram}
          </a>
        </div>
      </DialogContent>
    </Dialog>
  )
}