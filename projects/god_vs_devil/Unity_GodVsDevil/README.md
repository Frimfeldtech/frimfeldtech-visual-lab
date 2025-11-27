# GOD VS DEVIL - ETERNAL WAR

### Juego de Lucha 2D Completo

**Plataforma:** Unity 2D | Exportable a Windows y Android  
**Autor y Dueño de IP:** Fabrizio Raimondi Imfeld  
**© 2024-2025 Todos los derechos reservados**

---

## 📋 TABLA DE CONTENIDOS

1. [Descripción del Proyecto](#descripción)
2. [Características Principales](#características)
3. [Instalación y Configuración](#instalación)
4. [Estructura del Proyecto](#estructura)
5. [Controles](#controles)
6. [Roster de Personajes](#personajes)
7. [Modos de Juego](#modos)
8. [Créditos y Licencia](#créditos)

---

## 📖 DESCRIPCIÓN

**GOD VS DEVIL** es un juego de lucha 2D estilo *Mortal Kombat 3* que enfrenta a 7 Arcángeles contra 7 Demonios de los pecados capitales. Combina combate visceral con un sistema RPG de progresión y misiones.

### Estilo Visual

- Gráficos pre-renderizados oscuros y realistas
- Estética años 90 con tecnología moderna
- Contraste dramático: Luz divina vs Oscuridad corrupta

### Estilo Musical

- **Arcángeles:** Metal Sinfónico, Orquestal Épico, Fanfarrias
- **Demonios:** Industrial Metal, Dark Synthwave, Drone
- **Jefes:** Coros Gregorianos distorsionados, Ruido Orquestal

---

## ⭐ CARACTERÍSTICAS PRINCIPALES

### Sistema de Combate

- ✅ Unity New Input System (Teclado, Joystick, Xbox Controller)
- ✅ Hitboxes 2D precisas
- ✅ Sistema de combos dinámico
- ✅ Bloqueo direccional
- ✅ Carga de energía manual (LB + RB)
- ✅ Ataques Ultimate (LT + RT) con animaciones cinemáticas

### Sistema RPG

- ✅ Progresión de niveles (1-50)
- ✅ Sistema de XP con escala exponencial
- ✅ Puntos de Habilidad asignables
- ✅ Stats: Fuerza, Defensa, Energía
- ✅ Guardado persistente en JSON

### Sistema de Misiones

- ✅ 8 tipos de desafíos diferentes
- ✅ Recompensas de XP variables
- ✅ Tracking automático de estadísticas
- ✅ Misiones aleatorias por combate

### IA de Jefes

- ✅ Input Reading (trampa intencional)
- ✅ Fase 2 al 50% de vida
- ✅ Patrones de ataque dinámicos
- ✅ Comportamientos únicos por jefe

---

## 🛠 INSTALACIÓN Y CONFIGURACIÓN

### Requisitos

- **Unity:** 2021.3 LTS o superior
- **Paquetes Requeridos:**
  - Unity Input System (2.0+)
  - TextMesh Pro (incluido)
  - 2D Sprite Editor
  - Universal Render Pipeline (URP) [Recomendado]

### Pasos de Instalación

1. **Clonar/Copiar el proyecto**

   ```bash
   # Si usas Git
   git clone [tu-repo]/god_vs_devil_unity
   
   # O simplemente copia la carpeta Unity_GodVsDevil
   ```

2. **Abrir en Unity**
   - Abre Unity Hub
   - Click en "Add" → Selecciona carpeta del proyecto
   - Unity importará automáticamente

3. **Instalar Input System**

   ```
   Window > Package Manager > 
   Unity Registry > Input System > Install
   ```

   - Cuando pregunte si reiniciar, acepta

4. **Configurar Input Actions**
   - Navega a `Assets/Settings/`
   - Doble click en `FighterInputActions.inputactions`
   - Click "Generate C# Class"

5. **Configurar Capas**
   - Edit > Project Settings > Tags and Layers
   - Añadir capas:
     - Layer 8: "Player"
     - Layer 9: "Enemy"
     - Layer 10: "Ground"

### Importar Assets Extra

**NOTA:** Este proyecto incluye solo código y arquitectura. Necesitas crear/importar:

- Sprites de personajes (ver `ART_DIRECTION_GUIDE.md`)
- Música y SFX
- Fondos de escenarios

---

## 📁 ESTRUCTURA DEL PROYECTO

```
Unity_GodVsDevil/
│
├── Scripts/
│   ├── Combat/
│   │   └── FighterController.cs     # Control del luchador
│   │
│   ├── Systems/
│   │   ├── CharacterProgression.cs  # Sistema RPG
│   │   ├── MissionSystem.cs         # Sistema de misiones
│   │   └── CharacterDatabase.cs     # Base de datos de personajes
│   │
│   ├── AI/
│   │   └── BossAI.cs                # IA de jefes finales
│   │
│   └── UI/
│       └── GameUIManager.cs         # Gestión de interfaz
│
├── Prefabs/
│   ├── Characters/                  # Prefabs de luchadores
│   ├── VFX/                         # Efectos de partículas
│   └── UI/                          # Prefabs de UI
│
├── Animations/                      # Animators y clips
├── Audio/                           # Música y SFX
├── Scenes/                          # Escenas del juego
│   ├── MainMenu.unity
│   ├── CharacterSelect.unity
│   └── Arena.unity
│
└── ART_DIRECTION_GUIDE.md           # Guía completa de arte
```

---

## 🎮 CONTROLES

### Teclado

| Acción | Tecla |
|--------|-------|
| Movimiento | ← → ↑ ↓ |
| Puño | J |
| Patada | K |
| Agarre | L |
| Bloqueo | ← (mantener hacia atrás) |
| Cargar Energía | Espacio |
| Ultimate | Q + E |

### Xbox Controller

| Acción | Botón |
|--------|-------|
| Movimiento | D-Pad / Stick Izquierdo |
| Puño | X |
| Patada | A |
| Agarre | B |
| Bloqueo | ← (stick hacia atrás) |
| Cargar Energía | LB + RB |
| Ultimate | LT + RT |

---

## 👥 ROSTER DE PERSONAJES

### ARCÁNGELES (La Luz)

1. **MIGUEL** - Líder, guerrero equilibrado
2. **JOFIEL** - Mago solar, levita
3. **CHAMUEL** - Velocista extremo
4. **GABRIEL** - Guerrero sónico
5. **RAFAEL** - Asesino quirúrgico
6. **URIEL** - Tanque de magma
7. **ZADKIEL** - Mago dimensional

### DEMONIOS (Pecados)

1. **VULDROK** (Avaricia) - Esqueleto dorado, roba vida
2. **XYPHORA** (Lujuria) - Invierte controles
3. **RAGNOR** (Ira) - Berserker, más daño con baja vida
4. **VORAKH** (Gula) - Devora enemigos
5. **SKARN** (Envidia) - Copia ataques
6. **THUL-GAT** (Pereza) - Ralentiza enemigos
7. **LUCIFER** (Soberbia) - Ángel caído *[Desbloqueable/Jefe]*

### JEFES

- **LUCIFER** - Jefe de ruta Luz
- **ELOHIM** - Dios Supremo, jefe de ruta Oscuridad

*Ver `ART_DIRECTION_GUIDE.md` para descripciones visuales completas*

---

## 🎯 MODOS DE JUEGO

### 1. Modo Historia (Ramificado)

- **Ruta de la Luz:** Juega como Arcángeles, derrota a Lucifer
- **Ruta de la Oscuridad:** Juega como Demonios, derrota a Elohim
- Cinemáticas de introducción y final
- Pantalla de créditos obligatoria

### 2. Modo Arcade

- Escalera de 7 enemigos + Jefe
- Gan XP por victoria
- Aumenta dificultad progresivamente

### 3. Modo Versus

- P1 vs P2 local
- P1 vs CPU
- Mejores de 3 rounds

### 4. Modo Misiones

- Completa desafíos específicos
- Recompensas de XP extra
- Misiones rotativas

---

## 🎨 GUÍA DE DESARROLLO

### Crear Nuevo Personaje

1. **Crear Prefab**
   - Añadir `FighterController.cs`
   - Configurar Rigidbody2D
   - Añadir Animator

2. **Configurar Hitboxes**
   - Crear GameObjects hijos: `PunchHitbox`, `KickHitbox`, `GrabHitbox`
   - Posicionar según animaciones
   - Asignar en Inspector

3. **Crear Animaciones**
   - Ver sección de animaciones en `ART_DIRECTION_GUIDE.md`
   - Mínimo 27 animaciones por personaje

4. **Añadir a Database**
   - Editar `CharacterDatabase.cs`
   - Añadir nueva entrada con stats

### Crear Nuevo Escenario

1. Crear nueva escena
2. Añadir GameObject "Ground" con Collider2D (Layer: Ground)
3. Añadir GameObject "SpawnPoint_P1" y "SpawnPoint_P2"
4. Importar background como Sprite
5. Configurar iluminación (URP)

---

## 🔧 CONFIGURACIÓN AVANZADA

### Balanceo de Combate

Editar en `FighterController.cs`:

```csharp
[SerializeField] private float punchDamage = 10f;
[SerializeField] private float kickDamage = 15f;
[SerializeField] private float grabDamage = 20f;
[SerializeField] private float ultimateDamage = 50f;
```

### Progresión RPG

Editar en `CharacterProgression.cs`:

```csharp
[SerializeField] private int maxLevel = 50;
[SerializeField] private float baseXPRequired = 100f;
[SerializeField] private float xpScalingFactor = 1.5f;
```

### Dificultad de IA

Editar en `BossAI.cs`:

```csharp
[SerializeField] private float inputReadingChance = 0.7f; // 70% trampa
[SerializeField] private float phase2SpeedMultiplier = 1.2f;
```

---

## 📱 EXPORTACIÓN

### Windows Build

1. File > Build Settings
2. Platform: Windows
3. Architecture: x86_64
4. Development Build: OFF (para release)
5. Click "Build"

### Android Build

1. File > Build Settings > Platform: Android
2. Switch Platform
3. Player Settings:
   - Minimum API Level: 24 (Android 7.0)
   - Graphics API: Vulkan + OpenGLES3
4. Build APK o AAB (para Play Store)

**NOTA:** Android requiere configuración adicional de Input System para touch controls.

---

## 🐛 TROUBLESHOOTING

### Problema: "Input System backend not enabled"

**Solución:** Edit > Project Settings > Player > Other Settings > Active Input Handling → "Input System Package (New)"

### Problema: Animaciones no se reproducen

**Solución:** Verificar que el Animator tenga el Controller asignado y que los triggers coincidan con el código.

### Problema: Hitboxes no detectan

**Solución:** Verificar que las capas estén correctamente asignadas y que los Colliders no estén en "Trigger" si no es necesario.

### Problema: Guardado no funciona

**Solución:** El path de guardado es `Application.persistentDataPath`. En el editor de Unity, busca en `%AppData%\..\LocalLow\[CompanyName]\[ProductName]`

---

## 📜 CRÉDITOS Y LICENCIA

### Creador y Dueño de IP

**Fabrizio Raimondi Imfeld**

### Roles

- Creador y Director del Proyecto
- Programador Principal
- Diseñador de Personajes y Dirección de Arte
- Diseñador de Gameplay y Sistemas
- Diseñador de Sonido (conceptual)

### Licencia y Derechos de Autor

```
© 2024-2025 Fabrizio Raimondi Imfeld
TODOS LOS DERECHOS RESERVADOS

Este software, incluyendo pero no limitado a:
- Código fuente
- Diseños de personajes
- Conceptos de gameplay
- Arquitectura de sistemas
- Nombres y descripciones de personajes

Es propiedad exclusiva de Fabrizio Raimondi Imfeld.

El uso no autorizado, distribución, modificación o explotación
comercial de cualquier parte de este proyecto está estrictamente
PROHIBIDO sin permiso explícito por escrito del autor.

Para consultas sobre licenciamiento comercial, contactar al autor.
```

---

## 🔗 RECURSOS ADICIONALES

### Documentación

- [Guía de Dirección de Arte](ART_DIRECTION_GUIDE.md)
- [Unity Input System Docs](https://docs.unity3d.com/Packages/com.unity.inputsystem@1.7/manual/index.html)

### Assets Recomendados (Unity Asset Store)

- **Sprites:** "Universal Fighting Engine" (referencia)
- **VFX:** "Cartoon FX Remaster"
- **UI:** "Fantasy UI Borders"

### Herramientas Externas

- **Animación:** DragonBones, Spine
- **Música:** FL Studio, Ableton Live
- **SFX:** Audacity, Freesound.org

---

## 🎬 ROADMAP

### Fase 1: CORE (Completado en este release)

- [x] Sistema de combate completo
- [x] 16 personajes diseñados
- [x] Sistema RPG
- [x] Sistema de misiones
- [x] IA de jefes

### Fase 2: ASSETS (Por completar)

- [ ] Sprites de todos los personajes
- [ ] Animaciones completas
- [ ] Música original
- [ ] SFX de combate

### Fase 3: MODOS (Expansión futura)

- [ ] Modo Online
- [ ] Modo Torneo
- [ ] DLC: Personajes adicionales

---

## 📞 CONTACTO

Para consultas sobre el proyecto, licenciamiento o colaboración:

**Autor:** Fabrizio Raimondi Imfeld  
**Proyecto:** GOD VS DEVIL - ETERNAL WAR  
**Año:** 2024-2025  

---

**¡PREPÁRATE PARA LA BATALLA ETERNA!**

*Este README fue generado como parte del desarrollo del proyecto GOD VS DEVIL*
