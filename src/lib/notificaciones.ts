export function soportaNotificaciones(): boolean {
  return typeof window !== 'undefined' && 'Notification' in window
}

export function permisoActual(): NotificationPermission {
  return soportaNotificaciones() ? Notification.permission : 'denied'
}

export async function pedirPermisoNotificaciones(): Promise<NotificationPermission> {
  if (!soportaNotificaciones()) return 'denied'
  return Notification.requestPermission()
}

export function enviarNotificacion(titulo: string, cuerpo: string): boolean {
  if (!soportaNotificaciones() || Notification.permission !== 'granted') return false
  new Notification(titulo, { body: cuerpo })
  return true
}

export function programarNotificacion(
  fechaISO: string,
  titulo: string,
  cuerpo: string,
): () => void {
  const retraso = new Date(fechaISO).getTime() - Date.now()
  if (retraso <= 0 || retraso > 2_147_483_647) return () => undefined
  const temporizador = window.setTimeout(() => enviarNotificacion(titulo, cuerpo), retraso)
  return () => window.clearTimeout(temporizador)
}
