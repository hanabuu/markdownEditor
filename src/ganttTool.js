let record;

/**
 * 初期化関数
 * @param なし
 */
const init = () => {
    const loadData = localStorage.getItem("ganttTool");
    if(loadData != null) {
        record = JSON.parse(loadData);
        //console.log(record);
        for(const rec of record){
            let addData = {"taskName" : rec["taskName"], "start" : rec["start"], "end" : rec["end"], "user" : rec["user"]};
            //console.log(addData);
            addProcess(rec);
            reloadChart();
        }
    } else {
        let message = document.getElementById("message");
        message.innerText = "ストレージにデータはありません。";
    }
}

/**
 * 工程追加関数ボタン押下時処理
 * @param なし
 * @return なし
 * @note "新規工程追加"ボタン押下時処理
 */
const addProcessBtn = () => {
    let addData = {"taskName" : "", "start" : "2020-05-01", "end" : "2020-05-01", "user" : ""};
    addProcess(addData);
}

/**
 * 工程テーブル追加処理
 * @param {Array} data
 * @return なし
 * @note 工数テーブルへの追加共通処理
 */
const addProcess = data => {
    
    //テーブル取得
    let table = document.getElementById('process');
    //行数取得(id付与の為)
    let rowCount = table.rows.length;
    //行追加
    let row = table.insertRow(-1);
   	//カラム作成
    let cell1 = row.insertCell(-1);
	cell1.innerHTML = `<input type="text" id="taskName${rowCount}" value="${data["taskName"]}">`;
	var cell2 = row.insertCell(-1);
	cell2.innerHTML = `<input type="date" id="startDate${rowCount}" value="${data["start"]}">`;
	var cell3 = row.insertCell(-1);
	cell3.innerHTML = `<input type="date" id="endDate${rowCount}" value="${data["end"]}">`;
    var cell4 = row.insertCell(-1);
    cell4.innerHTML = `<input type="text" id="user${rowCount}" value="${data["user"]}">`;

    table.style.display = "block";
}

/**
 * チャートをリロードする
 * @param なし
 * @return なし
 */
const reloadChart = () => {
    let chartDiv = document.getElementById("chart");        //描画スペースのオブジェクトを取得
    chartDiv.removeAttribute('data-processed');             //描画スペースを削除する
    // excludesは休日設定？
    let chartText = `
        gantt
        title test Gantt Diagram
        dateFormat YYYY-MM-DD
        excludes weekdays 2020-05-01
        section test
    `;

    let table = document.getElementById('process');
    for(let rowCount = 1; rowCount < table.rows.length; rowCount++ ) {
        let taskName = document.getElementById(`taskName${rowCount}`).value;
        let startDate = document.getElementById(`startDate${rowCount}`).value;
        let start = getStringFormatDate(startDate, "YYYY-MM-DD");
        let endDate = document.getElementById(`endDate${rowCount}`).value;
        let end = getStringFormatDate(endDate, "YYYY-MM-DD");
        let user = document.getElementById(`user${rowCount}`).value;
        // console.log(sec + start + end + user);
        chartText += `
        ${taskName} : task${rowCount}, ${start}, ${end}
        `;
    }
    // console.log(chartText);
    chartDiv.innerHTML = chartText;
    let reloadSp = document.getElementById("reloadSpace").style.display = "none";
    mermaid.init();
}

const saveData = () => {
    let writeData = [];                             //書込み用JSON配列 初期化

    let table = document.getElementById('process');
    for(var rowCount = 1; rowCount < table.rows.length; rowCount++ ) {
        let taskName = document.getElementById(`taskName${rowCount}`).value;
        let startDate = document.getElementById(`startDate${rowCount}`).value;
        let start = getStringFormatDate(startDate, "YYYY-MM-DD");                   // input type="date"は"YYYY-MM-DD"しか受け付けないかも。保存時にそのフォーマットにする
        let endDate = document.getElementById(`endDate${rowCount}`).value;
        let end = getStringFormatDate(endDate, "YYYY-MM-DD");                       // input type="date"は"YYYY-MM-DD"しか受け付けないかも。保存時にそのフォーマットにする
        let user = document.getElementById(`user${rowCount}`).value;
        let JsonData = {"taskName" : taskName, "start" : start, "end" : end, "user" : user};
        writeData.push(JsonData);
    }
    //console.log(writeData);
    localStorage.setItem("ganttTool", JSON.stringify(writeData));
    record = writeData;
}

/**
 * ストレージ削除
 * @param なし
 */
const deleteData = () => {
    localStorage.removeItem("ganttTool");
    let message = document.getElementById("message");
    message.innerText = "ストレージにデータはありません。";
}