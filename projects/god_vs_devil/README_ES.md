# 🎮 GOD VS DEVIL - ETERNAL WAR

**Juego de lucha 2D | Arcángeles vs Demonios**  
**Autor:** Fabrizio Raimondi Imfeld  
**© 2024-2025 Todos los derechos reservados**

---

## 🚀 INICIO RÁPIDO

### Jugar en el navegador

1. Abre `index.html` en Chrome/Edge/Firefox
2. Selecciona modo de juego
3. Elige personaje
4. ¡Lucha!

### Controles

- **Movimiento:** Flechas ← → ↑
- **Puño:** J
- **Patada:** K
- **Especial:** L
- **Bloqueo:** Shift

---

## 📦 COMPILAR A APLICACIÓN

### 🪟 **Windows .exe:**

```powershell
# Ejecutar script automatizado:
.\BUILD-WINDOWS.ps1

# O manualmente:
npm install
npm run package-win
```

**Resultado:** `dist/GodVsDevil-win32-x64/GodVsDevil.exe`

### 📱 **Android APK:**

```powershell
# Ejecutar script automatizado:
.\BUILD-ANDROID.ps1

# O manualmente:
npm install
npx cap add android
npx cap sync
npx cap open android
# Luego compilar en Android Studio
```

**Resultado:** `android/app/build/outputs/apk/debug/app-debug.apk`

---

## 📖 DOCUMENTACIÓN COMPLETA

- **Guía de Compilación Completa:** [GUIA_COMPILACION.md](GUIA_COMPILACION.md)
- **Proyecto Unity (código fuente):** [Unity_GodVsDevil/](Unity_GodVsDevil/)

---

## 🎮 PERSONAJES

### Arcángeles (7)

MIGUEL, JOFIEL, CHAMUEL, GABRIEL, RAFAEL, URIEL, ZADKIEL

### Demonios (7)

VULDROK, XYPHORA, RAGNOR, VORAKH, SKARN, THUL-GAT, LUCIFER

---

## 🛠 TECNOLOGÍAS

- **Web:** HTML5 Canvas, JavaScript ES6
- **Windows:** Electron
- **Android:** Capacitor
- **Unity:** C# (código fuente en Unity_GodVsDevil/)

---

## 📝 LICENCIA

**TODOS LOS DERECHOS RESERVADOS**

Este juego, su código, personajes y assets son propiedad exclusiva de **Fabrizio Raimondi Imfeld**.

El uso no autorizado está prohibido.

---

## 🆘 SOPORTE

**¿Problemas al compilar?** Lee [GUIA_COMPILACION.md](GUIA_COMPILACION.md)

**¿Bugs en el juego?** Abre la consola del navegador (F12) y revisa errores.

---

**¡Que comience la guerra eterna! ⚔️**
