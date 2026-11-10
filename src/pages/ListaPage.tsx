import { useParams } from 'react-router-dom'
import ListaTareas from '../features/tareas/ListaTareas'
import { useAppStore } from '../stores/appStore'

export default function ListaPage() {
  const { listaId } = useParams()
  const listas = useAppStore((estado) => estado.datos.listas)
  const lista = listas.find((item) => item.id === listaId)

  if (!lista) {
    return <p className="text-slate-500">La lista no existe.</p>
  }

  return (
    <div className="mx-auto max-w-3xl">
      <header className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight">{lista.nombre}</h1>
        <p className="mt-1 text-sm text-slate-500">{lista.descripcion}</p>
      </header>
      <ListaTareas listaId={lista.id} />
    </div>
  )
}
