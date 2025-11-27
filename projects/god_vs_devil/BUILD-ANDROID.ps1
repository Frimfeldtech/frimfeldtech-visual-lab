# GOD VS DEVIL - BUILD SCRIPT FOR ANDROID
# © 2024-2025 Fabrizio Raimondi Imfeld

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  GOD VS DEVIL - BUILD SCRIPT ANDROID" -ForegroundColor Yellow
Write-Host "  Preparador de APK" -ForegroundColor Yellow
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Verificar Node.js
Write-Host "[1/4] Verificando Node.js..." -ForegroundColor Green
$nodeVersion = node --version 2>$null
if (-not $nodeVersion) {
    Write-Host "ERROR: Node.js no está instalado." -ForegroundColor Red
    pause
    exit 1
}
Write-Host "✓ Node.js instalado: $nodeVersion" -ForegroundColor Green
Write-Host ""

# Verificar Android SDK
Write-Host "[2/4] Verificando Android SDK..." -ForegroundColor Green
$androidHome = $env:ANDROID_HOME
if (-not $androidHome) {
    Write-Host "ADVERTENCIA: ANDROID_HOME no está configurado." -ForegroundColor Yellow
    Write-Host "Necesitas Android Studio instalado." -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Después de instalar Android Studio:" -ForegroundColor Cyan
    Write-Host "1. Abre Android Studio" -ForegroundColor White
    Write-Host "2. Tools > SDK Manager" -ForegroundColor White
    Write-Host "3. Anota la ruta del SDK" -ForegroundColor White
    Write-Host "4. Configura ANDROID_HOME en variables de entorno" -ForegroundColor White
    Write-Host ""
} else {
    Write-Host "✓ ANDROID_HOME: $androidHome" -ForegroundColor Green
}
Write-Host ""

# Instalar dependencias
Write-Host "[3/4] Instalando dependencias..." -ForegroundColor Green
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: No se pudieron instalar las dependencias." -ForegroundColor Red
    pause
    exit 1
}
Write-Host "✓ Dependencias instaladas" -ForegroundColor Green
Write-Host ""

# Inicializar Capacitor
Write-Host "[4/4] Configurando proyecto Android..." -ForegroundColor Green

if (-not (Test-Path "android\")) {
    Write-Host "Inicializando Capacitor..." -ForegroundColor Cyan
    npx cap add android
    if ($LASTEXITCODE -ne 0) {
        Write-Host "ERROR: No se pudo añadir plataforma Android." -ForegroundColor Red
        pause
        exit 1
    }
}

Write-Host "Sincronizando archivos web..." -ForegroundColor Cyan
npx cap sync
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: No se pudo sincronizar." -ForegroundColor Red
    pause
    exit 1
}

Write-Host "✓ Proyecto Android listo" -ForegroundColor Green
Write-Host ""

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "SIGUIENTE PASO:" -ForegroundColor Yellow
Write-Host ""
Write-Host "1. Abre Android Studio:" -ForegroundColor Cyan
Write-Host "   npx cap open android" -ForegroundColor White
Write-Host ""
Write-Host "2. Espera a que Gradle sincronice" -ForegroundColor Cyan
Write-Host ""
Write-Host "3. Para APK Debug (pruebas):" -ForegroundColor Cyan
Write-Host "   Build > Build Bundle(s) / APK(s) > Build APK(s)" -ForegroundColor White
Write-Host ""
Write-Host "4. Para APK Release (publicar):" -ForegroundColor Cyan
Write-Host "   Build > Generate Signed Bundle / APK" -ForegroundColor White
Write-Host "   Necesitarás crear una KeyStore primero" -ForegroundColor Yellow
Write-Host ""
Write-Host "5. El APK estará en:" -ForegroundColor Cyan
Write-Host "   android\app\build\outputs\apk\debug\app-debug.apk" -ForegroundColor White
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "¿Abrir Android Studio ahora? (s/n)" -ForegroundColor Yellow
$open = Read-Host
if ($open -eq "s" -or $open -eq "S") {
    npx cap open android
} else {
    Write-Host "Puedes abrirlo manualmente después con:" -ForegroundColor Cyan
    Write-Host "npx cap open android" -ForegroundColor White
}

Write-Host ""
Write-Host "Presiona cualquier tecla para salir..."
pause
