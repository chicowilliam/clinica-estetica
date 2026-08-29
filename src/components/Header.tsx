import { useState } from 'react'
import { MenuIcon, XIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'

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
    <header className="header-rule relative z-30">
      <div className="page-grid flex min-h-20 items-center justify-between gap-4 py-4 md:min-h-24">
        <a className="font-display text-[1.28rem] leading-none font-semibold tracking-[-0.025em]" href="#inicio" aria-label="Clínica Olívia Salles, início">
          Olívia Salles
          <span className="mt-2 block font-sans text-[0.58rem] font-medium tracking-[0.16em] text-muted-foreground">CLÍNICA DE ESTÉTICA</span>
        </a>

        <nav className="hidden items-center gap-6 lg:flex" aria-label="Navegação principal">
          {links.map(([label, href]) => (
            <a className="nav-link" href={href} key={href}>
              {label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Button asChild className="hidden sm:inline-flex">
            <a href="#agendamento">Agendar avaliação</a>
          </Button>
          <Button
            className="lg:hidden"
            variant="control"
            size="icon-lg"
            type="button"
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? 'Fechar menu' : 'Abrir menu'}
            onClick={() => setOpen((value) => !value)}
          >
            {open ? <XIcon strokeWidth={1.35} /> : <MenuIcon strokeWidth={1.35} />}
          </Button>
        </div>
      </div>

      {open ? (
        <nav id="mobile-nav" className="mobile-nav page-grid bg-clinic-pink py-4 lg:hidden" aria-label="Navegação móvel">
          {links.map(([label, href]) => (
            <a className="mobile-nav-link block py-4 text-sm font-medium" href={href} key={href} onClick={() => setOpen(false)}>
              {label}
            </a>
          ))}
          <Button asChild className="mt-4 w-full sm:hidden">
            <a href="#agendamento" onClick={() => setOpen(false)}>Agendar avaliação</a>
          </Button>
        </nav>
      ) : null}
    </header>
  )
}
