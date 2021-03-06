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
  //metaはstyleの続きから
  meta: "pointer-events: none;\" viewBox=\"0 0 100 100\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" version=\"1.1\"",
  circle_meta: "class=\"PrismSparkle_circle\" width=\"400\" height=\"400\"",
  cross_meta: "class=\"PrismSparkle_cross\" width=\"50\" height=\"50\"",
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
    "<radialGradient id=\"PrismSparkle_g2\" cx=\"0.8\" cy=\"0.2\" r=\"1.0\">" +
    "<stop offset=\"0.0\" stop-color=\"rgba(255,255,255,255)\"/>" +
    "<stop offset=\"0.5\" stop-color=\"rgba(255,255,255,255)\"/>" +
    "<stop offset=\"0.9\" stop-color=\"rgba(222,255,222,0)\"/>" +
    "</radialGradient>" +
    "<radialGradient id=\"PrismSparkle_g3\" cx=\"0.1\" cy=\"0.1\" r=\"1.2\">" +
    "<stop offset=\"0.0\" stop-color=\"rgba(255,255,255,255)\"/>" +
    "<stop offset=\"0.6\" stop-color=\"rgba(255,255,255,255)\"/>" +
    "<stop offset=\"0.9\" stop-color=\"rgba(222,255,255,0)\"/>" +
    "</radialGradient>" +
    "</defs>",
  circle: "<circle stroke=\"url(#PrismSparkle_g1)\" stroke-opacity=\"0.0\" stroke-width=\"3\" fill=\"url(#PrismSparkle_g0)\" opacity=\"0\" cx=\"50\" cy=\"50\" r=\"50\"></circle>",
  cross: "<line class=\"PrismSparkle_cross_back\" stroke=\"url(#PrismSparkle_g2)\" opacity=\"0.95\" stroke-width=\"8\" x1=\"0\" y1=\"0\" x2=\"100\" y2=\"100\"></line>" +
    "<line class=\"PrismSparkle_cross_slash\" stroke=\"url(#PrismSparkle_g3)\" opacity=\"0.95\" stroke-width=\"8\" x1=\"100\" y1=\"0\" x2=\"0\" y2=\"100\"></line>"
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
  sparkleVars.$crosses.each(function(i, elm) {
    var cntf = ((sparkleVars.cntf + sparkleVars.crosses_delay[Math.floor(i / 2)]) % sparkleVars.DUR) % 1000;
    var $elm = $(elm);
    if (cntf <= 500.0) {
      $elm.attr("opacity", Math.sin(Math.PI * cntf / 500.0));
      if ($elm.hasClass("PrismSparkle_cross_back")) {
        $elm.attr("x1", 50 - 50 * (cntf / 500.0));
        $elm.attr("y1", 50 - 50 * (cntf / 500.0));
        $elm.attr("x2", 50 + 50 * (cntf / 500.0));
        $elm.attr("y2", 50 + 50 * (cntf / 500.0));
      } else if ($elm.hasClass("PrismSparkle_cross_slash")) {
        $elm.attr("x1", 50 + 50 * (cntf / 500.0));
        $elm.attr("y1", 50 - 50 * (cntf / 500.0));
        $elm.attr("x2", 50 - 50 * (cntf / 500.0));
        $elm.attr("y2", 50 + 50 * (cntf / 500.0));

      }
    } else {
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
  sparkleVars.$crosses = $(".PrismSparkle_cross line");
  console.dir(sparkleVars.$crosses);

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
  sparkleVars.$crosses.each(function(i, elm) {
    $elm = $(elm);
    $elm.attr("opacity", 0);
  });
}

function appendSVG() {
  console.log("appendSVG");
  var cis = new Array(9);
  sparkleVars.circles_delay = new Array(cis.length);
  var crs = new Array(6);
  sparkleVars.crosses_delay = new Array(crs.length);

  var defs = $("<svg>" + sparkleSVGs.defs + "</svg>");
  cis[0] = $("<svg style=\"position:fixed; left:-100px; top:-150px; " + sparkleSVGs.meta + " " + sparkleSVGs.circle_meta + ">" + sparkleSVGs.circle + " </svg>");
  sparkleVars.circles_delay[0] = 0;
  cis[1] = $("<svg style=\"position:fixed; left:-200px; top:-120px; " + sparkleSVGs.meta + " " + sparkleSVGs.circle_meta + ">" + sparkleSVGs.circle + " </svg>");
  sparkleVars.circles_delay[1] = sparkleVars.DUR - 900;
  cis[2] = $("<svg style=\"position:fixed; left:-250px; top:100px; " + sparkleSVGs.meta + " " + sparkleSVGs.circle_meta + ">" + sparkleSVGs.circle + " </svg>");
  sparkleVars.circles_delay[2] = sparkleVars.DUR - 1800;
  cis[3] = $("<svg style=\"position:fixed; left:-150px; bottom:0px; " + sparkleSVGs.meta + " " + sparkleSVGs.circle_meta + ">" + sparkleSVGs.circle + " </svg>");
  sparkleVars.circles_delay[3] = sparkleVars.DUR - 2500;
  cis[4] = $("<svg style=\"position:fixed; left:400px; top:-200px;　" + sparkleSVGs.meta + " " + sparkleSVGs.circle_meta + ">" + sparkleSVGs.circle + " </svg>");
  sparkleVars.circles_delay[4] = sparkleVars.DUR - 2000;
  cis[5] = $("<svg style=\"position:fixed; right:200px; top:-250px; " + sparkleSVGs.meta + " " + sparkleSVGs.circle_meta + ">" + sparkleSVGs.circle + " </svg>");
  sparkleVars.circles_delay[5] = sparkleVars.DUR - 2300;
  cis[6] = $("<svg style=\"position:fixed; right:-50px; top:-200px; " + sparkleSVGs.meta + " " + sparkleSVGs.circle_meta + ">" + sparkleSVGs.circle + " </svg>");
  sparkleVars.circles_delay[6] = sparkleVars.DUR - 2100;
  cis[7] = $("<svg style=\"position:fixed; right:400px; bottom:-220px; " + sparkleSVGs.meta + " " + sparkleSVGs.circle_meta + ">" + sparkleSVGs.circle + " </svg>");
  sparkleVars.circles_delay[7] = sparkleVars.DUR - 300;
  cis[8] = $("<svg style=\"position:fixed; right:-200px; bottom:50px; " + sparkleSVGs.meta + " " + sparkleSVGs.circle_meta + ">" + sparkleSVGs.circle + " </svg>");
  sparkleVars.circles_delay[8] = sparkleVars.DUR - 1300;

  crs[0] = $("<svg style=\"position:fixed; left:0px; top:0px; " + sparkleSVGs.meta + " " + sparkleSVGs.cross_meta + ">" + sparkleSVGs.cross + " </svg>");
  sparkleVars.crosses_delay[0] = 0;
  crs[1] = $("<svg style=\"position:fixed; left:-20px; top:10px; " + sparkleSVGs.meta + " " + sparkleSVGs.cross_meta + ">" + sparkleSVGs.cross + " </svg>");
  sparkleVars.crosses_delay[1] = sparkleVars.DUR - 200;
  crs[2] = $("<svg style=\"position:fixed; left:10px; bottom:0px; " + sparkleSVGs.meta + " " + sparkleSVGs.cross_meta + ">" + sparkleSVGs.cross + " </svg>");
  sparkleVars.crosses_delay[2] = sparkleVars.DUR - 500;
  crs[3] = $("<svg style=\"position:fixed; right:10px; bottom:-30px; " + sparkleSVGs.meta + " " + sparkleSVGs.cross_meta + ">" + sparkleSVGs.cross + " </svg>");
  sparkleVars.crosses_delay[3] = sparkleVars.DUR - 0;
  crs[4] = $("<svg style=\"position:fixed; right:-10px; bottom:10px; " + sparkleSVGs.meta + " " + sparkleSVGs.cross_meta + ">" + sparkleSVGs.cross + " </svg>");
  sparkleVars.crosses_delay[4] = sparkleVars.DUR - 800;
  crs[5] = $("<svg style=\"position:fixed; right:0px; top:-10px; " + sparkleSVGs.meta + " " + sparkleSVGs.cross_meta + ">" + sparkleSVGs.cross + " </svg>");
  sparkleVars.crosses_delay[5] = sparkleVars.DUR - 200;

  $("body").append(defs);
  for (var i = 0; i < cis.length; i++) {
    $("body").append(cis[i]);
  }
  for (var i = 0; i < crs.length; i++) {
    $("body").append(crs[i]);
  }
  $(defs).ready(function() {
    $(cis).ready(function() {
      $(crs).ready(function() {
        console.log("SVG loaded!");
        sparkleVars.isSVGReady = true;
      });
    });
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
