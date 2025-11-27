const { app, BrowserWindow } = require('electron');
const path = require('path');

/**
 * GOD VS DEVIL - Electron Main Process
 * © 2024-2025 Fabrizio Raimondi Imfeld
 */

function createWindow() {
    const win = new BrowserWindow({
        width: 1280,
        height: 800,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true
        },
        icon: path.join(__dirname, 'assets', 'icon.png'),
        title: 'GOD VS DEVIL - ETERNAL WAR',
        backgroundColor: '#000000',
        resizable: true,
        fullscreen: false,
        autoHideMenuBar: true
    });

    // Cargar index.html
    win.loadFile('index.html');

    // Abrir DevTools en desarrollo (comentar en producción)
    // win.webContents.openDevTools();

    // Maximizar ventana al iniciar
    win.maximize();
}

app.whenReady().then(() => {
    createWindow();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});
