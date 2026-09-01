import { MessageCircleIcon } from 'lucide-react'
import { useEffect, useState } from 'react'

import { Button, ButtonIcon } from '@/components/ui/button'

export function WhatsAppDock() {
  const [hidden, setHidden] = useState(false)

  useEffect(() => {
    const guardedSections = [
      document.querySelector('.hero-section'),
      document.querySelector('#agendamento'),
      document.querySelector('footer'),
    ].filter((element): element is Element => Boolean(element))

    if (!guardedSections.length || !('IntersectionObserver' in window)) return

    const visibility = new Map<Element, boolean>()
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => visibility.set(entry.target, entry.isIntersecting))
        setHidden(Array.from(visibility.values()).some(Boolean))
      },
      { rootMargin: '0px 0px -12% 0px', threshold: 0.05 },
    )

    guardedSections.forEach((section) => observer.observe(section))
    return () => observer.disconnect()
  }, [])

  return (
    <Button asChild className="whatsapp-dock whatsapp-dock-button" size="sm">
      <a
        href="https://wa.me/5511999999999?text=Ol%C3%A1%2C%20gostaria%20de%20conversar%20sobre%20uma%20avalia%C3%A7%C3%A3o."
        target="_blank"
        rel="noreferrer"
        aria-label="Conversar com a clínica pelo WhatsApp"
        data-hidden={hidden ? 'true' : 'false'}
        data-whatsapp-dock
      >
        <ButtonIcon>
          <MessageCircleIcon strokeWidth={1.5} aria-hidden="true" />
        </ButtonIcon>
        WhatsApp
      </a>
    </Button>
  )
}
