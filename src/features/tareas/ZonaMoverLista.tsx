import { useDroppable } from '@dnd-kit/core'
import { useAppStore } from '../../stores/appStore'

interface Props {
  listaActualId: string
}

function ZonaLista({ id, nombre }: { id: string; nombre: string }) {
  const { setNodeRef, isOver } = useDroppable({ id })
  return (
    <span
      ref={setNodeRef}
      className={`rounded-full border px-3 py-1 text-xs font-medium transition ${
        isOver
          ? 'border-indigo-500 bg-indigo-50 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-200'
          : 'border-slate-300 text-slate-500 dark:border-slate-700'
      }`}
    >
      {nombre}
    </span>
  )
}

export default function ZonaMoverLista({ listaActualId }: Props) {
  const listas = useAppStore((estado) => estado.datos.listas)
  const otras = listas.filter((lista) => lista.id !== listaActualId)

  if (otras.length === 0) return null

  return (
    <div className="mt-4 rounded-xl border border-dashed border-slate-300 p-3 dark:border-slate-700">
      <p className="mb-2 text-xs text-slate-500">
        Arrastra una tarea aquí para moverla a otra lista:
      </p>
      <div className="flex flex-wrap gap-2">
        {otras.map((lista) => (
          <ZonaLista key={lista.id} id={`lista-${lista.id}`} nombre={lista.nombre} />
        ))}
      </div>
    </div>
  )
}
