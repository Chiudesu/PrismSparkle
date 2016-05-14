//変数一覧-----------------------------------------------------------------------
var sparkleVars = { //名前の衝突を防ぐ
  isSparkling:false,
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

//SVGの中身---------------------------------------------------------------------
var sparkleSVGs = {
  meta: "viewBox=\"0 0 100 100\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" version=\"1.1\"",
  defs: "<defs>" +
    "<radialGradient id=\"PrismSparkle_g0\" cx=\"0.55\" cy=\"0.55\" fx=\"0.25\" fy=\"0.25\" r=\"0.6\">" +
    "<stop offset=\"0.0\" stop-color=\"rgba(0,0,0,0)\"/>" +
    "<stop offset=\"0.6\" stop-color=\"rgba(255,255,255,0)\"/>" +
    "<stop offset=\"0.9\" stop-color=\"rgba(255,255,255,255)\"/>" +
    "</radialGradient>" +
    "<linearGradient id=\"PrismSparkle_g1\" x=\"0\" y=\"0\">" +
    "<stop offset=\"0.0\" stop-color=\"rgba(255,128,0,255)\"/>" +
    "<stop offset=\"0.1\" stop-color=\"rgba(255,255,0,255)\"/>" +
    "<stop offset=\"0.5\" stop-color=\"rgba(0,255,0,0)\"/>" +
    "<stop offset=\"0.9\" stop-color=\"rgba(0,255,255,255)\"/>" +
    "<stop offset=\"0.95\" stop-color=\"rgba(0,255,255,0)\"/>" +
    "<stop offset=\"1.0\" stop-color=\"rgba(255,255,0,255)\"/>" +
    "</linearGradient>" +
    "</defs>",
  circle: "<circle stroke=\"url(#PrismSparkle_g1)\" stroke-opacity=\"0.0\" stroke-width=\"3\" fill=\"url(#PrismSparkle_g0)\" opacity=\"0\" cx=\"50\" cy=\"50\" r=\"50\"></circle>",
  cross: "<rect stroke=\"blue\" stroke-opacity=\"1.0\" stroke-width=\"3\" fill=\"green\" opacity=\"1\" x=\"0\" y=\"0\" width=\"100\" height=\"100\"></rect>"
};

//関数定義-----------------------------------------------------------------------
//毎フレーム呼び出される
function sparkle() {
  sparkleVars.cntf += 1000.0 / sparkleVars.FPS;
  sparkleVars.$circles.each(function(i, elm) {
    var $elm = $(elm);
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

//要素を流し込み終わった頃にstartSparkleから呼び出される
function loadAndRunSparkle() {
  console.log("loadAndRunSparkle");
  //要素取得
  sparkleVars.$circles = $(".PrismSparkle_circle circle");
  console.dir(sparkleVars.$circles);

  //描画開始
  sparkleVars.cntf = 0.0;
  sparkleVars.tick = setInterval(sparkle, 1000 / sparkleVars.FPS);
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
  sparkleVars.$circles.each(function(i, elm) {
    $elm = $(elm);
    $elm.attr("r", 1);
    $elm.attr("stroke-opacity", 0);
    $elm.attr("opacity", 0);
  });
}

function appendSVG() {
  console.log("appendSVG");
  var cis = new Array(1);
  var crs = new Array(1);
  cis[0] = $("<svg class=\"PrismSparkle_circle\" " +
    "style=\"position:fixed; left:-50px; top:0px;\" width=\"300\" height=\"300\" " +
    sparkleSVGs.meta + ">" + sparkleSVGs.defs + sparkleSVGs.circle + " </svg>");
  cis[1] = $("<svg class=\"PrismSparkle_circle\" " +
    "style=\"position:fixed; right:300px; top:-100px;\" width=\"300\" height=\"300\" " +
    sparkleSVGs.meta + ">" + sparkleSVGs.defs + sparkleSVGs.circle + " </svg>");
  cis[2] = $("<svg class=\"PrismSparkle_circle\" " +
    "style=\"position:fixed; right:0px; bottom:0px;\" width=\"300\" height=\"300\" " +
    sparkleSVGs.meta + ">" + sparkleSVGs.defs + sparkleSVGs.circle + " </svg>");
  /*
  crs[0] = $("<svg class=\"PrismSparkle_cross\" " +
    "style=\"position:fixed; right:50px; top:50px;\" width=\"100\" height=\"100\" " +
    sparkleSVGs.meta + ">" + sparkleSVGs.cross + " </svg>");*/
  for (var i = 0; i < cis.length; i++) {
    $("body").append(cis[i]);
  }
  /*for (var i = 0; i < crs.length; i++) {
    $("body").append(crs[i]);
  }*/
  $(cis).ready(function() {
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
    sparkleVars.isSparkling = true;
      startSparkle();
      sendRes({
        success: true
      });
      break;
    case "PrismSparkle_stop":
    sparkleVars.isSparkling = false;
      stopSparkle();
      sendRes({
        success: true
      });
      break;
    case "PrismSparkle_ask": //読み込まれていて、かつ描画中ならtrueを返す
      sendRes({
        success: true,
        isSparkling: sparkleVars.isSparkling
      });
      break;
  }
});
