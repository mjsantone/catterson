// Muted loops play only while on screen, and not at all for people who asked
// for reduced motion (they get controls instead). Plus one buried thing for
// whoever thinks to type it.
(function () {
  "use strict";

  // Type the paperclip's name anywhere and it takes you to him.
  var typed = "";
  document.addEventListener("keydown", function (e) {
    if (e.target.matches("input, textarea, select") || e.metaKey || e.ctrlKey || e.altKey) return;
    if (!e.key || e.key.length !== 1) return;
    typed = (typed + e.key.toLowerCase()).slice(-6);
    if (typed === "clippy") {
      window.location.href = (document.body.getAttribute("data-root") || "") + "clippy/";
    }
  });

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
