// @vitest-environment jsdom

import { fireEvent, screen, waitFor, within } from '@testing-library/dom'
import { cleanup, render } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import App from './App'

afterEach(() => {
  cleanup()
  vi.restoreAllMocks()
})

describe('agendamento', () => {
  it('explica um campo assim que a paciente termina de preenchê-lo', async () => {
    render(<App />)

    const name = screen.getByLabelText('Nome')
    fireEvent.change(name, { target: { value: 'A' } })
    fireEvent.focusOut(name)

    expect(await screen.findByText('Conte seu nome completo para continuarmos.')).toBeInTheDocument()
  })

  it('mantém os dados e explica cada campo inválido', async () => {
    render(<App />)

    fireEvent.change(screen.getByLabelText('Nome'), { target: { value: 'A' } })
    fireEvent.change(screen.getByLabelText('Telefone'), { target: { value: '1199' } })
    fireEvent.click(screen.getByRole('button', { name: 'Preparar pedido no WhatsApp' }))

    expect(screen.getByDisplayValue('A')).toBeInTheDocument()
    expect(await screen.findByText('Confira o telefone: inclua DDD e número.')).toBeInTheDocument()
    expect(await screen.findByText('Escolha o tratamento que você quer conversar sobre.')).toBeInTheDocument()
  })

  it('abre o WhatsApp com a solicitação preenchida e confirma a próxima etapa', async () => {
    const open = vi.spyOn(window, 'open').mockImplementation(() => null)
    render(<App />)

    fireEvent.change(screen.getByLabelText('Nome'), { target: { value: 'Ana Souza' } })
    fireEvent.change(screen.getByLabelText('Telefone'), { target: { value: '(11) 98765-4321' } })
    const treatment = screen.getByRole('combobox', { name: 'Tratamento de interesse' })
    treatment.focus()
    fireEvent.keyDown(treatment, { key: 'ArrowDown' })
    const peeling = await screen.findByRole('option', { name: 'Peeling' })
    fireEvent.keyDown(peeling, { key: 'Enter' })
    fireEvent.change(screen.getByLabelText('Dia preferido'), { target: { value: '2099-09-04' } })
    fireEvent.change(screen.getByLabelText('Horário preferido'), { target: { value: '14:30' } })
    fireEvent.click(screen.getByRole('button', { name: 'Preparar pedido no WhatsApp' }))

    await waitFor(() => {
      expect(open).toHaveBeenCalledWith(expect.stringContaining('https://wa.me/'), '_blank', 'noopener,noreferrer')
    })
    expect(await screen.findByRole('status')).toHaveTextContent(
      'Solicitação preparada. O WhatsApp foi aberto para você revisar e enviar a mensagem.',
    )
  }, 15_000)
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
    expect(carousel.querySelector('[data-slot="card"]')).not.toBeInTheDocument()
  })

  it('expõe os dois momentos editoriais controlados pelo scroll', () => {
    render(<App />)

    expect(document.querySelector('[data-gsap-moment="hero-divider"]')).toBeInTheDocument()
    expect(document.querySelector('[data-gsap-moment="treatment-pin"]')).toBeInTheDocument()
  })

  it('diferencia a ação principal da secundária e prepara a seta para o hover', () => {
    render(<App />)

    const primary = screen.getByRole('link', { name: 'Solicitar avaliação' })
    const secondary = screen.getByRole('link', { name: 'Ver tratamentos' })
    expect(primary).toHaveAttribute('data-variant', 'default')
    expect(primary.querySelector('[data-button-arrow]')).toBeInTheDocument()
    expect(secondary).toHaveAttribute('data-variant', 'secondary')
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
