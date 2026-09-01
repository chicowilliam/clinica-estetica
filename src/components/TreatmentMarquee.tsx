import { useEffect, useRef, useState } from 'react'

const treatments = [
  'Avaliação individual',
  'Tecnologias da pele',
  'Bioestimuladores',
  'Peelings',
  'Cuidado corporal',
  'Acompanhamento',
]

function MarqueeGroup({ hidden = false }: { hidden?: boolean }) {
  return (
    <div className="marquee-group" data-marquee-track aria-hidden={hidden ? 'true' : undefined}>
      {treatments.map((treatment) => (
        <span key={treatment}>
          {treatment}
          <i aria-hidden="true">✦</i>
        </span>
      ))}
    </div>
  )
}

export function TreatmentMarquee() {
  const [fullMotion, setFullMotion] = useState(false)
  const [visible, setVisible] = useState(false)
  const marqueeRef = useRef<HTMLElement>(null)

  useEffect(() => {
    if (!window.matchMedia) return
    const media = window.matchMedia(
      '(min-width: 64rem) and (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)',
    )
    const sync = () => setFullMotion(media.matches)
    sync()
    media.addEventListener('change', sync)
    return () => media.removeEventListener('change', sync)
  }, [])

  useEffect(() => {
    const marquee = marqueeRef.current
    if (!marquee || !('IntersectionObserver' in window)) {
      setVisible(true)
      return
    }

    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting))
    observer.observe(marquee)
    return () => observer.disconnect()
  }, [])

  return (
    <aside
      ref={marqueeRef}
      className="treatment-marquee"
      data-marquee
      data-motion-mode={fullMotion ? 'full' : 'light'}
      data-visible={visible ? 'true' : 'false'}
      aria-label="Tratamentos em movimento"
    >
      <div className="marquee-rail" data-marquee-rail>
        <MarqueeGroup />
        <MarqueeGroup hidden />
      </div>
    </aside>
  )
}
