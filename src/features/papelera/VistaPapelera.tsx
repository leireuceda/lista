import { useState } from 'react'
import Boton from '../../components/ui/Boton'
import Insignia from '../../components/ui/Insignia'
import Modal from '../../components/ui/Modal'
import { useToast } from '../../components/ui/toastContexto'
import { formatearFechaHora } from '../../lib/fechas'
import { restaurarTarea, vaciarPapelera } from '../../stores/accionesTareas'
import { useAppStore } from '../../stores/appStore'

export default function VistaPapelera() {
  const tareas = useAppStore((estado) => estado.datos.tareas)
  const listas = useAppStore((estado) => estado.datos.listas)
  const { mostrar } = useToast()
  const [confirmar, setConfirmar] = useState(false)

  const eliminadas = tareas
    .filter((tarea) => tarea.eliminadaEn !== null)
    .sort((a, b) => (b.eliminadaEn ?? '').localeCompare(a.eliminadaEn ?? ''))

  const confirmarVaciado = () => {
    const total = vaciarPapelera()
    setConfirmar(false)
    mostrar(
      total === 0 ? 'La papelera ya estaba vacía.' : `${total} tarea(s) eliminadas para siempre.`,
      'info',
    )
  }

  return (
    <section>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">Papelera</h2>
          <p className="mt-1 text-sm text-slate-500">
            Las tareas eliminadas se pueden restaurar antes de vaciar la papelera.
          </p>
        </div>
        <Boton
          variante="peligro"
          onClick={() => setConfirmar(true)}
          disabled={eliminadas.length === 0}
        >
          Vaciar papelera
        </Boton>
      </div>

      {eliminadas.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-300 p-10 text-center text-sm text-slate-500 dark:border-slate-700">
          La papelera está vacía.
        </div>
      ) : (
        <ul className="space-y-2">
          {eliminadas.map((tarea) => (
            <li
              key={tarea.id}
              className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900"
            >
              <div className="min-w-0">
                <p className="text-sm font-medium">{tarea.titulo}</p>
                <p className="mt-1 text-xs text-slate-500">
                  {listas.find((lista) => lista.id === tarea.listaId)?.nombre ?? 'Lista'} · eliminada
                  el {formatearFechaHora(tarea.eliminadaEn)}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Insignia tono="neutro">En papelera</Insignia>
                <Boton
                  variante="secundario"
                  tamano="sm"
                  onClick={() => {
                    restaurarTarea(tarea.id)
                    mostrar('Tarea restaurada.', 'exito')
                  }}
                >
                  Restaurar
                </Boton>
              </div>
            </li>
          ))}
        </ul>
      )}

      <Modal
        abierto={confirmar}
        titulo="¿Vaciar la papelera?"
        onCerrar={() => setConfirmar(false)}
        acciones={
          <>
            <Boton variante="secundario" onClick={() => setConfirmar(false)}>
              Cancelar
            </Boton>
            <Boton variante="peligro" onClick={confirmarVaciado}>
              Eliminar para siempre
            </Boton>
          </>
        }
      >
        <p className="text-sm text-slate-500">
          Se eliminarán {eliminadas.length} tarea(s) de forma permanente. Esta acción no se puede
          deshacer.
        </p>
      </Modal>
    </section>
  )
}
