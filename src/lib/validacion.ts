import type { DatosApp } from '../types/modelo'

function esObjeto(valor: unknown): valor is Record<string, unknown> {
  return typeof valor === 'object' && valor !== null && !Array.isArray(valor)
}

function esListaDeObjetos(valor: unknown): boolean {
  return Array.isArray(valor) && valor.every(esObjeto)
}

export function validarDatos(valor: unknown): DatosApp | null {
  if (!esObjeto(valor)) return null
  const requeridas = [
    'listas',
    'tareas',
    'etiquetas',
    'categorias',
    'comparticiones',
  ] as const
  if (!requeridas.every((clave) => esListaDeObjetos(valor[clave]))) return null
  if (!esObjeto(valor.usuario) || !esObjeto(valor.preferencias)) return null
  if (typeof valor.version !== 'number') return null
  return valor as unknown as DatosApp
}
