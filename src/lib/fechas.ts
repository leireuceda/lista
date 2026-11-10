export function ahora(): string {
  return new Date().toISOString()
}

export function formatearFecha(iso: string | null): string {
  if (!iso) return 'Sin fecha'
  return new Intl.DateTimeFormat('es-ES', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(iso))
}

export function formatearFechaHora(iso: string | null): string {
  if (!iso) return 'Sin fecha'
  return new Intl.DateTimeFormat('es-ES', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(iso))
}

export function aValorInputFecha(iso: string | null): string {
  if (!iso) return ''
  const fecha = new Date(iso)
  const desfase = fecha.getTimezoneOffset() * 60_000
  return new Date(fecha.getTime() - desfase).toISOString().slice(0, 16)
}

export function desdeInputFecha(valor: string): string | null {
  if (!valor) return null
  return new Date(valor).toISOString()
}

export function estaVencida(iso: string | null): boolean {
  if (!iso) return false
  return new Date(iso).getTime() < Date.now()
}
