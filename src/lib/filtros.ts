import type { EstadoTarea, Prioridad, Tarea } from '../types/modelo'

export interface FiltrosTareas {
  texto: string
  estado: EstadoTarea | ''
  prioridad: Prioridad | ''
  categoriaId: string
  etiquetaId: string
  desde: string
  hasta: string
}

export const FILTROS_VACIOS: FiltrosTareas = {
  texto: '',
  estado: '',
  prioridad: '',
  categoriaId: '',
  etiquetaId: '',
  desde: '',
  hasta: '',
}

export function filtrarTareas(tareas: Tarea[], filtros: FiltrosTareas): Tarea[] {
  const consulta = filtros.texto.trim().toLowerCase()
  return tareas.filter((tarea) => {
    if (tarea.eliminadaEn !== null) return false
    if (consulta) {
      const contenido = `${tarea.titulo} ${tarea.descripcion}`.toLowerCase()
      if (!contenido.includes(consulta)) return false
    }
    if (filtros.estado && tarea.estado !== filtros.estado) return false
    if (filtros.prioridad && tarea.prioridad !== filtros.prioridad) return false
    if (filtros.categoriaId && tarea.categoriaId !== filtros.categoriaId) return false
    if (filtros.etiquetaId && !tarea.etiquetaIds.includes(filtros.etiquetaId)) return false
    if (filtros.desde) {
      if (!tarea.vencimiento) return false
      if (tarea.vencimiento.slice(0, 10) < filtros.desde) return false
    }
    if (filtros.hasta) {
      if (!tarea.vencimiento) return false
      if (tarea.vencimiento.slice(0, 10) > filtros.hasta) return false
    }
    return true
  })
}

export function contarFiltrosActivos(filtros: FiltrosTareas): number {
  return Object.values(filtros).filter((valor) => valor !== '').length
}

export function filtrosDesdeParams(params: URLSearchParams): FiltrosTareas {
  return {
    texto: params.get('q') ?? '',
    estado: (params.get('estado') as EstadoTarea | null) ?? '',
    prioridad: (params.get('prioridad') as Prioridad | null) ?? '',
    categoriaId: params.get('categoria') ?? '',
    etiquetaId: params.get('etiqueta') ?? '',
    desde: params.get('desde') ?? '',
    hasta: params.get('hasta') ?? '',
  }
}

export function paramsDesdeFiltros(filtros: FiltrosTareas): URLSearchParams {
  const params = new URLSearchParams()
  if (filtros.texto) params.set('q', filtros.texto)
  if (filtros.estado) params.set('estado', filtros.estado)
  if (filtros.prioridad) params.set('prioridad', filtros.prioridad)
  if (filtros.categoriaId) params.set('categoria', filtros.categoriaId)
  if (filtros.etiquetaId) params.set('etiqueta', filtros.etiquetaId)
  if (filtros.desde) params.set('desde', filtros.desde)
  if (filtros.hasta) params.set('hasta', filtros.hasta)
  return params
}
