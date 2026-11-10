import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import Insignia from '../components/ui/Insignia'
import { formatearFechaHora } from '../lib/fechas'
import { useSincronizacion } from '../hooks/useSincronizacion'
import { useTema } from '../hooks/useTema'
import { useAppStore } from '../stores/appStore'
import ListaTareas from '../features/tareas/ListaTareas'
import ListaTareasSoloLectura from '../features/compartido/ListaTareasSoloLectura'
import { registrarAcceso } from '../features/compartido/accionesComparticion'

export default function CompartidoPage() {
  useTema()
  useSincronizacion()
  const { token } = useParams()
  const comparticion = useAppStore((estado) =>
    estado.datos.comparticiones.find(
      (item) => item.token === token && item.revocadaEn === null,
    ),
  )
  const lista = useAppStore((estado) =>
    estado.datos.listas.find((item) => item.id === comparticion?.listaId),
  )

  const idComparticion = comparticion?.id

  useEffect(() => {
    if (idComparticion) registrarAcceso(idComparticion)
  }, [idComparticion])

  if (!comparticion || !lista) {
    return (
      <div className="mx-auto max-w-xl p-8 text-center">
        <h1 className="text-xl font-semibold">Enlace no válido</h1>
        <p className="mt-2 text-sm text-slate-500">
          Este enlace no existe o ha sido revocado por su propietario.
        </p>
      </div>
    )
  }

  const editable = comparticion.permiso === 'escritura'

  return (
    <div className="mx-auto max-w-3xl p-4 md:p-8">
      <header className="mb-6">
        <p className="text-xs uppercase tracking-wide text-slate-400">Lista compartida</p>
        <div className="mt-1 flex flex-wrap items-center gap-2">
          <h1 className="text-2xl font-semibold tracking-tight">{lista.nombre}</h1>
          <Insignia tono={editable ? 'indigo' : 'neutro'}>
            {editable ? 'Lectura y escritura' : 'Solo lectura'}
          </Insignia>
        </div>
        <p className="mt-1 text-sm text-slate-500">{lista.descripcion}</p>
        <p className="mt-1 text-xs text-slate-400">
          Último acceso a este enlace: {formatearFechaHora(comparticion.ultimoAcceso)}
        </p>
      </header>

      {editable ? (
        <ListaTareas listaId={lista.id} compartida />
      ) : (
        <ListaTareasSoloLectura listaId={lista.id} />
      )}
    </div>
  )
}
