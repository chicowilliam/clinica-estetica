import { motion, useReducedMotion, type Variants } from 'framer-motion'

import { Magnetic } from '@/components/Magnetic'
import { Button, ButtonArrow } from '@/components/ui/button'
import { fadeUp, staggerList } from '@/lib/motion'

const lineReveal: Variants = {
  hidden: { opacity: 0, y: 18 },
  visible: (index: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: index * 0.075, duration: 0.68, ease: [0.22, 1, 0.36, 1] },
  }),
}

export function Hero() {
  const reduceMotion = useReducedMotion()

  return (
    <section className="hero-section" aria-labelledby="hero-title">
      <motion.div
        className="page-grid grid items-start gap-10 lg:grid-cols-[minmax(0,0.96fr)_minmax(420px,1.04fr)] lg:gap-12"
        variants={staggerList}
        initial={reduceMotion ? false : 'hidden'}
        animate="visible"
      >
        <div className="lg:pt-4">
          <motion.p className="eyebrow" variants={fadeUp}>
            Estética facial e corporal · São Paulo
          </motion.p>
          <motion.h1
            id="hero-title"
            className="display-title hero-title mt-6 max-w-none"
            aria-label="Antes de indicar um procedimento, olhamos sua pele de perto."
            data-fluid-headline
            data-reveal-mode="light"
          >
            <span className="hero-title-line" data-hero-line aria-hidden="true">
              <motion.span custom={0} variants={lineReveal}>Antes de indicar</motion.span>
            </span>
            <span className="hero-title-line" data-hero-line aria-hidden="true">
              <motion.span custom={1} variants={lineReveal}>um procedimento,</motion.span>
            </span>
            <span className="hero-title-line" data-hero-line aria-hidden="true">
              <motion.span custom={2} variants={lineReveal}>olhamos sua pele</motion.span>
            </span>
            <span className="hero-title-line" data-hero-line aria-hidden="true">
              <motion.span custom={3} variants={lineReveal}><em>de perto.</em></motion.span>
            </span>
          </motion.h1>
          <motion.p className="body-lead mt-6 max-w-lg" variants={fadeUp}>
            Avaliação individual, protocolos explicados com clareza e acompanhamento depois de cada sessão.
          </motion.p>
          <motion.div className="mt-6 flex flex-wrap items-center gap-2" variants={fadeUp}>
            <Magnetic>
              <Button asChild>
                <a href="#agendamento" data-cursor-label="Agendar">
                  Solicitar avaliação
                  <ButtonArrow />
                </a>
              </Button>
            </Magnetic>
            <Button asChild variant="secondary">
              <a href="#tratamentos" data-cursor-label="Explorar">Ver tratamentos</a>
            </Button>
          </motion.div>
          <motion.dl className="hero-proof mt-8 grid grid-cols-3 gap-3 border-y border-border/80 py-5" variants={fadeUp}>
            <div>
              <dt className="text-xs font-semibold leading-4 text-foreground">60 min</dt>
              <dd className="mt-1 text-xs leading-4 text-muted-foreground">primeira conversa</dd>
            </div>
            <div>
              <dt className="text-xs font-semibold leading-4 text-foreground">Plano individual</dt>
              <dd className="mt-1 text-xs leading-4 text-muted-foreground">sem pacote fechado</dd>
            </div>
            <div>
              <dt className="text-xs font-semibold leading-4 text-foreground">Pós-atendimento</dt>
              <dd className="mt-1 text-xs leading-4 text-muted-foreground">canal com a equipe</dd>
            </div>
          </motion.dl>
        </div>

        <motion.figure className="hero-figure" variants={fadeUp}>
          <div className="hero-image-wrap photo-frame" data-photo-frame="hero">
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
