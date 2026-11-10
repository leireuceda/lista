import { useLocation } from 'react-router-dom'
import { useTema } from '../../hooks/useTema'
import { useAppStore } from '../../stores/appStore'
import type { Tema } from '../../types/modelo'
import Desplegable from '../ui/Desplegable'

const TITULOS: Record<string, string> = {
  '/busqueda': 'Búsqueda',
  '/papelera': 'Papelera',
  '/configuracion': 'Configuración',
}

const TEMAS: Array<{ valor: Tema; etiqueta: string }> = [
  { valor: 'claro', etiqueta: '☀️ Claro' },
  { valor: 'oscuro', etiqueta: '🌙 Oscuro' },
  { valor: 'sistema', etiqueta: '💻 Sistema' },
]

export default function Cabecera({ alAbrirMenu }: { alAbrirMenu: () => void }) {
  const { pathname } = useLocation()
  const listas = useAppStore((estado) => estado.datos.listas)
  const usuario = useAppStore((estado) => estado.datos.usuario)
  const { tema, cambiar } = useTema()

  const listaId = pathname.match(/^\/listas\/([^/]+)/)?.[1]
  const titulo =
    TITULOS[pathname] ??
    listas.find((lista) => lista.id === listaId)?.nombre ??
    (pathname.startsWith('/compartido') ? 'Lista compartida' : 'TaskFlow Pro')

  const temaActual = TEMAS.find((opcion) => opcion.valor === tema)?.etiqueta ?? 'Sistema'

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between gap-3 border-b border-slate-200 bg-white/80 px-4 py-3 backdrop-blur dark:border-slate-800 dark:bg-slate-900/80">
      <div className="flex min-w-0 items-center gap-3">
        <button
          type="button"
          onClick={alAbrirMenu}
          aria-label="Abrir menú"
          className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 md:hidden dark:hover:bg-slate-800"
        >
          ☰
        </button>
        <h1 className="truncate text-base font-semibold tracking-tight">{titulo}</h1>
      </div>

      <div className="flex items-center gap-2">
        <Desplegable
          ariaLabel="Cambiar tema"
          etiqueta={temaActual}
          alineacion="derecha"
          className="w-36"
          opciones={TEMAS.map((opcion) => ({
            id: opcion.valor,
            etiqueta: opcion.etiqueta,
            activo: opcion.valor === tema,
            onSelect: () => cambiar(opcion.valor),
          }))}
        />
        <span
          title={usuario.email}
          className="grid size-9 place-items-center rounded-full bg-indigo-600 text-sm font-semibold text-white"
        >
          {usuario.nombre.slice(0, 1).toUpperCase()}
        </span>
      </div>
    </header>
  )
}
