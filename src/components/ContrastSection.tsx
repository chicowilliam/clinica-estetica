import { Reveal } from '@/components/Reveal'

const facts = [
  ['09', 'anos de prática clínica'],
  ['60', 'minutos na primeira conversa'],
  ['01', 'plano construído para cada pele'],
]

export function ContrastSection() {
  return (
    <section className="contrast-section" data-contrast-section aria-labelledby="contrast-title">
      <Reveal className="page-grid contrast-grid">
        <p className="contrast-kicker">Manifesto de cuidado</p>
        <blockquote id="contrast-title">
          O procedimento pode ser pontual. <em>O olhar nunca é.</em>
        </blockquote>
        <p className="contrast-copy">
          Técnica, pausa e acompanhamento para decidir menos por impulso — e mais pelo que a pele realmente pede.
        </p>
        <dl className="contrast-facts">
          {facts.map(([value, label]) => (
            <div key={label}>
              <dt>{value}</dt>
              <dd>{label}</dd>
            </div>
          ))}
        </dl>
      </Reveal>
    </section>
  )
}
