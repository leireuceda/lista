import { useEffect, useRef, useState } from 'react'
import { useAppStore } from '../../stores/appStore'
import type { FiltrosTareas } from '../../lib/filtros'
import { FILTROS_VACIOS } from '../../lib/filtros'
import Boton from '../../components/ui/Boton'

interface Props {
  filtros: FiltrosTareas
  onCambiar: (filtros: FiltrosTareas) => void
  mostrarFechas?: boolean
}

const claseCampo =
  'w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 dark:border-slate-700 dark:bg-slate-950'

export default function FiltrosTareas({ filtros, onCambiar, mostrarFechas = true }: Props) {
  const categorias = useAppStore((estado) => estado.datos.categorias)
  const etiquetas = useAppStore((estado) => estado.datos.etiquetas)
  const [texto, setTexto] = useState(filtros.texto)
  const filtrosRef = useRef(filtros)
  filtrosRef.current = filtros
  const temporizador = useRef<number>(0)

  useEffect(() => {
    setTexto(filtros.texto)
  }, [filtros.texto])

  useEffect(() => () => window.clearTimeout(temporizador.current), [])

  const alEscribir = (valor: string) => {
    setTexto(valor)
    window.clearTimeout(temporizador.current)
    temporizador.current = window.setTimeout(() => {
      onCambiar({ ...filtrosRef.current, texto: valor })
    }, 250)
  }

  const cambiar = <C extends keyof FiltrosTareas>(campo: C, valor: FiltrosTareas[C]) =>
    onCambiar({ ...filtros, [campo]: valor })

  return (
    <div className="space-y-3 rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
      <input
        type="search"
        value={texto}
        onChange={(evento) => alEscribir(evento.target.value)}
        placeholder="Buscar por título o descripción…"
        aria-label="Buscar tareas"
        className={claseCampo}
      />

      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
        <select
          value={filtros.estado}
          onChange={(evento) => cambiar('estado', evento.target.value as FiltrosTareas['estado'])}
          aria-label="Filtrar por estado"
          className={claseCampo}
        >
          <option value="">Todos los estados</option>
          <option value="pendiente">Pendiente</option>
          <option value="en-progreso">En progreso</option>
          <option value="completada">Completada</option>
        </select>

        <select
          value={filtros.prioridad}
          onChange={(evento) =>
            cambiar('prioridad', evento.target.value as FiltrosTareas['prioridad'])
          }
          aria-label="Filtrar por prioridad"
          className={claseCampo}
        >
          <option value="">Todas las prioridades</option>
          <option value="baja">Baja</option>
          <option value="media">Media</option>
          <option value="alta">Alta</option>
          <option value="urgente">Urgente</option>
        </select>

        <select
          value={filtros.categoriaId}
          onChange={(evento) => cambiar('categoriaId', evento.target.value)}
          aria-label="Filtrar por categoría"
          className={claseCampo}
        >
          <option value="">Todas las categorías</option>
          {categorias.map((categoria) => (
            <option key={categoria.id} value={categoria.id}>
              {categoria.nombre}
            </option>
          ))}
        </select>

        <select
          value={filtros.etiquetaId}
          onChange={(evento) => cambiar('etiquetaId', evento.target.value)}
          aria-label="Filtrar por etiqueta"
          className={claseCampo}
        >
          <option value="">Todas las etiquetas</option>
          {etiquetas.map((etiqueta) => (
            <option key={etiqueta.id} value={etiqueta.id}>
              {etiqueta.nombre}
            </option>
          ))}
        </select>
      </div>

      {mostrarFechas && (
        <div className="grid gap-2 sm:grid-cols-2">
          <label className="text-xs text-slate-500">
            Vence desde
            <input
              type="date"
              value={filtros.desde}
              onChange={(evento) => cambiar('desde', evento.target.value)}
              className={claseCampo}
            />
          </label>
          <label className="text-xs text-slate-500">
            Vence hasta
            <input
              type="date"
              value={filtros.hasta}
              onChange={(evento) => cambiar('hasta', evento.target.value)}
              className={claseCampo}
            />
          </label>
        </div>
      )}

      <div className="flex justify-end">
        <Boton variante="fantasma" tamano="sm" onClick={() => onCambiar(FILTROS_VACIOS)}>
          Limpiar filtros
        </Boton>
      </div>
    </div>
  )
}
