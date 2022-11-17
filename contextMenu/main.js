const {app, BrowserWindow} = require('electron');
const remote = require('@electron/remote/main');
remote.initialize();
function createWindow() {
  let mainWin = new BrowserWindow({
    x: 10,
    y: 10,
    show: false,
    webPreferences: {
      nodeIntegration: true, // 允许node集成环境
      contextIsolation: false
    }
  });
  remote.enable(mainWin.webContents);
  mainWin.on('ready-to-show', () => {
    mainWin.show();
  });

  mainWin.loadFile('index.html');
  mainWin.webContents.openDevTools();
}
app.on('ready', createWindow);
