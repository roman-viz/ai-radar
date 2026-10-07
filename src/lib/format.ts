const dateFmt = new Intl.DateTimeFormat('en', { year: 'numeric', month: 'short', day: 'numeric', timeZone: 'UTC' })
const numFmt = new Intl.NumberFormat('en')

export const formatDate = (iso: string): string => {
  const d = new Date(`${iso}T00:00:00Z`)
  return Number.isNaN(d.getTime()) ? iso : dateFmt.format(d)
}

export const formatNumber = (n: number): string => numFmt.format(n)
