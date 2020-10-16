 
import { app, protocol, BrowserWindow,dialog,Menu  } from "electron";
// import db from '@/plugins/db'
import sq3 from 'sqlite3';
import path from 'path'; 
import ipc  from 'ipc2promise'
import { createProtocol } from "vue-cli-plugin-electron-builder/lib";
import installExtension, { VUEJS_DEVTOOLS } from "electron-devtools-installer";  
const isDevelopment = process.env.NODE_ENV !== "production";
// String

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win;

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
  { scheme: "app", privileges: { secure: true, standard: true } }
]);
Menu.setApplicationMenu(null)
function createWindow() {
  // Create the browser window.
  win = new BrowserWindow({
    width: 800,
    title:"今天我干了啥",
    height: 600,
    webPreferences: {
      // Use pluginOptions.nodeIntegration, leave this alone
      // See nklayman.github.io/vue-cli-plugin-electron-builder/guide/security.html#node-integration for more info
      nodeIntegration: process.env.ELECTRON_NODE_INTEGRATION
    }
  });
  
  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
    win.loadURL(process.env.WEBPACK_DEV_SERVER_URL);
    if (!process.env.IS_TEST) win.webContents.openDevTools();
  } else {
    createProtocol("app");
    // Load the index.html when not in development
    win.loadURL("app://./index.html");
  }
  ipc.on('open-directory-dialog',async(e,data,resolve,reject)=>{
    dialog.showOpenDialog({
      title:"选择你的浏览记录文件",
      properties:['openFile']
    }).then(files=>{
 
        if(!files.canceled){
          resolve(files);
        }else{
          reject(files)
        } 
    }).catch(res=>{ 
      reject(res)
    })
    // fs.copyFile(data,path.join( __dirname,'History'))
  })

  ipc.on('sql',async(event,data,resolve,reject)=>{ 

    const sqlite3 = sq3.verbose();
    const db = new sqlite3.Database(data.folder);
    db.all(data.sql,function(err,res){
      if(!err){
        resolve(res);
      }
      else{
        // console.log(err)
        reject(err);
      }
    });
  })

  win.on("closed", () => {
    win = null;
  });
}

// Quit when all windows are closed.
app.on("window-all-closed", () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (win === null) {
    createWindow();
  }
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", async () => {
  if (isDevelopment && !process.env.IS_TEST) {
    // Install Vue Devtools
    try {
      await installExtension(VUEJS_DEVTOOLS);
    } catch (e) {
      console.error("Vue Devtools failed to install:", e.toString());
    }
  }
  createWindow();
});

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
  if (process.platform === "win32") {
    process.on("message", data => {
      if (data === "graceful-exit") {
        app.quit();
      }
    });
  } else {
    process.on("SIGTERM", () => {
      app.quit();
    });
  }
}
