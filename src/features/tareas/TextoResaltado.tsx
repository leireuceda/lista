interface Props {
  texto: string
  consulta: string
}

export default function TextoResaltado({ texto, consulta }: Props) {
  const limpia = consulta.trim()
  if (!limpia) return <>{texto}</>

  const indice = texto.toLowerCase().indexOf(limpia.toLowerCase())
  if (indice === -1) return <>{texto}</>

  return (
    <>
      {texto.slice(0, indice)}
      <mark className="rounded bg-amber-200 px-0.5 text-slate-900 dark:bg-amber-400/40 dark:text-slate-100">
        {texto.slice(indice, indice + limpia.length)}
      </mark>
      {texto.slice(indice + limpia.length)}
    </>
  )
}
