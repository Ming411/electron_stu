const {ipcRenderer} = require('electron');

window.onload = function () {
  ipcRenderer.send('stm', 'subWin~');
  ipcRenderer.on('its', (ev, data) => {
    console.log(data);
  });
};
