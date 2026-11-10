import { useMemo, useState } from 'react'
import Boton from '../../components/ui/Boton'
import { FILTROS_VACIOS, filtrarTareas } from '../../lib/filtros'
import { useAppStore } from '../../stores/appStore'
import type { Tarea } from '../../types/modelo'
import FiltrosTareas from './FiltrosTareas'
import FormularioTarea from './FormularioTarea'
import TarjetaTarea from './TarjetaTarea'

interface Props {
  listaId: string
}

export default function ListaTareas({ listaId }: Props) {
  const tareas = useAppStore((estado) => estado.datos.tareas)
  const [formularioAbierto, setFormularioAbierto] = useState(false)
  const [editando, setEditando] = useState<Tarea | null>(null)
  const [filtros, setFiltros] = useState(FILTROS_VACIOS)

  const visibles = useMemo(
    () =>
      filtrarTareas(tareas, filtros)
        .filter((tarea) => tarea.listaId === listaId)
        .sort((a, b) => {
          if (a.estado === 'completada' && b.estado !== 'completada') return 1
          if (b.estado === 'completada' && a.estado !== 'completada') return -1
          return a.orden - b.orden
        }),
    [tareas, listaId, filtros],
  )

  const pendientes = visibles.filter((tarea) => tarea.estado !== 'completada').length

  const abrirNueva = () => {
    setEditando(null)
    setFormularioAbierto(true)
  }

  const abrirEdicion = (tarea: Tarea) => {
    setEditando(tarea)
    setFormularioAbierto(true)
  }

  return (
    <section>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">Tareas</h2>
          <p className="mt-1 text-sm text-slate-500">
            {pendientes} pendiente{pendientes === 1 ? '' : 's'} · {visibles.length} en total
          </p>
        </div>
        <Boton onClick={abrirNueva}>+ Nueva tarea</Boton>
      </div>

      <div className="mb-4">
        <FiltrosTareas filtros={filtros} onCambiar={setFiltros} />
      </div>

      {visibles.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-300 p-10 text-center dark:border-slate-700">
          <p className="text-sm text-slate-500">No hay tareas en esta lista todavía.</p>
          <Boton variante="secundario" className="mt-4" onClick={abrirNueva}>
            Crear la primera
          </Boton>
        </div>
      ) : (
        <div className="space-y-2">
          {visibles.map((tarea) => (
            <TarjetaTarea key={tarea.id} tarea={tarea} onEditar={abrirEdicion} />
          ))}
        </div>
      )}

      <FormularioTarea
        abierto={formularioAbierto}
        listaId={listaId}
        tarea={editando}
        onCerrar={() => setFormularioAbierto(false)}
      />
    </section>
  )
}
