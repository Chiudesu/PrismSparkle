//変数一覧-----------------------------------------------------------------------
var isSparkling = false;
var icons_on = {
  path: {
    "19": "icons/enable19.png",
    "38": "icons/enable38.png"
  },
  tabId: undefined
};
var icons_off = {
  path: {
    "19": "icons/wait19.png",
    "38": "icons/wait38.png"
  },
  tabId: undefined
};

//関数定義-----------------------------------------------------------------------
//アクティブなタブが変わったら呼び出し
function updateTab(completedf) {
  console.log("updateTab");
  //タブにスクリプトが読み込まれているかどうかを確認してアイコンの状態を変える

  chrome.tabs.query( //現在選択中のtab.idが必要
    {
      active: true,
      currentWindow: true
    },
    function(tabs) {
      chrome.pageAction.show(tabs[0].id);
      icons_on.tabId = tabs[0].id;
      icons_off.tabId = tabs[0].id;
      chrome.tabs.sendMessage(tabs[0].id, {
          type: "PrismSparkle_ask"
        },
        function(res) {
          if (res === undefined) {
            //まだ読み込まれていない
            console.log("asked:no response");
            isSparkling = false;
            chrome.pageAction.setIcon(icons_off);
          } else {
            console.log("asked:" + res.isSparkling); //レスポンスが返ってきた
            isSparkling = res.isSparkling;
            if (res.isSparkling) {
              //すでに動いている
              chrome.pageAction.setIcon(icons_on);
            } else {
              //止まっている
              chrome.pageAction.setIcon(icons_off);
            }
          }
          if (completedf !== undefined) completedf(); //完了のcallback
        });
    });
}

//アイコンクリックで呼び出し
function updateState(tab) {
  console.log("updateState");
  updateTab(function() {
    if (!isSparkling) {
      //開始
      chrome.pageAction.setIcon(icons_on);
      ensureSendMessage({
          type: "PrismSparkle_start"
        },
        function(res) {
          console.log("started:" + res); //レスポンスが返ってきた
          isSparkling = true;
        });
    } else {
      //停止
      icons_off.tabId = tab.id;
      chrome.pageAction.setIcon(icons_off);
      ensureSendMessage({
          type: "PrismSparkle_stop"
        },
        function(res) {
          console.log("stopped:" + res); //レスポンスが返ってきた
          isSparkling = false;
        });
    }
  });

}

//初めてのtabで実行されたらまずスクリプトを流し込む
function initContent(tabId, completedf) {
  console.log("init");
  chrome.tabs.executeScript(tabId, {
    file: "jquery-2.2.3.min.js" //TODO:jQueryのバージョンが違うと衝突するのでは?　content側でjQueryを確認して読む
  });
  chrome.tabs.executeScript(tabId, {
    file: "content.js"
  }, function() {
    if (chrome.runtime.lastError) {
      console.error(chrome.runtime.lastError);
      throw Error("Unable to inject script into tab " + tabId);
    }

    if (completedf !== undefined) completedf(); //完了のcallback
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

//実行ここから--------------------------------------------------------------------
chrome.pageAction.onClicked.addListener(updateState);
chrome.tabs.onActivated.addListener(updateTab);
chrome.tabs.onUpdated.addListener(function(tabId, info, tab) {
  console.log("onUpdated");
  if (info.status == "complete") updateTab();
});
chrome.windows.onFocusChanged.addListener(function(id) {
  console.log("onFocusChanged");
  updateTab();
});
