import { ahora } from '../lib/fechas'
import { nuevoId } from '../lib/id'
import type { EstadoTarea, Prioridad, Tarea } from '../types/modelo'
import { useAppStore } from './appStore'
import { aplicarEstado } from '../features/tareas/maquinaEstados'

export interface EntradaTarea {
  listaId: string
  titulo: string
  descripcion: string
  vencimiento: string | null
  categoriaId: string | null
  etiquetaIds: string[]
  prioridad: Prioridad
}

function siguienteOrden(tareas: Tarea[], listaId: string): number {
  const ordenes = tareas.filter((tarea) => tarea.listaId === listaId).map((tarea) => tarea.orden)
  return ordenes.length ? Math.max(...ordenes) + 1 : 1
}

export function crearTarea(entrada: EntradaTarea): string {
  const id = nuevoId('t')
  const fecha = ahora()
  useAppStore.getState().actualizar((datos) => {
    const tarea: Tarea = {
      id,
      listaId: entrada.listaId,
      titulo: entrada.titulo.trim(),
      descripcion: entrada.descripcion.trim(),
      vencimiento: entrada.vencimiento,
      categoriaId: entrada.categoriaId,
      etiquetaIds: entrada.etiquetaIds,
      prioridad: entrada.prioridad,
      estado: 'pendiente',
      historial: [{ estado: 'pendiente', fecha }],
      orden: siguienteOrden(datos.tareas, entrada.listaId),
      creadaEn: fecha,
      actualizadaEn: fecha,
      eliminadaEn: null,
    }
    return { ...datos, tareas: [...datos.tareas, tarea] }
  })
  return id
}

export function editarTarea(id: string, entrada: EntradaTarea): void {
  const fecha = ahora()
  useAppStore.getState().actualizar((datos) => ({
    ...datos,
    tareas: datos.tareas.map((tarea) =>
      tarea.id === id
        ? {
            ...tarea,
            ...entrada,
            titulo: entrada.titulo.trim(),
            descripcion: entrada.descripcion.trim(),
            actualizadaEn: fecha,
          }
        : tarea,
    ),
  }))
}

export function cambiarEstadoTarea(id: string, estado: EstadoTarea): void {
  const fecha = ahora()
  useAppStore.getState().actualizar((datos) => ({
    ...datos,
    tareas: datos.tareas.map((tarea) =>
      tarea.id === id ? aplicarEstado(tarea, estado, fecha) : tarea,
    ),
  }))
}

export function enviarAPapelera(id: string): void {
  const fecha = ahora()
  useAppStore.getState().actualizar((datos) => ({
    ...datos,
    tareas: datos.tareas.map((tarea) =>
      tarea.id === id ? { ...tarea, eliminadaEn: fecha, actualizadaEn: fecha } : tarea,
    ),
  }))
}

export function restaurarTarea(id: string): void {
  const fecha = ahora()
  useAppStore.getState().actualizar((datos) => ({
    ...datos,
    tareas: datos.tareas.map((tarea) =>
      tarea.id === id ? { ...tarea, eliminadaEn: null, actualizadaEn: fecha } : tarea,
    ),
  }))
}

export function vaciarPapelera(): number {
  let eliminadas = 0
  useAppStore.getState().actualizar((datos) => {
    const conservadas = datos.tareas.filter((tarea) => {
      const enPapelera = tarea.eliminadaEn !== null
      if (enPapelera) eliminadas += 1
      return !enPapelera
    })
    return { ...datos, tareas: conservadas }
  })
  return eliminadas
}
