import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import type { Tarea } from '../../types/modelo'
import TarjetaTarea from './TarjetaTarea'

interface Props {
  tarea: Tarea
  onEditar: (tarea: Tarea) => void
}

export default function TareaArrastrable({ tarea, onEditar }: Props) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: tarea.id,
  })

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={isDragging ? 'opacity-50' : undefined}
    >
      <div className="flex items-stretch gap-1">
        <button
          type="button"
          {...attributes}
          {...listeners}
          aria-label={`Reordenar ${tarea.titulo}`}
          className="cursor-grab touch-none rounded-lg px-1 text-slate-300 hover:bg-slate-100 hover:text-slate-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 active:cursor-grabbing dark:hover:bg-slate-800"
        >
          ⠿
        </button>
        <div className="min-w-0 flex-1">
          <TarjetaTarea tarea={tarea} onEditar={onEditar} />
        </div>
      </div>
    </div>
  )
}
