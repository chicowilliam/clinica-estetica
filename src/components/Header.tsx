import { useEffect, useState } from 'react'
import { motion, useReducedMotion, type Variants } from 'framer-motion'
import { MenuIcon, XIcon } from 'lucide-react'

import { Button, ButtonIcon } from '@/components/ui/button'
import { Magnetic } from '@/components/Magnetic'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from '@/components/ui/navigation-menu'
import { Separator } from '@/components/ui/separator'

const links = [
  ['A clínica', '#clinica'],
  ['Tratamentos', '#tratamentos'],
  ['Resultados', '#resultados'],
  ['Equipe', '#equipe'],
  ['Contato', '#contato'],
]

export function Header() {
  const [open, setOpen] = useState(false)
  const reduceMotion = useReducedMotion()

  useEffect(() => {
    if (!window.matchMedia) return
    const desktop = window.matchMedia('(min-width: 64rem)')
    const closeOnDesktop = () => {
      if (desktop.matches) setOpen(false)
    }

    closeOnDesktop()
    desktop.addEventListener('change', closeOnDesktop)
    return () => desktop.removeEventListener('change', closeOnDesktop)
  }, [])

  const menuListVariants: Variants = {
    hidden: {},
    visible: {
      transition: {
        delayChildren: reduceMotion ? 0 : 0.08,
        staggerChildren: reduceMotion ? 0 : 0.055,
      },
    },
  }

  const menuItemVariants: Variants = {
    hidden: { opacity: 0, y: reduceMotion ? 0 : 22 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: reduceMotion ? 0 : 0.42, ease: [0.22, 1, 0.36, 1] },
    },
  }

  return (
    <header className="site-header" data-floating="false">
      <div className="page-grid" data-header-container>
        <div
          className="header-surface"
          data-mobile-open={open ? 'true' : 'false'}
        >
          <div className="header-row flex min-h-20 items-center justify-between gap-4">
            <a className="font-display text-[1.28rem] leading-none font-semibold tracking-[-0.025em]" href="#inicio" aria-label="Clínica Olívia Salles, início">
              Olívia Salles
              <span className="mt-2 block font-sans text-[0.58rem] font-medium tracking-[0.16em] text-muted-foreground">CLÍNICA DE ESTÉTICA</span>
            </a>

            <NavigationMenu className="site-navigation hidden lg:flex" viewport={false} aria-label="Navegação principal">
              <NavigationMenuList>
                {links.map(([label, href]) => (
                  <NavigationMenuItem key={href}>
                    <NavigationMenuLink asChild>
                      <a href={href} data-cursor-label="Explorar">{label}</a>
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                ))}
              </NavigationMenuList>
            </NavigationMenu>

            <div className="flex items-center gap-2">
              <Magnetic className="hidden sm:inline-flex">
                <Button asChild>
                  <a href="#agendamento" data-cursor-label="Agendar">Agendar avaliação</a>
                </Button>
              </Magnetic>
              <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                  <Button
                    className="lg:hidden"
                    variant="ghost"
                    size="icon-lg"
                    type="button"
                    aria-expanded={open}
                    aria-controls="mobile-nav"
                    aria-label="Abrir menu"
                  >
                    <ButtonIcon>
                      <MenuIcon strokeWidth={1.35} />
                    </ButtonIcon>
                  </Button>
                </DialogTrigger>

                <DialogContent
                  id="mobile-nav"
                  role="dialog"
                  aria-label="Navegação móvel"
                  aria-modal="true"
                  aria-describedby={undefined}
                  showCloseButton={false}
                  className="mobile-menu-dialog inset-0 top-0 left-0 flex h-[100dvh] w-screen max-w-none translate-x-0 translate-y-0 flex-col gap-0 overflow-hidden rounded-none border-0 bg-background p-0 shadow-none ring-0 data-open:zoom-in-100 data-closed:zoom-out-100 lg:hidden"
                >
                  <DialogTitle className="sr-only">Navegação móvel</DialogTitle>

                  <div className="flex min-h-20 shrink-0 items-center justify-between border-b border-border/80 px-5 sm:px-10">
                    <a
                      className="flex min-h-11 flex-col justify-center font-display text-[1.28rem] leading-none font-semibold tracking-[-0.025em]"
                      href="#inicio"
                      aria-label="Clínica Olívia Salles, início"
                      onClick={() => setOpen(false)}
                    >
                      Olívia Salles
                      <span className="mt-2 block font-sans text-[0.58rem] font-medium tracking-[0.16em] text-muted-foreground">CLÍNICA DE ESTÉTICA</span>
                    </a>

                    <DialogClose asChild>
                      <Button
                        variant="ghost"
                        size="icon-lg"
                        type="button"
                        aria-label="Fechar menu"
                      >
                        <ButtonIcon>
                          <XIcon strokeWidth={1.35} />
                        </ButtonIcon>
                      </Button>
                    </DialogClose>
                  </div>

                  <nav className="flex min-h-0 flex-1 flex-col overflow-y-auto px-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-6 sm:px-10 sm:pt-10" aria-label="Navegação móvel">
                    <motion.ul
                      className="m-0 list-none p-0"
                      variants={menuListVariants}
                      initial="hidden"
                      animate="visible"
                    >
                      {links.map(([label, href], index) => (
                        <motion.li key={href} variants={menuItemVariants}>
                          <a
                            className="flex min-h-16 items-center border-b border-border/80 py-3 font-display text-[clamp(2.15rem,10vw,4.75rem)] leading-[0.95] tracking-[-0.04em] text-foreground outline-none transition-[color,padding] duration-200 active:pl-2 active:text-primary focus-visible:text-primary focus-visible:ring-2 focus-visible:ring-ring/45 focus-visible:ring-offset-2"
                            href={href}
                            onClick={() => setOpen(false)}
                          >
                            <span className="mr-4 font-sans text-[0.62rem] font-semibold tracking-[0.14em] text-primary" aria-hidden="true">
                              {String(index + 1).padStart(2, '0')}
                            </span>
                            {label}
                          </a>
                        </motion.li>
                      ))}
                    </motion.ul>

                    <motion.div
                      className="mt-auto pt-8"
                      variants={menuItemVariants}
                      initial="hidden"
                      animate="visible"
                    >
                      <p className="mb-4 text-[0.67rem] font-semibold tracking-[0.15em] text-muted-foreground uppercase">
                        Cuidado começa com escuta
                      </p>
                      <Button asChild className="w-full">
                        <a href="#agendamento" onClick={() => setOpen(false)}>Agendar avaliação</a>
                      </Button>
                    </motion.div>
                  </nav>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          <Separator className="navbar-hairline" data-navbar-hairline />
        </div>
      </div>
    </header>
  )
}
