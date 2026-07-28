(function () {
  "use strict";

  if (!document.documentElement.classList.contains("site-locked")) return;

  var form = document.getElementById("password-gate-form");
  var gate = document.getElementById("password-gate");
  var input = document.getElementById("password-gate-input");
  var entry = document.getElementById("password-gate-entry");
  var status = document.getElementById("password-gate-status");
  var cells = Array.prototype.slice.call(document.querySelectorAll(".password-gate__cell"));
  var expected = "catterson";
  var resetTimer = 0;

  if (!form || !gate || !input || !entry || !status || cells.length !== expected.length) return;

  document.title = "Private preview · " + gate.dataset.siteName;

  function draw() {
    var length = input.value.length;
    cells.forEach(function (cell, index) {
      cell.dataset.filled = index < length ? "true" : "false";
      cell.dataset.active = index === length && length < cells.length ? "true" : "false";
    });
  }

  function reset() {
    window.clearTimeout(resetTimer);
    form.dataset.invalid = "false";
    input.setAttribute("aria-invalid", "false");
    status.textContent = "";
    input.value = "";
    draw();
    input.focus();
  }

  function unlock() {
    try {
      window.localStorage.setItem("catterson.access.v1", "open");
    } catch (error) {
      try {
        window.sessionStorage.setItem("catterson.access.v1", "open");
      } catch (fallbackError) {
        document.documentElement.className = "site-unlocked";
        return;
      }
    }

    status.textContent = "Opening...";
    window.location.reload();
  }

  function submit() {
    if (input.value === expected) {
      unlock();
      return;
    }

    form.dataset.invalid = "true";
    input.setAttribute("aria-invalid", "true");
    status.textContent = "Try again.";
    resetTimer = window.setTimeout(reset, 650);
  }

  input.addEventListener("input", function () {
    window.clearTimeout(resetTimer);
    input.value = input.value.toLowerCase().replace(/[^a-z]/g, "").slice(0, cells.length);
    form.dataset.invalid = "false";
    input.setAttribute("aria-invalid", "false");
    status.textContent = "";
    draw();
    if (input.value.length === cells.length) submit();
  });

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    submit();
  });

  entry.addEventListener("click", function () {
    input.focus();
  });

  draw();
  window.requestAnimationFrame(function () {
    input.focus();
  });
})();