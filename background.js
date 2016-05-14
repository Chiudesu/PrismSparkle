var isSparkling = false;

//アクティブなタブが変わったら呼び出し
function updateTab() {
  console.log("updateTab");
  //TODO:タブにスクリプトが読み込まれているかどうかを確認してアイコンの状態を変える

}

//アイコンクリックで呼び出し
function updateState(tab) {
  console.log("updateState");

  isSparkling = !isSparkling;
  if (isSparkling) {
    //開始
    chrome.browserAction.setIcon({
      path: {
        "19": "icons/enable19.png",
        "38": "icons/enable38.png"
      }
    });
    ensureSendMessage({
        type: "PrismSparkle_start"
      },
      function(res) {
        console.log("started:" + res); //レスポンスが返ってきた
      });
  } else {
    //停止
    chrome.browserAction.setIcon({
      path: {
        "19": "icons/wait19.png",
        "38": "icons/wait38.png"
      }
    });
    ensureSendMessage({
        type: "PrismSparkle_stop"
      },
      function(res) {
        console.log("stopped:" + res); //レスポンスが返ってきた
      });
  }
}

//初めてのtabで実行されたらまずスクリプトを流し込む
function initContent(tabId, completedf) {
  console.log("init");
  chrome.tabs.executeScript(tabId, {
    file: "jquery-2.2.3.min.js"//TODO:jQueryのバージョンが違うと衝突するのでは?　content側でjQueryを確認して読む
  });
  chrome.tabs.executeScript(tabId, {
    file: "content.js"
  }, function() {
    if (chrome.runtime.lastError) {
      console.error(chrome.runtime.lastError);
      throw Error("Unable to inject script into tab " + tabId);
    }

    completedf();
  });
}

//メッセージを送る
//失敗したら（スクリプトがまだ読み込まれていないなら）initContentを呼ぶ
function ensureSendMessage(message, callback) {
  chrome.tabs.query( //現在選択中のtab.idが必要
    {
      active: true,
      currentWindow: true
    },
    function(tabs) {
      chrome.tabs.sendMessage(tabs[0].id, message, function(response) {
        if (response && response.success) { //content側で受信したら、success:trueとされる
          //成功
          callback(response);

        } else {
          //失敗
          initContent(tabs[0].id, function() {
            chrome.tabs.sendMessage(tabs[0].id, message, callback);
          });
        }
      });
    });
}

chrome.browserAction.onClicked.addListener(updateState);
chrome.tabs.onActivated.addListener(updateTab);
