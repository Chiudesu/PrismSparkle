var isSparkling = false;
var tick;
var FPS = 30;
var $circles;
var cntf;
var FADE = 120;
var DUR = 1000.0;
var circle_R_MAX = 50.0;


//毎フレーム呼び出される
function sparkle(){
    cntf += 1000.0 / FPS;
    $circles.each(function(i, $elm) {
        $elm.attr("r", (circle_R_MAX * cntf / DUR));
        $elm.attr("stroke-opacity", Math.sin(Math.PI * cntf / DUR)/3);

        if(cntf < FADE){
          $elm.attr("opacity", cntf / FADE);
        }else if (cntf > DUR-FADE) {
          $elm.attr("opacity", (DUR-cntf) / FADE);
        }else{
          $elm.attr("opacity", 1);
        }

    });
    if (cntf > DUR) { //cntf: 1000/FPS to DUR
      cntf = 0;
    }
}

function startSparkle(){
//TODO 流し込み
//<script type="text/javascript" src="jquery-2.2.3.min.js"></script>
//<object class="PrismSparkle_circle" type="image/svg+xml" data="prismcircle.svg" width="300" height="300" style="position:absolute; left:200px; top:200px;"> </object>


  //要素取得
    var svgelms = document.getElementsByClassName("PrismSparkle_circle");
    var circles = new Array(svgelms.length);
    for(var i=0; i < circles.length ;i++) {
        circles[i] = $(svgelms[i].contentDocument).find("svg").find("circle");
    };
    $circles = $(circles);
    cntf = 0.0;
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
