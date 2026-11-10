import { ahora } from '../../lib/fechas'
import { nuevoId } from '../../lib/id'
import { useAppStore } from '../../stores/appStore'

export function crearEtiqueta(nombre: string, color: string): void {
  useAppStore.getState().actualizar((datos) => ({
    ...datos,
    etiquetas: [...datos.etiquetas, { id: nuevoId('e'), nombre, color }],
  }))
}

export function actualizarEtiqueta(id: string, cambios: { nombre?: string; color?: string }): void {
  useAppStore.getState().actualizar((datos) => ({
    ...datos,
    etiquetas: datos.etiquetas.map((etiqueta) =>
      etiqueta.id === id ? { ...etiqueta, ...cambios } : etiqueta,
    ),
  }))
}

export function eliminarEtiqueta(id: string): void {
  const fecha = ahora()
  useAppStore.getState().actualizar((datos) => ({
    ...datos,
    etiquetas: datos.etiquetas.filter((etiqueta) => etiqueta.id !== id),
    tareas: datos.tareas.map((tarea) =>
      tarea.etiquetaIds.includes(id)
        ? {
            ...tarea,
            etiquetaIds: tarea.etiquetaIds.filter((etiquetaId) => etiquetaId !== id),
            actualizadaEn: fecha,
          }
        : tarea,
    ),
  }))
}

export function crearCategoria(nombre: string, color: string): void {
  useAppStore.getState().actualizar((datos) => ({
    ...datos,
    categorias: [...datos.categorias, { id: nuevoId('c'), nombre, color }],
  }))
}

export function actualizarCategoria(id: string, cambios: { nombre?: string; color?: string }): void {
  useAppStore.getState().actualizar((datos) => ({
    ...datos,
    categorias: datos.categorias.map((categoria) =>
      categoria.id === id ? { ...categoria, ...cambios } : categoria,
    ),
  }))
}

export function eliminarCategoria(id: string): void {
  const fecha = ahora()
  useAppStore.getState().actualizar((datos) => ({
    ...datos,
    categorias: datos.categorias.filter((categoria) => categoria.id !== id),
    tareas: datos.tareas.map((tarea) =>
      tarea.categoriaId === id ? { ...tarea, categoriaId: null, actualizadaEn: fecha } : tarea,
    ),
  }))
}
