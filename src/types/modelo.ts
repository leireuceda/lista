export type EstadoTarea = 'pendiente' | 'en-progreso' | 'completada'
export type Prioridad = 'baja' | 'media' | 'alta' | 'urgente'
export type PermisoComparticion = 'lectura' | 'escritura'
export type Tema = 'claro' | 'oscuro' | 'sistema'

export interface Etiqueta {
  id: string
  nombre: string
  color: string
}

export interface Categoria {
  id: string
  nombre: string
  color: string
}

export interface Usuario {
  id: string
  nombre: string
  email: string
}

export interface Lista {
  id: string
  nombre: string
  descripcion: string
  propietarioId: string
  creadaEn: string
  actualizadaEn: string
}

export interface CambioEstado {
  estado: EstadoTarea
  fecha: string
}

export interface Tarea {
  id: string
  listaId: string
  titulo: string
  descripcion: string
  vencimiento: string | null
  categoriaId: string | null
  etiquetaIds: string[]
  prioridad: Prioridad
  estado: EstadoTarea
  historial: CambioEstado[]
  orden: number
  creadaEn: string
  actualizadaEn: string
  eliminadaEn: string | null
}

export interface Comparticion {
  id: string
  listaId: string
  token: string
  permiso: PermisoComparticion
  creadaEn: string
  revocadaEn: string | null
  ultimoAcceso: string | null
}

export interface Preferencias {
  tema: Tema
  notificaciones: boolean
}

export interface DatosApp {
  version: number
  usuario: Usuario
  preferencias: Preferencias
  listas: Lista[]
  tareas: Tarea[]
  etiquetas: Etiqueta[]
  categorias: Categoria[]
  comparticiones: Comparticion[]
}

export const ESTADOS: EstadoTarea[] = ['pendiente', 'en-progreso', 'completada']

export const ETIQUETA_ESTADO: Record<EstadoTarea, string> = {
  pendiente: 'Pendiente',
  'en-progreso': 'En progreso',
  completada: 'Completada',
}

export const ETIQUETA_PRIORIDAD: Record<Prioridad, string> = {
  baja: 'Baja',
  media: 'Media',
  alta: 'Alta',
  urgente: 'Urgente',
}
