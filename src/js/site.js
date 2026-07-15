// Muted loops play only while on screen, and not at all for people who asked
// for reduced motion (they get controls instead). This is the site's only script.
(function () {
  "use strict";

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
