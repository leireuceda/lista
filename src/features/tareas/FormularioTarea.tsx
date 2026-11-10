import { useEffect, useState, type FormEvent } from 'react'
import { desdeInputFecha, aValorInputFecha } from '../../lib/fechas'
import { useAppStore } from '../../stores/appStore'
import { crearTarea, editarTarea, type EntradaTarea } from '../../stores/accionesTareas'
import type { Prioridad, Tarea } from '../../types/modelo'
import Boton from '../../components/ui/Boton'
import Modal from '../../components/ui/Modal'
import { useToast } from '../../components/ui/toastContexto'
import SelectorEtiquetas from './SelectorEtiquetas'

interface Props {
  abierto: boolean
  listaId: string
  tarea?: Tarea | null
  onCerrar: () => void
}

const VACIA = {
  titulo: '',
  descripcion: '',
  vencimiento: '',
  categoriaId: '',
  etiquetaIds: [] as string[],
  prioridad: 'media' as Prioridad,
  listaId: '',
}

export default function FormularioTarea({ abierto, listaId, tarea, onCerrar }: Props) {
  const listas = useAppStore((estado) => estado.datos.listas)
  const categorias = useAppStore((estado) => estado.datos.categorias)
  const etiquetas = useAppStore((estado) => estado.datos.etiquetas)
  const { mostrar } = useToast()
  const [formulario, setFormulario] = useState(VACIA)

  useEffect(() => {
    if (!abierto) return
    setFormulario(
      tarea
        ? {
            titulo: tarea.titulo,
            descripcion: tarea.descripcion,
            vencimiento: aValorInputFecha(tarea.vencimiento),
            categoriaId: tarea.categoriaId ?? '',
            etiquetaIds: tarea.etiquetaIds,
            prioridad: tarea.prioridad,
            listaId: tarea.listaId,
          }
        : { ...VACIA, listaId },
    )
  }, [abierto, tarea, listaId])

  const cambiar = <C extends keyof typeof formulario>(campo: C, valor: (typeof formulario)[C]) =>
    setFormulario((actual) => ({ ...actual, [campo]: valor }))

  const alternarEtiqueta = (id: string) =>
    setFormulario((actual) => ({
      ...actual,
      etiquetaIds: actual.etiquetaIds.includes(id)
        ? actual.etiquetaIds.filter((etiqueta) => etiqueta !== id)
        : [...actual.etiquetaIds, id],
    }))

  const enviar = (evento: FormEvent) => {
    evento.preventDefault()
    if (!formulario.titulo.trim()) {
      mostrar('El título es obligatorio.', 'error')
      return
    }
    const entrada: EntradaTarea = {
      listaId: formulario.listaId || listaId,
      titulo: formulario.titulo,
      descripcion: formulario.descripcion,
      vencimiento: desdeInputFecha(formulario.vencimiento),
      categoriaId: formulario.categoriaId || null,
      etiquetaIds: formulario.etiquetaIds,
      prioridad: formulario.prioridad,
    }
    if (tarea) {
      editarTarea(tarea.id, entrada)
      mostrar('Tarea actualizada.', 'exito')
    } else {
      crearTarea(entrada)
      mostrar('Tarea creada.', 'exito')
    }
    onCerrar()
  }

  const claseCampo =
    'w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 dark:border-slate-700 dark:bg-slate-950'

  return (
    <Modal
      abierto={abierto}
      titulo={tarea ? 'Editar tarea' : 'Nueva tarea'}
      onCerrar={onCerrar}
    >
      <form onSubmit={enviar} className="space-y-4">
        <label className="block text-sm">
          <span className="mb-1 block font-medium">Título</span>
          <input
            autoFocus
            required
            value={formulario.titulo}
            onChange={(evento) => cambiar('titulo', evento.target.value)}
            className={claseCampo}
            placeholder="¿Qué hay que hacer?"
          />
        </label>

        <label className="block text-sm">
          <span className="mb-1 block font-medium">Descripción</span>
          <textarea
            rows={3}
            value={formulario.descripcion}
            onChange={(evento) => cambiar('descripcion', evento.target.value)}
            className={claseCampo}
            placeholder="Detalles opcionales"
          />
        </label>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block text-sm">
            <span className="mb-1 block font-medium">Lista</span>
            <select
              value={formulario.listaId}
              onChange={(evento) => cambiar('listaId', evento.target.value)}
              className={claseCampo}
            >
              {listas.map((lista) => (
                <option key={lista.id} value={lista.id}>
                  {lista.nombre}
                </option>
              ))}
            </select>
          </label>

          <label className="block text-sm">
            <span className="mb-1 block font-medium">Categoría</span>
            <select
              value={formulario.categoriaId}
              onChange={(evento) => cambiar('categoriaId', evento.target.value)}
              className={claseCampo}
            >
              <option value="">Sin categoría</option>
              {categorias.map((categoria) => (
                <option key={categoria.id} value={categoria.id}>
                  {categoria.nombre}
                </option>
              ))}
            </select>
          </label>

          <label className="block text-sm">
            <span className="mb-1 block font-medium">Vencimiento</span>
            <input
              type="datetime-local"
              value={formulario.vencimiento}
              onChange={(evento) => cambiar('vencimiento', evento.target.value)}
              className={claseCampo}
            />
          </label>

          <label className="block text-sm">
            <span className="mb-1 block font-medium">Prioridad</span>
            <select
              value={formulario.prioridad}
              onChange={(evento) => cambiar('prioridad', evento.target.value as Prioridad)}
              className={claseCampo}
            >
              <option value="baja">Baja</option>
              <option value="media">Media</option>
              <option value="alta">Alta</option>
              <option value="urgente">Urgente</option>
            </select>
          </label>
        </div>

        <SelectorEtiquetas
          etiquetas={etiquetas}
          seleccionadas={formulario.etiquetaIds}
          onAlternar={alternarEtiqueta}
        />

        <div className="flex justify-end gap-2 pt-2">
          <Boton variante="secundario" onClick={onCerrar}>
            Cancelar
          </Boton>
          <Boton type="submit">{tarea ? 'Guardar cambios' : 'Crear tarea'}</Boton>
        </div>
      </form>
    </Modal>
  )
}
