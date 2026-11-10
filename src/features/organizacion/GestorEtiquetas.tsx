import { useState, type FormEvent } from 'react'
import Boton from '../../components/ui/Boton'
import { useToast } from '../../components/ui/toastContexto'
import { useAppStore } from '../../stores/appStore'
import { actualizarEtiqueta, crearEtiqueta, eliminarEtiqueta } from './accionesOrganizacion'

export default function GestorEtiquetas() {
  const etiquetas = useAppStore((estado) => estado.datos.etiquetas)
  const { mostrar } = useToast()
  const [nombre, setNombre] = useState('')
  const [color, setColor] = useState('#6366f1')

  const agregar = (evento: FormEvent) => {
    evento.preventDefault()
    if (!nombre.trim()) return
    crearEtiqueta(nombre.trim(), color)
    setNombre('')
    mostrar('Etiqueta creada.', 'exito')
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
      <h3 className="text-sm font-semibold">Etiquetas</h3>
      <p className="mt-1 text-xs text-slate-500">Colores para clasificar tus tareas.</p>

      <ul className="mt-4 space-y-2">
        {etiquetas.map((etiqueta) => (
          <li key={etiqueta.id} className="flex items-center gap-2">
            <input
              type="color"
              aria-label={`Color de ${etiqueta.nombre}`}
              value={etiqueta.color}
              onChange={(evento) => actualizarEtiqueta(etiqueta.id, { color: evento.target.value })}
              className="size-7 cursor-pointer rounded border border-slate-300 bg-transparent"
            />
            <input
              aria-label={`Nombre de ${etiqueta.nombre}`}
              value={etiqueta.nombre}
              onChange={(evento) => actualizarEtiqueta(etiqueta.id, { nombre: evento.target.value })}
              className="min-w-0 flex-1 rounded-lg border border-transparent px-2 py-1 text-sm hover:border-slate-300 focus-visible:border-indigo-500 focus-visible:outline-none dark:hover:border-slate-700"
            />
            <Boton
              variante="fantasma"
              tamano="sm"
              aria-label={`Eliminar etiqueta ${etiqueta.nombre}`}
              onClick={() => {
                eliminarEtiqueta(etiqueta.id)
                mostrar('Etiqueta eliminada.', 'info')
              }}
            >
              ✕
            </Boton>
          </li>
        ))}
        {etiquetas.length === 0 && <li className="text-xs text-slate-500">Sin etiquetas.</li>}
      </ul>

      <form onSubmit={agregar} className="mt-4 flex items-center gap-2">
        <input
          value={nombre}
          onChange={(evento) => setNombre(evento.target.value)}
          placeholder="Nueva etiqueta"
          aria-label="Nombre de la nueva etiqueta"
          className="min-w-0 flex-1 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-950"
        />
        <input
          type="color"
          aria-label="Color de la nueva etiqueta"
          value={color}
          onChange={(evento) => setColor(evento.target.value)}
          className="size-9 cursor-pointer rounded border border-slate-300 bg-transparent"
        />
        <Boton type="submit" tamano="sm">
          Añadir
        </Boton>
      </form>
    </div>
  )
}
