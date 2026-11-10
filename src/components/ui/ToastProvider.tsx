import { useCallback, useRef, useState, type ReactNode } from 'react'
import { cx } from '../../lib/clases'
import { nuevoId } from '../../lib/id'
import { ToastContext, type TipoToast, type Toast } from './toastContexto'

const ESTILOS: Record<TipoToast, string> = {
  exito: 'border-emerald-300 bg-emerald-50 text-emerald-800 dark:border-emerald-700 dark:bg-emerald-950 dark:text-emerald-200',
  error: 'border-red-300 bg-red-50 text-red-800 dark:border-red-700 dark:bg-red-950 dark:text-red-200',
  info: 'border-slate-300 bg-white text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200',
}

export default function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])
  const temporizadores = useRef<number[]>([])

  const mostrar = useCallback((mensaje: string, tipo: TipoToast = 'info') => {
    const id = nuevoId('toast')
    setToasts((actuales) => [...actuales, { id, mensaje, tipo }])
    const temporizador = window.setTimeout(() => {
      setToasts((actuales) => actuales.filter((toast) => toast.id !== id))
    }, 3500)
    temporizadores.current.push(temporizador)
  }, [])

  return (
    <ToastContext.Provider value={{ mostrar }}>
      {children}
      <div
        aria-live="polite"
        aria-atomic="false"
        className="pointer-events-none fixed inset-x-0 bottom-4 z-50 flex flex-col items-center gap-2 px-4"
      >
        {toasts.map((toast) => (
          <div
            key={toast.id}
            role="status"
            className={cx(
              'pointer-events-auto w-full max-w-sm rounded-lg border px-4 py-3 text-sm shadow-lg',
              ESTILOS[toast.tipo],
            )}
          >
            {toast.mensaje}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}
