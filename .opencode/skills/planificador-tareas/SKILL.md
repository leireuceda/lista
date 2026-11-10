---
name: Planificador TaskFlow Pro
description: Planificación y desarrollo por fases de TaskFlow Pro (app web de tareas en React 19, persistencia JSON, online, sin base de datos). Aplica SemVer estricto (< 1.0.0) y el flujo de ramas feat/* -> develop -> main. Usar al iniciar o retomar una fase, al crear ramas/etiquetas de versión, o al preguntar por el estado del plan. Solo para este proyecto.
---

# Planificador Experto y Gestor de Git/Versiones — TaskFlow Pro

Skill **exclusiva de este proyecto** (`.opencode/skills/planificador-tareas/`). No debe usarse en otros repositorios.

## Propósito

Guiar el desarrollo de **TaskFlow Pro** paso a paso, aplicando estrictamente:

1. Metodología basada en fases.
2. Versionado semántico por debajo de `1.0.0`.
3. Flujo de Git profesional con `develop` como rama de integración y `main` reservada a la versión final.

Fuentes del proyecto (leerlas antes de planificar o escribir código):

- `documento_prd_aplicaciondetareas.md` — PRD, alcance, stack y requerimientos (RF-01 a RF-10).
- `plan-desarrollo.md` — plan por fases, tareas y estado de avance (fuente de verdad del progreso).
- `AGENTS.md` — convenciones de código y reglas de trabajo del repositorio.
- `claude_skill.md` — reglas originales de planificación (referencia histórica; este skill es la versión operativa).

---

## Reglas de Ejecución y Gobernanza

### 1. Planificación por fases estricta

- Nunca abarcar todo el desarrollo de golpe. Cada interacción se enfoca **exclusivamente en la Fase Activa**.
- No adelantar trabajo de fases futuras, ni siquiera parcialmente.
- Al finalizar cada fase: resumen de lo entregado (archivos, funcionalidad, versión, rama) y **esperar confirmación explícita del usuario** antes de avanzar.

### 2. Gestión de ramas

- Cada fase se desarrolla en su propia rama de característica derivada de `develop` (ej. `feat/fase-1-arquitectura`).
- **Regla de integración:** al terminar una fase y ser validada, se fusiona **exclusivamente hacia `develop`**. Nunca merge directo a `main` desde una rama de fase.
- `main` permanece intacta hasta que **todas** las fases estén completadas, probadas y exista aprobación explícita ("OK") del usuario.

### 3. Versionado semántico estricto (SemVer < 1.0.0)

- Formato `MAJOR.MINOR.PATCH`, siempre en pre-lanzamiento (`0.y.z`).
- **Restricción crítica:** nunca alcanzar ni superar `1.0.0` durante este ciclo de desarrollo.
- Cada fase inicia con un incremento menor: Fase 1 `0.1.0`, Fase 2 `0.2.0`, … Fase 6 `0.6.0`.
- Los parches (`0.y.z`) se reservan para correcciones dentro de una fase ya validada.

### 4. Flujo de producción (release a `main`)

- Solo cuando todas las fases estén terminadas, integradas en `develop` y completamente testeadas, se prepara el merge final `develop` → `main`.
- Ese paso requiere **autorización explícita del usuario**, sin excepciones.

---

## Fases del Plan

| Fase | Rama | Versión | Objetivo |
| ---- | ---- | ------- | -------- |
| 1. Arquitectura, modelado JSON y configuración base | `feat/fase-1-arquitectura` | `0.1.0` | Estructura de datos JSON (tareas, etiquetas, estados, usuarios, compartición), proyecto React 19 y enrutamiento en español |
| 2. Layout base, interfaz moderna y notificaciones | `feat/fase-2-layout-ui` | `0.2.0` | Diseño visual moderno (Tailwind), menús desplegables, navegación en español, Web Notifications API |
| 3. Núcleo de tareas, estados reversibles y papelera | `feat/fase-3-core-tareas` | `0.3.0` | CRUD de tareas, prioridades, estados con reversión y flujo seguro de papelera |
| 4. Organización avanzada y buscador global | `feat/fase-4-organizacion-busqueda` | `0.4.0` | Etiquetas con colores, categorías y buscador avanzado en tiempo real sobre el JSON |
| 5. Interactividad visual (Drag and Drop) | `feat/fase-5-drag-and-drop` | `0.5.0` | Reordenación manual de tareas mediante Drag and Drop |
| 6. Colaboración en línea y compartición de listas | `feat/fase-6-colaboracion` | `0.6.0` | Compartición de listas en modo lectura/escritura simulando comportamiento online |

Criterios de salida por fase: compila sin errores, requisitos de la fase cubiertos, sin trabajo de fases posteriores, resumen entregado y validación del usuario registrada.

---

## Protocolo de Interacción

Cuando el usuario invoque este skill (o pida continuar el desarrollo):

1. **Verificar el estado real** antes de responder: `git status`, `git branch -a`, `git tag` y `package.json` (`version`). Si no hay repositorio Git, indicarlo y proponer `git init`.
2. **Saludar indicando contexto:** Fase activa, rama actual y versión (`0.y.z`).
3. **Mostrar los comandos Git sugeridos** para la fase: creación/checkout de rama, bump de versión, tag y merge a `develop`.
4. **Pedir la señal del usuario** para avanzar o generar el código de la tarea activa, sin romper las restricciones de SemVer ni de Git.
5. **Nunca** ejecutar merges a `main`, tags `>= 1.0.0`, ni cambios de versión no autorizados.

### Plantilla de respuesta

```text
Fase activa: <n> — <nombre>
Rama:        feat/fase-<n>-<slug>
Versión:     0.<n>.0

Entregado en la fase anterior: <resumen o "—">
Pendiente en esta fase: <objetivo + checklist corto>

Comandos sugeridos:
  git checkout develop && git pull
  git checkout -b feat/fase-<n>-<slug>
  npm version 0.<n>.0 --no-git-tag-version   # ajustar versión en package.json
  git add -A && git commit -m "feat(fase-<n>): <descripción>"
  git tag -a v0.<n>.0 -m "Fase <n>: <nombre>"
  # tras validación del usuario:
  git checkout develop && git merge --no-ff feat/fase-<n>-<slug>

¿Avanzo con la Fase <n> o prefieres revisar algo antes?
```

### Cierre de fase (checklist)

1. Resumen de lo entregado y archivos tocados.
2. Marcar en `plan-desarrollo.md`: tareas `- [x]`, estado ✅, contador `Tareas: n/n`, "Progreso global" y fila en "Registro de cierre"; commit `docs(plan): cierra fase <n>`.
3. Verificación de que no se adelantó trabajo de otras fases.
4. Confirmar versión `0.<n>.0` y tag `v0.<n>.0`.
5. Merge **solo** a `develop` (con `--no-ff`).
6. Esperar "OK" del usuario antes de abrir la siguiente fase.

### Seguimiento del plan

- El plan vive en `plan-desarrollo.md` (raíz del proyecto) y es la única fuente de verdad del avance.
- Al completar cada tarea durante el desarrollo: cambiar `- [ ]` por `- [x]` y actualizar el contador de la fase.
- Al abrir una fase: estado 🟨 En curso y "Fase activa" actualizada.
- Nunca marcar como completada una fase sin validación explícita del usuario.

### Release final (solo con autorización)

```text
git checkout develop
git merge --no-ff feat/fase-6-colaboracion   # si aún no está integrada
# pruebas finales completas
git checkout main
git merge --no-ff develop
git tag -a v0.6.0 -m "Release candidata TaskFlow Pro"
```

No crear `v1.0.0` ni etiquetas superiores.

---

## Restricciones rápidas (no negociables)

- ❌ Merge directo de ramas de fase a `main`.
- ❌ Versiones `>= 1.0.0` o tags fuera de `v0.y.z`.
- ❌ Desarrollar varias fases en una sola interacción.
- ❌ Archivos de código con más de **200 líneas** (dividir en componentes, hooks o utilidades).
- ❌ Eliminar, reescribir o reetiquetar historia ya integrada en `develop`.
- ✅ Una fase = una rama = una versión menor.
- ✅ Resumen + confirmación del usuario al cerrar cada fase.
- ✅ Rutas, textos y nombres de cara al usuario en español.
