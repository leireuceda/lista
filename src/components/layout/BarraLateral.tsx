import { NavLink } from 'react-router-dom'
import { cx } from '../../lib/clases'
import { useAppStore } from '../../stores/appStore'

const SECCIONES = [
  { a: '/busqueda', texto: 'Buscar', icono: '⌕' },
  { a: '/papelera', texto: 'Papelera', icono: '🗑' },
  { a: '/configuracion', texto: 'Configuración', icono: '⚙' },
]

const claseEnlace = ({ isActive }: { isActive: boolean }) =>
  cx(
    'flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition',
    isActive
      ? 'bg-indigo-50 font-medium text-indigo-700 dark:bg-indigo-500/15 dark:text-indigo-300'
      : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800',
  )

export default function BarraLateral({ alNavegar }: { alNavegar?: () => void }) {
  const listas = useAppStore((estado) => estado.datos.listas)

  return (
    <div className="flex h-full flex-col gap-6 p-4">
      <div>
        <p className="text-lg font-semibold tracking-tight">TaskFlow Pro</p>
        <p className="text-xs text-slate-500">Organiza tu día</p>
      </div>

      <nav aria-label="Listas" className="flex flex-col gap-1">
        <p className="px-3 pb-1 text-xs font-semibold uppercase tracking-wide text-slate-400">
          Mis listas
        </p>
        {listas.map((lista) => (
          <NavLink
            key={lista.id}
            to={`/listas/${lista.id}`}
            onClick={alNavegar}
            className={claseEnlace}
          >
            <span aria-hidden="true">▤</span>
            <span className="truncate">{lista.nombre}</span>
          </NavLink>
        ))}
      </nav>

      <nav aria-label="Secciones" className="flex flex-col gap-1">
        <p className="px-3 pb-1 text-xs font-semibold uppercase tracking-wide text-slate-400">
          General
        </p>
        {SECCIONES.map((seccion) => (
          <NavLink
            key={seccion.a}
            to={seccion.a}
            onClick={alNavegar}
            className={claseEnlace}
          >
            <span aria-hidden="true">{seccion.icono}</span>
            <span>{seccion.texto}</span>
          </NavLink>
        ))}
      </nav>

      <div className="mt-auto rounded-xl bg-slate-100 p-3 text-xs text-slate-500 dark:bg-slate-800/60 dark:text-slate-400">
        Los datos se guardan en tu navegador en formato JSON.
      </div>
    </div>
  )
}
