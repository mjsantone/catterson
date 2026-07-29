// One earned Clippy cameo per session. Detail pages reveal it at the closing
// navigation; home reveals it only after two distinct piece visits.
(function () {
  "use strict";

  if (document.documentElement.classList.contains("site-locked")) return;

  var script = document.currentScript;
  var homeNav = document.querySelector('nav[aria-label="Main stories"]');
  var detailNav = document.querySelector('nav[aria-label="More pieces"]');
  if (!script || !script.src || (!homeNav && !detailNav)) return;

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var shownKey = "catterson.clippy-cameo.shown";
  var visitsKey = "catterson.clippy-cameo.pieces";
  var shown = readSession(shownKey) === "1";
  var homeTimer = 0;

  function readSession(key) {
    try {
      return window.sessionStorage.getItem(key);
    } catch (error) {
      return null;
    }
  }

  function writeSession(key, value) {
    try {
      window.sessionStorage.setItem(key, value);
    } catch (error) {
      // The cameo still works on the current page when storage is unavailable.
    }
  }

  function readVisits() {
    try {
      var visits = JSON.parse(readSession(visitsKey) || "[]");
      return Array.isArray(visits) ? visits : [];
    } catch (error) {
      return [];
    }
  }

  function recordDetailVisit() {
    if (!detailNav) return;
    var visits = readVisits();
    var piece = window.location.pathname.replace(/\/index\.html$/, "").replace(/\/$/, "");
    if (visits.indexOf(piece) !== -1) return;
    visits.push(piece);
    writeSession(visitsKey, JSON.stringify(visits));
  }

  function showCameo() {
    if (shown || readSession(shownKey) === "1" || reduceMotion || document.querySelector(".clippy-cameo")) return;
    shown = true;
    writeSession(shownKey, "1");

    var link = document.createElement("a");
    link.className = "clippy-cameo";
    link.href = new URL("../clippy/", script.src).href;
    link.setAttribute("aria-label", "Play CLIPPY.EXE");
    link.title = "Play CLIPPY.EXE";

    var canvas = document.createElement("canvas");
    canvas.width = 60;
    canvas.height = 90;
    canvas.setAttribute("aria-hidden", "true");
    link.appendChild(canvas);

    var footerClip = document.querySelector('footer a[aria-label="A paperclip"]');
    var footerClipWasHidden = footerClip ? footerClip.hidden : false;
    if (footerClip) footerClip.hidden = true;
    document.body.appendChild(link);

    var exitTimer = 0;
    var isReady = false;
    var pointerHeld = false;
    var focusHeld = false;
    var animation = animateClippy(
      canvas,
      function () {
        isReady = true;
        scheduleExit(6000);
      },
      function () {
        link.remove();
        if (footerClip) footerClip.hidden = footerClipWasHidden;
      }
    );

    function holdCameo() {
      window.clearTimeout(exitTimer);
    }

    function scheduleExit(delay) {
      window.clearTimeout(exitTimer);
      if (!isReady) return;
      exitTimer = window.setTimeout(function () {
        if (pointerHeld || focusHeld || document.activeElement === link || link.matches(":hover")) {
          scheduleExit(1500);
          return;
        }
        animation.exit();
      }, delay);
    }

    link.addEventListener("pointerenter", function () {
      pointerHeld = true;
      holdCameo();
    });
    link.addEventListener("pointerleave", function () {
      pointerHeld = false;
      scheduleExit(1500);
    });
    link.addEventListener("focus", function () {
      focusHeld = true;
      holdCameo();
    });
    link.addEventListener("blur", function () {
      focusHeld = false;
      scheduleExit(1500);
    });
  }

  function scheduleHomeCameo() {
    if (!homeNav || shown || readSession(shownKey) === "1" || reduceMotion || homeTimer || readVisits().length < 2) return;
    homeTimer = window.setTimeout(showCameo, 1200);
  }

  recordDetailVisit();

  if (detailNav && !shown && !reduceMotion && "IntersectionObserver" in window) {
    var observer = new IntersectionObserver(
      function (entries) {
        if (!entries.some(function (entry) { return entry.isIntersecting; })) return;
        observer.disconnect();
        window.setTimeout(showCameo, 700);
      },
      { threshold: 0.5 }
    );
    observer.observe(detailNav);
  }

  if (homeNav) {
    window.addEventListener("pageshow", scheduleHomeCameo);
    scheduleHomeCameo();
  }

  var idleSequences = [
    [
      { s: "center", d: 80 }, { s: "right", d: 50 }, { s: "center", d: 25 },
      { s: "blink", d: 7 }, { s: "center", d: 70 }, { s: "left", d: 40 },
      { s: "center", d: 30 }
    ],
    [
      { s: "center", d: 40 }, { s: "blink", d: 6 }, { s: "center", d: 8 },
      { s: "blink", d: 6 }, { s: "center", d: 20 }, { s: "right", d: 90 },
      { s: "center", d: 30 }
    ],
    [
      { s: "center", d: 30 }, { s: "left", d: 120 }, { s: "blink", d: 7 },
      { s: "left", d: 40 }, { s: "center", d: 50 }
    ],
    [
      { s: "center", d: 20 }, { s: "left", d: 12 }, { s: "right", d: 12 },
      { s: "left", d: 10 }, { s: "center", d: 15 }, { s: "blink", d: 7 },
      { s: "center", d: 60 }
    ]
  ];
  var peekEyes = [
    { s: "up", d: 20 }, { s: "center", d: 15 },
    { s: "left", d: 20 }, { s: "right", d: 20 },
    { s: "blink", d: 7 }, { s: "center", d: 5 }
  ];
  var returnEyes = [
    { s: "up", d: 15 }, { s: "center", d: 10 },
    { s: "blink", d: 7 }, { s: "center", d: 10 }
  ];
  var hopPattern = [0, -1, -2, -3, -3, -3, -3, -2, -1, 0];

  function createSmallDrawer(context, pixel) {
    var outline = "#58585f";
    var fill = "#a8a8b4";
    var highlight = "#c8c8d2";
    var white = "#ffffff";
    var pupil = "#2a1810";
    var eyeOutline = "#181820";
    var eyebrow = "#4a3828";

    function px(x, y, color) {
      context.fillStyle = color;
      context.fillRect(x * pixel, y * pixel, pixel, pixel);
    }

    function drawBody() {
      var y;
      for (y = 5; y <= 14; y++) { px(2, y, highlight); px(3, y, outline); }
      px(2, 4, highlight); px(3, 4, fill); px(4, 4, fill); px(5, 4, fill); px(6, 4, fill); px(7, 4, fill);
      px(3, 3, highlight); px(4, 3, fill); px(5, 3, fill); px(6, 3, fill); px(7, 3, outline);
      for (y = 5; y <= 14; y++) { px(7, y, fill); px(8, y, outline); }
      px(2, 15, fill); px(3, 15, fill); px(4, 15, outline); px(5, 15, outline); px(6, 15, outline); px(7, 15, outline); px(8, 15, outline);
      px(3, 16, outline); px(4, 16, outline); px(5, 16, outline); px(6, 16, outline); px(7, 16, outline);
      for (y = 9; y <= 12; y++) { px(4, y, highlight); px(5, y, fill); px(6, y, outline); }
      px(4, 8, highlight); px(5, 8, fill); px(6, 8, outline);
      px(4, 13, fill); px(5, 13, outline); px(6, 13, outline);
      px(5, 14, outline);
    }

    function drawEyes(dx, dy, blink) {
      function drawEye(cx, cy) {
        if (blink) {
          px(cx, cy, eyeOutline); px(cx + 1, cy, eyeOutline);
          return;
        }
        px(cx, cy - 2, eyebrow); px(cx + 1, cy - 2, eyebrow);
        px(cx, cy - 1, eyeOutline); px(cx + 1, cy - 1, eyeOutline);
        px(cx - 1, cy, eyeOutline); px(cx, cy, white); px(cx + 1, cy, white); px(cx + 2, cy, eyeOutline);
        px(cx - 1, cy + 1, eyeOutline); px(cx, cy + 1, white); px(cx + 1, cy + 1, white); px(cx + 2, cy + 1, eyeOutline);
        px(cx, cy + 2, eyeOutline); px(cx + 1, cy + 2, eyeOutline);
        px(dx > 0 ? cx + 1 : cx, dy < 0 ? cy : cy + 1, pupil);
      }
      drawEye(3, 1);
      drawEye(7, 1);
    }

    return { drawBody: drawBody, drawEyes: drawEyes };
  }

  function animateClippy(canvas, onReady, onExited) {
    var context = canvas.getContext("2d");
    var pixel = 5;
    var drawer = createSmallDrawer(context, pixel);
    var currentSequence = idleSequences[0];
    var sequenceIndex = 0;
    var sequenceTimer = 0;
    var hopTimer = 0;
    var hopStep = -1;
    var hopFrame = 0;
    var hiddenOffset = 18;
    var peekOffset = 13;
    var phase = 0;
    var phaseTimer = 0;
    var currentOffset = hiddenOffset;
    var stepTimer = 0;
    var peekIndex = 0;
    var peekTimer = 0;
    var returnIndex = 0;
    var returnTimer = 0;
    var exitRequested = false;
    var ready = false;
    var exited = false;

    context.imageSmoothingEnabled = false;

    function resolveEye(state) {
      return {
        dx: state === "right" ? 1 : state === "left" ? -1 : 0,
        dy: state === "up" ? -1 : 0,
        blink: state === "blink"
      };
    }

    function tickIdleEyes() {
      sequenceTimer++;
      if (sequenceTimer >= currentSequence[sequenceIndex].d) {
        sequenceTimer = 0;
        sequenceIndex++;
        if (sequenceIndex >= currentSequence.length) {
          sequenceIndex = 0;
          currentSequence = idleSequences[Math.floor(Math.random() * idleSequences.length)];
        }
      }
      return resolveEye(currentSequence[sequenceIndex].s);
    }

    function tickHop() {
      var offset = 0;
      if (hopStep >= 0) {
        offset = hopPattern[hopStep];
        hopFrame++;
        if (hopFrame >= 3) {
          hopFrame = 0;
          hopStep++;
          if (hopStep >= hopPattern.length) { hopStep = -1; hopTimer = 0; }
        }
      } else {
        hopTimer++;
        if (hopTimer >= 180) { hopStep = 0; hopFrame = 0; }
      }
      return offset;
    }

    function finishExit() {
      if (exited) return;
      exited = true;
      context.clearRect(0, 0, canvas.width, canvas.height);
      onExited();
    }

    function frame() {
      context.clearRect(0, 0, canvas.width, canvas.height);

      var drawOffset = currentOffset;
      var eyes = { dx: 0, dy: 0, blink: false };

      if (phase === 0) {
        phaseTimer++;
        if (phaseTimer > 30) { phase = 1; phaseTimer = 0; }
      } else if (phase === 1) {
        stepTimer++;
        if (stepTimer >= 4) {
          stepTimer = 0;
          currentOffset -= 2;
          if (currentOffset <= peekOffset) {
            currentOffset = peekOffset;
            phase = 2;
            peekIndex = 0;
            peekTimer = 0;
          }
        }
        drawOffset = currentOffset;
        eyes.dy = -1;
      } else if (phase === 2) {
        peekTimer++;
        if (peekTimer >= peekEyes[peekIndex].d) {
          peekTimer = 0;
          peekIndex++;
          if (peekIndex >= peekEyes.length) { phase = 2.5; stepTimer = 0; }
        }
        if (phase === 2) eyes = resolveEye(peekEyes[peekIndex].s);
        drawOffset = currentOffset;
      } else if (phase === 2.5) {
        stepTimer++;
        if (stepTimer >= 4) {
          stepTimer = 0;
          currentOffset += 2;
          if (currentOffset >= peekOffset + 6) {
            currentOffset = peekOffset + 6;
            phase = 2.7;
            phaseTimer = 0;
          }
        }
        drawOffset = currentOffset;
        eyes.dy = -1;
      } else if (phase === 2.7) {
        phaseTimer++;
        drawOffset = currentOffset;
        if (phaseTimer > 40) { phase = 3; stepTimer = 0; returnIndex = 0; returnTimer = 0; }
      } else if (phase === 3) {
        stepTimer++;
        if (stepTimer >= 3) {
          stepTimer = 0;
          currentOffset -= 2;
          if (currentOffset <= peekOffset) {
            currentOffset = peekOffset;
            phase = 3.5;
            returnIndex = 0;
            returnTimer = 0;
          }
        }
        drawOffset = currentOffset;
        eyes.dy = -1;
      } else if (phase === 3.5) {
        returnTimer++;
        if (returnTimer >= returnEyes[returnIndex].d) {
          returnTimer = 0;
          returnIndex++;
          if (returnIndex >= returnEyes.length) { phase = 4; stepTimer = 0; }
        }
        if (phase === 3.5) eyes = resolveEye(returnEyes[returnIndex].s);
        drawOffset = currentOffset;
      } else if (phase === 4 && currentOffset > 0) {
        stepTimer++;
        if (stepTimer >= 3) {
          stepTimer = 0;
          currentOffset -= 2;
          if (currentOffset <= 0) {
            currentOffset = 0;
            phase = 5;
            if (!ready) { ready = true; onReady(); }
          }
        }
        drawOffset = currentOffset;
      } else {
        if (phase === 5 && exitRequested) { phase = 6; stepTimer = 0; }
        if (phase === 6) {
          stepTimer++;
          if (stepTimer >= 3) {
            stepTimer = 0;
            currentOffset += 2;
            if (currentOffset >= hiddenOffset) {
              finishExit();
              return;
            }
          }
          drawOffset = currentOffset;
          eyes.dy = -1;
        } else {
          eyes = tickIdleEyes();
          drawOffset = tickHop();
        }
      }

      context.save();
      context.beginPath();
      context.rect(0, 0, canvas.width, canvas.height);
      context.clip();
      context.translate(0, drawOffset * pixel);
      drawer.drawBody();
      drawer.drawEyes(eyes.dx, eyes.dy, eyes.blink);
      context.restore();

      window.requestAnimationFrame(frame);
    }

    window.requestAnimationFrame(frame);
    return {
      exit: function () {
        exitRequested = true;
      }
    };
  }
})();