import { zodResolver } from '@hookform/resolvers/zod'
import { useMemo, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'

import { Button, ButtonArrow } from '@/components/ui/button'
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Spinner } from '@/components/ui/spinner'
import { treatments } from '@/content'
import { buildWhatsAppUrl, type BookingData, createBookingSchema } from '@/lib/booking'

import { WhatsAppIcon } from './icons'

const initialData: BookingData = {
  name: '',
  phone: '',
  treatment: '',
  preferredDate: '',
  preferredTime: '',
}

function today() {
  const date = new Date()
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export function BookingForm() {
  const minimumDate = useMemo(today, [])
  const schema = useMemo(() => createBookingSchema(), [])
  const [success, setSuccess] = useState('')
  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<BookingData>({
    resolver: zodResolver(schema),
    defaultValues: initialData,
    mode: 'onBlur',
    reValidateMode: 'onChange',
  })

  const submit = handleSubmit(async (data) => {
    setSuccess('')
    const clinicPhone = import.meta.env.VITE_WHATSAPP_NUMBER as string | undefined
    window.open(buildWhatsAppUrl(data, clinicPhone), '_blank', 'noopener,noreferrer')
    setSuccess('Solicitação preparada. O WhatsApp foi aberto para você revisar e enviar a mensagem.')
  })

  const directMessage = buildWhatsAppUrl({
    ...initialData,
    name: 'Paciente',
    phone: 'A combinar',
    treatment: 'Avaliação inicial',
    preferredDate: minimumDate,
    preferredTime: '09:00',
  }, import.meta.env.VITE_WHATSAPP_NUMBER as string | undefined)

  return (
    <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(280px,0.58fr)] lg:gap-16">
      <form className="booking-form" noValidate onSubmit={submit}>
        <FieldGroup className="sm:grid sm:grid-cols-2">
          <Field className="sm:col-span-2" data-invalid={Boolean(errors.name)}>
            <FieldLabel htmlFor="name">Nome</FieldLabel>
            <Input
              id="name"
              type="text"
              autoComplete="name"
              maxLength={120}
              aria-invalid={Boolean(errors.name)}
              aria-describedby={errors.name ? 'name-error' : undefined}
              {...register('name')}
            />
            <FieldError id="name-error">{errors.name?.message}</FieldError>
          </Field>

          <Field className="sm:col-span-2" data-invalid={Boolean(errors.phone)}>
            <FieldLabel htmlFor="phone">Telefone</FieldLabel>
            <Input
              id="phone"
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              maxLength={20}
              placeholder="(11) 98765-4321"
              aria-invalid={Boolean(errors.phone)}
              aria-describedby={errors.phone ? 'phone-error' : undefined}
              {...register('phone')}
            />
            <FieldError id="phone-error">{errors.phone?.message}</FieldError>
          </Field>

          <Controller
            control={control}
            name="treatment"
            render={({ field }) => (
              <Field className="sm:col-span-2" data-invalid={Boolean(errors.treatment)}>
                <FieldLabel htmlFor="treatment">Tratamento de interesse</FieldLabel>
                <Select
                  name={field.name}
                  value={field.value}
                  onValueChange={(value) => {
                    setSuccess('')
                    field.onChange(value)
                  }}
                  onOpenChange={(open) => {
                    if (!open) field.onBlur()
                  }}
                >
                  <SelectTrigger
                    id="treatment"
                    ref={field.ref}
                    aria-invalid={Boolean(errors.treatment)}
                    aria-describedby={errors.treatment ? 'treatment-error' : undefined}
                  >
                    <SelectValue placeholder="Selecione uma opção" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {treatments.map((treatment) => (
                        <SelectItem value={treatment.name} key={treatment.name}>
                          {treatment.name}
                        </SelectItem>
                      ))}
                      <SelectItem value="Ainda não sei">Ainda não sei</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
                <FieldError id="treatment-error">{errors.treatment?.message}</FieldError>
              </Field>
            )}
          />

          <Field data-invalid={Boolean(errors.preferredDate)}>
            <FieldLabel htmlFor="preferredDate">Dia preferido</FieldLabel>
            <Input
              id="preferredDate"
              type="date"
              min={minimumDate}
              aria-invalid={Boolean(errors.preferredDate)}
              aria-describedby={errors.preferredDate ? 'date-error' : undefined}
              {...register('preferredDate')}
            />
            <FieldError id="date-error">{errors.preferredDate?.message}</FieldError>
          </Field>

          <Field data-invalid={Boolean(errors.preferredTime)}>
            <FieldLabel htmlFor="preferredTime">Horário preferido</FieldLabel>
            <Input
              id="preferredTime"
              type="time"
              min="08:00"
              max="19:00"
              step="1800"
              aria-invalid={Boolean(errors.preferredTime)}
              aria-describedby={errors.preferredTime ? 'time-error' : undefined}
              {...register('preferredTime')}
            />
            <FieldError id="time-error">{errors.preferredTime?.message}</FieldError>
          </Field>
        </FieldGroup>

        <Button className="mt-6 w-full sm:w-auto" type="submit" disabled={isSubmitting} aria-busy={isSubmitting}>
          {isSubmitting ? <Spinner data-icon="inline-start" /> : null}
          Preparar pedido no WhatsApp
          {!isSubmitting ? <ButtonArrow /> : null}
        </Button>
        <FieldDescription className="mt-2 max-w-xl">
          O envio é concluído no WhatsApp. A equipe confirma a disponibilidade; este formulário não reserva o horário automaticamente.
        </FieldDescription>
        {success ? (
          <p className="success-message" role="status">
            {success}
          </p>
        ) : null}
      </form>

      <aside className="booking-aside">
        <p className="eyebrow">Prefere conversar primeiro?</p>
        <h3 className="subheading mt-4">A equipe responde pelo WhatsApp durante o horário de atendimento.</h3>
        <p className="mt-4 text-sm leading-7 text-muted-foreground">
          Envie sua dúvida ou conte brevemente o que deseja tratar. A indicação de procedimento só acontece depois da avaliação.
        </p>
        <Button asChild variant="secondary" className="mt-6">
          <a href={directMessage} target="_blank" rel="noreferrer">
            <WhatsAppIcon data-icon="inline-start" />
            Abrir WhatsApp
          </a>
        </Button>
      </aside>
    </div>
  )
}
