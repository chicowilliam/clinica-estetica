// @vitest-environment jsdom

import { fireEvent, screen, waitFor, within } from '@testing-library/dom'
import { cleanup, render } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import App from './App'

function setViewport(width: number) {
  Object.defineProperty(window, 'innerWidth', { configurable: true, value: width })
  fireEvent(window, new Event('resize'))
}

function setScrollY(value: number) {
  Object.defineProperty(window, 'scrollY', { configurable: true, value })
  fireEvent.scroll(window)
}

async function selectPeeling() {
  const treatment = screen.getByRole('combobox', { name: 'Tratamento de interesse' })
  treatment.focus()
  fireEvent.keyDown(treatment, { key: 'ArrowDown' })
  const peeling = await screen.findByRole('option', { name: /Peeling/ })
  fireEvent.keyDown(peeling, { key: 'Enter' })
  await waitFor(() => expect(treatment).toHaveTextContent(/Peeling/))
}

async function continueToSchedule() {
  await selectPeeling()
  fireEvent.click(screen.getByRole('button', { name: 'Continuar para data e horário' }))
  await waitFor(() => expect(document.querySelector('[data-slot="calendar"]')).toBeInTheDocument())
}

async function chooseFirstAvailableSchedule() {
  const availableDay = Array.from(document.querySelectorAll<HTMLButtonElement>('[data-booking-day]')).find(
    (day) => !day.disabled,
  )
  expect(availableDay).toBeDefined()
  fireEvent.click(availableDay as HTMLButtonElement)

  const timeGrid = await waitFor(() => {
    const grid = document.querySelector('[data-booking-time-grid]')
    expect(grid).toBeInTheDocument()
    return grid as HTMLElement
  })
  fireEvent.click(within(timeGrid).getAllByRole('button')[0])
}

async function continueToContact() {
  await continueToSchedule()
  await chooseFirstAvailableSchedule()
  fireEvent.click(screen.getByRole('button', { name: 'Continuar para seus dados' }))
  await screen.findByLabelText('Nome')
}

afterEach(() => {
  cleanup()
  vi.restoreAllMocks()
  Object.defineProperty(window, 'innerWidth', { configurable: true, value: 1024 })
  Object.defineProperty(window, 'scrollY', { configurable: true, value: 0 })
})

describe('agendamento', () => {
  it('explica um campo assim que a paciente termina de preenchê-lo', async () => {
    render(<App />)
    await continueToContact()

    const name = screen.getByLabelText('Nome')
    fireEvent.change(name, { target: { value: 'A' } })
    fireEvent.focusOut(name)

    expect(await screen.findByText('Conte seu nome completo para continuarmos.')).toBeInTheDocument()
  })

  it('mantém os dados e explica cada campo inválido', async () => {
    render(<App />)

    fireEvent.click(screen.getByRole('button', { name: 'Continuar para data e horário' }))
    expect(await screen.findByText('Escolha o tratamento que você quer conversar sobre.')).toBeInTheDocument()

    await continueToContact()
    fireEvent.change(screen.getByLabelText('Nome'), { target: { value: 'A' } })
    fireEvent.change(screen.getByLabelText('Telefone'), { target: { value: '1199' } })
    fireEvent.click(screen.getByRole('button', { name: 'Enviar pedido de horário' }))

    expect(screen.getByDisplayValue('A')).toBeInTheDocument()
    expect(await screen.findByText('Confira o telefone: inclua DDD e número.')).toBeInTheDocument()
  })

  it('abre o WhatsApp com a solicitação preenchida e confirma a próxima etapa', async () => {
    const open = vi.spyOn(window, 'open').mockImplementation(() => null)
    render(<App />)

    await continueToContact()
    fireEvent.change(screen.getByLabelText('Nome'), { target: { value: 'Ana Souza' } })
    fireEvent.change(screen.getByLabelText('Telefone'), { target: { value: '(11) 98765-4321' } })
    fireEvent.click(screen.getByRole('button', { name: 'Enviar pedido de horário' }))

    await waitFor(() => {
      expect(open).toHaveBeenCalledWith(expect.stringContaining('https://wa.me/'), '_blank', 'noopener,noreferrer')
    })
    expect(await screen.findByRole('status')).toHaveTextContent(
      'Pedido preparado. Revise e envie a mensagem no WhatsApp; a equipe confirmará a disponibilidade.',
    )
  }, 15_000)

  it('revela serviço, agenda e dados em etapas progressivas sem inputs nativos', async () => {
    render(<App />)

    expect(document.querySelector('input[type="date"]')).not.toBeInTheDocument()
    expect(document.querySelector('input[type="time"]')).not.toBeInTheDocument()
    expect(screen.getByRole('combobox', { name: 'Tratamento de interesse' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Continuar para data e horário' })).toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: 'Encontre uma preferência' })).not.toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: 'Como a equipe fala com você?' })).not.toBeInTheDocument()
    expect(document.querySelector('[data-slot="calendar"]')).not.toBeInTheDocument()
    expect(screen.queryByLabelText('Nome')).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Enviar pedido de horário' })).not.toBeInTheDocument()

    await continueToSchedule()

    expect(document.querySelector('[data-slot="calendar"]')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Encontre uma preferência' })).toBeInTheDocument()
    expect(screen.getByText('Horários disponíveis')).toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: 'Como a equipe fala com você?' })).not.toBeInTheDocument()
    expect(screen.queryByLabelText('Nome')).not.toBeInTheDocument()

    await chooseFirstAvailableSchedule()
    expect(screen.getByRole('button', { name: 'Continuar para seus dados' })).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Continuar para seus dados' }))

    expect(await screen.findByLabelText('Nome')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Como a equipe fala com você?' })).toBeInTheDocument()
    expect(screen.getByLabelText('Telefone')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Enviar pedido de horário' })).toBeInTheDocument()
    expect(document.querySelector('input[type="date"]')).not.toBeInTheDocument()
    expect(document.querySelector('input[type="time"]')).not.toBeInTheDocument()
  })
})

describe('vitrine de tratamentos', () => {
  it('usa abas e troca a fotografia contextual ao escolher um tratamento', async () => {
    render(<App />)

    const treatment = screen.getByRole('tab', { name: /Drenagem linfática/ })
    fireEvent.mouseDown(treatment, { button: 0, ctrlKey: false })

    await waitFor(() => expect(treatment).toHaveAttribute('aria-selected', 'true'))
    expect(await screen.findByRole('img', { name: /drenagem linfática/i })).toBeInTheDocument()
  })
})

describe('estrutura editorial', () => {
  it('mostra o título dos depoimentos uma única vez', () => {
    render(<App />)

    expect(
      screen.getAllByRole('heading', {
        name: 'O que as pacientes lembram depois da consulta.',
      }),
    ).toHaveLength(1)
  })

  it('mostra um contexto visual para a localização fictícia', () => {
    render(<App />)

    expect(screen.getByRole('img', { name: /mapa ilustrado da região/i })).toBeInTheDocument()
  })
})

describe('linguagem visual da clínica', () => {
  it('mantém o headline fluido, acessível e preparado para revelação por linhas', () => {
    render(<App />)

    const headline = screen.getByRole('heading', {
      name: 'Antes de indicar um procedimento, olhamos sua pele de perto.',
    })
    const lines = headline.querySelectorAll('[data-hero-line]')

    expect(headline).toHaveAttribute('data-fluid-headline')
    expect(lines.length).toBeGreaterThanOrEqual(3)
    expect(Array.from(lines).every((line) => (line.textContent ?? '').trim().length > 0)).toBe(true)
  })

  it('usa somente um gesto tipográfico de acento no hero, sem rough-notation ou sublinhado', () => {
    render(<App />)

    const headline = screen.getByRole('heading', {
      name: 'Antes de indicar um procedimento, olhamos sua pele de perto.',
    })
    const accents = headline.querySelectorAll('em')

    expect(accents).toHaveLength(1)
    expect(accents[0]).toHaveTextContent('de perto.')
    expect(headline.querySelector('[data-annotation], [data-hero-highlight]')).not.toBeInTheDocument()
    expect(headline.querySelector('.rough-annotation')).not.toBeInTheDocument()
  })

  it('mantém a hairline da navbar dentro do mesmo container do conteúdo', () => {
    render(<App />)

    const header = screen.getByRole('banner')
    const container = header.querySelector('[data-header-container]')
    const hairline = header.querySelector('[data-navbar-hairline]')

    expect(container).toBeInTheDocument()
    expect(hairline).toBeInTheDocument()
    expect(container).toContainElement(hairline as HTMLElement)
  })

  it('mantém a navbar estável no viewport mobile depois do scroll', () => {
    setViewport(375)
    render(<App />)

    const header = screen.getByRole('banner')
    expect(header).toHaveAttribute('data-floating', 'false')

    setScrollY(96)

    expect(header).toHaveAttribute('data-floating', 'false')
  })

  it('mantém a navbar fora do conteúdo também no desktop depois do scroll', () => {
    setViewport(1440)
    render(<App />)

    const header = screen.getByRole('banner')
    expect(header).toHaveAttribute('data-floating', 'false')

    setScrollY(96)

    expect(header).toHaveAttribute('data-floating', 'false')
  })

  it('usa a mesma moldura editorial em todos os contextos fotográficos', () => {
    render(<App />)

    const contexts = Array.from(document.querySelectorAll('[data-photo-frame]')).map((frame) =>
      frame.getAttribute('data-photo-frame'),
    )

    expect(contexts).toEqual(expect.arrayContaining(['hero', 'clinic', 'treatment', 'comparison', 'team']))
  })

  it('apresenta o plano de cuidado como uma sequência editorial, sem cards repetidos', () => {
    render(<App />)

    const sequence = screen.getByRole('list', { name: 'Sequência de atendimento' })
    expect(within(sequence).getAllByRole('listitem')).toHaveLength(3)
    expect(within(sequence).getByText('01')).toBeInTheDocument()
    expect(within(sequence).getByText('02')).toBeInTheDocument()
    expect(within(sequence).getByText('03')).toBeInTheDocument()
    expect(sequence.querySelector('[data-slot="card"]')).not.toBeInTheDocument()
  })

  it('mantém os relatos em um carrossel editorial com navegação por setas', () => {
    render(<App />)

    const carousel = screen.getByRole('region', { name: 'Relatos de pacientes' })
    expect(within(carousel).getAllByRole('article')).toHaveLength(4)
    expect(within(carousel).getByRole('button', { name: 'Depoimento anterior' })).toBeInTheDocument()
    expect(within(carousel).getByRole('button', { name: 'Próximo depoimento' })).toBeInTheDocument()
    expect(within(carousel).getByRole('progressbar', { name: 'Progresso dos relatos' })).toHaveAttribute(
      'aria-valuenow',
      '1',
    )
    expect(carousel.querySelector('[data-slot="card"]')).not.toBeInTheDocument()
  })

  it('atualiza o indicador visível ao mover o comparativo', () => {
    render(<App />)

    const comparator = screen.getByRole('slider', { name: 'Comparar imagem antes e depois' })
    const comparisonProgress = document.querySelector('[data-comparison-progress]')
    expect(comparisonProgress).toHaveTextContent('50%')

    fireEvent.change(comparator, { target: { value: '68' } })
    expect(comparisonProgress).toHaveTextContent('68%')
  })

  it('usa uma única pausa de alto contraste com provas concretas', () => {
    render(<App />)

    const contrastSections = document.querySelectorAll('[data-contrast-section]')
    expect(contrastSections).toHaveLength(1)
    expect(contrastSections[0]).toHaveAccessibleName()
    expect(contrastSections[0].querySelectorAll('dl > div').length).toBeGreaterThanOrEqual(3)
  })

  it('mantém um único marquee sem duplicar conteúdo para tecnologias assistivas', () => {
    render(<App />)

    const marquees = document.querySelectorAll('[data-marquee]')
    expect(marquees).toHaveLength(1)
    expect(marquees[0]).toHaveAccessibleName('Tratamentos em movimento')
    expect(marquees[0].querySelectorAll('[data-marquee-track]')).toHaveLength(2)
    expect(marquees[0].querySelector('[data-marquee-track]:not([aria-hidden="true"])')).toBeInTheDocument()
    expect(marquees[0].querySelector('[data-marquee-track][aria-hidden="true"]')).toBeInTheDocument()
  })

  it('abre o menu mobile em tela cheia, fecha com Escape e devolve o foco ao acionador', async () => {
    setViewport(375)
    render(<App />)

    const trigger = screen.getByRole('button', { name: 'Abrir menu' })
    fireEvent.click(trigger)

    const dialog = await screen.findByRole('dialog', { name: 'Navegação móvel' })
    expect(dialog).toHaveAttribute('aria-modal', 'true')
    expect(within(dialog).getByRole('link', { name: 'A clínica' })).toBeInTheDocument()
    expect(within(dialog).getByRole('link', { name: 'Agendar avaliação' })).toBeInTheDocument()

    fireEvent.keyDown(dialog, { key: 'Escape', code: 'Escape' })

    await waitFor(() => expect(screen.queryByRole('dialog', { name: 'Navegação móvel' })).not.toBeInTheDocument())
    expect(trigger).toHaveFocus()
    expect(trigger).toHaveAttribute('aria-expanded', 'false')
  })

  it('oferece WhatsApp fixo pelo componente compartilhado e não monta efeitos de ponteiro no mobile', () => {
    setViewport(375)
    render(<App />)

    const whatsapp = document.querySelector('[data-whatsapp-dock]')
    expect(whatsapp).toBeInTheDocument()
    expect(whatsapp).toHaveAttribute('data-slot', 'button')
    expect(whatsapp).toHaveAttribute('href', expect.stringContaining('https://wa.me/'))
    expect(document.querySelector('[data-desktop-cursor]')).not.toBeInTheDocument()
  })

  it('usa movimento comedido sem prender o hero ou a vitrine ao scroll', () => {
    render(<App />)

    expect(document.querySelector('[data-gsap-moment="hero-divider"]')).not.toBeInTheDocument()
    expect(document.querySelector('[data-gsap-moment="treatment-pin"]')).not.toBeInTheDocument()
    expect(screen.getByText('60 min')).toBeInTheDocument()
    expect(screen.getByText('sem pacote fechado')).toBeInTheDocument()
  })

  it('diferencia a ação principal da secundária e prepara a seta para o hover', () => {
    render(<App />)

    const hero = screen.getByRole('heading', {
      name: 'Antes de indicar um procedimento, olhamos sua pele de perto.',
    }).closest('section') as HTMLElement
    const primary = within(hero).getByRole('link', { name: 'Solicitar avaliação' })
    const secondary = within(hero).getByRole('link', { name: 'Ver tratamentos' })
    expect(primary).toHaveAttribute('data-variant', 'primary')
    expect(primary.querySelector('[data-button-arrow]')).toBeInTheDocument()
    expect(secondary).toHaveAttribute('data-variant', 'secondary')
  })

  it('mantém todos os botões no componente compartilhado e nas três variantes do sistema', () => {
    render(<App />)

    const buttons = Array.from(document.querySelectorAll<HTMLElement>('[data-slot="button"]'))
    expect(buttons.length).toBeGreaterThan(0)
    expect(buttons.every((button) => ['primary', 'secondary', 'ghost'].includes(button.dataset.variant ?? ''))).toBe(true)
  })

  it('mantém um único indicador animado dentro do tratamento ativo', async () => {
    render(<App />)

    const drainage = screen.getByRole('tab', { name: /Drenagem linfática/ })
    fireEvent.mouseDown(drainage, { button: 0, ctrlKey: false })

    await waitFor(() => expect(drainage).toHaveAttribute('aria-selected', 'true'))
    expect(document.querySelector('[data-treatment-active-indicator]')).toHaveAttribute(
      'data-active-treatment',
      'Drenagem linfática',
    )
    expect(document.querySelectorAll('[data-treatment-active-indicator]')).toHaveLength(1)
  })
})
