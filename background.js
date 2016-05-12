var isSparkling = false;

function updateState(tab) {
    isSparkling = !isSparkling;
    if (isSparkling) {
        //開始
        chrome.browserAction.setIcon({
            path: {
                "19": "icons/enable19.png",
                "38": "icons/enable38.png"
            }
        });
        chrome.tabs.query( //現在選択中のtab.idが必要
            {
                active: true,
                currentWindow: true
            },
            function(tabs) {
                chrome.tabs.sendMessage(
                    tabs[0].id, {
                        type: "PrismSparkle_start"
                    },
                    function(res) {
                        console.log("started:" + res); //レスポンスが返ってきた
                    });
            });
    } else {
        //停止
        chrome.browserAction.setIcon({
            path: {
                "19": "icons/wait19.png",
                "38": "icons/wait38.png"
            }
        });
        chrome.tabs.query( //現在選択中のtab.idが必要
            {
                active: true,
                currentWindow: true
            },
            function(tabs) {
                chrome.tabs.sendMessage(
                    tabs[0].id, {
                        type: "PrismSparkle_stop"
                    },
                    function(res) {
                        console.log("stopped:" + res); //レスポンスが返ってきた
                    });
            });
    }
}

chrome.browserAction.onClicked.addListener(updateState);
