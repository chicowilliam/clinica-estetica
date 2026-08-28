import { z } from 'zod'

export type BookingData = {
  name: string
  phone: string
  treatment: string
  preferredDate: string
  preferredTime: string
}

export type BookingErrors = Partial<Record<keyof BookingData, string>>

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/
const TIME = /^(?:[01]\d|2[0-3]):[0-5]\d$/

function localIsoDate(date: Date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function cleanText(value: string, maxLength = 120) {
  return value.replace(/[<>]/g, '').replace(/\s+/g, ' ').trim().slice(0, maxLength)
}

export function createBookingSchema(now = new Date()) {
  const minimumDate = localIsoDate(now)

  return z.object({
    name: z.string().refine((value) => cleanText(value).length >= 2, {
      message: 'Conte seu nome completo para continuarmos.',
    }),
    phone: z.string().refine((value) => {
      const digits = value.replace(/\D/g, '')
      return digits.length >= 10 && digits.length <= 11
    }, {
      message: 'Confira o telefone: inclua DDD e número.',
    }),
    treatment: z.string().refine((value) => Boolean(cleanText(value, 80)), {
      message: 'Escolha o tratamento que você quer conversar sobre.',
    }),
    preferredDate: z.string().refine(
      (value) => ISO_DATE.test(value) && value >= minimumDate,
      { message: 'Escolha uma data a partir de hoje.' },
    ),
    preferredTime: z.string().refine((value) => TIME.test(value), {
      message: 'Indique um horário aproximado.',
    }),
  })
}

export function validateBooking(data: BookingData, now = new Date()): BookingErrors {
  const result = createBookingSchema(now).safeParse(data)
  if (result.success) return {}

  return result.error.issues.reduce<BookingErrors>((errors, issue) => {
    const field = issue.path[0]
    if (typeof field === 'string' && field in data && !errors[field as keyof BookingData]) {
      errors[field as keyof BookingData] = issue.message
    }
    return errors
  }, {})
}

export function formatBrazilianDate(value: string) {
  if (!ISO_DATE.test(value)) return value
  const [year, month, day] = value.split('-')
  return `${day}/${month}/${year}`
}

export function buildWhatsAppMessage(data: BookingData) {
  const name = cleanText(data.name)
  const phone = cleanText(data.phone, 20)
  const treatment = cleanText(data.treatment, 80)
  const date = formatBrazilianDate(data.preferredDate)
  const time = TIME.test(data.preferredTime) ? data.preferredTime : cleanText(data.preferredTime, 10)

  return [
    'Olá, gostaria de solicitar uma avaliação na Clínica Olívia Salles.',
    '',
    `Nome: ${name}`,
    `Telefone: ${phone}`,
    `Tratamento de interesse: ${treatment}`,
    `Preferência: ${date}, às ${time}`,
    '',
    'Entendo que o horário será confirmado pela equipe.',
  ].join('\n')
}

export function buildWhatsAppUrl(data: BookingData, clinicPhone?: string) {
  const digits = clinicPhone?.replace(/\D/g, '')
  const base = digits ? `https://wa.me/${digits}` : 'https://wa.me/'
  return `${base}?text=${encodeURIComponent(buildWhatsAppMessage(data))}`
}
