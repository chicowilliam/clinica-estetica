"use client"

import * as React from 'react'
import {
  DayPicker,
  getDefaultClassNames,
  type DayButton,
  type Locale,
} from 'react-day-picker'
import { ChevronDownIcon, ChevronLeftIcon, ChevronRightIcon } from 'lucide-react'

import { Button, buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'

function localDateKey(date: Date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  captionLayout = 'label',
  buttonVariant = 'ghost',
  locale,
  formatters,
  components,
  ...props
}: React.ComponentProps<typeof DayPicker> & {
  buttonVariant?: React.ComponentProps<typeof Button>['variant']
}) {
  const defaultClassNames = getDefaultClassNames()

  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      captionLayout={captionLayout}
      locale={locale}
      className={cn(
        'group/calendar w-full max-w-[23rem] bg-transparent p-0 [--cell-radius:3px] [--cell-size:2.5rem]',
        className,
      )}
      formatters={{
        formatMonthDropdown: (date) => date.toLocaleString(locale?.code, { month: 'short' }),
        ...formatters,
      }}
      classNames={{
        root: cn('w-full', defaultClassNames.root),
        months: cn('relative flex w-full flex-col gap-4', defaultClassNames.months),
        month: cn('flex w-full flex-col gap-4', defaultClassNames.month),
        nav: cn('absolute inset-x-0 top-0 z-10 flex w-full items-center justify-between', defaultClassNames.nav),
        button_previous: cn(
          buttonVariants({ variant: buttonVariant }),
          '!size-10 !h-10 !min-h-10 p-0 aria-disabled:opacity-35',
          defaultClassNames.button_previous,
        ),
        button_next: cn(
          buttonVariants({ variant: buttonVariant }),
          '!size-10 !h-10 !min-h-10 p-0 aria-disabled:opacity-35',
          defaultClassNames.button_next,
        ),
        month_caption: cn('flex h-10 w-full items-center justify-center px-12', defaultClassNames.month_caption),
        caption_label: cn('font-display text-lg font-semibold capitalize select-none', defaultClassNames.caption_label),
        dropdowns: cn('flex h-10 items-center justify-center gap-1.5 text-sm font-medium', defaultClassNames.dropdowns),
        dropdown_root: cn('relative rounded-[3px]', defaultClassNames.dropdown_root),
        dropdown: cn('absolute inset-0 bg-card opacity-0', defaultClassNames.dropdown),
        month_grid: cn('w-full table-fixed border-collapse', defaultClassNames.month_grid),
        weekdays: cn('flex w-full', defaultClassNames.weekdays),
        weekday: cn('flex-1 py-1 text-center text-[0.68rem] font-semibold tracking-[0.08em] text-muted-foreground uppercase select-none', defaultClassNames.weekday),
        week: cn('mt-1 flex w-full', defaultClassNames.week),
        day: cn('group/day relative aspect-square flex-1 p-0 text-center select-none', defaultClassNames.day),
        today: cn('rounded-[var(--cell-radius)] ring-1 ring-gold/70', defaultClassNames.today),
        outside: cn('text-muted-foreground/45', defaultClassNames.outside),
        disabled: cn('text-muted-foreground opacity-30', defaultClassNames.disabled),
        hidden: cn('invisible', defaultClassNames.hidden),
        footer: cn('rdp-footer', defaultClassNames.footer),
        ...classNames,
      }}
      components={{
        Root: ({ className: rootClassName, rootRef, ...rootProps }) => (
          <div data-slot="calendar" ref={rootRef} className={cn(rootClassName)} {...rootProps} />
        ),
        Chevron: ({ className: iconClassName, orientation, ...iconProps }) => {
          const Icon = orientation === 'left'
            ? ChevronLeftIcon
            : orientation === 'right'
              ? ChevronRightIcon
              : ChevronDownIcon

          return <Icon className={cn('size-4', iconClassName)} strokeWidth={1.35} {...iconProps} />
        },
        DayButton: (dayProps) => <CalendarDayButton locale={locale} {...dayProps} />,
        ...components,
      }}
      {...props}
    />
  )
}

function CalendarDayButton({
  className,
  day,
  modifiers,
  locale,
  ...props
}: React.ComponentProps<typeof DayButton> & { locale?: Partial<Locale> }) {
  const ref = React.useRef<HTMLButtonElement>(null)
  const buttonProps = props as unknown as React.ComponentProps<typeof Button>

  React.useEffect(() => {
    if (modifiers.focused) ref.current?.focus()
  }, [modifiers.focused])

  return (
    <Button
      ref={ref}
      variant="ghost"
      size="icon"
      data-booking-day={localDateKey(day.date)}
      data-selected={modifiers.selected ? 'true' : 'false'}
      className={cn(
        '!size-full !h-auto min-w-0 rounded-[var(--cell-radius)] border-0 p-0 text-[0.78rem] font-medium shadow-none',
        'data-[selected=true]:bg-primary data-[selected=true]:text-primary-foreground data-[selected=true]:shadow-[0_5px_14px_color-mix(in_srgb,var(--primary)_20%,transparent)]',
        'group-data-[focused=true]/day:ring-2 group-data-[focused=true]/day:ring-ring/45',
        className,
      )}
      {...buttonProps}
    />
  )
}

export { Calendar, CalendarDayButton }
