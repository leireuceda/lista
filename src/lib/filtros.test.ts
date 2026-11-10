import { describe, expect, it } from 'vitest'
import type { Tarea } from '../types/modelo'
import { contarFiltrosActivos, FILTROS_VACIOS, filtrarTareas } from './filtros'

function tarea(parcial: Partial<Tarea>): Tarea {
  return {
    id: 't',
    listaId: 'l-1',
    titulo: 'Tarea',
    descripcion: '',
    vencimiento: null,
    categoriaId: null,
    etiquetaIds: [],
    prioridad: 'media',
    estado: 'pendiente',
    historial: [],
    orden: 1,
    creadaEn: '2026-11-01T00:00:00.000Z',
    actualizadaEn: '2026-11-01T00:00:00.000Z',
    eliminadaEn: null,
    ...parcial,
  }
}

const tareas = [
  tarea({ id: 'a', titulo: 'Comprar pan', prioridad: 'alta', etiquetaIds: ['e-1'] }),
  tarea({
    id: 'b',
    titulo: 'Preparar informe',
    descripcion: 'Revisar métricas del sprint',
    estado: 'completada',
    categoriaId: 'c-1',
    vencimiento: '2026-11-12T10:00:00.000Z',
  }),
  tarea({ id: 'c', titulo: 'Llamar al dentista', eliminadaEn: '2026-11-09T10:00:00.000Z' }),
]

describe('filtros de tareas', () => {
  it('excluye las tareas de la papelera', () => {
    expect(filtrarTareas(tareas, FILTROS_VACIOS).map((item) => item.id)).toEqual(['a', 'b'])
  })

  it('busca en título y descripción sin distinguir mayúsculas', () => {
    const resultado = filtrarTareas(tareas, { ...FILTROS_VACIOS, texto: 'MÉTRICAS' })
    expect(resultado.map((item) => item.id)).toEqual(['b'])
  })

  it('combina filtros de estado, prioridad y etiqueta', () => {
    const resultado = filtrarTareas(tareas, {
      ...FILTROS_VACIOS,
      estado: 'pendiente',
      prioridad: 'alta',
      etiquetaId: 'e-1',
    })
    expect(resultado.map((item) => item.id)).toEqual(['a'])
  })

  it('filtra por rango de vencimiento', () => {
    const resultado = filtrarTareas(tareas, {
      ...FILTROS_VACIOS,
      desde: '2026-11-12',
      hasta: '2026-11-12',
    })
    expect(resultado.map((item) => item.id)).toEqual(['b'])
  })

  it('cuenta los filtros activos', () => {
    expect(contarFiltrosActivos(FILTROS_VACIOS)).toBe(0)
    expect(contarFiltrosActivos({ ...FILTROS_VACIOS, texto: 'pan', estado: 'pendiente' })).toBe(2)
  })
})
