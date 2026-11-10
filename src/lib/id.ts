export function nuevoId(prefijo: string): string {
  return `${prefijo}-${crypto.randomUUID()}`
}
