# GOD VS DEVIL - ÍNDICE PRINCIPAL

## PROYECTO COMPLETO DE VIDEOJUEGO DE LUCHA 2D

**Autor y Dueño de IP:** Fabrizio Raimondi Imfeld  
**© 2024-2025 Todos los derechos reservados**

---

## 📚 GUÍA DE NAVEGACIÓN DEL PROYECTO

Este documento te guiará a través de todos los archivos del proyecto. Lee primero el **README.md** para una introducción completa.

---

## 🎯 INICIO RÁPIDO

### Para Desarrolladores

1. Leer: **📄 [README.md](README.md)** - Instalación y configuración
2. Leer: **📄 [INPUT_SYSTEM_CONFIG.md](INPUT_SYSTEM_CONFIG.md)** - Configurar controles
3. Estudiar: **📁 Scripts/** - Código fuente

### Para Artistas

1. Leer: **🎨 [ART_DIRECTION_GUIDE.md](ART_DIRECTION_GUIDE.md)** - Guía visual completa
2. Referencia: **📄 Scripts/Systems/CharacterDatabase.cs** - Datos de personajes

### Para Gestores de Proyecto

1. Leer: **📊 [PROJECT_SUMMARY.md](PROJECT_SUMMARY.md)** - Resumen ejecutivo
2. Revisar: **📁 STRUCTURE.txt** - Árbol de archivos completo

---

## 📂 ESTRUCTURA DE DOCUMENTACIÓN

### Documentos Principales

| Archivo | Descripción | Prioridad |
|---------|-------------|-----------|
| **README.md** | Guía de instalación y configuración completa | 🔴 CRÍTICO |
| **PROJECT_SUMMARY.md** | Resumen ejecutivo con entregables y roadmap | 🔴 CRÍTICO |
| **ART_DIRECTION_GUIDE.md** | Especificaciones visuales de todos los personajes | 🔴 CRÍTICO |
| **INPUT_SYSTEM_CONFIG.md** | Configuración detallada de controles | 🟡 IMPORTANTE |
| **STRUCTURE.txt** | Árbol de archivos completo | 🟢 REFERENCIA |
| **INDEX.md** (este archivo) | Navegación del proyecto | 🟢 REFERENCIA |

---

## 💻 SCRIPTS C# - CÓDIGO FUENTE

### Combat/ - Sistema de Combate

| Script | Líneas | Descripción |
|--------|--------|-------------|
| **FighterController.cs** | 418 | Control completo del luchador, inputs, combate, energía |

**Características:**

- Unity New Input System
- Hitboxes 2D configurables
- Sistema de combos
- Bloqueo direccional
- Carga de energía (LB+RB)
- Ataques Ultimate (LT+RT)

---

### Systems/ - Sistemas Principales

| Script | Líneas | Descripción |
|--------|--------|-------------|
| **GameManager.cs** | 320 | Gestión principal del juego, rounds, victorias |
| **CharacterProgression.cs** | 220 | Sistema RPG: niveles, XP, stats, guardado |
| **MissionSystem.cs** | 280 | Sistema de misiones con 8 tipos de desafíos |
| **CharacterDatabase.cs** | 580 | Base de datos de 16 personajes completos |

**Características:**

- Singleton GameManager
- Guardado/carga en JSON
- Eventos para UI
- Progresión 1-50 niveles
- 8 tipos de misiones únicas

---

### AI/ - Inteligencia Artificial

| Script | Líneas | Descripción |
|--------|--------|-------------|
| **BossAI.cs** | 350 | IA de jefes con input reading y fases |

**Características:**

- Input Reading (70% trampa)
- Máquina de estados
- Fase 2 al 50% vida
- Comportamientos únicos por jefe
- Patrones de ataque dinámicos

---

### UI/ - Interfaz de Usuario

| Script | Líneas | Descripción |
|--------|--------|-------------|
| **GameUIManager.cs** | 230 | Control de barras, timer, mensajes, combos |

**Características:**

- Barras de vida/energía dinámicas
- Timer con efectos visuales
- Mensajes de combate
- Display de combos
- Iconos de victorias

---

## 🎮 PERSONAJES COMPLETOS (16)

### Arcángeles (7)

Todos definidos en `CharacterDatabase.cs` con:

- Stats completos (Health, Damage, Speed, Defense)
- Descripciones visuales detalladas
- Armas y posturas
- Temas musicales
- Habilidades especiales y Ultimates

1. **MIGUEL** - Líder, espada flamígera azul
2. **JOFIEL** - Mago solar dorado
3. **CHAMUEL** - Velocista rosa
4. **GABRIEL** - Guerrero sónico blanco
5. **RAFAEL** - Asesino verde quirúrgico
6. **URIEL** - Tanque de magma rojo
7. **ZADKIEL** - Mago dimensional violeta

### Demonios (7)

1. **VULDROK** (Avaricia) - Esqueleto dorado 4 brazos
2. **XYPHORA** (Lujuria) - Látigos neón Rosa
3. **RAGNOR** (Ira) - Berserker rojo brutal
4. **VORAKH** (Gula) - Obesidad grotesca verde
5. **SKARN** (Envidia) - Espejos rotos plateados
6. **THUL-GAT** (Pereza) - Trono flotante oxidado
7. **LUCIFER** (Soberbia) - Ángel caído dorado-negro

### Jefes (2)

1. **LUCIFER** - Jefe ruta Luz
2. **ELOHIM** - Dios Supremo, jefe ruta Oscuridad

*Ver ART_DIRECTION_GUIDE.md para descripciones visuales completas*

---

## 🎨 ESPECIFICACIONES DE ARTE

### Documentado en: ART_DIRECTION_GUIDE.md

**Incluye:**

- ✅ Estilo visual global (MK3-inspired)
- ✅ Especificaciones técnicas (512x512px, 32-bit RGBA)
- ✅ Descripción visual de 16 personajes
- ✅ Paletas de colores exactas
- ✅ Anatomía y proporciones
- ✅ Materiales y texturas
- ✅ Poses clave por personaje
- ✅ 27 animaciones requeridas
- ✅ 5 escenarios descritos
- ✅ Efectos visuales (VFX)
- ✅ Diseño de UI completo
- ✅ Pantalla de créditos

---

## 🎵 DIRECCIÓN MUSICAL

### Documentado en: ART_DIRECTION_GUIDE.md + CharacterDatabase.cs

**Cada personaje tiene:**

- Tema musical único
- SFX de Ultimate
- Estilo definido (Metal, Orquestal, Industrial, etc.)

**Ejemplo:**

- Miguel: Metal Sinfónico
- Xyphora: Dark Synthwave
- Elohim: Ruido Blanco Orquestal

---

## ⚙️ SISTEMAS IMPLEMENTADOS

### ✅ Sistema de Combate

- Archivo: `Scripts/Combat/FighterController.cs`
- Características: 5 tipos de ataques, combos, energía, ultimates

### ✅ Sistema RPG

- Archivo: `Scripts/Systems/CharacterProgression.cs`
- Características: Niveles 1-50, XP, stats, guardado JSON

### ✅ Sistema de Misiones

- Archivo: `Scripts/Systems/MissionSystem.cs`
- Características: 8 tipos de desafíos, tracking automático

### ✅ IA de Jefes

- Archivo: `Scripts/AI/BossAI.cs`
- Características: Input reading, fases, patrones dinámicos

### ✅ Gestión del Juego

- Archivo: `Scripts/Systems/GameManager.cs`
- Características: Rounds, victorias, XP, pausas

### ✅ Interfaz de Usuario

- Archivo: `Scripts/UI/GameUIManager.cs`
- Características: Barras, timer, mensajes, combos

### ✅ Base de Datos

- Archivo: `Scripts/Systems/CharacterDatabase.cs`
- Características: 16 personajes con datos completos

---

## 🎮 CONTROLES

### Documentado en: INPUT_SYSTEM_CONFIG.md

**Teclado:**

- Movimiento: WASD / Flechas
- Puño: J | Patada: K | Agarre: L
- Cargar: Espacio
- Ultimate: Q + E

**Xbox Controller:**

- Movimiento: D-Pad / Stick
- Puño: X | Patada: A | Agarre: B
- Cargar: LB + RB
- Ultimate: LT + RT

---

## 📋 CHECKLIST DE DESARROLLO

### Fase 1: CÓDIGO ✅ COMPLETO

- [x] FighterController
- [x] CharacterProgression
- [x] MissionSystem
- [x] BossAI
- [x] GameManager
- [x] GameUIManager
- [x] CharacterDatabase
- [x] Documentación completa

### Fase 2: ASSETS (Por Hacer)

- [ ] Sprites de 16 personajes
- [ ] 432 animaciones totales (16 × 27)
- [ ] 5 escenarios
- [ ] VFX de combate
- [ ] UI visual completa

### Fase 3: AUDIO (Por Hacer)

- [ ] 16 temas musicales
- [ ] SFX de combate
- [ ] Voces de personajes
- [ ] Música de menús

### Fase 4: UNITY (Por Hacer)

- [ ] Configurar Input Actions
- [ ] Crear Prefabs
- [ ] Configurar Animators
- [ ] Importar assets
- [ ] Build y testing

---

## 📊 ESTADÍSTICAS DEL PROYECTO

### Código

- **Total de Scripts:** 7 archivos C#
- **Total de Líneas:** ~2,400 líneas
- **Promedio por Script:** 343 líneas
- **Calidad:** Profesional, comentado, optimizado

### Documentación

- **Archivos de Documentación:** 6 archivos MD
- **Total de Líneas:** ~1,100+ líneas
- **Cobertura:** 100% del proyecto

### Diseño

- **Personajes Diseñados:** 16 completos
- **Arcángeles:** 7
- **Demonios:** 7
- **Jefes:** 2
- **Habilidades Únicas:** 16
- **Ultimates:** 16

---

## 🚀 CÓMO EMPEZAR

### Si eres PROGRAMADOR

1. Lee `README.md`
2. Abre Unity, importa el proyecto
3. Instala Input System package
4. Lee `INPUT_SYSTEM_CONFIG.md`
5. Estudia `Scripts/Combat/FighterController.cs`
6. Crea tu primer personaje siguiendo el README

### Si eres ARTISTA

1. Lee `ART_DIRECTION_GUIDE.md`
2. Revisa `Scripts/Systems/CharacterDatabase.cs`para specs de personajes
3. Empieza con sprites base de MIGUEL (ejemplo)
4. Crea 27 animaciones siguiendo la guía
5. Exporta a PNG 512x512px

### Si eres MÚSICO

1. Lee sección musical de `ART_DIRECTION_GUIDE.md`
2. Revisa `CharacterDatabase.cs` para temas por personaje
3. Empieza con tema de MIGUEL (Metal Sinfónico)
4. Formato: OGG Vorbis para Unity
5. Duración: 2-3 minutos loop

### Si eres PROJECT MANAGER

1. Lee `PROJECT_SUMMARY.md`
2. Revisa roadmap y estimaciones
3. Asigna tareas según fases
4. Trackea progreso con checklist

---

## 📞 INFORMACIÓN LEGAL

### Derechos de Autor

```
© 2024-2025 FABRIZIO RAIMONDI IMFELD
TODOS LOS DERECHOS RESERVADOS

Este proyecto es propiedad intelectual exclusiva de
Fabrizio Raimondi Imfeld.

El uso, distribución o modificación no autorizados
están estrictamente PROHIBIDOS.
```

### Pantalla de Créditos (Obligatoria)

Ver especificaciones en:

- `ART_DIRECTION_GUIDE.md` (sección "Pantalla de Créditos")
- `README.md` (sección "Créditos y Licencia")

---

## 🔗 NAVEGACIÓN RÁPIDA

| Necesito... | Ir a... |
|-------------|---------|
| Instalar el proyecto | [README.md](README.md) |
| Configurar controles | [INPUT_SYSTEM_CONFIG.md](INPUT_SYSTEM_CONFIG.md) |
| Ver diseño de personajes | [ART_DIRECTION_GUIDE.md](ART_DIRECTION_GUIDE.md) |
| Entender código de combate | Scripts/Combat/FighterController.cs |
| Modificar stats de personajes | Scripts/Systems/CharacterDatabase.cs |
| Añadir nueva misión | Scripts/Systems/MissionSystem.cs |
| Cambiar comportamiento de jefe | Scripts/AI/BossAI.cs |
| Ver resumen del proyecto | [PROJECT_SUMMARY.md](PROJECT_SUMMARY.md) |
| Troubleshooting | [README.md](README.md#troubleshooting) |

---

## 📝 NOTAS FINALES

### Este proyecto incluye

✅ Arquitectura completa de código C#  
✅ 16 personajes únicamente diseñados  
✅ Sistemas de combate, RPG, misiones y IA  
✅ Documentación exhaustiva  
✅ Dirección artística completa  
✅ Especificaciones técnicas para assets  

### Este proyecto NO incluye (Fase 2)

❌ Sprites visuales de personajes  
❌ Animaciones (assets)  
❌ Música y SFX (archivos de audio)  
❌ Prefabs configurados de Unity  
❌ Escenas de Unity armadas  

El proyecto está **LISTO para producción de assets** con toda la base técnica completa.

---

## 🎯 PRÓXIMO PASO RECOMENDADO

**Para continuar el desarrollo:**

1. **Configurar Unity** siguiendo README.md
2. **Crear Input Actions** siguiendo INPUT_SYSTEM_CONFIG.md
3. **Empezar producción de sprites** siguiendo ART_DIRECTION_GUIDE.md
4. **Contratar artistas** con el art guide como referencia
5. **Contratar músico** con las especificaciones de CharacterDatabase.cs

---

**Proyecto creado por:** Fabrizio Raimondi Imfeld  
**Fecha:** Noviembre 2024  
**Versión:** 1.0 - Code Complete  
**Estado:** ✅ Ready for Asset Production

---

*"La batalla entre Luz y Oscuridad está lista para comenzar"*

**GOD VS DEVIL: ETERNAL WAR**  
© 2024-2025 Fabrizio Raimondi Imfeld
