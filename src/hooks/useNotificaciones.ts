import { useCallback, useEffect, useRef, useState } from 'react'
import {
  enviarNotificacion,
  pedirPermisoNotificaciones,
  permisoActual,
  programarNotificacion,
  soportaNotificaciones,
} from '../lib/notificaciones'

export function useNotificaciones() {
  const [permiso, setPermiso] = useState<NotificationPermission>(permisoActual)
  const temporizadores = useRef<Array<() => void>>([])

  useEffect(() => {
    const pendientes = temporizadores.current
    return () => pendientes.forEach((cancelar) => cancelar())
  }, [])

  const solicitar = useCallback(async () => {
    const resultado = await pedirPermisoNotificaciones()
    setPermiso(resultado)
    return resultado
  }, [])

  const notificar = useCallback((titulo: string, cuerpo: string) => {
    return enviarNotificacion(titulo, cuerpo)
  }, [])

  const programar = useCallback((fechaISO: string, titulo: string, cuerpo: string) => {
    temporizadores.current.push(programarNotificacion(fechaISO, titulo, cuerpo))
  }, [])

  return {
    soportado: soportaNotificaciones(),
    permiso,
    solicitar,
    notificar,
    programar,
  }
}
