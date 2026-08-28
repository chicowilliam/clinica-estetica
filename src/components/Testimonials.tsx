import useEmblaCarousel from 'embla-carousel-react'
import { QuoteIcon } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { testimonials } from '@/content'
import { cn } from '@/lib/utils'

export function Testimonials() {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: 'start',
    containScroll: 'trimSnaps',
    breakpoints: { '(min-width: 48rem)': { active: false } },
  })
  const [selectedIndex, setSelectedIndex] = useState(0)

  const onSelect = useCallback(() => {
    if (emblaApi) setSelectedIndex(emblaApi.selectedScrollSnap())
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
    <div className="mt-12">
      <div className="testimonial-viewport" ref={emblaRef}>
        <div className="testimonial-track">
          {testimonials.map((testimonial) => (
            <div className="testimonial-slide" key={testimonial.patient}>
              <Card className="h-full">
                <CardHeader>
                  <QuoteIcon className="testimonial-quote" strokeWidth={1.2} aria-hidden="true" />
                </CardHeader>
                <CardContent>
                  <blockquote>
                    <p>“{testimonial.quote}”</p>
                  </blockquote>
                </CardContent>
                <CardFooter>
                  <cite>{testimonial.patient}</cite>
                  <span>{testimonial.context}</span>
                </CardFooter>
              </Card>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-5 flex justify-center gap-2 md:hidden" aria-label="Selecionar depoimento">
        {testimonials.map((testimonial, index) => (
          <Button
            key={testimonial.patient}
            type="button"
            variant="ghost"
            size="icon-xs"
            className="testimonial-dot"
            aria-label={`Mostrar depoimento ${index + 1} de ${testimonials.length}`}
            aria-current={index === selectedIndex ? 'true' : undefined}
            onClick={() => emblaApi?.scrollTo(index)}
          >
            <span className={cn('testimonial-dot-line', index === selectedIndex && 'testimonial-dot-line-active')} />
          </Button>
        ))}
      </div>
    </div>
  )
}
