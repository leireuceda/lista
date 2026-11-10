import type { DatosApp } from '../types/modelo'

export function fusionarDatos(locales: DatosApp, remotos: DatosApp): DatosApp {
  const tareas = new Map(locales.tareas.map((tarea) => [tarea.id, tarea]))
  for (const remota of remotos.tareas) {
    const local = tareas.get(remota.id)
    if (!local || remota.actualizadaEn >= local.actualizadaEn) tareas.set(remota.id, remota)
  }
  return { ...remotos, tareas: [...tareas.values()] }
}
