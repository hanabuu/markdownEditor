```
PS C:\work\nodejs\workspace\testElectron2> npm init
This utility will walk you through creating a package.json file.
It only covers the most common items, and tries to guess sensible defaults.

See `npm help init` for definitive documentation on these fields
and exactly what they do.

Use `npm install <pkg>` afterwards to install a package and
save it as a dependency in the package.json file.

Press ^C at any time to quit.
package name: (testelectron2)
version: (1.0.0)
description: TestElectron2
entry point: (index.js)
test command: testElectron2
git repository:
keywords: electron
author: hanabusa
license: (ISC)
About to write to C:\work\nodejs\workspace\testElectron2\package.json:

{
  "name": "testelectron2",
  "version": "1.0.0",
  "description": "TestElectron2",
  "main": "index.js",
  "scripts": {
    "test": "testElectron2"
  },
  "keywords": [
    "electron"
  ],
  "author": "hanabusa",
  "license": "ISC"
}


Is this OK? (yes)
```

## パッケージ
### electron
```
$ npm install electron
// Welcom画面表示
$ npx electron
```


#### 簡単な動作確認
```
$ npx electron src
```
* 動作させてみる方法

### electron-packager
```
$ npm install electron-packager
```

## パッケージ化
### コマンド実行
* コマンド実行の場合
```
$ electron-packager ./src my_electron --platform=win32 --arch=x64 --overwrite
```

### コマンド化
* package.jsonに以下のコマンドを追加してやるといい
```
"scripts": {
    :
  "build-windows": "electron-packager ./src my_electron --platform=win32 --arch=x64 --overwrite"
    :
}
```

* コマンドから以下実行
```
$ npm run build-windows
```


## 参考
https://qiita.com/gat3ta/items/1e9ada8d81d423d60493


## 参考のmermaid
```
# a

```mermaid
	graph TD
	  A-->B
	  A-->C
	  B-->D
	  C-->D
```
```

## file操作
https://blog.katsubemakito.net/nodejs/file-write

## path操作
https://tech.chakapoko.com/nodejs/file/path.html

## ファイルパスの指定
新規作成で保存したときに、ファイルパスを保存する処理必要
ほかにもいるかも