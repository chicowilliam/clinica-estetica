import { zodResolver } from '@hookform/resolvers/zod'
import { CheckIcon } from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { Controller, useForm, useWatch } from 'react-hook-form'
import { ptBR } from 'react-day-picker/locale'

import { Button, ButtonArrow, ButtonIcon } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from '@/components/ui/field'
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
import { buildWhatsAppUrl, type BookingData, createBookingSchema, formatBrazilianDate } from '@/lib/booking'

import { WhatsAppIcon } from './icons'

const initialData: BookingData = {
  name: '',
  phone: '',
  treatment: '',
  preferredDate: '',
  preferredTime: '',
}

const weekdaySlots: Record<number, string[]> = {
  1: ['09:00', '10:30', '14:00', '15:30', '17:00'],
  2: ['09:30', '11:00', '14:30', '16:00', '18:00'],
  3: ['09:00', '10:30', '13:30', '15:00', '17:30'],
  4: ['09:30', '11:00', '14:00', '16:30', '18:00'],
  5: ['09:00', '10:30', '13:30', '15:30', '17:00'],
  6: ['09:00', '10:30', '12:00', '13:30'],
}

const bookingSteps = [
  { number: 1, label: 'Cuidado' },
  { number: 2, label: 'Data e horário' },
  { number: 3, label: 'Seus dados' },
] as const

type BookingStep = (typeof bookingSteps)[number]['number']

function localDateKey(date: Date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function startOfToday() {
  const date = new Date()
  return new Date(date.getFullYear(), date.getMonth(), date.getDate())
}

function parseLocalDate(value: string) {
  const [year, month, day] = value.split('-').map(Number)
  if (!year || !month || !day) return undefined
  return new Date(year, month - 1, day)
}

function addMonths(date: Date, amount: number) {
  return new Date(date.getFullYear(), date.getMonth() + amount, 1)
}

function readableDate(value: string) {
  const date = parseLocalDate(value)
  if (!date) return ''

  return new Intl.DateTimeFormat('pt-BR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  }).format(date)
}

export function BookingForm() {
  const minimumDay = useMemo(startOfToday, [])
  const minimumDate = useMemo(() => localDateKey(minimumDay), [minimumDay])
  const initialCalendarMonth = useMemo(
    () => (minimumDay.getDate() > 20 ? addMonths(minimumDay, 1) : minimumDay),
    [minimumDay],
  )
  const finalMonth = useMemo(() => addMonths(minimumDay, 3), [minimumDay])
  const schema = useMemo(() => createBookingSchema(), [])
  const [step, setStep] = useState<BookingStep>(1)
  const [success, setSuccess] = useState('')
  const stepHeadingRef = useRef<HTMLHeadingElement>(null)
  const hasMountedRef = useRef(false)
  const {
    register,
    control,
    clearErrors,
    handleSubmit,
    setValue,
    trigger,
    formState: { errors, isSubmitting },
  } = useForm<BookingData>({
    resolver: zodResolver(schema),
    defaultValues: initialData,
    mode: 'onBlur',
    reValidateMode: 'onChange',
  })

  useEffect(() => {
    if (!hasMountedRef.current) {
      hasMountedRef.current = true
      return
    }

    stepHeadingRef.current?.focus({ preventScroll: true })
  }, [step])

  const treatment = useWatch({ control, name: 'treatment' })
  const preferredDate = useWatch({ control, name: 'preferredDate' })
  const preferredTime = useWatch({ control, name: 'preferredTime' })
  const selectedDate = parseLocalDate(preferredDate)
  const availableTimes = selectedDate ? (weekdaySlots[selectedDate.getDay()] ?? []) : []
  const hasAppointmentPreference = Boolean(treatment && preferredDate && preferredTime)

  const moveToStep = (nextStep: BookingStep) => {
    setSuccess('')
    setStep(nextStep)
  }

  const continueToSchedule = async () => {
    const valid = await trigger('treatment', { shouldFocus: true })
    if (valid) moveToStep(2)
  }

  const continueToContact = async () => {
    const valid = await trigger(['preferredDate', 'preferredTime'], { shouldFocus: true })
    if (valid) moveToStep(3)
  }

  const submit = handleSubmit(async (data) => {
    setSuccess('')
    const clinicPhone = import.meta.env.VITE_WHATSAPP_NUMBER as string | undefined
    window.open(buildWhatsAppUrl(data, clinicPhone), '_blank', 'noopener,noreferrer')
    setSuccess('Pedido preparado. Revise e envie a mensagem no WhatsApp; a equipe confirmará a disponibilidade.')
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
    <div className="booking-layout grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(280px,0.42fr)] lg:items-start lg:gap-8">
      <form className="booking-form booking-surface" noValidate onSubmit={submit}>
        <ol className="booking-progress" aria-label="Etapas do agendamento">
          {bookingSteps.map((item) => {
            const state = item.number < step ? 'complete' : item.number === step ? 'active' : 'upcoming'

            return (
              <li
                key={item.number}
                data-state={state}
                aria-current={state === 'active' ? 'step' : undefined}
              >
                <span aria-hidden="true">{String(item.number).padStart(2, '0')}</span>
                <span>{item.label}</span>
              </li>
            )
          })}
        </ol>

        <FieldGroup>
          {step === 1 ? (
            <section className="booking-step" aria-labelledby="booking-service-title">
            <div className="booking-step-heading">
              <span aria-hidden="true">01</span>
              <div>
                <h3 ref={stepHeadingRef} id="booking-service-title" tabIndex={-1}>Escolha o cuidado</h3>
                <p>Comece pelo tratamento que deseja conversar sobre.</p>
              </div>
            </div>

            <Controller
              control={control}
              name="treatment"
              render={({ field }) => (
                <Field data-invalid={Boolean(errors.treatment)}>
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
                        {treatments.map((item) => (
                          <SelectItem value={item.name} key={item.name}>
                            {item.name} · {item.duration}
                          </SelectItem>
                        ))}
                        <SelectItem value="Ainda não sei">Ainda não sei · avaliação inicial</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  <FieldError id="treatment-error">{errors.treatment?.message}</FieldError>
                </Field>
              )}
            />
              <div className="booking-step-actions">
                <Button type="button" onClick={() => void continueToSchedule()}>
                  Continuar para data e horário
                  <ButtonArrow />
                </Button>
              </div>
            </section>
          ) : null}

          {step === 2 ? (
            <section className="booking-step" aria-labelledby="booking-schedule-title">
            <div className="booking-step-heading">
              <span aria-hidden="true">02</span>
              <div>
                <h3 ref={stepHeadingRef} id="booking-schedule-title" tabIndex={-1}>Encontre uma preferência</h3>
                <p>Escolha um dia e depois um dos horários exibidos.</p>
              </div>
            </div>

            <div className="booking-schedule-grid">
              <Controller
                control={control}
                name="preferredDate"
                render={({ field }) => (
                  <FieldSet data-invalid={Boolean(errors.preferredDate)}>
                    <FieldLegend variant="label">Dia preferido</FieldLegend>
                    <Calendar
                      mode="single"
                      locale={ptBR}
                      selected={parseLocalDate(field.value)}
                      defaultMonth={initialCalendarMonth}
                      startMonth={minimumDay}
                      endMonth={finalMonth}
                      disabled={[{ before: minimumDay }, { dayOfWeek: [0] }]}
                      onSelect={(date) => {
                        field.onChange(date ? localDateKey(date) : '')
                        field.onBlur()
                        setValue('preferredTime', '', { shouldDirty: true, shouldValidate: false })
                        clearErrors('preferredTime')
                        setSuccess('')
                      }}
                      footer={field.value ? `Dia escolhido: ${readableDate(field.value)}.` : 'Escolha uma data disponível.'}
                      aria-label="Escolha o dia preferido"
                    />
                    <FieldError id="date-error">{errors.preferredDate?.message}</FieldError>
                  </FieldSet>
                )}
              />

              <Controller
                control={control}
                name="preferredTime"
                render={({ field }) => (
                  <FieldSet data-invalid={Boolean(errors.preferredTime)} disabled={!selectedDate}>
                    <FieldLegend variant="label">Horários disponíveis</FieldLegend>
                    {selectedDate ? (
                      <>
                        <FieldDescription>
                          {readableDate(preferredDate)} · escolha uma preferência
                        </FieldDescription>
                        <div className="booking-time-grid" data-booking-time-grid>
                          {availableTimes.map((time) => {
                            const selected = field.value === time
                            return (
                              <Button
                                key={time}
                                type="button"
                                variant={selected ? 'primary' : 'ghost'}
                                size="sm"
                                className="booking-time-pill"
                                aria-pressed={selected}
                                onClick={() => {
                                  field.onChange(time)
                                  field.onBlur()
                                  setSuccess('')
                                }}
                              >
                                {selected ? <CheckIcon data-icon="inline-start" strokeWidth={1.5} aria-hidden="true" /> : null}
                                {time}
                              </Button>
                            )
                          })}
                        </div>
                      </>
                    ) : (
                      <p className="booking-empty-state">Escolha um dia no calendário para ver os horários.</p>
                    )}
                    <FieldError id="time-error">{errors.preferredTime?.message}</FieldError>
                  </FieldSet>
                )}
              />
            </div>
              <div className="booking-step-actions flex flex-col-reverse gap-2 sm:flex-row sm:items-center">
                <Button type="button" variant="ghost" onClick={() => moveToStep(1)}>
                  Voltar
                </Button>
                <Button type="button" onClick={() => void continueToContact()}>
                  Continuar para seus dados
                  <ButtonArrow />
                </Button>
              </div>
            </section>
          ) : null}

          {step === 3 ? (
            <section className="booking-step" aria-labelledby="booking-contact-title">
            <div className="booking-step-heading">
              <span aria-hidden="true">03</span>
              <div>
                <h3 ref={stepHeadingRef} id="booking-contact-title" tabIndex={-1}>Como a equipe fala com você?</h3>
                <p>Seus dados ficam na mensagem que você revisa antes de enviar.</p>
              </div>
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              <Field data-invalid={Boolean(errors.name)}>
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

              <Field data-invalid={Boolean(errors.phone)}>
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
            </div>
            </section>
          ) : null}
        </FieldGroup>

        {step === 3 ? (
          <>
            {hasAppointmentPreference ? (
              <div className="booking-review" aria-label="Resumo do pedido">
                <span className="data-label">Seu pedido</span>
                <p><strong>{treatment}</strong></p>
                <p>{formatBrazilianDate(preferredDate)} · {preferredTime}</p>
                <span>Confirmação pendente pela equipe</span>
              </div>
            ) : null}

            <div className="booking-step-actions mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:items-center">
              <Button type="button" variant="ghost" onClick={() => moveToStep(2)}>
                Voltar
              </Button>
              <Button type="submit" disabled={isSubmitting} aria-busy={isSubmitting}>
                {isSubmitting ? <Spinner data-icon="inline-start" /> : null}
                Enviar pedido de horário
                {!isSubmitting ? <ButtonArrow /> : null}
              </Button>
            </div>
            <FieldDescription className="mt-3 max-w-xl">
              O WhatsApp abre com o resumo para você revisar. A equipe ainda precisa confirmar a disponibilidade; nenhum horário é reservado automaticamente.
            </FieldDescription>
            {success ? <p className="success-message" role="status">{success}</p> : null}
          </>
        ) : null}
      </form>

      <aside className="booking-aside booking-aside-mobile-first booking-surface">
        <p className="eyebrow">Prefere conversar primeiro?</p>
        <h3 className="subheading mt-4">A equipe responde pelo WhatsApp durante o horário de atendimento.</h3>
        <p className="mt-4 text-sm leading-7 text-muted-foreground">
          Envie sua dúvida ou conte brevemente o que deseja tratar. A indicação de procedimento só acontece depois da avaliação.
        </p>
        <Button asChild variant="secondary" className="mt-6 w-full sm:w-auto">
          <a href={directMessage} target="_blank" rel="noreferrer">
            <ButtonIcon direction="up-right"><WhatsAppIcon /></ButtonIcon>
            Abrir WhatsApp
          </a>
        </Button>
      </aside>
    </div>
  )
}
