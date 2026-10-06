"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { useLanguage } from '@/components/language-context'

interface PaymentNoticeModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function PaymentNoticeModal({ open, onOpenChange }: PaymentNoticeModalProps) {
  const { t } = useLanguage()

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-background border-border/30 sm:max-w-md max-h-[100dvh] sm:max-h-[90vh] flex flex-col p-4 sm:p-6 max-sm:max-w-full max-sm:rounded-none max-sm:left-0 max-sm:right-0 max-sm:bottom-0 max-sm:top-auto max-sm:translate-y-0 max-sm:translate-x-0 overflow-x-hidden gap-2">
        <DialogHeader>
          <DialogTitle className="font-serif text-2xl tracking-[0.1em] text-foreground text-center">
            {t.notice.title}
          </DialogTitle>
        </DialogHeader>
        <p className="text-[16px] text-muted-foreground text-center leading-relaxed">
          {t.notice.desc}
        </p>
        <Button
          type="button"
          onClick={() => onOpenChange(false)}
          className="w-full mt-2 text-[16px] tracking-[0.2em] rounded-none bg-primary text-primary-foreground hover:bg-primary/90 gold-glow py-4"
        >
          {t.notice.gotIt}
        </Button>
      </DialogContent>
    </Dialog>
  )
}