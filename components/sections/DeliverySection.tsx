"use client"

import { img as imgPath } from '@/lib/constants'
const img = imgPath
import { useLanguage } from '@/components/language-context'
import { useDeliverySettings } from '@/lib/use-delivery'

export default function DeliverySection() {
  const { t } = useLanguage()
  const { settings: delivery } = useDeliverySettings()

  return (
    <section id="delivery" className="py-28 lg:py-36 relative section-orange" style={{ contentVisibility: 'auto' }}>
      <div className="max-w-7xl mx-auto px-5 lg:px-10">
        <div className="animate-on-view text-center mb-16">
          <p className="text-[46px] tracking-[0.35em] mb-5">
            <span className="font-script text-primary uppercase">{t.delivery.headingPrefix}{t.delivery.headingSuffix}</span>
          </p>
        </div>

        <div className="max-w-3xl mx-auto stagger-children">
          <div className="grid grid-cols-2 gap-y-10 gap-x-6 md:gap-x-12">
            <div className="text-center">
              <p className="text-[13px] tracking-[0.2em] text-muted-foreground mb-2 uppercase">{t.delivery.sameDay}</p>
              <p className="font-serif text-2xl md:text-3xl text-foreground">{t.delivery.zones1to3}</p>
            </div>
            <div className="text-center">
              <p className="text-[13px] tracking-[0.2em] text-muted-foreground mb-2 uppercase">{t.delivery.nextDay}</p>
              <p className="font-serif text-2xl md:text-3xl text-foreground">{t.delivery.allLondon}</p>
            </div>
            <div className="text-center">
              <p className="text-[13px] tracking-[0.2em] text-muted-foreground mb-2 uppercase">{t.delivery.minOrder}</p>
              <p className="font-serif text-2xl md:text-3xl text-foreground">£{delivery.min_order}</p>
            </div>
            <div className="text-center">
              <p className="text-[13px] tracking-[0.2em] text-muted-foreground mb-2 uppercase">{t.delivery.freeDelivery}</p>
              <p className="font-serif text-2xl md:text-3xl text-foreground">{t.delivery.ordersOver} £{delivery.free_threshold}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}