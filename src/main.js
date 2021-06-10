'use strict';

// アプリケーション作成用のモジュールを読み込み
const {app, BrowserWindow, ipcMain, Menu, MenuItem} = require('electron');
const { fstat } = require('original-fs');
const fs = require('fs');
const path = require('path');
// メインウィンドウ
let mainWindow;

/**
 * メインウィンドウ作成関数
 */
function createWindow() {
  // メインウィンドウを作成します
  mainWindow = new BrowserWindow({
    width: 1350,
    height: 700,
    webPreferences: {
      worldSafeExecuteJavaScript: true, // In Electron 12, the default will be changed to true.
      nodeIntegration: false, // XSS対策としてnodeモジュールをレンダラープロセスで使えなくする
      // nodeIntegrationInWorker: false,
      contextIsolation: true, // レンダラープロセスに公開するAPIのファイル
      preload: `${__dirname}/preload.js`,    // preloadを追加
      // enableRemoteModule: true               // warning対策
    },
  });

  // メニューの追加
  const menu = new Menu();
  menu.append(new MenuItem({
    label: 'ファイル',
    submenu: [
      {
        label: 'ファイルを開く',
        accelerator: process.platform === 'darwin' ? 'Cmd+O' : 'Ctrl+O',
        click: () => { 
          // console.log('Electron rocks!');
          mainWindow.webContents.send("open-file");
        }
      },
      {
        label: '上書き保存',
        accelerator: process.platform === 'darwin' ? 'Cmd+S' : 'Ctrl+S',
        click: () => { 
          console.log('Electron rocks2!');
          mainWindow.webContents.send("save-file");
        }
      }
  ]
  }))
  
  Menu.setApplicationMenu(menu);

  mainWindow.loadFile('index.html');        // メインウィンドウに表示するURLを指定します
  mainWindow.webContents.openDevTools();    // デベロッパーツールの起動
  mainWindow.on('closed', () => {           // メインウィンドウが閉じられたときの処理
    mainWindow = null;
  });
}

// ----------------------------------------------------
/*
 * Window関連処理
 * app.onでWindowsの処理を取得する
 */
// ----------------------------------------------------
//  初期化が完了した時の処理
app.on('ready', createWindow);

// 全てのウィンドウが閉じたときの処理
app.on('window-all-closed', () => {
  // macOSのとき以外はアプリケーションを終了させます
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
// アプリケーションがアクティブになった時の処理(Macだと、Dockがクリックされた時）
app.on('activate', () => {
  // メインウィンドウが消えている場合は再度メインウィンドウを作成する
  if (mainWindow === null) {
    createWindow();
  }
});

// ----------------------------------------------------
/*
 * レンダラ―からの処理取得用
 * 
 */
// ----------------------------------------------------
let filePath;
let baseFilePath;
const options = {
  flag: 'w'
};

/**
 * MDファイル保存
 */
 ipcMain.handle("save-md-file", (event, message) => {
  // console.log(message);
  fs.writeFile(baseFilePath,message,options, (err) => {
    if(err) throw err;
  });
  return "正常に書き込みが完了しました";
});
/**
 * htmlファイル保存
 */
ipcMain.handle("save-html-file", (event, message) => {
  // console.log(message);
  fs.writeFile(filePath,message,options, (err) => {
    if(err) throw err;
  });
  return "正常に書き込みが完了しました";
});
/**
 * ファイルを開く
 */
ipcMain.on("load-file", (event, message) => {
  // console.log(message);
  baseFilePath = message;
  filePath = path.dirname(message) + "/" + path.basename(message, '.md') + ".html";
  // console.log(filePath);
  // mainWindow.webContents.send("ipc-recv-message",path.basename(message, '.md'));
});