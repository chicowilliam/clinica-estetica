import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react'
import { useState } from 'react'

export function BeforeAfter() {
  const [position, setPosition] = useState(50)
  const [dragging, setDragging] = useState(false)

  return (
    <div className="comparison" data-dragging={dragging}>
      <div className="comparison-image comparison-before" aria-hidden="true" />
      <div
        className="comparison-image comparison-after"
        style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
        aria-hidden="true"
      />
      <span className="comparison-label comparison-label-before">Antes</span>
      <span className="comparison-label comparison-label-after">Depois</span>
      <div className="comparison-handle" style={{ left: `${position}%` }} aria-hidden="true">
        <span>
          <ChevronLeftIcon />
          <ChevronRightIcon />
        </span>
      </div>
      <input
        className="comparison-range"
        type="range"
        min="0"
        max="100"
        value={position}
        aria-label="Comparar imagem antes e depois"
        onPointerDown={() => setDragging(true)}
        onPointerUp={() => setDragging(false)}
        onPointerCancel={() => setDragging(false)}
        onBlur={() => setDragging(false)}
        onChange={(event) => setPosition(Number(event.target.value))}
      />
    </div>
  )
}
