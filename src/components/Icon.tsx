const paths: Record<string, React.ReactNode> = {
  chevron: <path d="m6 9 6 6 6-6" />,
  arrow: <path d="M5 12h14m-6-6 6 6-6 6" />,
  up: <path d="m6 15 6-6 6 6" />,
  menu: <path d="M4 7h16M4 12h16M4 17h16" />,
  close: <path d="M6 6l12 12M18 6 6 18" />,
  mail: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3 7 9 6 9-6" />
    </>
  ),
  instagram: (
    <>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r=".8" fill="currentColor" />
    </>
  ),
  pin: (
    <>
      <path d="M12 21s-7-6.2-7-11a7 7 0 0 1 14 0c0 4.8-7 11-7 11Z" />
      <circle cx="12" cy="10" r="2.5" />
    </>
  ),
  check: <path d="m5 12 5 5 9-10" />,
  device: (
    <>
      <rect x="2" y="4" width="14" height="11" rx="1.5" />
      <rect x="16" y="8" width="6" height="12" rx="1.5" />
      <path d="M6 19h6" />
    </>
  ),
  person: (
    <>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6" />
    </>
  ),
  edit: <path d="M4 20h4L19 9l-4-4L4 16v4Zm10-14 4 4" />,
  search: (
    <>
      <circle cx="11" cy="11" r="6.5" />
      <path d="m20 20-4.2-4.2" />
    </>
  ),
  lock: (
    <>
      <rect x="5" y="10" width="14" height="10" rx="2" />
      <path d="M8 10V7a4 4 0 0 1 8 0v3" />
    </>
  ),
  chat: <path d="M4 5h16v11H9l-5 4V5Z" />,
  doc: (
    <>
      <path d="M6 3h9l4 4v14H6z" />
      <path d="M9 12h7M9 16h7M9 8h3" />
    </>
  ),
  palette: (
    <>
      <path d="M12 3a9 9 0 1 0 0 18c1.2 0 1.8-.8 1.8-1.7 0-1.2-1-1.6-1-2.6 0-.9.7-1.7 1.7-1.7H17a4 4 0 0 0 4-4c0-4.4-4-8-9-8Z" />
      <circle cx="7.5" cy="11" r="1" fill="currentColor" />
      <circle cx="10" cy="7" r="1" fill="currentColor" />
      <circle cx="15" cy="7.5" r="1" fill="currentColor" />
    </>
  ),
  code: <path d="m8 7-5 5 5 5m8-10 5 5-5 5m-3-12-2 14" />,
  rocket: (
    <>
      <path d="M12 15 9 12c1.5-4.5 4.5-8 10-9-1 5.5-4.5 8.5-9 10Z" />
      <path d="M9 12H5l2.5-3.5H11M12 15v4l3.5-2.5V13" />
    </>
  ),
  handshake: <path d="M3 12 7 8l4 2 3-3 7 6-4 4-3-2-2 2-3-2-2 1-3-3Z" />,
}

export type IconName = keyof typeof paths

export function Icon({ name, size = 20, className }: { name: IconName; size?: number; className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      height={size}
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.8}
      viewBox="0 0 24 24"
      width={size}
    >
      {paths[name]}
    </svg>
  )
}

export function LineIcon({ size = 24 }: { size?: number }) {
  return (
    <svg aria-hidden="true" height={size} viewBox="0 0 24 24" width={size}>
      <path
        fill="currentColor"
        d="M12 3C6.5 3 2 6.6 2 11.1c0 4 3.6 7.4 8.4 8 .3.1.8.2.9.5.1.3.1.7 0 1l-.1.9c0 .3-.2 1 .9.5 1.1-.5 6-3.5 8.2-6.1 1.5-1.6 2.2-3.2 2.2-4.9C22.5 6.6 18 3 12 3Zm-3.8 10.8H6.2a.5.5 0 0 1-.5-.5V9.3a.5.5 0 0 1 1 0v3.5h1.5a.5.5 0 0 1 0 1Zm2-.5a.5.5 0 0 1-1 0V9.3a.5.5 0 0 1 1 0v4Zm4.8 0a.5.5 0 0 1-.9.3l-2-2.8v2.5a.5.5 0 0 1-1 0V9.3a.5.5 0 0 1 .9-.3l2 2.8V9.3a.5.5 0 0 1 1 0v4Zm3.2-2.5a.5.5 0 0 1 0 1h-1.5v1h1.5a.5.5 0 0 1 0 1h-2a.5.5 0 0 1-.5-.5V9.3c0-.3.2-.5.5-.5h2a.5.5 0 0 1 0 1h-1.5v1h1.5Z"
      />
    </svg>
  )
}
