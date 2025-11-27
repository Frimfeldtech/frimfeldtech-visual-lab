# 🎮 GUÍA DE COMPILACIÓN - GOD VS DEVIL

## Convertir a Android APK y Windows .exe

**Autor:** Fabrizio Raimondi Imfeld  
**© 2024-2025 Todos los derechos reservados**

---

## 📋 REQUISITOS PREVIOS

### Para AMBAS plataformas

1. **Node.js** (v18 o superior)
   - Descargar: <https://nodejs.org/>
   - Verificar instalación: `node --version`

### Para Android APK

2. **Android Studio**
   - Descargar: <https://developer.android.com/studio>
   - Instalar Android SDK (API 33+)
   - Configurar variables de entorno:

     ```
     ANDROID_HOME=C:\Users\TuUsuario\AppData\Local\Android\Sdk
     PATH=%PATH%;%ANDROID_HOME%\platform-tools;%ANDROID_HOME%\tools
     ```

3. **Java JDK 17**
   - Descargar: <https://www.oracle.com/java/technologies/downloads/#java17>
   - Configurar `JAVA_HOME`

---

## 🔧 INSTALACIÓN INICIAL

Abre PowerShell en la carpeta del juego:

```powershell
cd "e:\Proyectos de apps webs y juegos\god_vs_devil"
```

### Instalar dependencias

```powershell
npm install
```

Esto instalará:

- Electron (para Windows .exe)
- Capacitor (para Android APK)

---

## 🪟 COMPILAR PARA WINDOWS (.exe)

### Método 1: Con Electron (RECOMENDADO)

#### Paso 1: Probar localmente

```powershell
npm start
```

Esto abrirá el juego en una ventana de Electron. Prueba que funcione.

#### Paso 2: Compilar a .exe

```powershell
npm run package-win
```

**Resultado:**

- Carpeta `dist/GodVsDevil-win32-x64/`
- Ejecutable: `GodVsDevil.exe`
- Tamaño: ~150 MB (incluye Chromium)

#### Paso 3: Distribuir

Comprime toda la carpeta `GodVsDevil-win32-x64` en un ZIP y distribuye.

### Método 2: Crear Instalador (Opcional)

Instalar `electron-builder`:

```powershell
npm install --save-dev electron-builder
```

Añadir a `package.json`:

```json
"build": {
  "appId": "com.fabrizioraimondi.godvsdevil",
  "productName": "God vs Devil",
  "win": {
    "target": "nsis",
    "icon": "assets/icon.ico"
  }
}
```

Compilar instalador:

```powershell
npx electron-builder --win
```

Esto crea un instalador `.exe` en `dist/` (~70 MB comprimido).

---

## 📱 COMPILAR PARA ANDROID (APK)

### Paso 1: Inicializar Capacitor

```powershell
npx cap init GodVsDevil com.fabrizioraimondi.godvsdevil --web-dir=.
```

Si ya está inicializado, omite este paso.

### Paso 2: Añadir plataforma Android

```powershell
npx cap add android
```

Esto crea la carpeta `android/` con el proyecto de Android Studio.

### Paso 3: Sincronizar cambios

```powershell
npx cap sync
```

Cada vez que modifiques el código HTML/JS, ejecuta esto.

### Paso 4: Abrir en Android Studio

```powershell
npx cap open android
```

**IMPORTANTE:** Esto abre Android Studio. Espera a que Gradle termine de sincronizar.

### Paso 5: Compilar APK

**Opción A: APK Debug (para probar)**

1. En Android Studio: `Build > Build Bundle(s) / APK(s) > Build APK(s)`
2. Espera a que compile
3. Click "locate" en la notificación
4. APK en: `android/app/build/outputs/apk/debug/app-debug.apk`

**Opción B: APK Release (para publicar)**

1. Necesitas crear una KeyStore (firma)

#### Crear KeyStore

```powershell
keytool -genkey -v -keystore release-key.keystore -keyalg RSA -keysize 2048 -validity 10000 -alias godvsdevil-key
```

Responde las preguntas:

- Contraseña: (guárdala!)
- Nombre, Organización, etc.

2. Configurar en Android Studio:
   - `Build > Generate Signed Bundle / APK`
   - Selecciona APK
   - Elige el keystore que creaste
   - Build variant: release

3. APK firmado en: `android/app/build/outputs/apk/release/app-release.apk`

### Paso 6: Instalar APK en tu teléfono

#### Método 1: USB

1. Conecta tu Android con cable USB
2. Habilita "Depuración USB" en opciones de desarrollador
3. En PowerShell:

```powershell
adb install "e:\Proyectos de apps webs y juegos\god_vs_devil\android\app\build\outputs\apk\debug\app-debug.apk"
```

#### Método 2: Transferir archivo

1. Copia el APK a tu teléfono
2. Abre el archivo APK en el teléfono
3. Permite "Instalar aplicaciones desconocidas"
4. Instala

---

## 🐛 SOLUCIÓN DE PROBLEMAS

### Problema: "npm no reconocido"

**Solución:** Instala Node.js y reinicia PowerShell.

### Problema: "Android SDK not found"

**Solución:**

1. Abre Android Studio
2. `Tools > SDK Manager`
3. Instala Android 13 (API 33) y SDK Tools
4. Configura `ANDROID_HOME`

### Problema: "Gradle sync failed"

**Solución:**

1. En Android Studio: `File > Invalidate Caches and Restart`
2. Espera a que descargue dependencias

### Problema: APK no instala en Android

**Solución:**

- Verifica que sea compatible con tu versión de Android (mínimo API 24 = Android 7.0)
- En APK release, verifica que esté firmado correctamente

### Problema: Pantalla negra en Electron

**Solución:**

- Verifica que `index.html` esté en la raíz
- Abre DevTools (F12) y revisa errores en consola

---

## 📦 OPTIMIZACIÓN Y DISTRIBUCIÓN

### Reducir tamaño del .exe

1. Usa `electron-builder` con compresión NSIS
2. Resultado: ~70 MB (vs ~150 MB con electron-packager)

### Reducir tamaño del APK

1. En `android/app/build.gradle`, habilita ProGuard:

```gradle
buildTypes {
    release {
        minifyEnabled true
        proguardFiles getDefaultProguardFile('proguard-android-optimize.txt'), 'proguard-rules.pro'
    }
}
```

2. Compila de nuevo
3. Resultado: ~10-15 MB (vs ~30 MB sin optimizar)

### App Bundle (AAB) para Google Play

```
Build > Generate Signed Bundle / APK > Android App Bundle
```

Esto crea un `.aab` optimizado para Play Store.

---

## 🚀 PUBLICACIÓN

### Windows .exe

- **itch.io**: Sube el ZIP directamente
- **Steam**: Necesitas Steamworks SDK
- **Sitio web propio**: Hosting + descarga directa

### Android APK

- **Google Play Store**:
  1. Crea cuenta de desarrollador ($25 único pago)
  2. Sube el `.aab`
  3. Completa ficha de la app
  4. Revisión ~1-3 días
  
- **itch.io**: Sube el APK directamente

- **APK directo**: Puedes distribuir el APK en tu sitio web

---

## 🎯 COMANDOS RÁPIDOS

### Windows

```powershell
npm start              # Probar
npm run package-win    # Compilar .exe
```

### Android

```powershell
npx cap sync                 # Sincronizar cambios
npx cap open android         # Abrir Android Studio
adb install ruta/al/app.apk  # Instalar en teléfono
```

---

## 📊 ESPECIFICACIONES FINALES

### Windows .exe

- **Tamaño:** 70-150 MB
- **Requisitos:** Windows 10/11 (64-bit)
- **Distribución:** ZIP o Instalador NSIS

### Android APK

- **Tamaño:** 10-30 MB
- **Requisitos:** Android 7.0+ (API 24+)
- **Permisos:** Ninguno especial requerido

---

## 📝 NOTAS IMPORTANTES

1. **Iconos:** Añade un `icon.ico` (256x256) para Windows y `icon.png` (512x512) para Android en la carpeta `assets/`

2. **Splash Screen (Android):**
   - Crea `res/drawable/splash.png` (2048x2048 max)
   - Capacitor lo mostrará al iniciar

3. **Performance:**
   - El juego web funciona bien en ambas plataformas
   - En Android, puede haber lag en dispositivos antiguos

4. **Actualizar el juego:**
   - Modifica los archivos HTML/CSS/JS
   - Windows: `npm run package-win` de nuevo
   - Android: `npx cap sync` y recompila en Android Studio

---

## ✅ CHECKLIST DE LANZAMIENTO

### Antes de compilar

- [ ] Probar el juego en navegador (sin errores de consola)
- [ ] Crear iconos (icon.ico, icon.png)
- [ ] Actualizar versión en `package.json`
- [ ] Cambiar `appId` en `capacitor.config.json` si es necesario

### Windows

- [ ] Compilar con `npm run package-win`
- [ ] Probar el .exe en una PC limpia
- [ ] Crear README.txt con instrucciones
- [ ] Comprimir en ZIP

### Android

- [ ] `npx cap sync`
- [ ] Compilar APK release firmado
- [ ] Instalar en al menos 2 dispositivos diferentes
- [ ] Verificar que no crashea

---

## 🆘 SOPORTE

Si tienes problemas:

1. Revisa los logs en Android Studio o Electron DevTools
2. Consulta la documentación oficial:
   - Electron: <https://www.electronjs.org/docs>
   - Capacitor: <https://capacitorjs.com/docs>

---

**Creado por:** Fabrizio Raimondi Imfeld  
**Proyecto:** GOD VS DEVIL - ETERNAL WAR  
**© 2024-2025 Todos los derechos reservados**

---

¡Listo para compilar! 🎮🔥
