import { useEffect } from 'react'
import { useNotificaciones } from './useNotificaciones'
import { useAppStore } from '../stores/appStore'

export function useRecordatorios() {
  const tareas = useAppStore((estado) => estado.datos.tareas)
  const activas = useAppStore((estado) => estado.datos.preferencias.notificaciones)
  const { permiso, programar } = useNotificaciones()

  useEffect(() => {
    if (!activas || permiso !== 'granted') return
    const cancelaciones = tareas
      .filter((tarea) => tarea.eliminadaEn === null && tarea.estado !== 'completada')
      .filter((tarea) => tarea.vencimiento !== null)
      .map((tarea) => programar(tarea.vencimiento as string, 'Tarea próxima a vencer', tarea.titulo))
    return () => cancelaciones.forEach((cancelar) => cancelar())
  }, [tareas, activas, permiso, programar])
}
