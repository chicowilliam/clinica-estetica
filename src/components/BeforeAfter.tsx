import { useEffect, useRef, useState } from 'react'

export function BeforeAfter() {
  const [position, setPosition] = useState(50)
  const [demo, setDemo] = useState(false)
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const element = sectionRef.current
    const reducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false
    if (!element || reducedMotion || !('IntersectionObserver' in window)) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        setDemo(true)
        observer.disconnect()
        window.setTimeout(() => setDemo(false), 920)
      },
      { threshold: 0.55 },
    )
    observer.observe(element)
    return () => observer.disconnect()
  }, [])

  const stopDemo = () => setDemo(false)

  return (
    <div ref={sectionRef} className={`comparison ${demo ? 'comparison-demo' : ''}`}>
      <div className="comparison-image comparison-before" aria-hidden="true" />
      <div className="comparison-image comparison-after" style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }} aria-hidden="true" />
      <span className="comparison-label comparison-label-before">Antes</span>
      <span className="comparison-label comparison-label-after">Depois</span>
      <div className="comparison-handle" style={{ left: `${position}%` }} aria-hidden="true">
        <span />
      </div>
      <input
        className="comparison-range"
        type="range"
        min="0"
        max="100"
        value={position}
        aria-label="Comparar imagem antes e depois"
        onPointerDown={stopDemo}
        onKeyDown={stopDemo}
        onChange={(event) => setPosition(Number(event.target.value))}
      />
    </div>
  )
}
