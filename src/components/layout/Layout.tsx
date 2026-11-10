import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { useRecordatorios } from '../../hooks/useRecordatorios'
import { useTema } from '../../hooks/useTema'
import BarraLateral from './BarraLateral'
import Cabecera from './Cabecera'

export default function Layout() {
  useTema()
  useRecordatorios()
  const [menuAbierto, setMenuAbierto] = useState(false)

  return (
    <div className="min-h-screen md:flex">
      <aside className="hidden w-64 shrink-0 border-r border-slate-200 bg-white md:block dark:border-slate-800 dark:bg-slate-900">
        <div className="sticky top-0 h-screen">
          <BarraLateral />
        </div>
      </aside>

      {menuAbierto && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div
            className="absolute inset-0 bg-slate-950/50"
            onClick={() => setMenuAbierto(false)}
            aria-hidden="true"
          />
          <aside className="relative h-full w-72 border-r border-slate-200 bg-white shadow-xl dark:border-slate-800 dark:bg-slate-900">
            <BarraLateral alNavegar={() => setMenuAbierto(false)} />
            <button
              type="button"
              onClick={() => setMenuAbierto(false)}
              aria-label="Cerrar menú"
              className="absolute right-2 top-2 rounded-lg p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              ✕
            </button>
          </aside>
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        <Cabecera alAbrirMenu={() => setMenuAbierto(true)} />
        <main className="flex-1 p-4 md:p-6">
          <Outlet />
        </main>
        <footer className="border-t border-slate-200 px-4 py-3 text-xs text-slate-400 dark:border-slate-800">
          TaskFlow Pro · v{__APP_VERSION__} · datos locales en JSON
        </footer>
      </div>
    </div>
  )
}
