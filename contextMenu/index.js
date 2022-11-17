const remote = require('@electron/remote');
const Menu = remote.Menu;
const contextMenu = [
  {
    // role必传
    label: 'coder',
    role: 'copy'
  },
  {
    lable: 'whyccc',
    role: 'paste',
    click() {
      console.log('whyccc');
    }
  }
];
let menu = Menu.buildFromTemplate(contextMenu);
window.addEventListener('DOMContentLoaded', () => {
  window.addEventListener(
    'contextmenu',
    e => {
      e.preventDefault();
      console.log(1111);
      menu.popup({window: remote.getCurrentWindow()});
    },
    false
  );
});
