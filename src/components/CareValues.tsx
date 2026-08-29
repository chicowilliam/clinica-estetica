import { motion, useReducedMotion } from 'framer-motion'

import { fadeUp, staggerList } from '@/lib/motion'

const values = [
  {
    title: 'Avaliação antes da indicação',
    text: 'A decisão considera pele, saúde, expectativa e tempo disponível para recuperação.',
  },
  {
    title: 'Protocolos sem pacote fechado',
    text: 'As sessões são combinadas apenas quando fazem sentido para o objetivo discutido.',
  },
  {
    title: 'Acompanhamento após o atendimento',
    text: 'Você recebe orientações claras e um canal para relatar como a pele está reagindo.',
  },
]

export function CareValues() {
  const reduceMotion = useReducedMotion()

  return (
    <motion.ol
      className="care-sequence"
      aria-label="Sequência de atendimento"
      variants={staggerList}
      initial={reduceMotion ? false : 'hidden'}
      whileInView={reduceMotion ? undefined : 'visible'}
      viewport={{ once: true, amount: 0.24 }}
    >
      {values.map(({ title, text }, index) => (
        <motion.li className="care-sequence-item" variants={fadeUp} key={title}>
          <span className="care-sequence-number" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
          <h3>{title}</h3>
          <p>{text}</p>
        </motion.li>
      ))}
    </motion.ol>
  )
}
