//変数一覧-----------------------------------------------------------------------
var sparkleVars = { //名前の衝突を防ぐ
  tick: undefined,
  wait: undefined,
  FPS: 30,
  $circles: undefined,
  $crosses: undefined,
  isSVGReady: false,
  cntf: undefined,
  FADE: 120,
  DUR: 1000.0,
  circle_R_MAX: 50.0
};

//関数定義-----------------------------------------------------------------------
//毎フレーム呼び出される
function sparkle() {
  sparkleVars.cntf += 1000.0 / sparkleVars.FPS;
  sparkleVars.$circles.each(function(i, $elm) {
    $elm.attr("r", (sparkleVars.circle_R_MAX * sparkleVars.cntf / sparkleVars.DUR));
    $elm.attr("stroke-opacity", Math.sin(Math.PI * sparkleVars.cntf / sparkleVars.DUR) / 3);

    if (sparkleVars.cntf < sparkleVars.FADE) {
      $elm.attr("opacity", sparkleVars.cntf / sparkleVars.FADE);
    } else if (sparkleVars.cntf > sparkleVars.DUR - sparkleVars.FADE) {
      $elm.attr("opacity", (sparkleVars.DUR - sparkleVars.cntf) / sparkleVars.FADE);
    } else {
      $elm.attr("opacity", 1);
    }

  });
  if (sparkleVars.cntf > sparkleVars.DUR) { //cntf: 1000/FPS to DUR
    console.log("Sparkle:reset cntf");
    sparkleVars.cntf = 0.0;
  }
}

function loadAndRunSparkle() {
  console.log("loadAndRunSparkle");
  //要素取得

  var svgelms = document.getElementsByClassName("PrismSparkle_circle");
  var circles = new Array(svgelms.length);
  for (var i = 0; i < circles.length; i++) {
    circles[i] = $(svgelms[i].contentDocument).find("svg").find("circle");
  };
  sparkleVars.$circles = $(circles);
  //sparkleVars.$circles = $(".PrismSparkle_circle circle");

  //描画開始
  sparkleVars.cntf = 0.0;
  sparkleVars.tick = setInterval(sparkle, 1000 / sparkleVars.FPS);
  console.dir(sparkleVars.$circles);
}

function startSparkle() {
  console.log("startSparkle");

  if (!sparkleVars.isSVGReady) { //読み込まれていないなら読み込まれるまで0.1sec待機
    sparkleVars.wait = setInterval(function() {
      if (sparkleVars.isSVGReady) {
        clearInterval(sparkleVars.wait);
        loadAndRunSparkle();
      } else {
        console.log("SVG loading...");
      }
    }, 100);
  } else {
    loadAndRunSparkle();
  }
}

function stopSparkle() {
  console.log("stopSparkle");
  clearInterval(sparkleVars.tick);
  sparkleVars.cntf = 0.0;
  sparkleVars.$circles.each(function(i, $elm) {
    $elm.attr("r", 1);
    $elm.attr("stroke-opacity", 0);
    $elm.attr("opacity", 0);
  });
}

function appendSVG() {
  console.log("appendSVG");
  var cis = {
    length: 1
  };
  var crs = {
    length: 1
  };
  cis[0] = $('<object class="PrismSparkle_circle" type="image/svg+xml" data="http://chiudesu.konjiki.jp/PrismTest/prismcircle.svg" width="300" height="300" style="position:fixed; left:50px; top:100px;"> </object>');
  crs[0] = $('<object class="PrismSparkle_cross" type="image/svg+xml" data="http://chiudesu.konjiki.jp/PrismTest/prismcross.svg" width="150" height="150" style="position:fixed; left:100px; top:200px;"> </object>');
  for (var i = 0; i < cis.length; i++) {
    $("body").append(cis[i]);
  }
  for (var i = 0; i < crs.length; i++) {
    $("body").append(crs[i]);
  }
  cis[0].ready(function() {
    console.log("SVG loaded!");
    sparkleVars.isSVGReady = true;
  });
}

//実行ここから--------------------------------------------------------------------
appendSVG();
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
