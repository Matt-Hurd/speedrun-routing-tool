const { app, BrowserWindow } = require('electron');
const path = require('path');
const isDev = require('electron-is-dev');

try {
    require('electron-reloader')(module)
} catch (_) {}

let mainWindow;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 900,
        height: 680,
        webPreferences: {
            nodeIntegration: true
        }
    });

    mainWindow.loadURL(
        isDev
            ? 'http://localhost:3000'  // Assuming you run your dev server on this port
            : `file://${path.join(__dirname, '../build/index.html')}`
    );

    mainWindow.on('closed', () => (mainWindow = null));
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (mainWindow === null) {
        createWindow();
    }
});
