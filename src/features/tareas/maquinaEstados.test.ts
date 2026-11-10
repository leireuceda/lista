import { describe, expect, it } from 'vitest'
import type { Tarea } from '../../types/modelo'
import { aplicarEstado, estadosAnteriores, SIGUIENTE_ESTADO } from './maquinaEstados'

const base: Tarea = {
  id: 't-1',
  listaId: 'l-1',
  titulo: 'Tarea de prueba',
  descripcion: '',
  vencimiento: null,
  categoriaId: null,
  etiquetaIds: [],
  prioridad: 'media',
  estado: 'en-progreso',
  historial: [
    { estado: 'pendiente', fecha: '2026-11-01T10:00:00.000Z' },
    { estado: 'en-progreso', fecha: '2026-11-02T10:00:00.000Z' },
  ],
  orden: 1,
  creadaEn: '2026-11-01T10:00:00.000Z',
  actualizadaEn: '2026-11-02T10:00:00.000Z',
  eliminadaEn: null,
}

describe('máquina de estados', () => {
  it('registra el cambio en el historial', () => {
    const resultado = aplicarEstado(base, 'completada', '2026-11-03T10:00:00.000Z')
    expect(resultado.estado).toBe('completada')
    expect(resultado.historial.at(-1)).toEqual({
      estado: 'completada',
      fecha: '2026-11-03T10:00:00.000Z',
    })
    expect(resultado.actualizadaEn).toBe('2026-11-03T10:00:00.000Z')
  })

  it('no duplica el estado actual', () => {
    expect(aplicarEstado(base, 'en-progreso', '2026-11-03T10:00:00.000Z')).toBe(base)
  })

  it('devuelve los estados anteriores sin repetir ni incluir el actual', () => {
    expect(estadosAnteriores(base)).toEqual(['pendiente'])
    const completada = aplicarEstado(base, 'completada', '2026-11-03T10:00:00.000Z')
    expect(estadosAnteriores(completada)).toEqual(['pendiente', 'en-progreso'])
  })

  it('define la transición natural', () => {
    expect(SIGUIENTE_ESTADO.pendiente).toBe('en-progreso')
    expect(SIGUIENTE_ESTADO['en-progreso']).toBe('completada')
  })
})
