import { useState } from 'react'

import { treatments } from '../content'

export function TreatmentGallery() {
  const [selectedIndex, setSelectedIndex] = useState(0)
  const selected = treatments[selectedIndex]

  return (
    <div className="mt-10 grid gap-8 lg:grid-cols-[minmax(0,1.06fr)_minmax(320px,0.72fr)] lg:gap-16">
      <div className="border-t border-gold/70">
        {treatments.map((treatment, index) => {
          const active = index === selectedIndex
          return (
            <button
              className="treatment-row"
              type="button"
              aria-pressed={active}
              onClick={() => setSelectedIndex(index)}
              onFocus={() => setSelectedIndex(index)}
              key={treatment.name}
            >
              <span className="min-w-0">
                <span className="block font-display text-[clamp(1.38rem,3vw,2.15rem)] leading-[1.08] font-medium tracking-[-0.025em]">
                  {treatment.name}
                </span>
                <span className={`treatment-description ${active ? 'treatment-description-active' : ''}`}>{treatment.indication}</span>
              </span>
              <span className="shrink-0 pt-1 text-right text-[0.7rem] font-semibold tracking-[0.08em] text-muted">{treatment.duration}</span>
            </button>
          )
        })}
      </div>

      <div className="lg:sticky lg:top-8 lg:h-fit">
        <div
          className="treatment-image"
          role="img"
          aria-label={selected.imageDescription}
          style={{
            backgroundImage: `url(${selected.sheet})`,
            backgroundPosition: `${selected.panel * 50}% center`,
          }}
        />
        <div className="mt-4 flex items-start justify-between gap-6 border-t border-gold/55 pt-3 text-xs leading-relaxed text-muted">
          <p>Imagem ilustrativa do contexto clínico.</p>
          <p className="max-w-48 text-right">A indicação é definida somente após avaliação presencial.</p>
        </div>
      </div>
    </div>
  )
}
