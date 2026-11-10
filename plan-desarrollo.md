# Plan de Desarrollo — TaskFlow Pro

> Documento vivo. Se actualiza al cerrar cada fase. Fuente de requisitos: `documento_prd_aplicaciondetareas.md`.
> Reglas operativas: `.opencode/skills/planificador-tareas/SKILL.md`.

## 1. Estado del proyecto

| Campo | Valor |
| ----- | ----- |
| Repositorio | https://github.com/leireuceda/lista.git |
| Rama de integración | `develop` |
| Rama de producción | `main` (intacta hasta el release final) |
| Fase activa | **Completada — release `v0.6.0` en `main`** |
| Versión actual | `0.6.1` (parche de despliegue) |
| Última fase validada | Fase 6 — `v0.6.0` (2026-11-10) |
| Progreso global | 35 / 35 tareas · 6 / 6 fases |

### Leyenda de seguimiento

| Marca | Significado |
| ----- | ----------- |
| ⬜ Pendiente | La fase/tarea no ha empezado |
| 🟨 En curso | Fase activa o tarea en desarrollo |
| ✅ Completada | Validada (fase) o terminada (tarea) |
| 🔒 Bloqueado | No permitido todavía (p. ej. release a `main`) |

**Regla de actualización:** cada vez que se termina una tarea se marca `- [x]` en este documento; al cerrar una fase se actualizan su estado (✅), el contador `Tareas: n/total`, el "Progreso global" y el "Registro de cierre", y se commitea con `docs(plan): ...`.

## 2. Reglas no negociables

1. Una interacción = una fase. No se adelanta trabajo de fases posteriores.
2. Cada fase nace de `develop` en su propia rama `feat/fase-N-*` y se fusiona **solo** a `develop` con `--no-ff`.
3. `main` no recibe merges hasta que todas las fases estén validadas y el usuario dé el "OK" explícito.
4. SemVer siempre `0.y.z`: nunca `1.0.0` ni superior. Una fase = una versión menor; los parches se reservan a correcciones.
5. Al cerrar cada fase: resumen, tag `v0.y.0` y espera de confirmación del usuario.
6. Toda la interfaz, rutas y textos visibles en español.

## 3. Stack objetivo (según PRD)

- React 19 + Vite + TypeScript.
- React Router (rutas en español).
- Tailwind CSS (modo claro/oscuro).
- Estado global con Context API o Zustand.
- Persistencia JSON: `localStorage` + backend ligero JSON (JSON Server / Express con archivos `.json`), exportación/importación `.json`.
- Drag and Drop con `@dnd-kit/core`.
- Web Notifications API.

## 4. Mapa de fases

| # | Fase | Rama | Versión | Tareas | Requisitos | Estado |
| - | ---- | ---- | ------- | ------ | ---------- | ------ |
| 1 | Arquitectura, modelado JSON y configuración base | `feat/fase-1-arquitectura` | `0.1.0` | 7/7 | RNF-02, RF-01 (base) | ✅ Completada |
| 2 | Layout base, interfaz moderna y notificaciones | `feat/fase-2-layout-ui` | `0.2.0` | 6/6 | RF-01, RF-02, RF-11, RNF-03 | ✅ Completada |
| 3 | Núcleo de tareas, estados reversibles y papelera | `feat/fase-3-core-tareas` | `0.3.0` | 6/6 | RF-03, RF-04, RF-05 | ✅ Completada |
| 4 | Organización avanzada y buscador global | `feat/fase-4-organizacion-busqueda` | `0.4.0` | 5/5 | RF-07, RF-08 | ✅ Completada |
| 5 | Interactividad visual (Drag and Drop) | `feat/fase-5-drag-and-drop` | `0.5.0` | 5/5 | RF-06, RNF-01 | ✅ Completada |
| 6 | Colaboración en línea y compartición de listas | `feat/fase-6-colaboracion` | `0.6.0` | 6/6 | RF-09, RF-10 | ✅ Completada |
| — | Release final a `main` | `develop` → `main` | `v0.6.0` | — | DoD completo | 🔒 Bloqueado |

---

## 5. Fases detalladas

### Fase 1 — Arquitectura, modelado JSON y configuración base

- **Rama:** `feat/fase-1-arquitectura` · **Versión:** `0.1.0`
- **Objetivo:** definir el contrato de datos JSON y dejar el proyecto React 19 compilando con rutas en español.
- **Estado:** ✅ Completada · **Tareas:** 7/7

**Tareas**
- [x] Inicializar proyecto con Vite + React 19 + TypeScript.
- [x] Configurar Tailwind CSS y estructura de carpetas (`src/features`, `src/components`, `src/lib`, `src/types`).
- [x] Definir tipos e interfaces del modelo JSON: `Tarea`, `Lista`, `Etiqueta`, `Categoria`, `Estado`, `Usuario`, `PermisoComparticion`.
- [x] Crear `src/data/esquema.json` + datos semilla (`semilla.json`) coherentes con los tipos.
- [x] Implementar capa de persistencia (`localStorage` + adaptador JSON) y exportación/importación `.json` (RNF-02).
- [x] Configurar React Router con rutas en español: `/listas/:lista`, `/papelera`, `/busqueda`, `/configuracion`, `/compartido/:id`.
- [x] Añadir `package.json` en `0.1.0`, ESLint/Prettier y scripts (`dev`, `build`, `lint`).

**Entregables:** esquema JSON documentado, seed de ejemplo, proyecto arrancando, rutas navegables (placeholders).
**Criterios de aceptación:** `npm run build` sin errores; las 5 rutas responden; exportar e importar el seed restaura el estado idéntico; sin lógica de tareas todavía.

```text
git checkout develop
git checkout -b feat/fase-1-arquitectura
# ... desarrollo ...
git add -A && git commit -m "feat(fase-1): arquitectura, modelo JSON y rutas base"
git tag -a v0.1.0 -m "Fase 1: Arquitectura y modelo de datos"
git checkout develop && git merge --no-ff feat/fase-1-arquitectura
```

---

### Fase 2 — Layout base, interfaz moderna y notificaciones

- **Rama:** `feat/fase-2-layout-ui` · **Versión:** `0.2.0`
- **Objetivo:** construir el esqueleto visual y la navegación en español, más la integración de notificaciones.
- **Estado:** ✅ Completada · **Tareas:** 6/6

**Tareas**
- [x] Layout responsive: barra lateral de listas, cabecera, área de contenido, pie de estado.
- [x] Sistema de diseño en Tailwind: tipografía, espaciados, colores, modo claro/oscuro automático (RF-02).
- [x] Menús desplegables accesibles (teclado + foco visible) y modales base (RNF-03).
- [x] Navegación con React Router y estados activos por ruta (RF-01).
- [x] Servicio de notificaciones: permiso, programación por fecha de vencimiento y fallback si el navegador no lo soporta (RF-11).
- [x] Página `/configuracion` con preferencias de tema y notificaciones.

**Entregables:** shell de la app, componentes UI reutilizables (`Button`, `Dropdown`, `Modal`, `Toast`), servicio de notificaciones.
**Criterios de aceptación:** navegación completa sin recargas; modo oscuro conmuta y persiste; notificación de prueba se dispara con permiso concedido; contraste y foco conformes a WCAG básico.

```text
git checkout develop
git checkout -b feat/fase-2-layout-ui
git add -A && git commit -m "feat(fase-2): layout, sistema de diseno y notificaciones"
git tag -a v0.2.0 -m "Fase 2: Layout e interfaz"
git checkout develop && git merge --no-ff feat/fase-2-layout-ui
```

---

### Fase 3 — Núcleo de tareas, estados reversibles y papelera

- **Rama:** `feat/fase-3-core-tareas` · **Versión:** `0.3.0`
- **Objetivo:** ciclo de vida completo de la tarea sin pérdida de datos.
- **Estado:** ✅ Completada · **Tareas:** 6/6

**Tareas**
- [x] Store de tareas (Zustand/Context) con operaciones CRUD y persistencia automática.
- [x] Formulario de tarea: título, descripción, vencimiento, categoría, etiquetas, prioridad (Baja/Media/Alta/Urgente) (RF-03).
- [x] Máquina de estados `Pendiente → En progreso → Completada` con reversión a cualquier estado anterior y registro de historial (RF-04).
- [x] Papelera: borrado lógico, restauración y vaciado definitivo con confirmación (RF-05).
- [x] Vista `/papelera` con acciones masivas y aviso de purga.
- [x] Tests unitarios del reducer/máquina de estados.

**Entregables:** CRUD funcional, estados reversibles, flujo papelera completo.
**Criterios de aceptación:** crear → completar → revertir → enviar a papelera → restaurar funciona sin recargar; nada se borra sin pasar por papelera; tests en verde.

```text
git checkout develop
git checkout -b feat/fase-3-core-tareas
git add -A && git commit -m "feat(fase-3): CRUD de tareas, estados reversibles y papelera"
git tag -a v0.3.0 -m "Fase 3: Nucleo de tareas"
git checkout develop && git merge --no-ff feat/fase-3-core-tareas
```

---

### Fase 4 — Organización avanzada y buscador global

- **Rama:** `feat/fase-4-organizacion-busqueda` · **Versión:** `0.4.0`
- **Objetivo:** clasificar y encontrar tareas al instante.
- **Estado:** ✅ Completada · **Tareas:** 5/5

**Tareas**
- [x] Gestión de etiquetas con color y categorías personalizables (Personal, Trabajo, Estudio) (RF-07).
- [x] Filtros combinables por etiqueta, categoría, estado, prioridad y rango de fechas.
- [x] Buscador global con debounce sobre texto libre (título/descripción) y resaltado de coincidencias (RF-08).
- [x] Vista `/busqueda` con estado en la URL (query params compartibles).
- [x] Índices/estructuras derivadas para mantener el filtrado fluido con miles de tareas (RNF-01).

**Entregables:** etiquetas, categorías, filtros y buscador en tiempo real.
**Criterios de aceptación:** combinación de 3+ filtros devuelve resultados correctos en < 100 ms con 1.000 tareas; la URL refleja la búsqueda y es recargable.

```text
git checkout develop
git checkout -b feat/fase-4-organizacion-busqueda
git add -A && git commit -m "feat(fase-4): etiquetas, categorias y buscador global"
git tag -a v0.4.0 -m "Fase 4: Organizacion y busqueda"
git checkout develop && git merge --no-ff feat/fase-4-organizacion-busqueda
```

---

### Fase 5 — Interactividad visual (Drag and Drop)

- **Rama:** `feat/fase-5-drag-and-drop` · **Versión:** `0.5.0`
- **Objetivo:** reordenar tareas de forma manual e intuitiva, sin flechas.
- **Estado:** ✅ Completada · **Tareas:** 5/5

**Tareas**
- [x] Integrar `@dnd-kit/core` + `@dnd-kit/sortable` con sensores de puntero y teclado.
- [x] Reordenación dentro de una lista y entre listas, persistiendo el orden en el JSON (RF-06).
- [x] Feedback visual (placeholder, elevación, animaciones) sin saltos de layout.
- [x] Accesibilidad: reordenación por teclado y anuncios ARIA.
- [x] Guardas ante solapamientos y reordenaciones inválidas.

**Entregables:** drag and drop persistente y accesible.
**Criterios de aceptación:** el orden sobrevive a recargar y a exportar/importar; funciona con teclado; sin errores de consola ni saltos visuales.

```text
git checkout develop
git checkout -b feat/fase-5-drag-and-drop
git add -A && git commit -m "feat(fase-5): reordenacion con drag and drop"
git tag -a v0.5.0 -m "Fase 5: Drag and drop"
git checkout develop && git merge --no-ff feat/fase-5-drag-and-drop
```

---

### Fase 6 — Colaboración en línea y compartición de listas

- **Rama:** `feat/fase-6-colaboracion` · **Versión:** `0.6.0` (candidata final)
- **Objetivo:** compartir listas con permisos de lectura/escritura simulando colaboración online.
- **Estado:** ✅ Completada · **Tareas:** 6/6

**Tareas**
- [x] Modelo de compartición: enlace público/privado, token y permiso (`lectura` | `escritura`).
- [x] Ruta pública `/compartido/:id` con vista de solo lectura cuando corresponda (RF-10).
- [x] Modo escritura: añadir, editar, cambiar estado y reordenar desde el enlace compartido.
- [x] Sincronización entre pestañas/usuarios (BroadcastChannel + sondeo del backend JSON) y resolución de conflictos simple por `updatedAt` (RF-09).
- [x] Panel de gestión de enlaces: crear, revocar, copiar y ver últimos accesos.
- [x] Exportación/importación completa del entorno `.json` verificada de extremo a extremo (RNF-02).

**Entregables:** enlaces compartidos funcionales, colaboración simulada y gestión de permisos.
**Criterios de aceptación:** dos pestañas con el mismo enlace ven cambios en < 2 s; el modo lectura no permite mutaciones (UI y datos); revocar un enlace lo invalida de inmediato.

```text
git checkout develop
git checkout -b feat/fase-6-colaboracion
git add -A && git commit -m "feat(fase-6): comparticion de listas y colaboracion en linea"
git tag -a v0.6.0 -m "Fase 6: Colaboracion (release candidata)"
git checkout develop && git merge --no-ff feat/fase-6-colaboracion
```

---

## 6. Release final (solo con "OK" explícito del usuario)

```text
git checkout develop
# pruebas finales: build, lint, tests, recorrido manual del DoD
git checkout main
git merge --no-ff develop
# v0.6.0 ya se etiquetó al cerrar la Fase 6 (release candidata) y queda
# incluida en main. No se reetiqueta para no reescribir historia publicada.
git push origin main --tags
```

**DoD global (PRD §5):**
- [x] Compila y corre con React 19 y es accesible en línea.
- [x] Todas las rutas en español responden.
- [x] Flujo crear → completar → papelera → restaurar sin errores.
- [x] Enlaces compartidos permiten ver y editar listas colaborativamente.

> Prohibido crear `v1.0.0` o cualquier versión superior en este ciclo.

---

## 7. Registro de cierre de fases

| Fase | Versión | Tag | Fecha | Commit de merge | Validación del usuario |
| ---- | ------- | --- | ----- | --------------- | ---------------------- |
| 1 | `0.1.0` | `v0.1.0` | 2026-11-10 | `b29584f` | Modo auto (autorizado por el usuario) |
| 2 | `0.2.0` | `v0.2.0` | 2026-11-10 | `37495ca` | Modo auto (autorizado por el usuario) |
| 3 | `0.3.0` | `v0.3.0` | 2026-11-10 | `d406621` | Modo auto (autorizado por el usuario) |
| 4 | `0.4.0` | `v0.4.0` | 2026-11-10 | `5e4f473` | Modo auto (autorizado por el usuario) |
| 5 | `0.5.0` | `v0.5.0` | 2026-11-10 | `da96d71` | Modo auto (autorizado por el usuario) |
| 6 | `0.6.0` | `v0.6.0` | 2026-11-10 | `4ced6bd` | Aprobado por el usuario («OK») |
| — | `0.6.0` | `v0.6.0` | 2026-11-10 | — | Release final autorizado («OK») |
| — (parche) | `0.6.1` | `v0.6.1` | 2026-11-10 | `7527831` | Fix 404 de rutas profundas en Vercel (solicitado por el usuario) |

Se añade una fila al validar cada fase en `develop`. La Fase 6 se aprobó explícitamente y se publicó en `main` como release `v0.6.0`.
