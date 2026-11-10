import { ahora } from '../../lib/fechas'
import { nuevoId } from '../../lib/id'
import { useAppStore } from '../../stores/appStore'
import type { Comparticion, PermisoComparticion } from '../../types/modelo'

function nuevoToken(): string {
  return crypto.randomUUID().replaceAll('-', '').slice(0, 12)
}

export function crearComparticion(listaId: string, permiso: PermisoComparticion): string {
  const id = nuevoId('comp')
  const comparticion: Comparticion = {
    id,
    listaId,
    token: nuevoToken(),
    permiso,
    creadaEn: ahora(),
    revocadaEn: null,
    ultimoAcceso: null,
  }
  useAppStore.getState().actualizar((datos) => ({
    ...datos,
    comparticiones: [...datos.comparticiones, comparticion],
  }))
  return id
}

export function revocarComparticion(id: string): void {
  useAppStore.getState().actualizar((datos) => ({
    ...datos,
    comparticiones: datos.comparticiones.map((comparticion) =>
      comparticion.id === id ? { ...comparticion, revocadaEn: ahora() } : comparticion,
    ),
  }))
}

export function registrarAcceso(id: string): void {
  useAppStore.getState().actualizar((datos) => ({
    ...datos,
    comparticiones: datos.comparticiones.map((comparticion) =>
      comparticion.id === id ? { ...comparticion, ultimoAcceso: ahora() } : comparticion,
    ),
  }))
}

export function enlacesDeLista(listaId: string): Comparticion[] {
  return useAppStore
    .getState()
    .datos.comparticiones.filter(
      (comparticion) => comparticion.listaId === listaId && comparticion.revocadaEn === null,
    )
}

export function urlCompartida(token: string): string {
  return `${window.location.origin}/compartido/${token}`
}
