// Release dates are plain dates (YYYY-MM-DD) in SA time. Parse and format them
// as UTC so the day never shifts with the server's or browser's timezone.

/** Today in South Africa as YYYY-MM-DD — comparable to release_date strings. */
export function todaySA(): string {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'Africa/Johannesburg' }).format(new Date())
}

/** '2026-10-23' → 'FRI 23 OCT'. */
export function formatDropDate(date: string): string {
  const d = new Date(`${date}T00:00:00Z`)
  const weekday = d.toLocaleDateString('en-GB', { weekday: 'short', timeZone: 'UTC' })
  const month = d.toLocaleDateString('en-GB', { month: 'short', timeZone: 'UTC' })
  return `${weekday} ${d.getUTCDate()} ${month}`.toUpperCase()
}

/** '2026-10-23' → '23 OCT' — for tight spots like menu tags. */
export function formatDropDay(date: string): string {
  const d = new Date(`${date}T00:00:00Z`)
  return `${d.getUTCDate()} ${d.toLocaleDateString('en-GB', { month: 'short', timeZone: 'UTC' })}`.toUpperCase()
}

/** "A", "A and B", "A, B and C". */
export function joinNames(names: string[]): string {
  return names.length <= 1 ? names.join('') : `${names.slice(0, -1).join(', ')} and ${names[names.length - 1]}`
}
