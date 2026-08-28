import { motion, useReducedMotion } from 'framer-motion'
import { ClipboardCheckIcon, ListChecksIcon, MessageSquareTextIcon, type LucideIcon } from 'lucide-react'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const values: Array<{ title: string; text: string; icon: LucideIcon }> = [
  {
    title: 'Avaliação antes da indicação',
    text: 'A decisão considera pele, saúde, expectativa e tempo disponível para recuperação.',
    icon: ClipboardCheckIcon,
  },
  {
    title: 'Protocolos sem pacote fechado',
    text: 'As sessões são combinadas apenas quando fazem sentido para o objetivo discutido.',
    icon: ListChecksIcon,
  },
  {
    title: 'Acompanhamento após o atendimento',
    text: 'Você recebe orientações claras e um canal para relatar como a pele está reagindo.',
    icon: MessageSquareTextIcon,
  },
]

export function CareValues() {
  const reduceMotion = useReducedMotion()

  return (
    <div className="mt-12 grid gap-4 md:grid-cols-3">
      {values.map(({ title, text, icon: Icon }, index) => (
        <motion.div
          key={title}
          initial={reduceMotion ? false : { opacity: 0, y: 14 }}
          whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.44, delay: index * 0.055, ease: [0.22, 1, 0.36, 1] }}
          className="care-card"
        >
          <Card className="h-full">
            <CardHeader>
              <Icon className="value-icon" strokeWidth={1.35} aria-hidden="true" />
              <CardTitle>{title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p>{text}</p>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  )
}
