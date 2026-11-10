# AGENTS.md — TaskFlow Pro

Guía obligatoria para cualquier agente o persona que trabaje en este repositorio.

## Proyecto

**TaskFlow Pro** es una aplicación web de gestión de tareas (inspirada en Todoist/Notion) con rutas en español, notificaciones nativas, etiquetas, prioridades, estados reversibles, papelera y compartición de listas en modo lectura/escritura. Funciona en línea con persistencia basada en JSON (sin base de datos relacional).

- **Repositorio:** https://github.com/leireuceda/lista.git
- **Rama de integración:** `develop` · **Producción:** `main` (bloqueada hasta el release final)

### Documentos clave

| Documento | Contenido |
| --------- | --------- |
| `documento_prd_aplicaciondetareas.md` | Requisitos funcionales (RF-01…RF-11), no funcionales y DoD |
| `plan-desarrollo.md` | Plan por fases, tareas y estado de avance (fuente de verdad del progreso) |
| `.opencode/skills/planificador-tareas/SKILL.md` | Reglas operativas de fases, ramas y versiones |

## Stack

- **React 19** + **Vite** + **TypeScript** (modo `strict`).
- **React Router** con rutas en español (`/listas/:lista`, `/papelera`, `/busqueda`, `/configuracion`, `/compartido/:id`).
- **Tailwind CSS** con modo claro/oscuro.
- **Zustand** o Context API para estado global.
- Persistencia JSON: `localStorage` + backend ligero (JSON Server / Express con archivos `.json`).
- **@dnd-kit** para Drag and Drop.
- **Web Notifications API**.
- Tests con **Vitest** + Testing Library.

## Estructura objetivo

```text
src/
├── app/            # rutas, layout y providers
├── components/     # UI reutilizable (Button, Modal, Dropdown…)
├── features/       # tareas, listas, etiquetas, busqueda, compartido
├── lib/            # persistencia, utilidades, validaciones
├── stores/         # estado global
├── types/          # tipos e interfaces del modelo JSON
└── data/           # esquema y datos semilla
```

## Reglas de trabajo

### Fases, ramas y versiones

1. Se trabaja **una fase a la vez**, según `plan-desarrollo.md`. No se adelanta trabajo de fases posteriores.
2. Cada fase nace de `develop` en su rama `feat/fase-N-*` y se fusiona **solo** a `develop` con `--no-ff`.
3. `main` no recibe merges hasta que todas las fases estén validadas y exista un "OK" explícito del usuario.
4. SemVer siempre `0.y.z`; **prohibido** `1.0.0` o superior. Una fase = una versión menor (`0.1.0` … `0.6.0`).
5. Al cerrar una fase: actualizar `plan-desarrollo.md` (tareas `- [x]`, estado ✅, contadores), tag `v0.y.0` y esperar confirmación.

### Tamaño de archivos (límite duro)

- **Ningún archivo de código debe superar las 200 líneas.**
- Si un archivo se acerca al límite, dividir antes de seguir añadiendo lógica:
  - Extraer componentes de UI a `src/components/`.
  - Extraer lógica de estado a hooks (`useX`) o a `src/stores/`.
  - Extraer utilidades puras a `src/lib/`.
  - Extraer tipos a `src/types/`.
- Excepciones: archivos generados, `package-lock.json` y datos semilla JSON.
- Un archivo que supere 200 líneas se considera un defecto a corregir en la misma tarea, no deuda técnica aceptable.

### Convenciones de código

- TypeScript estricto; evitar `any` (usar tipos del modelo en `src/types/`).
- Componentes funcionales y hooks; sin clases.
- Componentes y archivos de componentes en `PascalCase` (`TaskCard.tsx`); hooks `useAlgo`; constantes `UPPER_SNAKE_CASE`.
- Una responsabilidad por archivo/módulo; exports nombrados salvo el componente de página.
- Textos visibles, rutas y mensajes al usuario **en español**.
- Fechas en ISO 8601 (`YYYY-MM-DDTHH:mm:ss.sssZ`); IDs con `crypto.randomUUID()`.
- Accesibilidad: navegación por teclado, foco visible, `aria-*` en desplegables y modales.
- Sin `console.log` en código de producción.

### Git

- Commits en **Conventional Commits** (`feat:`, `fix:`, `docs:`, `chore:`, `refactor:`, `test:`), en español y en imperativo.
- Un commit = un cambio coherente. No mezclar fases ni refactors ajenos.
- No reescribir ni reetiquetar historia ya integrada en `develop`.

## Comandos

```text
npm install          # dependencias
npm run dev          # servidor de desarrollo
npm run build        # build de producción
npm run lint         # ESLint
npm run test         # Vitest
npm run test -- --coverage
```

## Prohibiciones

- ❌ Merge directo de una rama de fase a `main`.
- ❌ Versiones o tags `>= 1.0.0`.
- ❌ Desarrollar varias fases en una interacción.
- ❌ Archivos de código con más de 200 líneas.
- ❌ Eliminar datos de usuario sin pasar por la papelera.
- ❌ Añadir dependencias sin justificarlas en el commit.
