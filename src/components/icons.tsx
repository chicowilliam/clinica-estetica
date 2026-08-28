type IconProps = React.SVGProps<SVGSVGElement>

export function ArrowIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" {...props}>
      <path d="M4 10h11M11 5l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function MenuIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <path d="M4 8h16M4 16h16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

export function CloseIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <path d="m6 6 12 12M18 6 6 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

export function WhatsAppIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <path d="M20 11.6a8 8 0 0 1-11.8 7l-4.2 1.1 1.1-4A8 8 0 1 1 20 11.6Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M8.4 7.8c.2-.4.4-.4.7-.4h.4c.2 0 .4.1.5.4l.8 1.8c.1.3.1.5-.1.7l-.6.8c-.2.2-.1.4 0 .6.5.9 1.3 1.6 2.2 2.1.3.2.5.2.7 0l.8-1c.2-.2.4-.3.7-.2l1.8.8c.3.1.4.3.4.5 0 .3-.1 1.3-.7 1.8-.5.5-1.3.8-2.2.6-1-.2-2.4-.7-4.1-2.2-1.3-1.1-2.2-2.6-2.5-3.6-.3-1-.1-2 .2-2.7Z" fill="currentColor" />
    </svg>
  )
}
