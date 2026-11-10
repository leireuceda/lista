import { useEffect, useId, useRef, useState, type ReactNode } from 'react'
import { cx } from '../../lib/clases'

export interface OpcionDesplegable {
  id: string
  etiqueta: string
  activo?: boolean
  onSelect: () => void
}

interface Props {
  etiqueta: ReactNode
  ariaLabel: string
  opciones: OpcionDesplegable[]
  alineacion?: 'izquierda' | 'derecha'
  className?: string
}

export default function Desplegable({
  etiqueta,
  ariaLabel,
  opciones,
  alineacion = 'izquierda',
  className,
}: Props) {
  const [abierto, setAbierto] = useState(false)
  const contenedor = useRef<HTMLDivElement>(null)
  const idMenu = useId()

  useEffect(() => {
    if (!abierto) return
    const alClicarFuera = (evento: MouseEvent) => {
      if (!contenedor.current?.contains(evento.target as Node)) setAbierto(false)
    }
    const alPulsarTecla = (evento: KeyboardEvent) => {
      if (evento.key === 'Escape') setAbierto(false)
    }
    document.addEventListener('mousedown', alClicarFuera)
    document.addEventListener('keydown', alPulsarTecla)
    return () => {
      document.removeEventListener('mousedown', alClicarFuera)
      document.removeEventListener('keydown', alPulsarTecla)
    }
  }, [abierto])

  return (
    <div ref={contenedor} className={cx('relative', className)}>
      <button
        type="button"
        aria-label={ariaLabel}
        aria-haspopup="menu"
        aria-expanded={abierto}
        aria-controls={abierto ? idMenu : undefined}
        onClick={() => setAbierto((valor) => !valor)}
        className="inline-flex w-full items-center justify-between gap-2 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
      >
        <span className="truncate">{etiqueta}</span>
        <span aria-hidden="true" className="text-xs text-slate-400">
          ▾
        </span>
      </button>
      {abierto && (
        <ul
          id={idMenu}
          role="menu"
          className={cx(
            'absolute z-20 mt-1 min-w-44 overflow-hidden rounded-lg border border-slate-200 bg-white py-1 shadow-lg dark:border-slate-700 dark:bg-slate-900',
            alineacion === 'derecha' ? 'right-0' : 'left-0',
          )}
        >
          {opciones.map((opcion) => (
            <li key={opcion.id} role="none">
              <button
                role="menuitem"
                type="button"
                onClick={() => {
                  opcion.onSelect()
                  setAbierto(false)
                }}
                className={cx(
                  'flex w-full items-center gap-2 px-3 py-2 text-left text-sm hover:bg-slate-100 focus-visible:bg-slate-100 focus-visible:outline-none dark:hover:bg-slate-800 dark:focus-visible:bg-slate-800',
                  opcion.activo && 'font-semibold text-indigo-600 dark:text-indigo-400',
                )}
              >
                {opcion.activo && <span aria-hidden="true">✓</span>}
                {opcion.etiqueta}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
