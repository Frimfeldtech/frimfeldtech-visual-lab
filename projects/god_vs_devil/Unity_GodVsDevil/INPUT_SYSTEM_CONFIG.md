# CONFIGURACIÓN UNITY INPUT SYSTEM

## GOD VS DEVIL - Mapeo de Controles

Este archivo describe cómo configurar el Unity Input System para el proyecto.

---

## CREACIÓN DEL INPUT ACTIONS ASSET

1. En Unity, click derecho en `Assets/Settings/` → Create → Input Actions
2. Nombrar: `FighterInputActions`
3. Doble click para abrir el editor

---

## CONFIGURACIÓN DE ACTION MAPS

### Action Map: "Fighter"

#### Actions

**1. Move**

- Action Type: Value
- Control Type: Vector2
- Bindings:
  - Keyboard: WASD Composite
    - Up: W
    - Down: S
    - Left: A
    - Right: D
  - Keyboard Alt: Arrow Keys Composite
    - Up: ↑
    - Down: ↓
    - Left: ←
    - Right: →
  - Gamepad: `<Gamepad>/leftStick`
  - Gamepad Alt: `<Gamepad>/dpad`

**2. Punch**

- Action Type: Button
- Bindings:
  - Keyboard: J
  - Gamepad: `<Gamepad>/buttonWest` (X en Xbox, ▢ en PlayStation)

**3. Kick**

- Action Type: Button
- Bindings:
  - Keyboard: K
  - Gamepad: `<Gamepad>/buttonSouth` (A en Xbox, × en PlayStation)

**4. Grab**

- Action Type: Button
- Bindings:
  - Keyboard: L
  - Gamepad: `<Gamepad>/buttonEast` (B en Xbox, ○ en PlayStation)

**5. Block**

- Action Type: Button
- Bindings:
  - Keyboard: Shift (izquierdo)
  - Gamepad: Automático (se detecta por dirección hacia atrás)

**6. ChargeEnergy**

- Action Type: Button
- Interaction: Hold (0.1s)
- Bindings:
  - Keyboard: Space
  - Gamepad: Composite `<Gamepad>/leftShoulder` + `<Gamepad>/rightShoulder`
    - Binding 1: `<Gamepad>/leftShoulder` (LB)
    - Binding 2: `<Gamepad>/rightShoulder` (RB)
    - Modifier: Both Pressed

**7. Ultimate**

- Action Type: Button
- Interaction: Press
- Bindings:
  - Keyboard: Q + E (Composite)
    - Binding 1: Q
    - Binding 2: E
    - Modifier: Both Pressed
  - Gamepad: Composite `<Gamepad>/leftTrigger` + `<Gamepad>/rightTrigger`
    - Binding 1: `<Gamepad>/leftTrigger` (LT)
    - Binding 2: `<Gamepad>/rightTrigger` (RT)
    - Modifier: Both Pressed

**8. Pause**

- Action Type: Button
- Bindings:
  - Keyboard: Escape
  - Gamepad: `<Gamepad>/start`

---

## CONFIGURACIÓN EN UNITY

### 1. Generar Clase C #

En el Input Actions editor:

- Click "Generate C# Class"
- Namespace: `GodVsDevil.Input`
- Class Name: `FighterInputActions`
- Output Path: `Scripts/Input/FighterInputActions.cs`

### 2. Configurar Player Input Component

En el Prefab del Fighter:

1. Añadir componente `Player Input`
2. Asignar `FighterInputActions` en "Actions"
3. Default Map: "Fighter"
4. Behavior: "Invoke Unity Events" o "Send Messages"
5. Control Scheme: Auto (detecta automáticamente)

### 3. Vincular con FighterController

```csharp
using UnityEngine.InputSystem;

public class FighterController : MonoBehaviour
{
    private FighterInputActions inputActions;
    
    private void Awake()
    {
        inputActions = new FighterInputActions();
    }
    
    private void OnEnable()
    {
        inputActions.Fighter.Enable();
        
        // Suscribirse a eventos
        inputActions.Fighter.Punch.performed += OnPunch;
        inputActions.Fighter.Kick.performed += OnKick;
        inputActions.Fighter.Ultimate.performed += OnUltimate;
        // etc...
    }
    
    private void OnDisable()
    {
        inputActions.Fighter.Disable();
        
        // Desuscribirse
        inputActions.Fighter.Punch.performed -= OnPunch;
        // etc...
    }
}
```

---

## CONTROL SCHEMES

### Keyboard & Mouse

- Device Required: Keyboard
- Optional: Mouse (para menús)

### Gamepad

- Device Required: Gamepad
- Supported:
  - Xbox Controller (360, One, Series)
  - PlayStation Controller (DualShock 4, DualSense)
  - Generic Gamepad

---

## MULTIPLAYER LOCAL

Para 2 jugadores locales:

### Jugador 1

- Keyboard: WASD + JKL
- Gamepad 1: Conectado primero

### Jugador 2

- Keyboard: Arrow Keys + Numpad
- Gamepad 2: Conectado segundo

Configurar en `PlayerInputManager`:

- Joining Behavior: "Join Players When Button Is Pressed"
- Join Action: Cualquier botón
- Max Player Count: 2

---

## ANDROID TOUCH CONTROLS (Futuro)

Para la versión Android, añadir:

### Virtual Joystick (Move)

- On-Screen Stick
- Binding Path: `<Touchscreen>/position`

### Touch Buttons

- Punch: Virtual Button → Binding: `<Touchscreen>/primaryTouch/press`
- Kick: Virtual Button → Binding: `<Touchscreen>/touch1/press`
- etc.

**Usar Unity UI + On-Screen Control components del Input System.**

---

## DEBUGGING

### Test Input Actions

1. Window → Analysis → Input Debugger
2. Seleccionar dispositivo
3. Presionar botones para ver si se detectan
4. Verificar Action Maps activos

### Common Issues

- **Input no funciona:** Verificar que Action Map esté enabled
- **Botones no responden:** Revisar bindings en Input Debugger
- **Gamepad no detectado:** Verificar "Control Schemes"

---

## REFERENCIAS

- [Unity Input System Package](https://docs.unity3d.com/Packages/com.unity.inputsystem@1.7/manual/index.html)
- [Rebinding UI](https://docs.unity3d.com/Packages/com.unity.inputsystem@1.7/manual/ActionBindings.html#runtime-rebinding)

---

**Configuración creada por:** Fabrizio Raimondi Imfeld  
**Proyecto:** GOD VS DEVIL  
**© 2024-2025 Todos los derechos reservados**
