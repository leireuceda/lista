import { useState, type FormEvent } from 'react'
import Boton from '../../components/ui/Boton'
import { useToast } from '../../components/ui/toastContexto'
import { useAppStore } from '../../stores/appStore'
import { actualizarCategoria, crearCategoria, eliminarCategoria } from './accionesOrganizacion'

export default function GestorCategorias() {
  const categorias = useAppStore((estado) => estado.datos.categorias)
  const { mostrar } = useToast()
  const [nombre, setNombre] = useState('')
  const [color, setColor] = useState('#0ea5e9')

  const agregar = (evento: FormEvent) => {
    evento.preventDefault()
    if (!nombre.trim()) return
    crearCategoria(nombre.trim(), color)
    setNombre('')
    mostrar('Categoría creada.', 'exito')
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
      <h3 className="text-sm font-semibold">Categorías</h3>
      <p className="mt-1 text-xs text-slate-500">Personal, Trabajo, Estudio o las que quieras.</p>

      <ul className="mt-4 space-y-2">
        {categorias.map((categoria) => (
          <li key={categoria.id} className="flex items-center gap-2">
            <input
              type="color"
              aria-label={`Color de ${categoria.nombre}`}
              value={categoria.color}
              onChange={(evento) => actualizarCategoria(categoria.id, { color: evento.target.value })}
              className="size-7 cursor-pointer rounded border border-slate-300 bg-transparent"
            />
            <input
              aria-label={`Nombre de ${categoria.nombre}`}
              value={categoria.nombre}
              onChange={(evento) => actualizarCategoria(categoria.id, { nombre: evento.target.value })}
              className="min-w-0 flex-1 rounded-lg border border-transparent px-2 py-1 text-sm hover:border-slate-300 focus-visible:border-indigo-500 focus-visible:outline-none dark:hover:border-slate-700"
            />
            <Boton
              variante="fantasma"
              tamano="sm"
              aria-label={`Eliminar categoría ${categoria.nombre}`}
              onClick={() => {
                eliminarCategoria(categoria.id)
                mostrar('Categoría eliminada.', 'info')
              }}
            >
              ✕
            </Boton>
          </li>
        ))}
        {categorias.length === 0 && <li className="text-xs text-slate-500">Sin categorías.</li>}
      </ul>

      <form onSubmit={agregar} className="mt-4 flex items-center gap-2">
        <input
          value={nombre}
          onChange={(evento) => setNombre(evento.target.value)}
          placeholder="Nueva categoría"
          aria-label="Nombre de la nueva categoría"
          className="min-w-0 flex-1 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-950"
        />
        <input
          type="color"
          aria-label="Color de la nueva categoría"
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
