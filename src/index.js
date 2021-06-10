let editor;
let filePath = "";
let renderer = new marked.Renderer();
mermaid.initialize({startOnLoad:false});
renderer.code = function(code, language) {
    if(language == 'mermaid'){
        return '<pre class="mermaid">'+code+'\n</pre>';
    }else{
        return '<pre><code>'+code+'</code></pre>';
    }
}

/**
 * @method メインプロセスからのメッセージ受信
 */
window.api.RecvMessage("save-file", () => {
    // console.log(msg);
    saveData();
});
window.api.RecvMessage("open-file", () => {
    console.log("msg");

});


/**
 * @method 初期化
 */
const init = () => {
    editor = ace.edit("editor");
    //editor.setTheme("ace/theme/monokai");                   //テーマ設定
    editor.setFontSize(12);                                 //フォントサイズ
    editor.getSession().setMode("ace/mode/markdown");           //HTMLモード
    editor.getSession().setUseWrapMode(true);               //折り返しあり
    editor.getSession().setTabSize(4);                      //タブ幅

    const fileSelector = document.getElementById("readFileId");
    fileSelector.addEventListener('change', (event) => {
        let file = event.target.files[0];
        loadFile(file);
    });
}

/**
 * @method ファイルロード
 */
const loadFile = file => {
    // console.log(file.path);
    if(file === undefined){
        filePath = "";
        return;
    } else {
        filePath = file.path;
    }
    window.api.LoadFile(file.path);
    let reader = new FileReader();
    reader.readAsText(file);
    reader.onload = function(event){
        let resultStr = event.target.result;
        editor.setValue(resultStr, -1);
    }
}

/**
 * @method 保存
 */
const saveData = async () => {
    let text = editor.getValue();
    if(filePath == ""){
        let blob = new Blob([text],{type:"text/plain"});
        let link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = "memo.md";
        link.click();
    } else {
        const result = await window.api.saveMdFile(text);
    }
    // window.api.LoadFile2(text);
}

/**
 * @method マークダウン再読み込み
 */
const reload = () => {
    let text = editor.getValue();
    document.getElementById("markdown-output").innerHTML = marked(text, { renderer: renderer });
    // console.log(marked(text, { renderer: renderer }));
    mermaid.init();
}

/**
 * @method HTMLファイル出力
 */
const outputFile = async () => {
    let text = document.getElementById("markdown-output").innerHTML;
    if(text === "") return;
    const result = await window.api.saveHtmlFile(text);
    // console.log(text);
}

/**
 * @method ドラッグ時イベント
 */
const handleDragOver = evt => {
    // ドラッグ時にブラウザデフォルトの動作を停止する
    evt.preventDefault();
    evt.dataTransfer.dropEffect = 'copy';
}
/**
 * @method ドロップ時ファイル読込
 */
const execDrop = evt => {
    // ドラッグ時にブラウザデフォルトの動作を停止する
    evt.preventDefault();

    let file = evt.dataTransfer.files[0];
    loadFile(file);
}

