// @vitest-environment jsdom

import { fireEvent, screen, waitFor } from '@testing-library/dom'
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
