var tick;
var FPS = 30;
var $circles;
var cntf;
var FADE = 120;
var DUR = 1000.0;
var circle_R_MAX = 50.0;


//毎フレーム呼び出される
function sparkle() {
  cntf += 1000.0 / FPS;
  $circles.each(function(i, $elm) {
    $elm.attr("r", (circle_R_MAX * cntf / DUR));
    $elm.attr("stroke-opacity", Math.sin(Math.PI * cntf / DUR) / 3);

    if (cntf < FADE) {
      $elm.attr("opacity", cntf / FADE);
    } else if (cntf > DUR - FADE) {
      $elm.attr("opacity", (DUR - cntf) / FADE);
    } else {
      $elm.attr("opacity", 1);
    }

  });
  if (cntf > DUR) { //cntf: 1000/FPS to DUR
    console.log("Sparkle:reset cntf");
    cntf = 0;
  }
}

function startSparkle() {
  console.log("startSparkle");
  //TODO 流し込み
  //<script type="text/javascript" src="jquery-2.2.3.min.js"></script>
  //<object class="PrismSparkle_circle" type="image/svg+xml" data="prismcircle.svg" width="300" height="300" style="position:absolute; left:200px; top:200px;"> </object>
  $("body").append("<object class=\"PrismSparkle_circle\" type=\"image/svg+xml\" data=\"view-source:http://chiudesu.konjiki.jp/PrismTest/prismcircle.svg\" width=\"300\" height=\"300\" style=\"position:fixed; left:200px; top:200px;\"> </object>");
  $("body").append("<object class=\"PrismSparkle_circle\" type=\"image/svg+xml\" data=\"view-source:http://chiudesu.konjiki.jp/PrismTest/prismcross.svg\" width=\"150\" height=\"150\" style=\"position:fixed; right:100px; top:200px;\"> </object>");

  //要素取得
  var svgelms = document.getElementsByClassName("PrismSparkle_circle");
  var circles = new Array(svgelms.length);
  for (var i = 0; i < circles.length; i++) {
    circles[i] = $(svgelms[i].contentDocument).find("svg").find("circle");
  };
  $circles = $(circles);
  cntf = 0.0;
  tick = setInterval(sparkle, 1000 / FPS);
  console.dir($circles);
}

function stopSparkle() {
  console.log("stopSparkle");
  clearInterval(tick);
}

chrome.runtime.onMessage.addListener(function(req, sender, sendRes) {
  console.log("getMessage");
  switch (req.type) {
    case "PrismSparkle_start":
      startSparkle();
      sendRes({
        success: true
      });
      break;
    case "PrismSparkle_stop":
      stopSparkle();
      sendRes({
        success: true
      });
      break;
  }
});
