// Muted loops play only while on screen, and not at all for people who asked
// for reduced motion (they get controls instead). Plus one buried thing for
// whoever thinks to type it.
(function () {
  "use strict";

  // Type the paperclip's name anywhere and it takes you to him.
  var typed = "";
  document.addEventListener("keydown", function (e) {
    if ((e.target.matches && e.target.matches("input, textarea, select")) || e.metaKey || e.ctrlKey || e.altKey) return;
    if (!e.key || e.key.length !== 1) return;
    typed = (typed + e.key.toLowerCase()).slice(-6);
    if (typed === "clippy") {
      window.location.href = (document.body.getAttribute("data-root") || "") + "clippy/";
    }
  });

  // Cycle through the published detail sequence without touching native arrow
  // behavior inside editable fields or media controls.
  var cyclePage = document.querySelector("[data-cycle-prev][data-cycle-next]");
  if (cyclePage) {
    document.addEventListener("keyup", function (e) {
      if (
        e.metaKey ||
        e.ctrlKey ||
        e.altKey ||
        (e.key !== "ArrowLeft" && e.key !== "ArrowRight")
      ) return;

      var target = e.target;
      if (
        target.isContentEditable ||
        (target.closest && target.closest("input, textarea, select, button, video, audio, iframe, [role=slider]"))
      ) return;

      e.preventDefault();
      window.location.href = cyclePage.getAttribute(
        e.key === "ArrowLeft" ? "data-cycle-prev" : "data-cycle-next"
      );
    });
  }

  var videos = document.querySelectorAll("video[data-autoplay]");
  if (!videos.length) return;

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (reduceMotion || !("IntersectionObserver" in window)) {
    videos.forEach(function (v) {
      v.controls = true;
    });
    return;
  }

  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        var v = entry.target;
        if (entry.isIntersecting) {
          v.muted = true;
          var p = v.play();
          if (p) p.catch(function () { v.controls = true; });
        } else {
          v.pause();
        }
      });
    },
    { threshold: 0.25 }
  );

  videos.forEach(function (v) {
    observer.observe(v);
  });
})();

// Trusted local report artifacts keep their source HTML intact. Their full-width
// timeline treatment counts the vertical scrollbar, so trim horizontal
// overflow and hide the scrollbar chrome inside the fixed-ratio viewer.
(function () {
  "use strict";

  var viewers = document.querySelectorAll("iframe[data-document-viewer]");
  if (!viewers.length) return;

  function fitViewer(viewer) {
    try {
      var doc = viewer.contentDocument;
      if (!doc || !doc.head || doc.getElementById("portfolio-viewer-fit")) return;
      var style = doc.createElement("style");
      style.id = "portfolio-viewer-fit";
      style.textContent = "html,body{overflow-x:hidden!important;scrollbar-width:none!important}html::-webkit-scrollbar,body::-webkit-scrollbar{display:none!important;width:0!important;height:0!important}";
      doc.head.appendChild(style);
    } catch (error) {
      // A future cross-origin artifact still remains usable without this trim.
    }
  }

  viewers.forEach(function (viewer) {
    viewer.addEventListener("load", function () {
      fitViewer(viewer);
    });
    if (viewer.contentDocument && viewer.contentDocument.readyState !== "loading") {
      fitViewer(viewer);
    }
  });
})();
