import useEmblaCarousel from 'embla-carousel-react'
import { motion, useReducedMotion } from 'framer-motion'
import { ArrowLeftIcon, ArrowRightIcon } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'

import { Button, ButtonIcon } from '@/components/ui/button'
import { testimonials } from '@/content'
import { fadeUp } from '@/lib/motion'

export function Testimonials() {
  const reduceMotion = useReducedMotion()
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: 'start',
    containScroll: 'trimSnaps',
  })
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [snapCount, setSnapCount] = useState(testimonials.length)
  const [canScrollPrev, setCanScrollPrev] = useState(false)
  const [canScrollNext, setCanScrollNext] = useState(true)

  const onSelect = useCallback(() => {
    if (!emblaApi) return
    setSelectedIndex(emblaApi.selectedScrollSnap())
    setSnapCount(emblaApi.scrollSnapList().length)
    setCanScrollPrev(emblaApi.canScrollPrev())
    setCanScrollNext(emblaApi.canScrollNext())
  }, [emblaApi])

  useEffect(() => {
    if (!emblaApi) return
    onSelect()
    emblaApi.on('select', onSelect)
    emblaApi.on('reInit', onSelect)
    return () => {
      emblaApi.off('select', onSelect)
      emblaApi.off('reInit', onSelect)
    }
  }, [emblaApi, onSelect])

  return (
    <motion.div
      className="testimonial-carousel"
      role="region"
      aria-label="Relatos de pacientes"
      aria-roledescription="carrossel"
      variants={fadeUp}
      initial={reduceMotion ? false : 'hidden'}
      whileInView={reduceMotion ? undefined : 'visible'}
      viewport={{ once: true, amount: 0.18 }}
    >
      <div className="testimonial-viewport" ref={emblaRef}>
        <div className="testimonial-track">
          {testimonials.map((testimonial, index) => (
            <article className="testimonial-slide" aria-label={`Relato ${index + 1} de ${testimonials.length}`} key={testimonial.patient}>
              <span className="testimonial-mark" aria-hidden="true">“</span>
              <blockquote>
                <p><em>{testimonial.highlight}</em> {testimonial.quote}</p>
              </blockquote>
              <footer>
                <cite>{testimonial.patient}</cite>
                <span>{testimonial.context}</span>
              </footer>
            </article>
          ))}
        </div>
      </div>

      <div className="testimonial-controls">
        <div className="testimonial-progress-wrap">
          <p aria-live="polite"><span>{String(selectedIndex + 1).padStart(2, '0')}</span> / {String(snapCount).padStart(2, '0')}</p>
          <div
            className="testimonial-progress"
            role="progressbar"
            aria-label="Progresso dos relatos"
            aria-valuemin={1}
            aria-valuemax={snapCount}
            aria-valuenow={selectedIndex + 1}
          >
            <span style={{ transform: `scaleX(${(selectedIndex + 1) / Math.max(snapCount, 1)})` }} />
          </div>
        </div>
        <div className="flex gap-2">
          <Button type="button" variant="secondary" size="icon" aria-label="Depoimento anterior" disabled={!canScrollPrev} onClick={() => emblaApi?.scrollPrev()}>
            <ButtonIcon direction="left"><ArrowLeftIcon strokeWidth={1.35} aria-hidden="true" /></ButtonIcon>
          </Button>
          <Button type="button" variant="secondary" size="icon" aria-label="Próximo depoimento" disabled={!canScrollNext} onClick={() => emblaApi?.scrollNext()}>
            <ButtonIcon><ArrowRightIcon strokeWidth={1.35} aria-hidden="true" /></ButtonIcon>
          </Button>
        </div>
      </div>
    </motion.div>
  )
}
