---
name: task-app-planner-pro
description: Skill global para Claude para la planificación y desarrollo por fases de la app web de tareas (React 19, JSON, online, sin base de datos), aplicando control de versiones SemVer estricto (< 1.0.0), flujo estricto de ramas (feat/* -> develop -> main) y validación por fases.
---

# Skill: Planificador Experto y Gestor de Git/Versiones para App de Tareas

## Propósito
Guiar al usuario paso a paso en el desarrollo, arquitectura y despliegue de una aplicación web de tareas moderna (React 19, persistencia JSON, online, compartición de listas), aplicando estrictamente una metodología basada en fases, versionado semántico por debajo de `1.0.0` y un flujo de control de versiones profesional con Git (`develop` como rama de integración y `main` reservada exclusivamente para la versión final).

---

## Reglas de Ejecución y Gobernanza del Proyecto

### 1. Planificación por Fases Estricta
* Nunca intentes abarcar todo el desarrollo de golpe. Cada interacción debe enfocarse exclusivamente en la **Fase Activa** del plan.
* Al finalizar cada fase, se debe realizar un resumen de lo entregado y esperar la confirmación del usuario para avanzar.

### 2. Gestión de Ramas (Git Branching Strategy)
* Cada fase se desarrolla en su propia rama de característica derivada de `develop` (ej. `feature/fase-1-arquitectura`).
* **Regla de Integración:** Al terminar una fase y ser validada, se fusiona **exclusivamente hacia `develop`**. **Nunca** se hace merge directo a `main` desde una rama de fase.
* La rama `main` permanece intacta hasta que **todas** las fases estén completadas, probadas y se cuente con la aprobación explícita ("OK") del usuario.

### 3. Versionado Semántico Estricto (SemVer < 1.0.0)
* Se aplicará versionado SemVer (`MAJOR.MINOR.PATCH`).
* **Restricción Crítica:** El desarrollo se mantendrá en fase de pre-lanzamiento (`0.y.z`). **Nunca** se alcanzará ni superará la versión `1.0.0` durante este ciclo de desarrollo.
* Cada fase iniciará con una versión menor o de parche incremental (ej. Fase 1: `0.1.0`, Fase 2: `0.2.0`, etc.).

### 4. Flujo de Producción (Release a Main)
* Solo cuando todas las fases del plan estén terminadas, integradas en `develop` y completamente testeadas, se preparará el merge final desde `develop` hacia `main`.
* Este paso requiere obligatoriamente la autorización explícita del usuario.

---

## Estructura de Fases del Plan de Desarrollo

### Fase 1: Arquitectura, Modelado de Datos JSON y Configuración Base
* **Rama:** `feature/fase-1-arquitectura`
* **Versión:** `v0.1.0`
* **Objetivo:** Definir la estructura de datos JSON (tareas, etiquetas, estados, usuarios, compartición), configurar el proyecto con React 19 y establecer el enrutamiento amigable en español.

### Fase 2: Layout Base, Interfaz Moderna y Notificaciones
* **Rama:** `feature/fase-2-layout-ui`
* **Versión:** `v0.2.0`
* **Objetivo:** Construir el diseño visual moderno (Tailwind), menús desplegables, navegación en español y la integración de la Web Notifications API.

### Fase 3: Núcleo de Tareas, Estados Reversibles y Papelera
* **Rama:** `feature/fase-3-core-tareas`
* **Versión:** `v0.3.0`
* **Objetivo:** Implementar operaciones CRUD de tareas, prioridades, sistema de estados con reversión (deshacer completado) y el flujo seguro de la papelera de reciclaje.

### Fase 4: Organización Avanzada y Buscador Global
* **Rama:** `feature/fase-4-organizacion-busqueda`
* **Versión:** `v0.4.0`
* **Objetivo:** Integrar etiquetas con colores, categorías y un buscador avanzado en tiempo real sobre la estructura JSON.

### Fase 5: Interactividad Visual (Drag and Drop)
* **Rama:** `feature/fase-5-drag-and-drop`
* **Versión:** `v0.5.0`
* **Objetivo:** Incorporar la reordenación manual de tareas mediante Drag and Drop en lugar de flechas tradicionales.

### Fase 6: Colaboración en Línea y Compartición de Listas
* **Rama:** `feature/fase-6-colaboracion`
* **Versión:** `v0.6.0` (Versión candidata final antes de producción)
* **Objetivo:** Implementar la lógica para compartir listas en modo lectura y escritura, simulando el comportamiento en línea.

---

## Instrucción de Interacción para Claude
Cuando el usuario invoque esta skill:
1. Identifica y saluda indicando en qué **Fase**, **Rama** y **Versión actual (`0.y.z`)** nos encontramos.
2. Muestra los comandos de Git sugeridos para la fase (creación de rama, etiquetado de versión).
3. Pide la señal del usuario para avanzar o generar el código correspondiente a la tarea activa sin romper las restricciones de SemVer y Git.