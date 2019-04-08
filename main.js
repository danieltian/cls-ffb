const { app, BrowserWindow } = require('electron')
const { default: installExtension, VUEJS_DEVTOOLS } = require('electron-devtools-installer')

let window

function createWindow() {
  installExtension(VUEJS_DEVTOOLS)

  window = new BrowserWindow({
    width: 1800,
    height: 1100,
    webPreferences: {
      nodeIntegration: true
    }
  })

  window.loadURL('http://localhost:8080')

  // Open the dev tools after the window finishes loading to avoid an error message.
  window.webContents.addListener('did-frame-finish-load', () => {
    window.webContents.openDevTools()
  })

  window.on('closed', () => {
    window = undefined
  })
}

app.on('ready', createWindow)