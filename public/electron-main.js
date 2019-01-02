const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;

let mainWindow;

const createWindow = () => {
    mainWindow = new BrowserWindow({width: 1000, height: 800});

    mainWindow.loadFile('index.html');
    // mainWindow.webContents.openDevTools();

    mainWindow.on('close', () => {
        mainWindow = null;
    });

}

app.on('ready', createWindow)
app.on('window-all-closed', () => app.quit());
app.on('activate', () => (mainWindow || createWindow()));