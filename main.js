const {app, BrowserWindow} = require('electron');
const Promise = require("bluebird");
const  db = require("sqlite");



function createWindow() {
  win = new BrowserWindow({width: 800, height: 600})
  win.loadURL(`file://${__dirname}/index.html`);
  win.webContents.openDevTools();
  win.on('closed', () => {
    win = null
  });

  // global.coon  = new sql.Database("./db.sqlite");
  Promise.resolve()
    .then(() => db.open('./database.sqlite', {Promise}))
    .then(coon=>{
      "use strict";
      global.coon = coon;
    })
}

app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (win === null) {
    createWindow()
  }
})