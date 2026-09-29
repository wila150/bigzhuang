import { notFound } from 'next/navigation'

// Unknown URLs land here so the localized not-found page (with header and footer) is shown.
export default function CatchAll() {
  notFound()
}
