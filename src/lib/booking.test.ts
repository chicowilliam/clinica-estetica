import { describe, expect, it } from 'vitest'

import { buildWhatsAppMessage, validateBooking } from './booking'

describe('validateBooking', () => {
  it('aceita um pedido preenchido com telefone brasileiro e data futura', () => {
    const result = validateBooking(
      {
        name: '  Ana Souza  ',
        phone: '(11) 98765-4321',
        treatment: 'Limpeza de pele profunda',
        preferredDate: '2026-09-04',
        preferredTime: '14:30',
      },
      new Date('2026-08-28T10:00:00-03:00'),
    )

    expect(result).toEqual({})
  })

  it('explica como corrigir nome, telefone e data inválidos', () => {
    const result = validateBooking(
      {
        name: 'A',
        phone: '11999',
        treatment: '',
        preferredDate: '2026-08-27',
        preferredTime: '',
      },
      new Date('2026-08-28T10:00:00-03:00'),
    )

    expect(result).toEqual({
      name: 'Conte seu nome completo para continuarmos.',
      phone: 'Confira o telefone: inclua DDD e número.',
      treatment: 'Escolha o tratamento que você quer conversar sobre.',
      preferredDate: 'Escolha uma data a partir de hoje.',
      preferredTime: 'Indique um horário aproximado.',
    })
  })
})

describe('buildWhatsAppMessage', () => {
  it('gera uma mensagem legível sem incluir marcação HTML', () => {
    const message = buildWhatsAppMessage({
      name: 'Ana <script>alert(1)</script>',
      phone: '(11) 98765-4321',
      treatment: 'Peeling',
      preferredDate: '2026-09-04',
      preferredTime: '14:30',
    })

    expect(message).toContain('Ana scriptalert(1)/script')
    expect(message).toContain('04/09/2026, às 14:30')
    expect(message).not.toContain('<script>')
  })
})
