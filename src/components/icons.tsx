type IconProps = { className?: string }

export const IconHome = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" className={className}>
    <path d="M4 11.5 12 5l8 6.5V19a1 1 0 0 1-1 1h-4.5v-5.5h-5V20H5a1 1 0 0 1-1-1v-7.5Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
  </svg>
)

export const IconSearch = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" className={className}>
    <circle cx="11" cy="11" r="6.5" stroke="currentColor" strokeWidth="1.6" />
    <path d="m20 20-4-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
  </svg>
)

export const IconPlus = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" className={className}>
    <rect x="4" y="4" width="16" height="16" rx="4" stroke="currentColor" strokeWidth="1.6" />
    <path d="M12 8v8M8 12h8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
  </svg>
)

export const IconUser = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" className={className}>
    <circle cx="12" cy="8.5" r="3.5" stroke="currentColor" strokeWidth="1.6" />
    <path d="M4.5 20c1.4-3.6 4.4-5.5 7.5-5.5s6.1 1.9 7.5 5.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
  </svg>
)

export const IconArrowLeft = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" className={className}>
    <path d="M15 19 8 12l7-7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

export const IconCamera = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" className={className}>
    <path d="M4 8.5A1.5 1.5 0 0 1 5.5 7h2l1-2h7l1 2h2A1.5 1.5 0 0 1 20 8.5v9A1.5 1.5 0 0 1 18.5 19h-13A1.5 1.5 0 0 1 4 17.5v-9Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
    <circle cx="12" cy="12.5" r="3.2" stroke="currentColor" strokeWidth="1.6" />
  </svg>
)

export const IconHeart = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" className={className}>
    <path d="M12 20s-7-4.4-9.3-9C1.3 7.8 3 5 6.2 5c1.9 0 3.3 1 4.8 2.8C12.5 6 13.9 5 15.8 5 19 5 20.7 7.8 21.3 11c-2.3 4.6-9.3 9-9.3 9Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
  </svg>
)

export const IconShare = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" className={className}>
    <circle cx="18" cy="6" r="2.6" stroke="currentColor" strokeWidth="1.6" />
    <circle cx="6" cy="12" r="2.6" stroke="currentColor" strokeWidth="1.6" />
    <circle cx="18" cy="18" r="2.6" stroke="currentColor" strokeWidth="1.6" />
    <path d="m8.3 10.7 7.4-3.4M8.3 13.3l7.4 3.4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
  </svg>
)

export const IconBarcode = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" className={className}>
    <path d="M4 5v14M8 5v14M11 5v14M13.5 5v14M17 5v14M20 5v14" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
  </svg>
)

export const IconTrash = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" className={className}>
    <path d="M5 7h14M9 7V5.5A1.5 1.5 0 0 1 10.5 4h3A1.5 1.5 0 0 1 15 5.5V7m-8 0 .6 12A1.5 1.5 0 0 0 9.1 20.5h5.8a1.5 1.5 0 0 0 1.5-1.5L17 7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)
