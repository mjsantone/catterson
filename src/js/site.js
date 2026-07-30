// Muted loops play only while on screen, and not at all for people who asked
// for reduced motion (they get controls instead). Plus one buried thing for
// whoever thinks to type it.
(function () {
  "use strict";

  if (document.documentElement.classList.contains("site-locked")) return;

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
        (target.closest && target.closest("input, textarea, select, button, video, audio, iframe, [role=slider], [data-document-carousel]"))
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

// Detail stories reveal each editorial beat once as it enters the viewport.
// Live iframe figures remain untransformed to avoid Safari compositor churn.
(function () {
  "use strict";

  if (document.documentElement.classList.contains("site-locked")) return;

  var detailMain = document.querySelector("main[data-cycle-prev][data-cycle-next]");
  if (!detailMain) return;

  var article = detailMain.querySelector("article");
  if (!article) return;

  var blocks = [];
  var directChildren = Array.prototype.slice.call(article.children);

  directChildren.forEach(function (child) {
    var nestedEditorialBlocks = child.querySelectorAll(":scope > .reading, :scope > div > .folio-sys, :scope > figure");
    if (nestedEditorialBlocks.length) {
      nestedEditorialBlocks.forEach(function (block) {
        blocks.push(block.classList.contains("folio-sys") ? block.parentElement : block);
      });
      return;
    }
    blocks.push(child);
  });

  blocks = blocks.filter(function (block, index) {
    return block && !block.querySelector("iframe") && blocks.indexOf(block) === index;
  });

  if (!blocks.length) return;

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduceMotion || document.hidden) {
    blocks.forEach(function (block) {
      block.dataset.detailReveal = "";
      block.dataset.visible = "true";
    });
    return;
  }

  blocks.forEach(function (block) {
    block.dataset.detailReveal = "";
  });
  document.documentElement.classList.add("detail-reveal-ready");

  var pending = blocks.slice();

  function revealInView() {
    var revealLine = window.innerHeight * 0.92;
    pending = pending.filter(function (block) {
      var bounds = block.getBoundingClientRect();
      if (bounds.top >= revealLine || bounds.bottom <= 0) return true;
      block.dataset.visible = "true";
      return false;
    });

    if (!pending.length) {
      window.removeEventListener("scroll", scheduleReveal);
      window.removeEventListener("resize", scheduleReveal);
    }
  }

  function scheduleReveal() {
    revealInView();
  }

  window.addEventListener("scroll", scheduleReveal, { passive: true });
  window.addEventListener("resize", scheduleReveal);
  revealInView();
})();

// Trusted local report artifacts keep their source HTML intact. Their full-width
// timeline treatment counts the vertical scrollbar, so trim horizontal
// overflow and hide the scrollbar chrome inside the fixed-ratio viewer.
(function () {
  "use strict";

  if (document.documentElement.classList.contains("site-locked")) return;

  var viewers = document.querySelectorAll("iframe[data-document-viewer]");
  if (!viewers.length) return;

  function fitViewer(viewer) {
    try {
      var doc = viewer.contentDocument;
      if (!doc || !doc.head || doc.getElementById("portfolio-viewer-fit")) return;
      var style = doc.createElement("style");
      style.id = "portfolio-viewer-fit";
      style.textContent =
        "html,body{overflow-x:hidden!important;scrollbar-width:none!important}" +
        "html::-webkit-scrollbar,body::-webkit-scrollbar{display:none!important;width:0!important;height:0!important}" +
        (viewer.closest("[data-document-carousel]")
          ? "*,*::before,*::after{animation:none!important;transition:none!important}"
          : "");
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

// Editorial outputs sit in a snap carousel with the selected report centered
// and its neighboring artifacts left visible as context.
(function () {
  "use strict";

  if (document.documentElement.classList.contains("site-locked")) return;

  var carousels = document.querySelectorAll("[data-document-carousel]");
  if (!carousels.length) return;

  carousels.forEach(function (carousel) {
    var viewport = carousel.querySelector("[data-carousel-viewport]");
    var slides = Array.prototype.slice.call(carousel.querySelectorAll("[data-carousel-slide]"));
    var previous = carousel.querySelector("[data-carousel-prev]");
    var next = carousel.querySelector("[data-carousel-next]");
    var current = Math.min(Number(carousel.dataset.featuredIndex) || 0, slides.length - 1);
    var scrollFrame = 0;
    var initialized = false;

    if (!viewport || !slides.length || !previous || !next) return;

    function loadSlide(slide) {
      var viewer = slide.querySelector("iframe[data-document-viewer]");
      if (!viewer || viewer.hasAttribute("src")) return;
      viewer.setAttribute("src", viewer.dataset.src);
    }

    function unloadSlide(slide) {
      var viewer = slide.querySelector("iframe[data-document-viewer]");
      if (!viewer || !viewer.hasAttribute("src")) return;
      viewer.removeAttribute("src");
      viewer.removeAttribute("data-loaded");
      viewer.setAttribute("tabindex", "-1");
    }

    slides.forEach(function (slide) {
      var viewer = slide.querySelector("iframe[data-document-viewer]");
      if (!viewer) return;
      viewer.addEventListener("load", function () {
        if (!viewer.hasAttribute("src")) {
          viewer.removeAttribute("data-loaded");
          return;
        }
        viewer.dataset.loaded = "true";
        if (slide.dataset.active === "true") viewer.removeAttribute("tabindex");
      });
    });

    function setActive(index) {
      current = (index + slides.length) % slides.length;
      slides.forEach(function (slide, slideIndex) {
        var active = slideIndex === current;
        slide.dataset.active = active ? "true" : "false";
        slide.toggleAttribute("aria-hidden", !active);
        if (active) loadSlide(slide);
        else unloadSlide(slide);
        slide.querySelectorAll("iframe, a").forEach(function (element) {
          var viewerReady = element.matches("iframe") && element.dataset.loaded === "true";
          if (active && (!element.matches("iframe") || viewerReady)) element.removeAttribute("tabindex");
          else element.setAttribute("tabindex", "-1");
        });
      });
    }

    function center(index, behavior) {
      setActive(index);
      var slide = slides[current];
      viewport.scrollTo({
        left: slide.offsetLeft - (viewport.clientWidth - slide.offsetWidth) / 2,
        behavior: behavior || "smooth",
      });
    }

    function updateFromScroll() {
      scrollFrame = 0;
      var viewportCenter = viewport.scrollLeft + viewport.clientWidth / 2;
      var nearest = 0;
      var distance = Infinity;
      slides.forEach(function (slide, index) {
        var slideCenter = slide.offsetLeft + slide.offsetWidth / 2;
        var nextDistance = Math.abs(slideCenter - viewportCenter);
        if (nextDistance < distance) {
          distance = nextDistance;
          nearest = index;
        }
      });
      setActive(nearest);
    }

    viewport.addEventListener("scroll", function () {
      if (!initialized) return;
      if (scrollFrame) return;
      scrollFrame = window.requestAnimationFrame(updateFromScroll);
    }, { passive: true });

    viewport.addEventListener("keydown", function (event) {
      if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
      event.preventDefault();
      center(current + (event.key === "ArrowLeft" ? -1 : 1));
    });

    slides.forEach(function (slide, index) {
      slide.addEventListener("click", function () {
        if (index !== current) center(index);
      });
    });

    previous.addEventListener("click", function () { center(current - 1); });
    next.addEventListener("click", function () { center(current + 1); });
    window.addEventListener("resize", function () {
      window.requestAnimationFrame(function () { center(current, "auto"); });
    });

    window.requestAnimationFrame(function () {
      window.requestAnimationFrame(function () {
        center(current, "auto");
        initialized = true;
      });
    });
    window.addEventListener("load", function () {
      center(current, "auto");
      initialized = true;
    }, { once: true });
  });
})();

/* A touch screen never hovers, so the story rows had no active state at all and
   read as plain text. Give whichever row sits across the middle of the screen
   the same treatment a pointer would give it. */
(function storyScrollFocus() {
  var rows = document.querySelectorAll(
    'nav[aria-label="Main stories"] a, [aria-labelledby="writing-heading"] li a'
  );
  if (!rows.length || !("IntersectionObserver" in window)) return;
  if (window.matchMedia("(hover: hover)").matches) return;

  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        entry.target.setAttribute("data-active", entry.isIntersecting ? "true" : "false");
      });
    },
    { rootMargin: "-45% 0px -45% 0px" }
  );

  Array.prototype.forEach.call(rows, function (row) {
    observer.observe(row);
  });
})();

/* Index rules draw in as each row arrives. Drawn once, never undone.
   Swept on scroll rather than observed: an element that jumps from below the
   fold to above it never intersects, so an observer would leave it ruleless. */
(function drawIndexRules() {
  var rows = Array.prototype.slice.call(document.querySelectorAll(".rule-draw"));
  if (!rows.length) return;

  function draw(row) {
    row.setAttribute("data-drawn", "true");
  }

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    rows.forEach(draw);
    return;
  }

  var ticking = false;
  function sweep() {
    ticking = false;
    var limit = window.innerHeight * 0.88;
    rows = rows.filter(function (row) {
      if (row.getBoundingClientRect().top > limit) return true;
      draw(row);
      return false;
    });
    if (!rows.length) {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    }
  }
  function onScroll() {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(sweep);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);
  sweep();
})();

/* The archive reward waits for the last tile, so only a full scroll earns it. */
(function archiveReward() {
  var reward = document.querySelector("[data-archive-reward]");
  var tiles = document.querySelectorAll(".archive-tile");
  if (!reward || !tiles.length || !("IntersectionObserver" in window)) {
    if (reward) reward.setAttribute("data-revealed", "true");
    return;
  }
  var last = tiles[tiles.length - 1];
  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        reward.setAttribute("data-revealed", "true");
        observer.disconnect();
      });
    },
    { threshold: 0.6 }
  );
  observer.observe(last);
})();

/* A rule in the margin of the long pieces, filling as the article is read. */
(function readingProgress() {
  var article = document.querySelector("main article");
  if (!article || document.querySelector('nav[aria-label="Main stories"]')) return;

  var rule = document.createElement("div");
  rule.className = "reading-rule";
  rule.setAttribute("aria-hidden", "true");
  var fill = document.createElement("span");
  fill.className = "reading-rule__fill";
  rule.appendChild(fill);
  document.body.appendChild(rule);

  var ticking = false;
  function update() {
    ticking = false;
    var box = article.getBoundingClientRect();
    var scrolled = -box.top;
    var runway = box.height - window.innerHeight;
    var progress = runway > 0 ? scrolled / runway : 0;
    progress = Math.max(0, Math.min(1, progress));
    fill.style.setProperty("--reading-progress", progress.toFixed(4));
    rule.setAttribute("data-visible", scrolled > 40 ? "true" : "false");
  }
  function onScroll() {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(update);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);
  update();
})();
