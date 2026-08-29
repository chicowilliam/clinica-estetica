import { AnimatePresence, LayoutGroup, motion, useReducedMotion } from 'framer-motion'
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { treatments } from '@/content'
import { clinicEase } from '@/lib/motion'

const treatmentIndicatorHeight = 56

function TreatmentImage({ index, decorative = false }: { index: number; decorative?: boolean }) {
  const treatment = treatments[index]
  const reduceMotion = useReducedMotion()

  return (
    <div
      className="treatment-image-stage photo-frame"
      data-photo-frame="treatment"
      role={decorative ? undefined : 'img'}
      aria-hidden={decorative ? true : undefined}
      aria-label={decorative ? undefined : treatment.imageDescription}
    >
      <AnimatePresence mode="sync" initial={false}>
        <motion.div
          key={treatment.name}
          className="treatment-image"
          aria-hidden="true"
          initial={reduceMotion ? false : { opacity: 0, y: 7, filter: 'blur(2px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          exit={reduceMotion ? undefined : { opacity: 0, y: -5, filter: 'blur(2px)' }}
          transition={{ duration: reduceMotion ? 0 : 0.24, ease: clinicEase }}
          style={{
            backgroundImage: `url(${treatment.sheet})`,
            backgroundPosition: `${treatment.panel * 50}% center`,
          }}
        />
      </AnimatePresence>
    </div>
  )
}

export function TreatmentGallery() {
  const reduceMotion = useReducedMotion()
  const stageRef = useRef<HTMLDivElement>(null)
  const tabsListRef = useRef<HTMLDivElement>(null)
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([])
  const selectedNameRef = useRef(treatments[0].name)
  const [selectedName, setSelectedName] = useState(treatments[0].name)
  const [indicatorY, setIndicatorY] = useState(0)
  const selectedIndex = treatments.findIndex((treatment) => treatment.name === selectedName)

  const selectTreatment = useCallback((name: string) => {
    if (selectedNameRef.current === name) return
    selectedNameRef.current = name
    setSelectedName(name)
  }, [])

  const updateIndicatorPosition = useCallback(() => {
    const selectedTab = tabRefs.current[selectedIndex]
    if (!selectedTab) return
    setIndicatorY(selectedTab.offsetTop + Math.max(0, (selectedTab.offsetHeight - treatmentIndicatorHeight) / 2))
  }, [selectedIndex])

  useLayoutEffect(() => {
    const firstTab = tabRefs.current[0]
    if (!firstTab) return
    setIndicatorY(firstTab.offsetTop + Math.max(0, (firstTab.offsetHeight - treatmentIndicatorHeight) / 2))
  }, [])

  useEffect(updateIndicatorPosition, [updateIndicatorPosition])

  useEffect(() => {
    const list = tabsListRef.current
    if (!list || typeof ResizeObserver === 'undefined') return
    const resizeObserver = new ResizeObserver(updateIndicatorPosition)
    resizeObserver.observe(list)
    return () => resizeObserver.disconnect()
  }, [updateIndicatorPosition])

  useEffect(() => {
    const stage = stageRef.current
    if (!stage) return

    if (reduceMotion) {
      stage.dataset.gsapState = 'reduced'
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

        const media = gsap.matchMedia()
        media.add('(min-width: 1024px)', () => {
          stage.dataset.gsapState = 'ready'
          const trigger = ScrollTrigger.create({
            trigger: stage,
            start: 'top top+=96',
            end: () => `+=${Math.min(Math.max(window.innerHeight * 0.56, 440), 640)}`,
            pin: true,
            pinSpacing: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              const index = Math.min(treatments.length - 1, Math.round(self.progress * (treatments.length - 1)))
              selectTreatment(treatments[index].name)
            },
          })

          return () => trigger.kill()
        })

        releaseGsap = () => media.revert()
      })
    }

    if ('IntersectionObserver' in window) {
      observer = new IntersectionObserver(([entry]) => entry.isIntersecting && setup(), { rootMargin: '260px' })
      observer.observe(stage)
    } else {
      setup()
    }

    return () => {
      cancelled = true
      observer?.disconnect()
      releaseGsap?.()
    }
  }, [reduceMotion, selectTreatment])

  return (
    <div ref={stageRef} className="treatment-pin-stage" data-gsap-moment="treatment-pin" data-gsap-state="pending">
      <Tabs
        value={selectedName}
        onValueChange={selectTreatment}
        orientation="vertical"
        activationMode="automatic"
        className="hidden lg:grid lg:grid-cols-[minmax(0,1.06fr)_minmax(320px,0.72fr)] lg:gap-16"
      >
        <LayoutGroup id="treatment-active-indicator">
          <TabsList ref={tabsListRef} variant="line" aria-label="Tratamentos disponíveis" className="relative h-auto w-full flex-col items-stretch justify-start p-0">
            <motion.span
              className="treatment-active-line"
              data-treatment-active-indicator
              data-active-treatment={selectedName}
              layoutId="treatment-active-line"
              initial={false}
              animate={{ y: indicatorY }}
              transition={{ duration: reduceMotion ? 0 : 0.32, ease: clinicEase }}
            />
            {treatments.map((treatment, index) => {
              return (
                <TabsTrigger
                  ref={(element) => { tabRefs.current[index] = element }}
                  className="treatment-tab"
                  value={treatment.name}
                  key={treatment.name}
                >
                  <span className="min-w-0">
                    <span className="treatment-name">{treatment.name}</span>
                    <span className="treatment-description">{treatment.indication}</span>
                  </span>
                  <span className="treatment-duration">{treatment.duration}</span>
                </TabsTrigger>
              )
            })}
          </TabsList>
        </LayoutGroup>

        <TabsContent value={selectedName} className="h-fit">
          <TreatmentImage index={selectedIndex} />
          <div className="treatment-caption">
            <p>Imagem ilustrativa do contexto clínico.</p>
            <p>A indicação é definida somente após avaliação presencial.</p>
          </div>
        </TabsContent>
      </Tabs>

      <Accordion
        type="single"
        collapsible
        value={selectedName}
        onValueChange={(value) => value && selectTreatment(value)}
        className="lg:hidden"
      >
        {treatments.map((treatment, index) => (
          <AccordionItem value={treatment.name} key={treatment.name}>
            <AccordionTrigger className="treatment-accordion-trigger">
              <span>
                <span className="treatment-name">{treatment.name}</span>
                <span className="treatment-duration mt-2 block text-left">{treatment.duration}</span>
              </span>
            </AccordionTrigger>
            <AccordionContent className="pb-6">
              <p className="mb-6 text-sm leading-6 text-muted-foreground">{treatment.indication}</p>
              <TreatmentImage index={index} decorative />
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  )
}
