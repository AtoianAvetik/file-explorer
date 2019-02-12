import {app, BrowserWindow, ipcMain, globalShortcut} from 'electron';
import * as path from 'path';
import * as url from 'url';
import * as fs from 'fs';

let win: BrowserWindow;

app.on('ready', createWindow);

// initialize the app's main window
app.on('activate', () => {
  if (win === null) {
    createWindow();
  }
});

// on macOS, closing the window doesn't quit the app
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

function createWindow() {
  // Create the browser window.
  win = new BrowserWindow({
    width: 1200,
    height: 1000
  });

  if ( process.argv[2] === '--serve' ) {
    // load the running local angular project
    win.loadURL(`http://localhost:4200/index.html`);
  } else {
    // load the dist folder from Angular
    win.loadURL(
      url.format({
        pathname: path.join(__dirname, `/../../dist/index.html`),
        protocol: 'file:',
        slashes: true
      })
    );
  }


  // The following is optional and will open the DevTools:
  win.webContents.openDevTools();

  win.on('closed', () => {   // only for macOS
    win = null;
  });
}

ipcMain.on('getFiles', (event, arg) => {
  const files = fs.readdirSync(__dirname);
  win.webContents.send('getFilesResponse', files);
});

ipcMain.on('request-keyboard-shortcut', (event, shortcut) => {
  globalShortcut.register(shortcut, () => {
    event.sender.send(`keyboard-shortcut-${shortcut}`);
  });
});
