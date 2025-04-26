import { app, BrowserWindow, Tray, Menu, globalShortcut } from 'electron';
import * as path from 'path';

let mainWindow: BrowserWindow | null = null;
let tray: Tray | null = null;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 350,
    height: 600,
    transparent: true,
    frame: false,
    alwaysOnTop: true,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  mainWindow.loadURL(
    process.env.NODE_ENV === 'development'
      ? 'http://localhost:8080'
      : `file://${path.join(__dirname, '../renderer/index.html')}`,
  );

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.whenReady().then(() => {
  createWindow();

  tray = new Tray(path.join(__dirname, '../../public/icon.png'));
  const contextMenu = Menu.buildFromTemplate([
    { label: 'Pause', type: 'normal', click: () => {/* TODO: Pause logic */} },
    { label: 'Resume', type: 'normal', click: () => {/* TODO: Resume logic */} },
    { type: 'separator' },
    { label: 'Quit', type: 'normal', click: () => app.quit() },
  ]);
  tray.setToolTip('Wellbeing Bubbles');
  tray.setContextMenu(contextMenu);

  // Example global shortcut (to be configurable)
  globalShortcut.register('CommandOrControl+Shift+P', () => {
    // TODO: Toggle pause/resume
  });

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});