import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react'
import { useRef, useState, type PointerEvent as ReactPointerEvent } from 'react'

export function BeforeAfter() {
  const [position, setPosition] = useState(50)
  const [dragging, setDragging] = useState(false)
  const activePointer = useRef<number | null>(null)

  const updateFromPointer = (event: ReactPointerEvent<HTMLInputElement>) => {
    const rect = event.currentTarget.getBoundingClientRect()
    const nextPosition = ((event.clientX - rect.left) / rect.width) * 100
    setPosition(Math.round(Math.min(100, Math.max(0, nextPosition))))
  }

  return (
    <figure className="comparison-shell" aria-labelledby="comparison-caption">
      <div className="comparison" data-dragging={dragging} data-photo-frame="comparison">
      <div className="comparison-image comparison-before" aria-hidden="true">
        <div className="comparison-portrait-window">
          <img src="/images/comparativo-pele.jpg" alt="" width="1536" height="1024" loading="lazy" decoding="async" />
        </div>
      </div>
      <div
        className="comparison-image comparison-after"
        style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
        aria-hidden="true"
      >
        <div className="comparison-portrait-window">
          <img src="/images/comparativo-pele.jpg" alt="" width="1536" height="1024" loading="lazy" decoding="async" />
        </div>
      </div>
      <span className="comparison-label comparison-label-before">Antes</span>
      <span className="comparison-label comparison-label-after">Depois</span>
      <div className="comparison-handle" style={{ left: `${position}%` }} aria-hidden="true">
        <span>
          <ChevronLeftIcon strokeWidth={1.35} />
          <ChevronRightIcon strokeWidth={1.35} />
        </span>
      </div>
      <input
        id="comparison-range"
        className="comparison-range"
        type="range"
        min="0"
        max="100"
        value={position}
        aria-label="Comparar imagem antes e depois"
        aria-valuetext={`${position}% da imagem depois revelada`}
        onPointerDown={(event) => {
          if (activePointer.current !== null) return
          activePointer.current = event.pointerId
          event.currentTarget.setPointerCapture(event.pointerId)
          setDragging(true)
          updateFromPointer(event)
        }}
        onPointerMove={(event) => {
          if (activePointer.current !== event.pointerId) return
          updateFromPointer(event)
        }}
        onPointerUp={(event) => {
          if (activePointer.current !== event.pointerId) return
          updateFromPointer(event)
          if (event.currentTarget.hasPointerCapture(event.pointerId)) {
            event.currentTarget.releasePointerCapture(event.pointerId)
          }
          activePointer.current = null
          setDragging(false)
        }}
        onPointerCancel={(event) => {
          if (activePointer.current === event.pointerId) activePointer.current = null
          setDragging(false)
        }}
        onBlur={() => {
          activePointer.current = null
          setDragging(false)
        }}
        onChange={(event) => setPosition(Number(event.target.value))}
      />
      </div>
      <figcaption id="comparison-caption" className="comparison-progress-row">
        <span>Deslize para comparar</span>
        <output data-comparison-progress htmlFor="comparison-range">{position}% revelado</output>
      </figcaption>
      <div className="comparison-progress-track" aria-hidden="true">
        <span style={{ width: `${position}%` }} />
      </div>
    </figure>
  )
}
