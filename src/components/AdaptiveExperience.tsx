import { useEffect, useState, type ComponentType } from 'react'

const desktopExperienceQuery =
  '(min-width: 64rem) and (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)'

export function AdaptiveExperience() {
  const [Experience, setExperience] = useState<ComponentType | null>(null)

  useEffect(() => {
    const media = window.matchMedia(desktopExperienceQuery)
    let active = true

    const syncExperience = () => {
      if (!media.matches) {
        setExperience(null)
        return
      }

      void import('@/components/DesktopExperience').then((module) => {
        if (active && media.matches) {
          setExperience(() => module.DesktopExperience)
        }
      })
    }

    syncExperience()
    media.addEventListener('change', syncExperience)

    return () => {
      active = false
      media.removeEventListener('change', syncExperience)
    }
  }, [])

  return Experience ? <Experience /> : null
}
