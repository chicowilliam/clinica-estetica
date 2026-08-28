import { type FormEvent, useMemo, useRef, useState } from 'react'

import { treatments } from '../content'
import { buildWhatsAppUrl, type BookingData, type BookingErrors, validateBooking } from '../lib/booking'
import { ArrowIcon, WhatsAppIcon } from './icons'

const initialData: BookingData = {
  name: '',
  phone: '',
  treatment: '',
  preferredDate: '',
  preferredTime: '',
}

const fieldOrder: (keyof BookingData)[] = ['name', 'phone', 'treatment', 'preferredDate', 'preferredTime']

function today() {
  const date = new Date()
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function FieldError({ id, children }: { id: string; children?: string }) {
  return children ? (
    <p className="field-error" id={id} role="alert">
      {children}
    </p>
  ) : null
}

export function BookingForm() {
  const [data, setData] = useState(initialData)
  const [errors, setErrors] = useState<BookingErrors>({})
  const [success, setSuccess] = useState('')
  const formRef = useRef<HTMLFormElement>(null)
  const minimumDate = useMemo(today, [])

  function update(field: keyof BookingData, value: string) {
    setData((current) => ({ ...current, [field]: value }))
    setErrors((current) => ({ ...current, [field]: undefined }))
    setSuccess('')
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const nextErrors = validateBooking(data)
    setErrors(nextErrors)
    setSuccess('')

    const firstInvalid = fieldOrder.find((field) => nextErrors[field])
    if (firstInvalid) {
      const field = formRef.current?.elements.namedItem(firstInvalid)
      if (field instanceof HTMLElement) field.focus()
      return
    }

    const clinicPhone = import.meta.env.VITE_WHATSAPP_NUMBER as string | undefined
    window.open(buildWhatsAppUrl(data, clinicPhone), '_blank', 'noopener,noreferrer')
    setSuccess('Dados conferidos. Abrimos o WhatsApp com sua solicitação.')
  }

  const directMessage = buildWhatsAppUrl({
    ...initialData,
    name: 'Paciente',
    phone: 'A combinar',
    treatment: 'Avaliação inicial',
    preferredDate: minimumDate,
    preferredTime: '09:00',
  }, import.meta.env.VITE_WHATSAPP_NUMBER as string | undefined)

  return (
    <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(280px,0.58fr)] lg:gap-18">
      <form ref={formRef} className="booking-form" noValidate onSubmit={submit}>
        <div className="grid gap-6 sm:grid-cols-2">
          <label className="field sm:col-span-2">
            <span>Nome</span>
            <input
              name="name"
              type="text"
              autoComplete="name"
              maxLength={120}
              value={data.name}
              aria-invalid={Boolean(errors.name)}
              aria-describedby={errors.name ? 'name-error' : undefined}
              onChange={(event) => update('name', event.target.value)}
            />
            <FieldError id="name-error">{errors.name}</FieldError>
          </label>

          <label className="field sm:col-span-2">
            <span>Telefone</span>
            <input
              name="phone"
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              maxLength={20}
              placeholder="(11) 98765-4321"
              value={data.phone}
              aria-invalid={Boolean(errors.phone)}
              aria-describedby={errors.phone ? 'phone-error' : undefined}
              onChange={(event) => update('phone', event.target.value)}
            />
            <FieldError id="phone-error">{errors.phone}</FieldError>
          </label>

          <label className="field sm:col-span-2">
            <span>Tratamento de interesse</span>
            <select
              name="treatment"
              value={data.treatment}
              aria-invalid={Boolean(errors.treatment)}
              aria-describedby={errors.treatment ? 'treatment-error' : undefined}
              onChange={(event) => update('treatment', event.target.value)}
            >
              <option value="">Selecione uma opção</option>
              {treatments.map((treatment) => (
                <option value={treatment.name} key={treatment.name}>
                  {treatment.name}
                </option>
              ))}
              <option value="Ainda não sei">Ainda não sei</option>
            </select>
            <FieldError id="treatment-error">{errors.treatment}</FieldError>
          </label>

          <label className="field">
            <span>Dia preferido</span>
            <input
              name="preferredDate"
              type="date"
              min={minimumDate}
              value={data.preferredDate}
              aria-invalid={Boolean(errors.preferredDate)}
              aria-describedby={errors.preferredDate ? 'date-error' : undefined}
              onChange={(event) => update('preferredDate', event.target.value)}
            />
            <FieldError id="date-error">{errors.preferredDate}</FieldError>
          </label>

          <label className="field">
            <span>Horário preferido</span>
            <input
              name="preferredTime"
              type="time"
              min="08:00"
              max="19:00"
              step="1800"
              value={data.preferredTime}
              aria-invalid={Boolean(errors.preferredTime)}
              aria-describedby={errors.preferredTime ? 'time-error' : undefined}
              onChange={(event) => update('preferredTime', event.target.value)}
            />
            <FieldError id="time-error">{errors.preferredTime}</FieldError>
          </label>
        </div>

        <button className="button-primary mt-8 w-full sm:w-auto" type="submit">
          Preparar pedido no WhatsApp
          <ArrowIcon className="size-4" />
        </button>
        <p className="mt-3 max-w-xl text-xs leading-relaxed text-muted">
          O envio é concluído no WhatsApp. A equipe responde para confirmar disponibilidade; este formulário não reserva o horário automaticamente.
        </p>
        {success ? (
          <p className="success-message" role="status">
            {success}
          </p>
        ) : null}
      </form>

      <aside className="border-t border-gold/60 pt-7 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-10">
        <p className="eyebrow">Prefere conversar primeiro?</p>
        <h3 className="mt-5 font-display text-4xl leading-[1.05] font-medium tracking-[-0.035em]">
          A equipe responde pelo WhatsApp durante o horário de atendimento.
        </h3>
        <p className="mt-5 text-sm leading-7 text-muted">
          Envie sua dúvida ou conte brevemente o que deseja tratar. A indicação de procedimento só acontece depois da avaliação.
        </p>
        <a className="button-secondary mt-7" href={directMessage} target="_blank" rel="noreferrer">
          <WhatsAppIcon className="size-4" />
          Abrir WhatsApp
        </a>
      </aside>
    </div>
  )
}
