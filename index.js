const {dialog} = require('@electron/remote');
const {ipcRenderer, shell, clipboard, nativeImage} = require('electron');
const path = require('path');
window.addEventListener('DOMContentLoaded', () => {
  const asyncBtn = document.querySelector('.async');
  const syncBtn = document.querySelector('.sync');
  asyncBtn.addEventListener('click', () => {
    // 渲染进程异步发送消息
    ipcRenderer.send('msg1', 'coder');
  });
  syncBtn.addEventListener('click', () => {
    // 渲染进程同步发送消息
    let val = ipcRenderer.sendSync('msg2', '同步消息');
    console.log(val);
  });
  ipcRenderer.on('msgRe', (ev, data) => {
    console.log(data);
  });

  // 接收由主进程发送的消息
  ipcRenderer.on('mtp', (ev, data) => {
    console.log(data);
  });

  const subWin1 = document.querySelector('.subWin1');
  subWin1.addEventListener('click', () => {
    ipcRenderer.send('openWin2', 'index~~~');
  });

  ipcRenderer.on('mti', (ev, data) => {
    console.log(data, '-----------');
  });

  // dialog
  const dialogEl = document.querySelector('.dialog');
  dialogEl.addEventListener('click', () => {
    // remote中导入
    dialog
      .showOpenDialog({
        defaultPath: __dirname,
        buttonLabel: '请选择', // 按钮样式
        title: '勿忘初心',
        properties: ['openFile', 'multiSelections'], //['openDirectory'] 只选择文件夹
        filters: [
          // 定义文件筛选
          {
            name: '代码文件',
            extensions: ['js', 'json', 'html']
          },
          {
            name: '图片文件',
            extensions: ['ico', 'jpeg', 'png']
          }
        ]
      })
      .then(ret => {
        console.log(ret); // 可以获取文件路径
      });
  });

  document.querySelector('.error_dialog').addEventListener('click', () => {
    dialog.showErrorBox('custom', 'xxxxx');
  });

  const openUrl = document.querySelector('.openUrl');
  openUrl.addEventListener('click', e => {
    // 阻止在app中跳转，转而利用默认浏览器打开
    e.preventDefault();
    shell.openExternal(openUrl.getAttribute('href'));
  });
  const openFolder = document.querySelector('.openFolder');
  openFolder.addEventListener('click', e => {
    // 打开指定的目录
    shell.showItemInFolder(path.resolve(__dirname));
  });

  document.querySelector('.message').addEventListener('click', () => {
    let option = {
      title: 'coder',
      body: 'xxxx',
      icon: './blog_avatar.jpg'
    };
    let myNotification = new window.Notification(option.title, option);
    myNotification.onclick = function () {
      console.log('点击了消息体');
    };
  });

  /* 剪切板 */
  const ipt = document.querySelector('.ipt');
  const btn = document.querySelector('.clipboard');
  btn.addEventListener('click', () => {
    // 复制内容，往剪贴板中写入
    clipboard.writeText(ipt.value);
    // clipboard.readText(xxx);  // 读取剪贴板内容
  });
  const imgBtn = document.querySelector('.imgBtn');
  imgBtn.addEventListener('click', () => {
    // 将图片放置于剪切板中必须是 nativeImage 实例
    let oImage = nativeImage.createFromPath('./blog_avatar.jpg');
    clipboard.writeImage(oImage);
    let oImg = clipboard.readImage(oImage);
    let oImgDom = new Image();
    oImgDom.src = oImg.toDataURL();
    document.body.appendChild(oImgDom);
  });
});
