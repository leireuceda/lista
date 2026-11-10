import semilla from '../data/semilla.json'
import type { DatosApp } from '../types/modelo'
import { validarDatos } from './validacion'

export const CLAVE_ALMACENAMIENTO = 'taskflow-pro:datos:v1'

export function datosIniciales(): DatosApp {
  return structuredClone(semilla) as unknown as DatosApp
}

export function cargarDatos(): DatosApp {
  try {
    const bruto = localStorage.getItem(CLAVE_ALMACENAMIENTO)
    if (!bruto) return datosIniciales()
    return validarDatos(JSON.parse(bruto)) ?? datosIniciales()
  } catch {
    return datosIniciales()
  }
}

export function guardarDatos(datos: DatosApp): void {
  localStorage.setItem(CLAVE_ALMACENAMIENTO, JSON.stringify(datos))
}

export function reiniciarDatos(): DatosApp {
  const datos = datosIniciales()
  guardarDatos(datos)
  return datos
}

export function serializarDatos(datos: DatosApp): string {
  return JSON.stringify(datos, null, 2)
}

export function deserializarDatos(texto: string): DatosApp {
  const datos = validarDatos(JSON.parse(texto))
  if (!datos) throw new Error('El archivo no tiene un formato válido de TaskFlow Pro.')
  return datos
}

export function descargarJSON(datos: DatosApp): void {
  const blob = new Blob([serializarDatos(datos)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const enlace = document.createElement('a')
  enlace.href = url
  enlace.download = `taskflow-pro-${new Date().toISOString().slice(0, 10)}.json`
  enlace.click()
  URL.revokeObjectURL(url)
}
