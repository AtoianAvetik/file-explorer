"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var electron_1 = require("electron");
var path = require("path");
var url = require("url");
var fs = require("fs");
var win;
electron_1.app.on('ready', createWindow);
// initialize the app's main window
electron_1.app.on('activate', function () {
    if (win === null) {
        createWindow();
    }
});
// on macOS, closing the window doesn't quit the app
electron_1.app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') {
        electron_1.app.quit();
    }
});
function createWindow() {
    // Create the browser window.
    win = new electron_1.BrowserWindow({
        width: 1200,
        height: 1000
    });
    if (process.argv[2] === '--serve') {
        // load the running local angular project
        win.loadURL("http://localhost:4200/index.html");
    }
    else {
        // load the dist folder from Angular
        win.loadURL(url.format({
            pathname: path.join(__dirname, "/../../dist/index.html"),
            protocol: 'file:',
            slashes: true
        }));
    }
    // The following is optional and will open the DevTools:
    win.webContents.openDevTools();
    win.on('closed', function () {
        win = null;
    });
}
electron_1.ipcMain.on('getFiles', function (event, arg) {
    var files = fs.readdirSync(__dirname);
    win.webContents.send('getFilesResponse', files);
});
electron_1.ipcMain.on('request-keyboard-shortcut', function (event, shortcut) {
    electron_1.globalShortcut.register(shortcut, function () {
        event.sender.send("keyboard-shortcut-" + shortcut);
    });
});
//# sourceMappingURL=main.js.map