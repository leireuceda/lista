import { useEffect, useRef, type ReactNode } from 'react'

interface Props {
  abierto: boolean
  titulo: string
  onCerrar: () => void
  children: ReactNode
  acciones?: ReactNode
}

export default function Modal({ abierto, titulo, onCerrar, children, acciones }: Props) {
  const cerrarRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!abierto) return
    const focoPrevio = document.activeElement as HTMLElement | null
    cerrarRef.current?.focus()
    const alPulsarTecla = (evento: KeyboardEvent) => {
      if (evento.key === 'Escape') onCerrar()
    }
    document.addEventListener('keydown', alPulsarTecla)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', alPulsarTecla)
      document.body.style.overflow = ''
      focoPrevio?.focus()
    }
  }, [abierto, onCerrar])

  if (!abierto) return null

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-950/50" onClick={onCerrar} aria-hidden="true" />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={titulo}
        className="relative z-10 w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-5 shadow-xl dark:border-slate-800 dark:bg-slate-900"
      >
        <div className="mb-4 flex items-start justify-between gap-4">
          <h2 className="text-lg font-semibold tracking-tight">{titulo}</h2>
          <button
            ref={cerrarRef}
            type="button"
            onClick={onCerrar}
            aria-label="Cerrar"
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 dark:hover:bg-slate-800"
          >
            ✕
          </button>
        </div>
        {children}
        {acciones && <div className="mt-6 flex justify-end gap-2">{acciones}</div>}
      </div>
    </div>
  )
}
