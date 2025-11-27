# GOD VS DEVIL - BUILD SCRIPT FOR WINDOWS
# © 2024-2025 Fabrizio Raimondi Imfeld

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  GOD VS DEVIL - BUILD SCRIPT" -ForegroundColor Yellow
Write-Host "  Compilador automático a .exe" -ForegroundColor Yellow
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Verificar Node.js
Write-Host "[1/5] Verificando Node.js..." -ForegroundColor Green
$nodeVersion = node --version 2>$null
if (-not $nodeVersion) {
    Write-Host "ERROR: Node.js no está instalado." -ForegroundColor Red
    Write-Host "Descárgalo desde: https://nodejs.org/" -ForegroundColor Yellow
    pause
    exit 1
}
Write-Host "✓ Node.js instalado: $nodeVersion" -ForegroundColor Green
Write-Host ""

# Verificar package.json
if (-not (Test-Path "package.json")) {
    Write-Host "ERROR: package.json no encontrado." -ForegroundColor Red
    Write-Host "Asegúrate de ejecutar este script en la carpeta del juego." -ForegroundColor Yellow
    pause
    exit 1
}

# Instalar dependencias
Write-Host "[2/5] Instalando dependencias..." -ForegroundColor Green
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: No se pudieron instalar las dependencias." -ForegroundColor Red
    pause
    exit 1
}
Write-Host "✓ Dependencias instaladas" -ForegroundColor Green
Write-Host ""

# Probar el juego
Write-Host "[3/5] ¿Quieres probar el juego antes de compilar? (s/n)" -ForegroundColor Yellow
$test = Read-Host
if ($test -eq "s" -or $test -eq "S") {
    Write-Host "Abriendo juego en Electron..." -ForegroundColor Cyan
    npm start
}

# Compilar
Write-Host ""
Write-Host "[4/5] Compilando a .exe..." -ForegroundColor Green
Write-Host "Esto puede tardar unos minutos..." -ForegroundColor Yellow
npm run package-win

if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Falló la compilación." -ForegroundColor Red
    pause
    exit 1
}
Write-Host "✓ Compilación exitosa!" -ForegroundColor Green
Write-Host ""

# Verificar resultado
$exePath = "dist\GodVsDevil-win32-x64\GodVsDevil.exe"
if (Test-Path $exePath) {
    Write-Host "[5/5] ¡ÉXITO!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Tu juego está en:" -ForegroundColor Cyan
    Write-Host (Resolve-Path "dist\GodVsDevil-win32-x64") -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Ejecutable:" -ForegroundColor Cyan
    Write-Host "GodVsDevil.exe" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Para distribuir:" -ForegroundColor Cyan
    Write-Host "1. Comprime toda la carpeta 'GodVsDevil-win32-x64' en un ZIP" -ForegroundColor White
    Write-Host "2. Distribuye el ZIP a tus usuarios" -ForegroundColor White
    Write-Host "3. Ellos extraen y ejecutan GodVsDevil.exe" -ForegroundColor White
    Write-Host ""
    
    # Preguntar si desea abrir carpeta
    Write-Host "¿Abrir carpeta de salida? (s/n)" -ForegroundColor Yellow
    $open = Read-Host
    if ($open -eq "s" -or $open -eq "S") {
        explorer "dist\GodVsDevil-win32-x64"
    }
} else {
    Write-Host "ERROR: No se encontró el ejecutable." -ForegroundColor Red
    Write-Host "Revisa los errores arriba." -ForegroundColor Yellow
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Presiona cualquier tecla para salir..."
pause
