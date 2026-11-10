import { createContext, useContext } from 'react'

export type TipoToast = 'exito' | 'error' | 'info'

export interface Toast {
  id: string
  mensaje: string
  tipo: TipoToast
}

export interface ContextoToast {
  mostrar: (mensaje: string, tipo?: TipoToast) => void
}

export const ToastContext = createContext<ContextoToast | null>(null)

export function useToast(): ContextoToast {
  const contexto = useContext(ToastContext)
  if (!contexto) throw new Error('useToast debe usarse dentro de ToastProvider')
  return contexto
}
