import { Link } from 'react-router-dom'

export default function NoEncontradaPage() {
  return (
    <section>
      <h1 className="text-2xl font-semibold tracking-tight">Página no encontrada</h1>
      <p className="mt-2 text-sm text-slate-500">La ruta que buscas no existe.</p>
      <Link className="mt-6 inline-block text-sm font-medium text-indigo-600" to="/">
        Volver al inicio
      </Link>
    </section>
  )
}
