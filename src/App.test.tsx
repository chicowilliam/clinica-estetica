// @vitest-environment jsdom

import { fireEvent, screen } from '@testing-library/dom'
import { cleanup, render } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import App from './App'

afterEach(() => {
  cleanup()
  vi.restoreAllMocks()
})

describe('agendamento', () => {
  it('mantém os dados e explica cada campo inválido', () => {
    render(<App />)

    fireEvent.change(screen.getByLabelText('Nome'), { target: { value: 'A' } })
    fireEvent.change(screen.getByLabelText('Telefone'), { target: { value: '1199' } })
    fireEvent.click(screen.getByRole('button', { name: 'Preparar pedido no WhatsApp' }))

    expect(screen.getByDisplayValue('A')).toBeInTheDocument()
    expect(screen.getByText('Confira o telefone: inclua DDD e número.')).toBeInTheDocument()
    expect(screen.getByText('Escolha o tratamento que você quer conversar sobre.')).toBeInTheDocument()
  })

  it('abre o WhatsApp com a solicitação preenchida e confirma a próxima etapa', () => {
    const open = vi.spyOn(window, 'open').mockImplementation(() => null)
    render(<App />)

    fireEvent.change(screen.getByLabelText('Nome'), { target: { value: 'Ana Souza' } })
    fireEvent.change(screen.getByLabelText('Telefone'), { target: { value: '(11) 98765-4321' } })
    fireEvent.change(screen.getByLabelText('Tratamento de interesse'), { target: { value: 'Peeling' } })
    fireEvent.change(screen.getByLabelText('Dia preferido'), { target: { value: '2099-09-04' } })
    fireEvent.change(screen.getByLabelText('Horário preferido'), { target: { value: '14:30' } })
    fireEvent.click(screen.getByRole('button', { name: 'Preparar pedido no WhatsApp' }))

    expect(open).toHaveBeenCalledWith(expect.stringContaining('https://wa.me/'), '_blank', 'noopener,noreferrer')
    expect(screen.getByRole('status')).toHaveTextContent(
      'Dados conferidos. Abrimos o WhatsApp com sua solicitação.',
    )
  })
})

describe('vitrine de tratamentos', () => {
  it('troca a fotografia contextual ao escolher um tratamento', () => {
    render(<App />)

    fireEvent.click(screen.getByRole('button', { name: /Drenagem linfática/ }))

    expect(screen.getByRole('img', { name: /drenagem linfática/i })).toBeInTheDocument()
  })
})
