import type { Etiqueta } from '../../types/modelo'

interface Props {
  etiquetas: Etiqueta[]
  seleccionadas: string[]
  onAlternar: (id: string) => void
}

export default function SelectorEtiquetas({ etiquetas, seleccionadas, onAlternar }: Props) {
  return (
    <fieldset>
      <legend className="mb-2 text-sm font-medium">Etiquetas</legend>
      <div className="flex flex-wrap gap-2">
        {etiquetas.map((etiqueta) => {
          const activa = seleccionadas.includes(etiqueta.id)
          return (
            <button
              key={etiqueta.id}
              type="button"
              aria-pressed={activa}
              onClick={() => onAlternar(etiqueta.id)}
              className={`rounded-full border px-3 py-1 text-xs font-medium transition ${
                activa ? 'border-transparent text-white' : 'border-slate-300 text-slate-600'
              }`}
              style={activa ? { backgroundColor: etiqueta.color } : undefined}
            >
              {etiqueta.nombre}
            </button>
          )
        })}
      </div>
    </fieldset>
  )
}
