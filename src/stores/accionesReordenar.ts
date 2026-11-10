import { ahora } from '../lib/fechas'
import type { Tarea } from '../types/modelo'
import { useAppStore } from './appStore'

export function reordenarTareas(idsEnOrden: string[]): void {
  const fecha = ahora()
  const posiciones = new Map(idsEnOrden.map((id, indice) => [id, indice + 1]))
  useAppStore.getState().actualizar((datos) => ({
    ...datos,
    tareas: datos.tareas.map((tarea) => {
      const orden = posiciones.get(tarea.id)
      if (orden === undefined || tarea.orden === orden) return tarea
      return { ...tarea, orden, actualizadaEn: fecha }
    }),
  }))
}

export function moverTareaALista(tareaId: string, listaId: string): void {
  const fecha = ahora()
  useAppStore.getState().actualizar((datos) => {
    const tarea = datos.tareas.find((item) => item.id === tareaId)
    if (!tarea || tarea.listaId === listaId) return datos
    const ordenes = datos.tareas
      .filter((item) => item.listaId === listaId && item.eliminadaEn === null)
      .map((item) => item.orden)
    const orden = ordenes.length ? Math.max(...ordenes) + 1 : 1
    const tareas: Tarea[] = datos.tareas.map((item) =>
      item.id === tareaId
        ? { ...item, listaId, orden, actualizadaEn: fecha }
        : item,
    )
    return { ...datos, tareas }
  })
}
