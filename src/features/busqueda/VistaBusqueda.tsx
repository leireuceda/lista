import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import FormularioTarea from '../tareas/FormularioTarea'
import FiltrosTareas from '../tareas/FiltrosTareas'
import TarjetaTarea from '../tareas/TarjetaTarea'
import { contarFiltrosActivos, filtrarTareas, filtrosDesdeParams, paramsDesdeFiltros } from '../../lib/filtros'
import { useAppStore } from '../../stores/appStore'
import type { Tarea } from '../../types/modelo'

export default function VistaBusqueda() {
  const [params, setParams] = useSearchParams()
  const tareas = useAppStore((estado) => estado.datos.tareas)
  const [editando, setEditando] = useState<Tarea | null>(null)

  const filtros = useMemo(() => filtrosDesdeParams(params), [params])

  const resultados = useMemo(
    () =>
      filtrarTareas(tareas, filtros).sort((a, b) => a.titulo.localeCompare(b.titulo, 'es')),
    [tareas, filtros],
  )

  const activos = contarFiltrosActivos(filtros)

  return (
    <section className="mx-auto max-w-3xl">
      <header className="mb-6">
        <h2 className="text-2xl font-semibold tracking-tight">Buscador global</h2>
        <p className="mt-1 text-sm text-slate-500">
          Filtra por texto, estado, prioridad, categoría, etiqueta o vencimiento.
        </p>
      </header>

      <FiltrosTareas
        filtros={filtros}
        onCambiar={(nuevos) => setParams(paramsDesdeFiltros(nuevos), { replace: true })}
      />

      <p className="mb-3 mt-6 text-xs text-slate-500">
        {resultados.length} resultado{resultados.length === 1 ? '' : 's'}
        {activos > 0 ? ` · ${activos} filtro(s) activo(s)` : ''}
      </p>

      {resultados.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-300 p-10 text-center text-sm text-slate-500 dark:border-slate-700">
          No hay tareas que coincidan con la búsqueda.
        </div>
      ) : (
        <div className="space-y-2">
          {resultados.map((tarea) => (
            <TarjetaTarea
              key={tarea.id}
              tarea={tarea}
              onEditar={setEditando}
              consulta={filtros.texto}
              mostrarLista
            />
          ))}
        </div>
      )}

      <FormularioTarea
        abierto={editando !== null}
        listaId={editando?.listaId ?? ''}
        tarea={editando}
        onCerrar={() => setEditando(null)}
      />
    </section>
  )
}
