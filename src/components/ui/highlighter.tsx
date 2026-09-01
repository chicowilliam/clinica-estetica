import { useEffect, useRef } from 'react'
import { useInView, useReducedMotion } from 'framer-motion'
import { annotate } from 'rough-notation'
import type {
  RoughAnnotation,
  RoughAnnotationType,
  RoughPadding,
} from 'rough-notation/lib/model'

interface HighlighterProps {
  children: React.ReactNode
  action?: RoughAnnotationType
  color?: string
  strokeWidth?: number
  animationDuration?: number
  iterations?: number
  padding?: RoughPadding
  multiline?: boolean
  isView?: boolean
  className?: string
}

function Highlighter({
  children,
  action = 'highlight',
  color = '#B3667A',
  strokeWidth = 1.5,
  animationDuration = 600,
  iterations = 2,
  padding = 2,
  multiline = true,
  isView = false,
  className,
}: HighlighterProps) {
  const elementRef = useRef<HTMLSpanElement>(null)
  const reduceMotion = useReducedMotion()
  const isInView = useInView(elementRef, { once: true, margin: '-10%' })
  const shouldShow = !isView || isInView

  useEffect(() => {
    const element = elementRef.current
    if (!element || !shouldShow) return

    let disposed = false
    let annotation: RoughAnnotation | null = null
    let resizeObserver: ResizeObserver | null = null

    const draw = () => {
      if (disposed) return

      annotation = annotate(element, {
        type: action,
        color,
        strokeWidth,
        animationDuration: reduceMotion ? 0 : animationDuration,
        animate: !reduceMotion,
        iterations,
        padding,
        multiline,
      })
      annotation.show()

      if (typeof ResizeObserver !== 'undefined') {
        resizeObserver = new ResizeObserver(() => annotation?.show())
        resizeObserver.observe(element)
      }
    }

    const fontsReady = document.fonts?.ready ?? Promise.resolve()
    void fontsReady.then(draw)

    return () => {
      disposed = true
      resizeObserver?.disconnect()
      annotation?.remove()
    }
  }, [
    action,
    animationDuration,
    color,
    iterations,
    multiline,
    padding,
    reduceMotion,
    shouldShow,
    strokeWidth,
  ])

  return (
    <span
      ref={elementRef}
      className={className}
      data-annotation={action}
      data-hero-highlight
    >
      {children}
    </span>
  )
}

export { Highlighter }
