import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { motion, useReducedMotion } from 'framer-motion'
import { ArrowRightIcon, ArrowUpRightIcon } from 'lucide-react'

import { clinicEase } from '@/lib/motion'
import { cn } from '@/lib/utils'

const MotionSlot = motion.create(Slot)

const buttonVariants = cva(
  "group/button relative inline-flex h-13 shrink-0 items-center justify-center gap-2 overflow-hidden rounded-[3px] border border-transparent bg-clip-padding px-6 text-[0.78rem] font-semibold whitespace-nowrap outline-none select-none transition-[background-color,color,border-color,box-shadow,filter,opacity] duration-200 focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/45 disabled:pointer-events-none disabled:opacity-45 aria-invalid:border-destructive aria-invalid:ring-2 aria-invalid:ring-destructive/20 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        primary: 'bg-primary text-primary-foreground shadow-[0_12px_30px_color-mix(in_srgb,var(--primary)_20%,transparent)] hover:saturate-[1.08] hover:shadow-[0_16px_36px_color-mix(in_srgb,var(--primary)_28%,transparent)]',
        secondary: 'border-gold/75 bg-card/72 text-foreground shadow-[0_8px_22px_color-mix(in_srgb,var(--primary)_9%,transparent)] hover:border-primary hover:bg-card hover:text-primary hover:saturate-[1.06]',
        ghost: 'bg-transparent text-foreground hover:bg-primary/6 hover:text-primary hover:saturate-[1.06]',
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
      variant: 'primary',
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

function Button({ className, variant = 'primary', size = 'default', asChild = false, ...props }: ButtonProps) {
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

  return <motion.button type="button" {...sharedProps} />
}

type ButtonIconProps = {
  children: React.ReactNode
  direction?: 'left' | 'right' | 'up-right'
  className?: string
}

function ButtonIcon({ children, direction = 'right', className }: ButtonIconProps) {
  const reduceMotion = useReducedMotion()
  const variants = direction === 'up-right'
    ? { rest: { x: 0, y: 0 }, hover: { x: reduceMotion ? 0 : 3, y: reduceMotion ? 0 : -3 }, tap: { x: 0, y: 0 } }
    : direction === 'left'
      ? { rest: { x: 0 }, hover: { x: reduceMotion ? 0 : -4 }, tap: { x: reduceMotion ? 0 : -1 } }
      : { rest: { x: 0 }, hover: { x: reduceMotion ? 0 : 4 }, tap: { x: reduceMotion ? 0 : 1 } }

  return (
    <motion.span
      className={cn('inline-flex', className)}
      data-button-icon
      data-icon-direction={direction}
      variants={variants}
      transition={{ duration: 0.18, ease: clinicEase }}
    >
      {children}
    </motion.span>
  )
}

function ButtonArrow({ direction = 'right' }: { direction?: 'right' | 'up-right' }) {
  const Icon = direction === 'up-right' ? ArrowUpRightIcon : ArrowRightIcon

  return (
    <ButtonIcon direction={direction}>
      <Icon strokeWidth={1.35} aria-hidden="true" data-button-arrow />
    </ButtonIcon>
  )
}

export { Button, ButtonArrow, ButtonIcon, buttonVariants }
