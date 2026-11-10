import { useMemo, useState } from 'react'
import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from '@dnd-kit/core'
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import Boton from '../../components/ui/Boton'
import { useToast } from '../../components/ui/toastContexto'
import { contarFiltrosActivos, FILTROS_VACIOS, filtrarTareas } from '../../lib/filtros'
import { useAppStore } from '../../stores/appStore'
import { moverTareaALista, reordenarTareas } from '../../stores/accionesReordenar'
import type { Tarea } from '../../types/modelo'
import FiltrosTareas from './FiltrosTareas'
import FormularioTarea from './FormularioTarea'
import TareaArrastrable from './TareaArrastrable'
import TarjetaTarea from './TarjetaTarea'
import ZonaMoverLista from './ZonaMoverLista'

interface Props {
  listaId: string
}

export default function ListaTareas({ listaId }: Props) {
  const tareas = useAppStore((estado) => estado.datos.tareas)
  const { mostrar } = useToast()
  const [formularioAbierto, setFormularioAbierto] = useState(false)
  const [editando, setEditando] = useState<Tarea | null>(null)
  const [filtros, setFiltros] = useState(FILTROS_VACIOS)
  const [arrastrando, setArrastrando] = useState<string | null>(null)

  const sensores = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  )

  const visibles = useMemo(
    () =>
      filtrarTareas(tareas, filtros)
        .filter((tarea) => tarea.listaId === listaId)
        .sort((a, b) => {
          if (a.estado === 'completada' && b.estado !== 'completada') return 1
          if (b.estado === 'completada' && a.estado !== 'completada') return -1
          return a.orden - b.orden
        }),
    [tareas, listaId, filtros],
  )

  const pendientes = visibles.filter((tarea) => tarea.estado !== 'completada').length
  const filtrosActivos = contarFiltrosActivos(filtros) > 0

  const alEmpezarArrastre = ({ active }: DragStartEvent) => setArrastrando(String(active.id))

  const alTerminarArrastre = ({ active, over }: DragEndEvent) => {
    setArrastrando(null)
    if (!over) return
    const destino = String(over.id)
    if (destino.startsWith('lista-')) {
      moverTareaALista(String(active.id), destino.slice('lista-'.length))
      mostrar('Tarea movida a otra lista.', 'exito')
      return
    }
    if (active.id === over.id) return
    const ids = visibles.map((tarea) => tarea.id)
    const desde = ids.indexOf(String(active.id))
    const hasta = ids.indexOf(destino)
    if (desde === -1 || hasta === -1) return
    reordenarTareas(arrayMove(ids, desde, hasta))
  }

  const abrirNueva = () => {
    setEditando(null)
    setFormularioAbierto(true)
  }

  const abrirEdicion = (tarea: Tarea) => {
    setEditando(tarea)
    setFormularioAbierto(true)
  }

  const tarjetas = (
    <div className="space-y-2">
      {visibles.map((tarea) =>
        filtrosActivos ? (
          <TarjetaTarea key={tarea.id} tarea={tarea} onEditar={abrirEdicion} />
        ) : (
          <TareaArrastrable key={tarea.id} tarea={tarea} onEditar={abrirEdicion} />
        ),
      )}
    </div>
  )

  return (
    <section>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">Tareas</h2>
          <p className="mt-1 text-sm text-slate-500">
            {pendientes} pendiente{pendientes === 1 ? '' : 's'} · {visibles.length} en total
          </p>
        </div>
        <Boton onClick={abrirNueva}>+ Nueva tarea</Boton>
      </div>

      <div className="mb-4">
        <FiltrosTareas filtros={filtros} onCambiar={setFiltros} />
      </div>

      {visibles.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-300 p-10 text-center dark:border-slate-700">
          <p className="text-sm text-slate-500">No hay tareas en esta lista todavía.</p>
          <Boton variante="secundario" className="mt-4" onClick={abrirNueva}>
            Crear la primera
          </Boton>
        </div>
      ) : (
        <>
          {filtrosActivos ? (
            <>
              <p className="mb-2 text-xs text-slate-500">
                Limpia los filtros para reordenar las tareas.
              </p>
              {tarjetas}
            </>
          ) : (
            <DndContext
              sensors={sensores}
              collisionDetection={closestCenter}
              onDragStart={alEmpezarArrastre}
              onDragEnd={alTerminarArrastre}
              accessibility={{
                screenReaderInstructions: {
                  draggable:
                    'Pulsa espacio para coger una tarea. Usa las flechas para moverla y espacio para soltarla.',
                },
                announcements: {
                  onDragStart: ({ active }) => `Tarea ${String(active.id)} cogida.`,
                  onDragOver: ({ over }) =>
                    over ? `Sobre ${String(over.id)}.` : 'Fuera de una zona válida.',
                  onDragEnd: ({ over }) =>
                    over ? `Soltada en ${String(over.id)}.` : 'Tarea soltada.',
                  onDragCancel: () => 'Movimiento cancelado.',
                },
              }}
            >
              <SortableContext
                items={visibles.map((tarea) => tarea.id)}
                strategy={verticalListSortingStrategy}
              >
                {tarjetas}
              </SortableContext>
              <ZonaMoverLista listaActualId={listaId} />
            </DndContext>
          )}
          {arrastrando && <span className="sr-only">Arrastrando tarea</span>}
        </>
      )}

      <FormularioTarea
        abierto={formularioAbierto}
        listaId={listaId}
        tarea={editando}
        onCerrar={() => setFormularioAbierto(false)}
      />
    </section>
  )
}
