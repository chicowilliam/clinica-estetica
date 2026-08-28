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

export function validateBooking(data: BookingData, now = new Date()): BookingErrors {
  const errors: BookingErrors = {}
  const phoneDigits = data.phone.replace(/\D/g, '')

  if (cleanText(data.name).length < 2) {
    errors.name = 'Conte seu nome completo para continuarmos.'
  }

  if (phoneDigits.length < 10 || phoneDigits.length > 11) {
    errors.phone = 'Confira o telefone: inclua DDD e número.'
  }

  if (!cleanText(data.treatment, 80)) {
    errors.treatment = 'Escolha o tratamento que você quer conversar sobre.'
  }

  if (!ISO_DATE.test(data.preferredDate) || data.preferredDate < localIsoDate(now)) {
    errors.preferredDate = 'Escolha uma data a partir de hoje.'
  }

  if (!TIME.test(data.preferredTime)) {
    errors.preferredTime = 'Indique um horário aproximado.'
  }

  return errors
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
