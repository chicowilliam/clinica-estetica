import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { motion, useReducedMotion } from 'framer-motion'
import { ArrowRightIcon, ArrowUpRightIcon } from 'lucide-react'

import { clinicEase } from '@/lib/motion'
import { cn } from '@/lib/utils'

const MotionSlot = motion.create(Slot)

const buttonVariants = cva(
  "group/button relative inline-flex h-13 shrink-0 items-center justify-center gap-2 overflow-hidden rounded-[3px] border border-transparent bg-clip-padding px-6 text-[0.78rem] font-semibold whitespace-nowrap outline-none select-none transition-[background-color,color,border-color,box-shadow,opacity] duration-200 focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/45 disabled:pointer-events-none disabled:opacity-45 aria-invalid:border-destructive aria-invalid:ring-2 aria-invalid:ring-destructive/20 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground shadow-[0_12px_30px_color-mix(in_srgb,var(--primary)_20%,transparent)] hover:shadow-[0_16px_36px_color-mix(in_srgb,var(--primary)_28%,transparent)]',
        secondary: "bg-transparent text-foreground after:absolute after:right-6 after:bottom-2 after:left-6 after:h-px after:origin-left after:scale-x-0 after:bg-primary after:transition-transform after:duration-200 after:ease-[cubic-bezier(0.22,1,0.36,1)] hover:text-primary hover:after:scale-x-100 focus-visible:after:scale-x-100",
        control: 'border-gold/75 bg-card text-foreground shadow-[0_8px_22px_color-mix(in_srgb,var(--primary)_10%,transparent)] hover:border-primary hover:text-primary',
        outline: 'border-gold/75 bg-transparent text-foreground hover:border-primary hover:text-primary',
        ghost: 'bg-transparent text-foreground hover:text-primary',
        destructive: 'bg-destructive text-primary-foreground',
        link: "h-auto rounded-none bg-transparent px-0 text-primary after:absolute after:inset-x-0 after:bottom-0 after:h-px after:origin-left after:scale-x-0 after:bg-primary after:transition-transform after:duration-200 hover:after:scale-x-100",
      },
      size: {
        default: 'h-13 px-6',
        xs: 'h-13 px-4',
        sm: 'h-13 px-5',
        lg: 'h-13 px-7',
        icon: 'size-13 px-0',
        'icon-xs': 'size-13 px-0',
        'icon-sm': 'size-13 px-0',
        'icon-lg': 'size-13 px-0',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
)

const interactionVariants = {
  rest: { y: 0, scale: 1 },
  hover: { y: -1, scale: 1, transition: { duration: 0.14, ease: clinicEase } },
  tap: { y: 0, scale: 0.98, transition: { duration: 0.12, ease: clinicEase } },
}

type ButtonProps = React.ComponentProps<typeof motion.button> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }

function Button({ className, variant = 'default', size = 'default', asChild = false, ...props }: ButtonProps) {
  const reduceMotion = useReducedMotion()
  const motionProps = reduceMotion
    ? {}
    : { initial: false as const, animate: 'rest', whileHover: 'hover', whileTap: 'tap', variants: interactionVariants }
  const sharedProps = {
    'data-slot': 'button',
    'data-variant': variant,
    'data-size': size,
    className: cn(buttonVariants({ variant, size, className })),
    ...motionProps,
    ...props,
  }

  if (asChild) {
    return <MotionSlot {...sharedProps} />
  }

  return <motion.button {...sharedProps} />
}

function ButtonArrow({ direction = 'right' }: { direction?: 'right' | 'up-right' }) {
  const reduceMotion = useReducedMotion()
  const Icon = direction === 'up-right' ? ArrowUpRightIcon : ArrowRightIcon
  const variants = direction === 'up-right'
    ? { rest: { x: 0, y: 0 }, hover: { x: reduceMotion ? 0 : 3, y: reduceMotion ? 0 : -3 }, tap: { x: 0, y: 0 } }
    : { rest: { x: 0 }, hover: { x: reduceMotion ? 0 : 4 }, tap: { x: reduceMotion ? 0 : 1 } }

  return (
    <motion.span className="inline-flex" data-button-arrow variants={variants} transition={{ duration: 0.18, ease: clinicEase }}>
      <Icon strokeWidth={1.35} aria-hidden="true" />
    </motion.span>
  )
}

export { Button, ButtonArrow, buttonVariants }
