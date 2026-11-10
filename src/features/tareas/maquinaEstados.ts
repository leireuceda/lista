import type { EstadoTarea, Tarea } from '../../types/modelo'

export const SIGUIENTE_ESTADO: Record<EstadoTarea, EstadoTarea> = {
  pendiente: 'en-progreso',
  'en-progreso': 'completada',
  completada: 'completada',
}

export function estadosAnteriores(tarea: Tarea): EstadoTarea[] {
  const vistos: EstadoTarea[] = []
  for (const cambio of tarea.historial) {
    if (!vistos.includes(cambio.estado)) vistos.push(cambio.estado)
  }
  return vistos.filter((estado) => estado !== tarea.estado)
}

export function aplicarEstado(tarea: Tarea, estado: EstadoTarea, fecha: string): Tarea {
  if (tarea.estado === estado) return tarea
  return {
    ...tarea,
    estado,
    historial: [...tarea.historial, { estado, fecha }],
    actualizadaEn: fecha,
  }
}

export function descripcionTransicion(actual: EstadoTarea, siguiente: EstadoTarea): string {
  if (siguiente === 'completada') return 'Completar'
  if (siguiente === 'en-progreso') return 'Empezar'
  if (actual === 'completada') return 'Reabrir'
  return 'Volver a pendiente'
}
