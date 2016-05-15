//変数一覧-----------------------------------------------------------------------
var sparkleVars = { //名前の衝突を防ぐ
  isSparkling: false,
  tick: undefined,
  wait: undefined,
  FPS: 15,
  $circles: undefined,
  $crosses: undefined,
  circles_delay: undefined,
  crosses_delay: undefined,
  isSVGReady: false,
  cntf: undefined,
  FADE: 120,
  DUR: 3000.0,
  circle_R_MAX: 50.0
};

//SVGの中身---------------------------------------------------------------------
var sparkleSVGs = {
  meta: "viewBox=\"0 0 100 100\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" version=\"1.1\" " +
    "width=\"400\" height=\"400\"",
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
    var cntf = (sparkleVars.cntf + sparkleVars.circles_delay[i]) % sparkleVars.DUR;
    var $elm = $(elm);
    if (cntf <= 1000.0) {
      $elm.attr("r", (sparkleVars.circle_R_MAX * cntf / 1000.0));
      $elm.attr("stroke-opacity", Math.sin(Math.PI * cntf / 1000.0) / 3);

      if (cntf < sparkleVars.FADE) {
        $elm.attr("opacity", cntf / sparkleVars.FADE);
      } else if (cntf > 1000.0 - sparkleVars.FADE) {
        $elm.attr("opacity", (1000.0 - cntf) / sparkleVars.FADE);
      } else {
        $elm.attr("opacity", 1);
      }
    } else {
      $elm.attr("r", 1);
      $elm.attr("stroke-opacity", 0);
      $elm.attr("opacity", 0);
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
  var cis = new Array(9);
  sparkleVars.circles_delay = new Array(cis.length);
  var crs = new Array(1);
  sparkleVars.crosses_delay = new Array(crs.length);

var defs = $("<svg>"+sparkleSVGs.defs+"</svg>");
  cis[0] = $("<svg class=\"PrismSparkle_circle\" " +
    "style=\"position:fixed; left:-100px; top:-150px;\" " +
    sparkleSVGs.meta + ">" + sparkleSVGs.circle + " </svg>");
  sparkleVars.circles_delay[0] = 0;
  cis[1] = $("<svg class=\"PrismSparkle_circle\" " +
    "style=\"position:fixed; left:-200px; top:-120px;\" " +
    sparkleSVGs.meta + ">" + sparkleSVGs.circle + " </svg>");
  sparkleVars.circles_delay[1] = sparkleVars.DUR - 900;
  cis[2] = $("<svg class=\"PrismSparkle_circle\" " +
    "style=\"position:fixed; left:-250px; top:100px;\" " +
    sparkleSVGs.meta + ">" + sparkleSVGs.circle + " </svg>");
  sparkleVars.circles_delay[2] = sparkleVars.DUR - 1800;
  cis[3] = $("<svg class=\"PrismSparkle_circle\" " +
    "style=\"position:fixed; left:-150px; bottom:0px;\" " +
    sparkleSVGs.meta + ">" + sparkleSVGs.circle + " </svg>");
  sparkleVars.circles_delay[3] = sparkleVars.DUR - 2500;
  cis[4] = $("<svg class=\"PrismSparkle_circle\" " +
    "style=\"position:fixed; left:400px; top:-200px;\" " +
    sparkleSVGs.meta + ">" + sparkleSVGs.circle + " </svg>");
  sparkleVars.circles_delay[4] = sparkleVars.DUR - 2000;
  cis[5] = $("<svg class=\"PrismSparkle_circle\" " +
    "style=\"position:fixed; right:200px; top:-250px;\" " +
    sparkleSVGs.meta + ">" + sparkleSVGs.circle + " </svg>");
  sparkleVars.circles_delay[5] = sparkleVars.DUR - 2300;
  cis[6] = $("<svg class=\"PrismSparkle_circle\" " +
    "style=\"position:fixed; right:-50px; top:-200px;\" " +
    sparkleSVGs.meta + ">" + sparkleSVGs.circle + " </svg>");
  sparkleVars.circles_delay[6] = sparkleVars.DUR - 2100;
  cis[7] = $("<svg class=\"PrismSparkle_circle\" " +
    "style=\"position:fixed; right:400px; bottom:-220px;\" " +
    sparkleSVGs.meta + ">" + sparkleSVGs.circle + " </svg>");
  sparkleVars.circles_delay[7] = sparkleVars.DUR - 300;
  cis[8] = $("<svg class=\"PrismSparkle_circle\" " +
    "style=\"position:fixed; right:-200px; bottom:50px;\" " +
    sparkleSVGs.meta + ">" + sparkleSVGs.circle + " </svg>");
  sparkleVars.circles_delay[8] = sparkleVars.DUR - 1300;
  /*
  crs[0] = $("<svg class=\"PrismSparkle_cross\" " +
    "style=\"position:fixed; right:50px; top:50px;\" " +
    sparkleSVGs.meta + ">" + sparkleSVGs.cross + " </svg>");
    */

      $("body").append(defs);
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
