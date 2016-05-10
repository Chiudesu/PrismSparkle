var isSparkling = false;
var tick;
var FPS = 30;


//毎フレーム呼び出される
function sparkle(){

}

function startSparkle(){
  tick = setInterval(sparkle,1000/FPS);
}

function stopSparkle(){
  clearInterval(tick);
}

function updateState(){
  isSparkling = !isSparkling;
  if (isSparkling) {
    //開始
    chrome.browserAction.setIcon({
      path: {"19": "icons/enable19.png", "38": "icons/enable38.png"}
    });
    startSparkle();//Sparkler.js
  } else {
    //停止
    chrome.browserAction.setIcon({
      path: {"19": "icons/wait19.png", "38": "icons/wait38.png"}
    });
    stopSparkle();
  }
}

chrome.browserAction.onClicked.addListener(updateState);
