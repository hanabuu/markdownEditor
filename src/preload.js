const { contextBridge, ipcRenderer} = require("electron");

contextBridge.exposeInMainWorld(
  "api", {
      saveMdFile: (str) =>
        ipcRenderer.invoke("save-md-file", str)
                .then(result => result)
                .catch(err => console.log(err)),

      saveHtmlFile: (str) =>
        ipcRenderer.invoke("save-html-file", str)
            .then(result => result)
            .catch(err => console.log(err)),

      LoadFile: (str) => ipcRenderer.send("load-file", str),

      RecvMessage: (channel, listener) => {
        ipcRenderer.on(channel, (event, arg) => listener(arg));
      }

    // send: (channel, data) => { // レンダラーからの送信用
    //   ipcRenderer.send(channel, data);
    // },
    // on: (channel, func) => { // メインプロセスからの受信用
    //   ipcRenderer.on(channel, (event, ...args) => func(...args));
    // }

  }
);
