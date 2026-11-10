import Boton from '../components/ui/Boton'
import ExportarImportar from '../features/configuracion/ExportarImportar'
import GestorCategorias from '../features/organizacion/GestorCategorias'
import GestorEtiquetas from '../features/organizacion/GestorEtiquetas'
import { useNotificaciones } from '../hooks/useNotificaciones'
import { useTema } from '../hooks/useTema'
import { useAppStore } from '../stores/appStore'
import type { Tema } from '../types/modelo'

const OPCIONES_TEMA: Array<{ valor: Tema; etiqueta: string; descripcion: string }> = [
  { valor: 'claro', etiqueta: 'Claro', descripcion: 'Fondo luminoso' },
  { valor: 'oscuro', etiqueta: 'Oscuro', descripcion: 'Ideal de noche' },
  { valor: 'sistema', etiqueta: 'Sistema', descripcion: 'Sigue al dispositivo' },
]

export default function ConfiguracionPage() {
  const { tema, cambiar } = useTema()
  const { soportado, permiso, solicitar, notificar } = useNotificaciones()
  const notificaciones = useAppStore((estado) => estado.datos.preferencias.notificaciones)
  const actualizar = useAppStore((estado) => estado.actualizar)

  const alternarNotificaciones = () => {
    actualizar((datos) => ({
      ...datos,
      preferencias: { ...datos.preferencias, notificaciones: !datos.preferencias.notificaciones },
    }))
  }

  return (
    <section className="mx-auto max-w-2xl space-y-8">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">Configuración</h2>
        <p className="mt-1 text-sm text-slate-500">Ajusta la apariencia y las alertas.</p>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
        <h3 className="text-sm font-semibold">Apariencia</h3>
        <div className="mt-3 grid gap-2 sm:grid-cols-3">
          {OPCIONES_TEMA.map((opcion) => (
            <button
              key={opcion.valor}
              type="button"
              onClick={() => cambiar(opcion.valor)}
              aria-pressed={tema === opcion.valor}
              className={`rounded-xl border p-3 text-left text-sm transition ${
                tema === opcion.valor
                  ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-500/10'
                  : 'border-slate-200 hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800'
              }`}
            >
              <span className="block font-medium">{opcion.etiqueta}</span>
              <span className="text-xs text-slate-500">{opcion.descripcion}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
        <h3 className="text-sm font-semibold">Notificaciones</h3>
        <p className="mt-1 text-sm text-slate-500">
          {soportado
            ? `Permiso del navegador: ${permiso === 'granted' ? 'concedido' : permiso === 'denied' ? 'denegado' : 'sin solicitar'}.`
            : 'Tu navegador no soporta la Web Notifications API.'}
        </p>

        <label className="mt-4 flex items-center justify-between gap-4 text-sm">
          <span>Recordatorios de tareas con vencimiento</span>
          <input
            type="checkbox"
            checked={notificaciones}
            onChange={alternarNotificaciones}
            disabled={!soportado}
            className="size-4 accent-indigo-600"
          />
        </label>

        <div className="mt-4 flex flex-wrap gap-2">
          <Boton variante="secundario" onClick={solicitar} disabled={!soportado}>
            Solicitar permiso
          </Boton>
          <Boton
            variante="secundario"
            onClick={() => notificar('TaskFlow Pro', '¡Las notificaciones funcionan!')}
            disabled={!soportado || permiso !== 'granted'}
          >
            Enviar prueba
          </Boton>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <GestorEtiquetas />
        <GestorCategorias />
      </div>

      <ExportarImportar />
    </section>
  )
}
