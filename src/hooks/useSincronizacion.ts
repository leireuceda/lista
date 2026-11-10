import { useEffect } from 'react'
import { cargarDatos, CANAL_SINCRONIZACION, CLAVE_ALMACENAMIENTO } from '../lib/almacenamiento'
import { fusionarDatos } from '../lib/sincronizacion'
import { useAppStore } from '../stores/appStore'

const CANAL = CANAL_SINCRONIZACION

export function useSincronizacion() {
  const establecer = useAppStore((estado) => estado.establecer)

  useEffect(() => {
    const sincronizar = () => {
      const remotos = cargarDatos()
      const locales = useAppStore.getState().datos
      const fusionados = fusionarDatos(locales, remotos)
      if (JSON.stringify(fusionados) === JSON.stringify(locales)) return
      establecer(fusionados)
    }

    const alCambiarAlmacen = (evento: StorageEvent) => {
      if (evento.key === CLAVE_ALMACENAMIENTO) sincronizar()
    }

    const canal = typeof BroadcastChannel === 'undefined' ? null : new BroadcastChannel(CANAL)
    if (canal) canal.onmessage = sincronizar

    window.addEventListener('storage', alCambiarAlmacen)
    const sondeo = window.setInterval(sincronizar, 5000)

    return () => {
      window.removeEventListener('storage', alCambiarAlmacen)
      window.clearInterval(sondeo)
      canal?.close()
    }
  }, [establecer])
}
