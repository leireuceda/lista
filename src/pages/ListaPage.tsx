import { useParams } from 'react-router-dom'
import { useAppStore } from '../stores/appStore'

export default function ListaPage() {
  const { listaId } = useParams()
  const lista = useAppStore((estado) => estado.datos.listas.find((l) => l.id === listaId))

  if (!lista) {
    return <p className="text-slate-500">La lista no existe.</p>
  }

  return (
    <section>
      <h1 className="text-2xl font-semibold tracking-tight">{lista.nombre}</h1>
      <p className="mt-1 text-sm text-slate-500">{lista.descripcion}</p>
      <p className="mt-6 rounded-xl border border-dashed border-slate-300 p-6 text-sm text-slate-500 dark:border-slate-700">
        Núcleo de tareas en construcción (Fase 3).
      </p>
    </section>
  )
}
