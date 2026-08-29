import { motion, useReducedMotion } from 'framer-motion'
import type { ReactNode } from 'react'

import { fadeUp } from '@/lib/motion'

export function Reveal({ children, className }: { children: ReactNode; className?: string }) {
  const reduceMotion = useReducedMotion()

  return (
    <motion.div
      className={className}
      variants={fadeUp}
      initial={reduceMotion ? false : 'hidden'}
      whileInView={reduceMotion ? undefined : 'visible'}
      viewport={{ once: true, amount: 0.14 }}
    >
      {children}
    </motion.div>
  )
}
