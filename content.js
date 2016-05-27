//変数一覧-----------------------------------------------------------------------
var sparkleVars = { //名前の衝突を防ぐ
  isSparkling: false,
  tick: undefined,
  wait: undefined,
  FPS: 15,
  ctx: undefined,
  cv: undefined,
  circles: undefined,
  crosses: undefined,
  isCVReady: false,
  cntf: undefined,
  FADE: 120,
  DUR: 3000.0,
  circle_R_MAX: 400
};


//関数定義-----------------------------------------------------------------------
//毎フレーム呼び出される
function sparkle() {
  var w = document.documentElement.clientWidth;
  var h = document.documentElement.clientHeight;
  sparkleVars.ctx.clearRect(0, 0, w, h);
  sparkleVars.cntf += 1000.0 / sparkleVars.FPS;

  sparkleVars.circles.forEach(function(c) {
    var cntf = (sparkleVars.cntf + c.delay) % sparkleVars.DUR;
    if (cntf <= 1000.0) {
      sparkleVars.ctx.fillStyle = "rgba(0, 0, 255,255)";
      sparkleVars.ctx.beginPath();
      sparkleVars.ctx.arc(w * c.xp, h * c.yp, (sparkleVars.circle_R_MAX * cntf / 1000.0), 0, Math.PI * 2, true);
      sparkleVars.ctx.fill();
      // +     cis[0] = $("<svg style=\"position:fixed; left:-100px; top:-150px; " + sparkleSVGs.meta + " " + sparkleSVGs.circle_meta + ">" + sparkleSVGs.circle + " </svg>");
      //$elm.attr("r", (sparkleVars.circle_R_MAX * cntf / 1000.0));
      //$elm.attr("stroke-opacity", Math.sin(Math.PI * cntf / 1000.0) / 3);

      if (cntf < sparkleVars.FADE) {
        //$elm.attr("opacity", cntf / sparkleVars.FADE);
      } else if (cntf > 1000.0 - sparkleVars.FADE) {
        //$elm.attr("opacity", (1000.0 - cntf) / sparkleVars.FADE);
      } else {
        //$elm.attr("opacity", 1);
      }
    }

    c = sparkleVars;
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
  sparkleVars.cv = document.getElementById("PrismSparkle_CV");
  sparkleVars.ctx = sparkleVars.cv.getContext("2d");

  //描画開始
  sparkleVars.cntf = 0.0;
  sparkleVars.tick = setInterval(sparkle, 1000 / sparkleVars.FPS);
}

function startSparkle() {
  console.log("startSparkle");

  if (!sparkleVars.isCVReady) { //読み込まれていないなら読み込まれるまで0.1sec待機
    sparkleVars.wait = setInterval(function() {
      if (sparkleVars.isCVReady) {
        clearInterval(sparkleVars.wait);
        loadAndRunSparkle();
      } else {
        console.log("CV loading...");
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
  var w = document.documentElement.clientWidth;
  var h = document.documentElement.clientHeight;
  sparkleVars.ctx.clearRect(0, 0, w, h);
}

function appendCV() {
  console.log("appendCV");
  sparkleVars.circles = new Array(1);
  sparkleVars.crosses = new Array(1);
  //x,yはw,hに対する割合で
  sparkleVars.circles[0] = {
    xp: 0.5,
    yp: 0.1,
    delay: 0
  };

  var cv = document.createElement("canvas");
  cv.setAttribute("id", "PrismSparkle_CV");
  var w = screen.availWidth;
  var h = screen.availHeight;
  cv.setAttribute("width", w);
  cv.setAttribute("height", h);
  cv.setAttribute("style", "position:fixed; left:0px; top:0px;");
  document.body.appendChild(cv);

  //cv.ready(function() {
  console.log("CV loaded!");
  sparkleVars.isCVReady = true;
  //});
}

//実行ここから--------------------------------------------------------------------
appendCV();
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
