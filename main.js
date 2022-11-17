const {app, BrowserWindow, ipcMain, Menu, globalShortcut} = require('electron');
const remote = require('@electron/remote/main');
remote.initialize();
let mainWinId;
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
  mainWinId = mainWin.id;
  let temp = [
    {
      label: 'send',
      click() {
        // 主进程主动发送消息
        BrowserWindow.getFocusedWindow().webContents.send('mtp', '由主进程发送的消息');
      }
    }
  ];
  let menu = Menu.buildFromTemplate(temp);
  Menu.setApplicationMenu(menu); // 自定义菜单
  remote.enable(mainWin.webContents);
  mainWin.on('ready-to-show', () => {
    mainWin.show();
  });

  mainWin.loadFile('index.html');
  mainWin.webContents.openDevTools(); // 自动打开控制台
}
app.on('ready', createWindow);
app.on('ready', () => {
  // 注册快捷键
  let ret = globalShortcut.register('ctrl + q', () => {
    console.log('ctrl+q');
  });
  if (!ret) {
    console.log('register fail');
  }
  // 判断快捷键是否已注册
  console.log(globalShortcut.isRegistered('ctrl + q'));
});
app.on('will-quit', () => {
  // 取消注册快捷键
  globalShortcut.unregister('ctrl + q');
  globalShortcut.unregisterAll();
});

ipcMain.on('msg1', (ev, data) => {
  console.log(data);
  // 回送渲染进程
  ev.sender.send('msgRe', 'whycccMain');
});
ipcMain.on('msg2', (ev, data) => {
  console.log(data);
  ev.returnValue = '来自于主进程的同步消息';
});

// 接收其他进程发送的数据，完成相应操作
ipcMain.on('openWin2', (ev, data) => {
  // 创建一个新窗口
  let subWin1 = new BrowserWindow({
    width: 400,
    height: 300,
    parent: BrowserWindow.fromId(mainWinId),
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });
  subWin1.loadFile('./subWin1.html');
  subWin1.webContents.openDevTools();
  subWin1.on('close', () => {
    subWin1 = null;
  });

  subWin1.webContents.on('did-finish-load', () => {
    subWin1.webContents.send('its', data);
  });
});

// 接收渲染进程一的消息
ipcMain.on('stm', (ev, data) => {
  // 获取渲染进程二
  let mainWin = BrowserWindow.fromId(mainWinId);
  // 将数据传递给渲染进程二
  mainWin.webContents.send('mti', data);
});
