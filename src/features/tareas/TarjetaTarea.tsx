import Insignia from '../../components/ui/Insignia'
import Desplegable from '../../components/ui/Desplegable'
import { useToast } from '../../components/ui/toastContexto'
import { estaVencida, formatearFecha } from '../../lib/fechas'
import { useAppStore } from '../../stores/appStore'
import { cambiarEstadoTarea, enviarAPapelera } from '../../stores/accionesTareas'
import { ETIQUETA_ESTADO, ETIQUETA_PRIORIDAD, type Tarea } from '../../types/modelo'
import { descripcionTransicion, estadosAnteriores, SIGUIENTE_ESTADO } from './maquinaEstados'
import TextoResaltado from './TextoResaltado'

const TONO_PRIORIDAD = {
  baja: 'neutro',
  media: 'indigo',
  alta: 'ambar',
  urgente: 'rojo',
} as const

interface Props {
  tarea: Tarea
  onEditar: (tarea: Tarea) => void
  consulta?: string
  mostrarLista?: boolean
}

export default function TarjetaTarea({ tarea, onEditar, consulta = '', mostrarLista }: Props) {
  const categorias = useAppStore((estado) => estado.datos.categorias)
  const etiquetas = useAppStore((estado) => estado.datos.etiquetas)
  const listas = useAppStore((estado) => estado.datos.listas)
  const { mostrar } = useToast()

  const categoria = categorias.find((item) => item.id === tarea.categoriaId)
  const lista = listas.find((item) => item.id === tarea.listaId)
  const etiquetasTarea = etiquetas.filter((item) => tarea.etiquetaIds.includes(item.id))
  const completada = tarea.estado === 'completada'
  const vencida = !completada && estaVencida(tarea.vencimiento)

  const opcionesEstado = [
    {
      id: 'siguiente',
      etiqueta: descripcionTransicion(tarea.estado, SIGUIENTE_ESTADO[tarea.estado]),
      onSelect: () => cambiarEstadoTarea(tarea.id, SIGUIENTE_ESTADO[tarea.estado]),
    },
    ...estadosAnteriores(tarea).map((estado) => ({
      id: `volver-${estado}`,
      etiqueta: `Volver a ${ETIQUETA_ESTADO[estado].toLowerCase()}`,
      onSelect: () => cambiarEstadoTarea(tarea.id, estado),
    })),
  ]

  return (
    <article className="flex gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <button
        type="button"
        onClick={() => cambiarEstadoTarea(tarea.id, completada ? 'pendiente' : 'completada')}
        aria-label={completada ? 'Reabrir tarea' : 'Completar tarea'}
        aria-pressed={completada}
        className={`mt-0.5 grid size-6 shrink-0 place-items-center rounded-full border text-xs transition ${
          completada
            ? 'border-emerald-500 bg-emerald-500 text-white'
            : 'border-slate-300 text-transparent hover:border-emerald-500'
        }`}
      >
        ✓
      </button>

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <h3
            className={`text-sm font-medium ${
              completada ? 'text-slate-400 line-through' : 'text-slate-900 dark:text-slate-100'
            }`}
          >
            <TextoResaltado texto={tarea.titulo} consulta={consulta} />
          </h3>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => onEditar(tarea)}
              aria-label={`Editar ${tarea.titulo}`}
              className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 dark:hover:bg-slate-800"
            >
              ✎
            </button>
            <button
              type="button"
              onClick={() => {
                enviarAPapelera(tarea.id)
                mostrar('Tarea movida a la papelera.', 'info')
              }}
              aria-label={`Enviar ${tarea.titulo} a la papelera`}
              className="rounded-lg p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600 dark:hover:bg-red-500/10"
            >
              🗑
            </button>
          </div>
        </div>

        {tarea.descripcion && (
          <p className="mt-1 line-clamp-2 text-xs text-slate-500">{tarea.descripcion}</p>
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
          <span className={`text-xs ${vencida ? 'font-medium text-red-600' : 'text-slate-400'}`}>
            {tarea.vencimiento ? `📅 ${formatearFecha(tarea.vencimiento)}` : 'Sin vencimiento'}
          </span>
          {mostrarLista && lista && (
            <span className="text-xs text-slate-400">▤ {lista.nombre}</span>
          )}
          <Desplegable
            ariaLabel={`Cambiar estado de ${tarea.titulo}`}
            etiqueta={ETIQUETA_ESTADO[tarea.estado]}
            opciones={opcionesEstado}
            alineacion="derecha"
            className="ml-auto w-40"
          />
        </div>
      </div>
    </article>
  )
}
