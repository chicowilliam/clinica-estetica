import { useState } from 'react'

import { CloseIcon, MenuIcon } from './icons'

const links = [
  ['A clínica', '#clinica'],
  ['Tratamentos', '#tratamentos'],
  ['Resultados', '#resultados'],
  ['Equipe', '#equipe'],
  ['Contato', '#contato'],
]

export function Header() {
  const [open, setOpen] = useState(false)

  return (
    <header className="relative z-30 border-b border-gold/45">
      <div className="page-grid flex min-h-20 items-center justify-between gap-4 py-3 md:min-h-24">
        <a className="font-display text-[1.28rem] leading-none font-semibold tracking-[-0.025em]" href="#inicio" aria-label="Clínica Olívia Salles, início">
          Olívia Salles
          <span className="mt-1 block font-sans text-[0.58rem] font-medium tracking-[0.16em] text-muted">CLÍNICA DE ESTÉTICA</span>
        </a>

        <nav className="hidden items-center gap-7 lg:flex" aria-label="Navegação principal">
          {links.map(([label, href]) => (
            <a className="nav-link" href={href} key={href}>
              {label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <a className="button-primary hidden sm:inline-flex" href="#agendamento">
            Agendar avaliação
          </a>
          <button
            className="icon-button lg:hidden"
            type="button"
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? 'Fechar menu' : 'Abrir menu'}
            onClick={() => setOpen((value) => !value)}
          >
            {open ? <CloseIcon className="size-5" /> : <MenuIcon className="size-5" />}
          </button>
        </div>
      </div>

      {open ? (
        <nav id="mobile-nav" className="page-grid border-t border-gold/45 bg-clinic-pink py-3 lg:hidden" aria-label="Navegação móvel">
          {links.map(([label, href]) => (
            <a className="block border-b border-gold/35 py-4 text-sm font-medium" href={href} key={href} onClick={() => setOpen(false)}>
              {label}
            </a>
          ))}
          <a className="button-primary mt-4 w-full sm:hidden" href="#agendamento" onClick={() => setOpen(false)}>
            Agendar avaliação
          </a>
        </nav>
      ) : null}
    </header>
  )
}
