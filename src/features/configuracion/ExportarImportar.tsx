import { useRef, useState, type ChangeEvent } from 'react'
import Boton from '../../components/ui/Boton'
import Modal from '../../components/ui/Modal'
import { useToast } from '../../components/ui/toastContexto'
import { descargarJSON, deserializarDatos } from '../../lib/almacenamiento'
import { useAppStore } from '../../stores/appStore'
import type { DatosApp } from '../../types/modelo'

export default function ExportarImportar() {
  const datos = useAppStore((estado) => estado.datos)
  const reemplazar = useAppStore((estado) => estado.reemplazar)
  const { mostrar } = useToast()
  const entrada = useRef<HTMLInputElement>(null)
  const [pendiente, setPendiente] = useState<DatosApp | null>(null)

  const exportar = () => {
    descargarJSON(datos)
    mostrar('Copia de seguridad exportada.', 'exito')
  }

  const alSeleccionar = async (evento: ChangeEvent<HTMLInputElement>) => {
    const archivo = evento.target.files?.[0]
    evento.target.value = ''
    if (!archivo) return
    try {
      setPendiente(deserializarDatos(await archivo.text()))
    } catch (error) {
      mostrar(
        error instanceof Error ? error.message : 'No se pudo leer el archivo seleccionado.',
        'error',
      )
    }
  }

  const confirmar = () => {
    if (!pendiente) return
    reemplazar(pendiente)
    setPendiente(null)
    mostrar('Datos importados correctamente.', 'exito')
  }

  const totalTareas = pendiente?.tareas.filter((tarea) => tarea.eliminadaEn === null).length ?? 0

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 text-sm text-slate-500 dark:border-slate-800 dark:bg-slate-900">
      <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Datos</h3>
      <p className="mt-1">
        La aplicación guarda todo en JSON dentro de este navegador. Exporta una copia de seguridad o
        restaura un archivo; al importar se reemplazan los datos actuales.
      </p>

      <div className="mt-4 flex flex-wrap gap-2">
        <Boton variante="secundario" onClick={exportar}>
          Exportar JSON
        </Boton>
        <Boton variante="secundario" onClick={() => entrada.current?.click()}>
          Importar JSON
        </Boton>
        <input
          ref={entrada}
          type="file"
          accept="application/json,.json"
          onChange={alSeleccionar}
          className="hidden"
          aria-hidden="true"
          tabIndex={-1}
        />
      </div>

      <Modal
        abierto={pendiente !== null}
        titulo="¿Reemplazar los datos actuales?"
        onCerrar={() => setPendiente(null)}
        acciones={
          <>
            <Boton variante="secundario" onClick={() => setPendiente(null)}>
              Cancelar
            </Boton>
            <Boton variante="peligro" onClick={confirmar}>
              Importar y reemplazar
            </Boton>
          </>
        }
      >
        <p className="text-sm text-slate-500">
          El archivo contiene {pendiente?.listas.length ?? 0} lista(s), {totalTareas} tarea(s) y{' '}
          {pendiente?.etiquetas.length ?? 0} etiqueta(s). Se perderán los datos actuales que no estén
          en el archivo.
        </p>
      </Modal>
    </div>
  )
}
