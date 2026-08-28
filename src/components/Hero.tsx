import { motion, useReducedMotion } from 'framer-motion'
import { ArrowRightIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'

const entrance = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.58, ease: [0.22, 1, 0.36, 1] as const },
  },
}

const sequence = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07, delayChildren: 0.04 } },
}

export function Hero() {
  const reduceMotion = useReducedMotion()

  return (
    <section className="hero-section" aria-labelledby="hero-title">
      <motion.div
        className="page-grid grid items-end gap-10 lg:grid-cols-[minmax(0,0.79fr)_minmax(440px,1.1fr)] lg:gap-14"
        variants={sequence}
        initial={reduceMotion ? false : 'hidden'}
        animate="visible"
      >
        <div className="pb-1 lg:pb-12">
          <motion.p className="eyebrow" variants={entrance}>
            Estética facial e corporal · São Paulo
          </motion.p>
          <motion.h1 id="hero-title" className="display-title mt-7 max-w-[13ch]" variants={entrance}>
            Antes de indicar um procedimento, olhamos sua pele <em>de perto.</em>
          </motion.h1>
          <motion.p className="body-lead mt-8 max-w-lg" variants={entrance}>
            Avaliação individual, protocolos explicados com clareza e acompanhamento depois de cada sessão.
          </motion.p>
          <motion.div className="mt-8 flex flex-wrap items-center gap-3" variants={entrance}>
            <Button asChild>
              <a href="#agendamento">
                Solicitar avaliação
                <ArrowRightIcon data-icon="inline-end" />
              </a>
            </Button>
            <Button asChild variant="outline">
              <a href="#tratamentos">Ver tratamentos</a>
            </Button>
          </motion.div>
        </div>

        <motion.figure className="hero-figure" variants={entrance}>
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
    </section>
  )
}
