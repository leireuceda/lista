import { useState } from 'react'
import Boton from '../../components/ui/Boton'
import Insignia from '../../components/ui/Insignia'
import Modal from '../../components/ui/Modal'
import { useToast } from '../../components/ui/toastContexto'
import { formatearFechaHora } from '../../lib/fechas'
import { useAppStore } from '../../stores/appStore'
import type { PermisoComparticion } from '../../types/modelo'
import {
  crearComparticion,
  revocarComparticion,
  urlCompartida,
} from './accionesComparticion'

interface Props {
  listaId: string
  abierto: boolean
  onCerrar: () => void
}

export default function PanelComparticion({ listaId, abierto, onCerrar }: Props) {
  const comparticiones = useAppStore((estado) => estado.datos.comparticiones)
  const { mostrar } = useToast()
  const [permiso, setPermiso] = useState<PermisoComparticion>('lectura')

  const enlaces = comparticiones.filter(
    (comparticion) => comparticion.listaId === listaId && comparticion.revocadaEn === null,
  )

  const crear = () => {
    crearComparticion(listaId, permiso)
    mostrar('Enlace de compartición creado.', 'exito')
  }

  const copiar = async (token: string) => {
    try {
      await navigator.clipboard.writeText(urlCompartida(token))
      mostrar('Enlace copiado al portapapeles.', 'exito')
    } catch {
      mostrar('No se pudo copiar el enlace.', 'error')
    }
  }

  return (
    <Modal abierto={abierto} titulo="Compartir lista" onCerrar={onCerrar}>
      <div className="space-y-4">
        <p className="text-sm text-slate-500">
          Genera un enlace público con permiso de lectura o escritura. Los enlaces se pueden revocar
          en cualquier momento.
        </p>

        <div className="flex flex-wrap items-end gap-2">
          <label className="text-sm">
            <span className="mb-1 block font-medium">Permiso</span>
            <select
              value={permiso}
              onChange={(evento) => setPermiso(evento.target.value as PermisoComparticion)}
              className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-950"
            >
              <option value="lectura">Solo lectura</option>
              <option value="escritura">Lectura y escritura</option>
            </select>
          </label>
          <Boton onClick={crear}>Crear enlace</Boton>
        </div>

        <div className="space-y-2">
          {enlaces.length === 0 && (
            <p className="rounded-lg border border-dashed border-slate-300 p-4 text-center text-xs text-slate-500 dark:border-slate-700">
              Esta lista todavía no está compartida.
            </p>
          )}
          {enlaces.map((enlace) => (
            <div
              key={enlace.id}
              className="rounded-lg border border-slate-200 p-3 text-xs dark:border-slate-700"
            >
              <div className="flex flex-wrap items-center gap-2">
                <Insignia tono={enlace.permiso === 'escritura' ? 'indigo' : 'neutro'}>
                  {enlace.permiso === 'escritura' ? 'Lectura y escritura' : 'Solo lectura'}
                </Insignia>
                <code className="min-w-0 flex-1 truncate text-slate-500">
                  {urlCompartida(enlace.token)}
                </code>
                <Boton variante="secundario" tamano="sm" onClick={() => copiar(enlace.token)}>
                  Copiar
                </Boton>
                <Boton
                  variante="fantasma"
                  tamano="sm"
                  onClick={() => {
                    revocarComparticion(enlace.id)
                    mostrar('Enlace revocado.', 'info')
                  }}
                >
                  Revocar
                </Boton>
              </div>
              <p className="mt-2 text-slate-400">
                Último acceso: {enlace.ultimoAcceso ? formatearFechaHora(enlace.ultimoAcceso) : 'nunca'}
              </p>
            </div>
          ))}
        </div>

        <p className="text-xs text-slate-400">
          Simulación en línea: los enlaces funcionan entre pestañas de este navegador porque los
          datos viven en JSON local.
        </p>
      </div>
    </Modal>
  )
}
