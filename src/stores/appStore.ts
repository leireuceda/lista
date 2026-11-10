import { create } from 'zustand'
import { cargarDatos, guardarDatos } from '../lib/almacenamiento'
import type { DatosApp } from '../types/modelo'

interface EstadoApp {
  datos: DatosApp
  reemplazar: (datos: DatosApp) => void
  actualizar: (cambio: (datos: DatosApp) => DatosApp) => void
  recargar: () => void
}

export const useAppStore = create<EstadoApp>((set) => ({
  datos: cargarDatos(),
  reemplazar: (datos) => {
    guardarDatos(datos)
    set({ datos })
  },
  actualizar: (cambio) =>
    set((estado) => {
      const datos = cambio(estado.datos)
      guardarDatos(datos)
      return { datos }
    }),
  recargar: () => set({ datos: cargarDatos() }),
}))

export function datosActuales(): DatosApp {
  return useAppStore.getState().datos
}
