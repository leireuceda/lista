import { NavLink, Outlet } from 'react-router-dom'
import { useAppStore } from '../../stores/appStore'

const ENLACES = [
  { a: '/listas/l-personal', texto: 'Personal' },
  { a: '/listas/l-trabajo', texto: 'Trabajo' },
  { a: '/busqueda', texto: 'Buscar' },
  { a: '/papelera', texto: 'Papelera' },
  { a: '/configuracion', texto: 'Configuración' },
]

export default function Layout() {
  const listas = useAppStore((estado) => estado.datos.listas)

  return (
    <div className="flex min-h-screen">
      <aside className="hidden w-60 shrink-0 border-r border-slate-200 bg-white p-4 md:block dark:border-slate-800 dark:bg-slate-900">
        <p className="mb-6 text-lg font-semibold tracking-tight">TaskFlow Pro</p>
        <nav className="flex flex-col gap-1">
          {listas.map((lista) => (
            <NavLink
              key={lista.id}
              to={`/listas/${lista.id}`}
              className="rounded-lg px-3 py-2 text-sm hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              {lista.nombre}
            </NavLink>
          ))}
          {ENLACES.slice(2).map((enlace) => (
            <NavLink
              key={enlace.a}
              to={enlace.a}
              className="rounded-lg px-3 py-2 text-sm hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              {enlace.texto}
            </NavLink>
          ))}
        </nav>
      </aside>
      <main className="flex-1 p-6">
        <Outlet />
      </main>
    </div>
  )
}
