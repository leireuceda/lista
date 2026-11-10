import { useMemo } from 'react'
import Insignia from '../../components/ui/Insignia'
import { formatearFecha } from '../../lib/fechas'
import { useAppStore } from '../../stores/appStore'
import { ETIQUETA_ESTADO, ETIQUETA_PRIORIDAD } from '../../types/modelo'

interface Props {
  listaId: string
}

const TONO_PRIORIDAD = {
  baja: 'neutro',
  media: 'indigo',
  alta: 'ambar',
  urgente: 'rojo',
} as const

export default function ListaTareasSoloLectura({ listaId }: Props) {
  const tareas = useAppStore((estado) => estado.datos.tareas)
  const categorias = useAppStore((estado) => estado.datos.categorias)
  const etiquetas = useAppStore((estado) => estado.datos.etiquetas)

  const visibles = useMemo(
    () =>
      tareas
        .filter((tarea) => tarea.listaId === listaId && tarea.eliminadaEn === null)
        .sort((a, b) => a.orden - b.orden),
    [tareas, listaId],
  )

  return (
    <div className="space-y-2">
      {visibles.length === 0 && (
        <p className="rounded-xl border border-dashed border-slate-300 p-10 text-center text-sm text-slate-500 dark:border-slate-700">
          Esta lista no tiene tareas.
        </p>
      )}
      {visibles.map((tarea) => {
        const categoria = categorias.find((item) => item.id === tarea.categoriaId)
        const etiquetasTarea = etiquetas.filter((item) => tarea.etiquetaIds.includes(item.id))
        return (
          <article
            key={tarea.id}
            className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900"
          >
            <div className="flex flex-wrap items-center gap-2">
              <h3
                className={`text-sm font-medium ${
                  tarea.estado === 'completada'
                    ? 'text-slate-400 line-through'
                    : 'text-slate-900 dark:text-slate-100'
                }`}
              >
                {tarea.titulo}
              </h3>
              <Insignia tono={tarea.estado === 'completada' ? 'verde' : 'neutro'}>
                {ETIQUETA_ESTADO[tarea.estado]}
              </Insignia>
            </div>
            {tarea.descripcion && (
              <p className="mt-1 text-xs text-slate-500">{tarea.descripcion}</p>
            )}
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <Insignia tono={TONO_PRIORIDAD[tarea.prioridad]}>
                {ETIQUETA_PRIORIDAD[tarea.prioridad]}
              </Insignia>
              {categoria && <Insignia color={categoria.color}>{categoria.nombre}</Insignia>}
              {etiquetasTarea.map((etiqueta) => (
                <Insignia key={etiqueta.id} color={etiqueta.color}>
                  {etiqueta.nombre}
                </Insignia>
              ))}
              <span className="text-xs text-slate-400">
                {tarea.vencimiento ? `📅 ${formatearFecha(tarea.vencimiento)}` : 'Sin vencimiento'}
              </span>
            </div>
          </article>
        )
      })}
    </div>
  )
}
