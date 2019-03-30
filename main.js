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
  window.webContents.openDevTools()

  window.on('closed', function () {
    window = undefined
  })
}

app.on('ready', createWindow)