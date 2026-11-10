import type { ReactNode } from 'react'
import { cx } from '../../lib/clases'

type Tono = 'neutro' | 'indigo' | 'verde' | 'ambar' | 'rojo'

interface Props {
  children: ReactNode
  tono?: Tono
  color?: string
  className?: string
}

const TONOS: Record<Tono, string> = {
  neutro: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300',
  indigo: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-300',
  verde: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300',
  ambar: 'bg-amber-100 text-amber-800 dark:bg-amber-500/20 dark:text-amber-300',
  rojo: 'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-300',
}

export default function Insignia({ children, tono = 'neutro', color, className }: Props) {
  return (
    <span
      className={cx(
        'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium',
        !color && TONOS[tono],
        className,
      )}
      style={color ? { backgroundColor: `${color}22`, color } : undefined}
    >
      {children}
    </span>
  )
}
