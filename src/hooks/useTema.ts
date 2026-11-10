import { useEffect } from 'react'
import { useAppStore } from '../stores/appStore'
import type { Tema } from '../types/modelo'

export function useTema() {
  const tema = useAppStore((estado) => estado.datos.preferencias.tema)
  const actualizar = useAppStore((estado) => estado.actualizar)

  useEffect(() => {
    const medios = window.matchMedia('(prefers-color-scheme: dark)')
    const aplicar = () => {
      const oscuro = tema === 'oscuro' || (tema === 'sistema' && medios.matches)
      document.documentElement.classList.toggle('dark', oscuro)
    }
    aplicar()
    if (tema !== 'sistema') return
    medios.addEventListener('change', aplicar)
    return () => medios.removeEventListener('change', aplicar)
  }, [tema])

  const cambiar = (nuevo: Tema) =>
    actualizar((datos) => ({
      ...datos,
      preferencias: { ...datos.preferencias, tema: nuevo },
    }))

  return { tema, cambiar }
}
