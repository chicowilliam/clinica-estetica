import Lenis from 'lenis'
import 'lenis/dist/lenis.css'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import SplitType from 'split-type'
import { useEffect, useRef } from 'react'

const desktopConditions = {
  desktop: '(min-width: 64rem) and (hover: hover) and (pointer: fine)',
  reduceMotion: '(prefers-reduced-motion: reduce)',
}

export function DesktopExperience() {
  const cursorRef = useRef<HTMLDivElement>(null)
  const cursorLabelRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)

    const media = gsap.matchMedia()
    const cleanups: Array<() => void> = []

    media.add(desktopConditions, (context) => {
      const { desktop, reduceMotion } = context.conditions as {
        desktop: boolean
        reduceMotion: boolean
      }

      if (!desktop || reduceMotion) return

      const root = document.documentElement
      const headline = document.querySelector<HTMLElement>('[data-fluid-headline]')
      const marquee = document.querySelector<HTMLElement>('[data-marquee]')
      const marqueeTrack = marquee?.querySelector<HTMLElement>('[data-marquee-rail]')
      const team = document.querySelector<HTMLElement>('[data-team-portrait]')
      const teamFrame = team?.querySelector<HTMLElement>('[data-team-frame]')
      const teamImage = team?.querySelector<HTMLElement>('[data-team-image]')
      const cursor = cursorRef.current
      const cursorLabel = cursorLabelRef.current

      root.dataset.desktopEffects = 'true'

      if (headline) headline.dataset.revealMode = 'split'

      const lenis = new Lenis({
        anchors: true,
        autoRaf: true,
        duration: 1.08,
        smoothWheel: true,
        syncTouch: false,
        wheelMultiplier: 0.92,
      })
      root.dataset.lenisActive = 'true'

      let split: SplitType | undefined
      let splitContext: gsap.Context | undefined

      if (headline) {
        split = new SplitType(headline, { types: 'words' })
        splitContext = gsap.context(() => {
          gsap.fromTo(
            split?.words ?? [],
            { autoAlpha: 0, filter: 'blur(7px)', yPercent: 112 },
            {
              autoAlpha: 1,
              clearProps: 'opacity,transform,visibility,filter',
              delay: 0.08,
              duration: 0.82,
              ease: 'power3.out',
              filter: 'blur(0px)',
              stagger: 0.047,
              yPercent: 0,
            },
          )
        }, headline)
      }

      let marqueeObserver: IntersectionObserver | undefined
      if (marquee && marqueeTrack) {
        const marqueeTween = gsap.to(marqueeTrack, {
          duration: 34,
          ease: 'none',
          paused: true,
          repeat: -1,
          xPercent: -50,
        })

        marqueeObserver = new IntersectionObserver(([entry]) => {
          if (entry.isIntersecting) marqueeTween.play()
          else marqueeTween.pause()
        })
        marqueeObserver.observe(marquee)
        cleanups.push(() => marqueeTween.kill())
      }

      let teamContext: gsap.Context | undefined
      if (team && teamFrame && teamImage) {
        teamContext = gsap.context(() => {
          gsap.fromTo(
            teamFrame,
            { clipPath: 'inset(0 0 100% 0)' },
            {
              clipPath: 'inset(0 0 0% 0)',
              duration: 0.95,
              ease: 'power4.out',
              scrollTrigger: { trigger: team, start: 'top 78%', once: true },
            },
          )
          gsap.fromTo(
            teamImage,
            { yPercent: -2.5 },
            {
              yPercent: 2.5,
              ease: 'none',
              scrollTrigger: {
                trigger: team,
                start: 'top bottom',
                end: 'bottom top',
                scrub: 0.6,
              },
            },
          )
        }, team)
      }

      const magneticElements = Array.from(
        document.querySelectorAll<HTMLElement>('[data-magnetic]'),
      )
      const magneticCleanups = magneticElements.map((element) => {
        const onMove = (event: PointerEvent) => {
          const rect = element.getBoundingClientRect()
          const x = (event.clientX - (rect.left + rect.width / 2)) * 0.14
          const y = (event.clientY - (rect.top + rect.height / 2)) * 0.14
          gsap.to(element, { x, y, duration: 0.28, ease: 'power3.out', overwrite: true })
        }
        const onLeave = () => {
          gsap.to(element, { x: 0, y: 0, duration: 0.48, ease: 'elastic.out(1, 0.45)', overwrite: true })
        }

        element.addEventListener('pointermove', onMove)
        element.addEventListener('pointerleave', onLeave)
        return () => {
          element.removeEventListener('pointermove', onMove)
          element.removeEventListener('pointerleave', onLeave)
          gsap.set(element, { clearProps: 'transform' })
        }
      })

      let removeCursorListeners = () => undefined
      if (cursor && cursorLabel) {
        gsap.set(cursor, { autoAlpha: 0, xPercent: -50, yPercent: -50 })
        const moveX = gsap.quickTo(cursor, 'x', { duration: 0.28, ease: 'power3.out' })
        const moveY = gsap.quickTo(cursor, 'y', { duration: 0.28, ease: 'power3.out' })

        const syncCursorTarget = (target: Element | null) => {
          const interactive = target?.closest<HTMLElement>(
            '[data-cursor-label], a, button, input, [role="button"], [data-magnetic]',
          )
          const label = interactive?.dataset.cursorLabel ?? ''
          cursor.dataset.active = interactive ? 'true' : 'false'
          cursor.dataset.labeled = label ? 'true' : 'false'
          cursorLabel.textContent = label
        }
        const onPointerMove = (event: PointerEvent) => {
          moveX(event.clientX)
          moveY(event.clientY)
          syncCursorTarget(document.elementFromPoint(event.clientX, event.clientY))
          gsap.to(cursor, { autoAlpha: 1, duration: 0.16, overwrite: 'auto' })
        }
        const onPointerOver = (event: PointerEvent) => {
          syncCursorTarget(event.target as Element | null)
        }
        const onPointerLeave = () => {
          gsap.to(cursor, { autoAlpha: 0, duration: 0.16, overwrite: true })
        }

        window.addEventListener('pointermove', onPointerMove, { passive: true })
        document.addEventListener('pointerover', onPointerOver, { passive: true })
        document.documentElement.addEventListener('pointerleave', onPointerLeave)
        removeCursorListeners = () => {
          window.removeEventListener('pointermove', onPointerMove)
          document.removeEventListener('pointerover', onPointerOver)
          document.documentElement.removeEventListener('pointerleave', onPointerLeave)
        }
      }

      return () => {
        removeCursorListeners()
        magneticCleanups.forEach((cleanup) => cleanup())
        marqueeObserver?.disconnect()
        teamContext?.revert()
        splitContext?.revert()
        split?.revert()
        ScrollTrigger.getAll().forEach((trigger) => trigger.kill())
        lenis.destroy()
        cleanups.forEach((cleanup) => cleanup())
        if (headline) headline.dataset.revealMode = 'light'
        delete root.dataset.desktopEffects
        delete root.dataset.lenisActive
      }
    })

    return () => media.revert()
  }, [])

  return (
    <div ref={cursorRef} className="desktop-cursor" data-desktop-cursor aria-hidden="true">
      <span ref={cursorLabelRef} className="desktop-cursor-label" />
    </div>
  )
}
