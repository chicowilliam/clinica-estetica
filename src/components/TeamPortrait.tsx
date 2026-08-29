import { useEffect, useRef } from 'react'

export function TeamPortrait() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const frameRef = useRef<HTMLDivElement>(null)
  const imageRef = useRef<HTMLImageElement>(null)

  useEffect(() => {
    const section = sectionRef.current
    const frame = frameRef.current
    const image = imageRef.current
    const reducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false

    if (!section || !frame || !image || reducedMotion || !('IntersectionObserver' in window)) return

    let cancelled = false
    let context: { revert: () => void } | undefined

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        observer.disconnect()

        void Promise.all([import('gsap'), import('gsap/ScrollTrigger')]).then(([gsapModule, scrollTriggerModule]) => {
          if (cancelled) return
          const gsap = gsapModule.gsap
          const ScrollTrigger = scrollTriggerModule.ScrollTrigger
          gsap.registerPlugin(ScrollTrigger)

          context = gsap.context(() => {
            gsap.fromTo(
              frame,
              { clipPath: 'inset(0 0 100% 0)' },
              {
                clipPath: 'inset(0 0 0% 0)',
                duration: 0.95,
                ease: 'power4.out',
                scrollTrigger: { trigger: section, start: 'top 78%', once: true },
              },
            )
            gsap.fromTo(
              image,
              { yPercent: -2.5 },
              {
                yPercent: 2.5,
                ease: 'none',
                scrollTrigger: {
                  trigger: section,
                  start: 'top bottom',
                  end: 'bottom top',
                  scrub: 0.6,
                },
              },
            )
          }, section)
        })
      },
      { rootMargin: '280px 0px' },
    )

    observer.observe(section)

    return () => {
      cancelled = true
      observer.disconnect()
      context?.revert()
    }
  }, [])

  return (
    <div ref={sectionRef} className="team-portrait">
      <div ref={frameRef} className="team-portrait-frame photo-frame" data-photo-frame="team">
        <img
          ref={imageRef}
          src="/images/hero-marina.jpg"
          alt="Retrato de Marina Avelar"
          width="1122"
          height="1402"
          loading="lazy"
        />
      </div>
      <p className="team-portrait-note">Atendimento clínico com agenda reduzida</p>
    </div>
  )
}
