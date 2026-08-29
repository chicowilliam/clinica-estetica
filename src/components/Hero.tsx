import { motion, useReducedMotion } from 'framer-motion'
import { useEffect, useRef } from 'react'

import { Button, ButtonArrow } from '@/components/ui/button'
import { fadeUp, staggerList } from '@/lib/motion'

export function Hero() {
  const reduceMotion = useReducedMotion()
  const sectionRef = useRef<HTMLElement>(null)
  const dividerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const section = sectionRef.current
    const divider = dividerRef.current
    if (!section || !divider) return

    if (reduceMotion) {
      divider.dataset.gsapState = 'reduced'
      return
    }

    let cancelled = false
    let releaseGsap: (() => void) | undefined
    let observer: IntersectionObserver | undefined

    const setup = () => {
      observer?.disconnect()
      void Promise.all([import('gsap'), import('gsap/ScrollTrigger')]).then(([gsapModule, scrollTriggerModule]) => {
        if (cancelled) return
        const gsap = gsapModule.gsap
        const ScrollTrigger = scrollTriggerModule.ScrollTrigger
        gsap.registerPlugin(ScrollTrigger)

        const context = gsap.context(() => {
          gsap.fromTo(
            divider,
            { scaleY: 0.82, yPercent: 0 },
            {
              scaleY: 1.42,
              yPercent: 12,
              ease: 'none',
              scrollTrigger: {
                trigger: section,
                start: 'top top',
                end: 'bottom top',
                scrub: 0.45,
              },
            },
          )
        }, section)

        divider.dataset.gsapState = 'ready'
        releaseGsap = () => context.revert()
      })
    }

    if ('IntersectionObserver' in window) {
      observer = new IntersectionObserver(([entry]) => entry.isIntersecting && setup(), { rootMargin: '160px' })
      observer.observe(section)
    } else {
      setup()
    }

    return () => {
      cancelled = true
      observer?.disconnect()
      releaseGsap?.()
    }
  }, [reduceMotion])

  return (
    <section ref={sectionRef} className="hero-section" aria-labelledby="hero-title">
      <motion.div
        className="page-grid grid items-end gap-10 lg:grid-cols-[minmax(0,0.79fr)_minmax(440px,1.1fr)] lg:gap-14"
        variants={staggerList}
        initial={reduceMotion ? false : 'hidden'}
        animate="visible"
      >
        <div className="pb-1 lg:pb-12">
          <motion.p className="eyebrow" variants={fadeUp}>
            Estética facial e corporal · São Paulo
          </motion.p>
          <motion.h1 id="hero-title" className="display-title mt-7 max-w-[13ch]" variants={fadeUp}>
            Antes de indicar um procedimento, olhamos sua pele <em>de perto.</em>
          </motion.h1>
          <motion.p className="body-lead mt-8 max-w-lg" variants={fadeUp}>
            Avaliação individual, protocolos explicados com clareza e acompanhamento depois de cada sessão.
          </motion.p>
          <motion.div className="mt-8 flex flex-wrap items-center gap-3" variants={fadeUp}>
            <Button asChild>
              <a href="#agendamento">
                Solicitar avaliação
                <ButtonArrow />
              </a>
            </Button>
            <Button asChild variant="secondary">
              <a href="#tratamentos">Ver tratamentos</a>
            </Button>
          </motion.div>
        </div>

        <motion.figure className="hero-figure" variants={fadeUp}>
          <div className="hero-image-wrap">
            <img
              src="/images/hero-marina.jpg"
              alt="Marina Avelar, biomédica esteta responsável pela clínica"
              width="1122"
              height="1402"
              fetchPriority="high"
            />
          </div>
          <figcaption className="hero-caption">
            <span>Responsável técnica</span>
            <strong>Marina Avelar</strong>
            <small>Biomédica esteta · 9 anos de prática clínica</small>
          </figcaption>
        </motion.figure>
      </motion.div>
      <div ref={dividerRef} className="hero-scroll-curve" data-gsap-moment="hero-divider" data-gsap-state="pending" aria-hidden="true" />
    </section>
  )
}
