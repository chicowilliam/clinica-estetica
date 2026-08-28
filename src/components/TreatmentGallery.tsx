import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { useState } from 'react'

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { treatments } from '@/content'

function TreatmentImage({ index, decorative = false }: { index: number; decorative?: boolean }) {
  const treatment = treatments[index]
  const reduceMotion = useReducedMotion()

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={treatment.name}
        className="treatment-image"
        role={decorative ? undefined : 'img'}
        aria-hidden={decorative ? true : undefined}
        aria-label={decorative ? undefined : treatment.imageDescription}
        initial={reduceMotion ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={reduceMotion ? undefined : { opacity: 0 }}
        transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
        style={{
          backgroundImage: `url(${treatment.sheet})`,
          backgroundPosition: `${treatment.panel * 50}% center`,
        }}
      />
    </AnimatePresence>
  )
}

export function TreatmentGallery() {
  const [selectedName, setSelectedName] = useState(treatments[0].name)
  const selectedIndex = treatments.findIndex((treatment) => treatment.name === selectedName)

  return (
    <div className="mt-10">
      <Tabs
        value={selectedName}
        onValueChange={setSelectedName}
        orientation="vertical"
        activationMode="automatic"
        className="hidden lg:grid lg:grid-cols-[minmax(0,1.06fr)_minmax(320px,0.72fr)] lg:gap-16"
      >
        <TabsList variant="line" aria-label="Tratamentos disponíveis" className="h-auto w-full flex-col items-stretch justify-start p-0">
          {treatments.map((treatment) => {
            const active = treatment.name === selectedName
            return (
              <TabsTrigger className="treatment-tab" value={treatment.name} key={treatment.name}>
                {active ? <motion.span className="treatment-active-line" layoutId="treatment-active-line" /> : null}
                <span className="min-w-0">
                  <span className="treatment-name">{treatment.name}</span>
                  <span className="treatment-description">{treatment.indication}</span>
                </span>
                <span className="treatment-duration">{treatment.duration}</span>
              </TabsTrigger>
            )
          })}
        </TabsList>

        <TabsContent value={selectedName} className="sticky top-8 h-fit">
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
        onValueChange={(value) => value && setSelectedName(value)}
        className="lg:hidden"
      >
        {treatments.map((treatment, index) => (
          <AccordionItem value={treatment.name} key={treatment.name}>
            <AccordionTrigger className="treatment-accordion-trigger">
              <span>
                <span className="treatment-name">{treatment.name}</span>
                <span className="treatment-duration mt-1 block text-left">{treatment.duration}</span>
              </span>
            </AccordionTrigger>
            <AccordionContent className="pb-7">
              <p className="mb-5 text-sm leading-6 text-muted-foreground">{treatment.indication}</p>
              <TreatmentImage index={index} decorative />
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  )
}
