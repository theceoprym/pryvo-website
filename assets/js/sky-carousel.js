/* No dependencies. Product screens remain visible without JavaScript. */
(function () {
  'use strict';
  var root = document.querySelector('[data-sky-carousel]');
  if (!root) return;
  var stage = root.querySelector('.sky-stage');
  var screens = Array.from(root.querySelectorAll('.sky-screen'));
  var name = root.querySelector('[data-screen-name]');
  var count = root.querySelector('[data-screen-count]');
  var pause = root.querySelector('[data-action="pause"]');
  var status = root.querySelector('[data-carousel-status]');
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  var index = 0;
  var paused = reduced.matches;
  var hovering = false;
  var focusing = false;
  var inView = true;
  var timer = null;
  var suppressClickUntil = 0;
  var pointerStart = null;
  var animations = [];
  var interval = 6500;

  function english() { return document.documentElement.lang === 'en'; }
  function title(screen) { return screen.dataset[english() ? 'nameEn' : 'nameDe']; }
  function slot(role) {
    var radius = Math.min(stage.clientWidth * .22, 108);
    return [
      { x: 0, y: 12, scale: 1, rotation: 0 },
      { x: radius, y: -12, scale: .78, rotation: 8 },
      { x: -radius, y: -12, scale: .78, rotation: -8 }
    ][role];
  }
  function transform(p) {
    return 'translate(-50%,-50%) translate(' + p.x + 'px,' + p.y + 'px) scale(' + p.scale + ') rotate(' + p.rotation + 'deg)';
  }
  function labels() {
    var en = english();
    name.textContent = title(screens[index]);
    count.textContent = '0' + (index + 1) + ' / 03';
    screens.forEach(function (screen) {
      screen.setAttribute('aria-label', en ? 'View ' + title(screen).toLowerCase() : title(screen) + ' anzeigen');
    });
    root.querySelector('[data-step="-1"]').setAttribute('aria-label', en ? 'Previous app screen' : 'Vorheriger App-Screen');
    root.querySelector('[data-step="1"]').setAttribute('aria-label', en ? 'Next app screen' : 'Nächster App-Screen');
    pause.setAttribute('aria-label', en ? (paused ? 'Start automatic slideshow' : 'Pause automatic slideshow') : (paused ? 'Automatischen Bildwechsel starten' : 'Automatischen Bildwechsel pausieren'));
    pause.setAttribute('aria-pressed', String(paused));
    pause.textContent = paused ? '▶' : 'Ⅱ';
  }
  function render(animate) {
    screens.forEach(function (screen, i) {
      var role = (i - index + screens.length) % screens.length;
      var destination = transform(slot(role));
      var current = window.getComputedStyle(screen).transform;
      if (animations[i]) animations[i].cancel();
      screen.style.transform = destination;
      screen.style.zIndex = role === 0 ? '6' : role === 1 ? '3' : '2';
      screen.style.filter = role === 0 ? 'none' : 'brightness(.86)';
      screen.setAttribute('aria-pressed', String(role === 0));
      screen.dataset.position = String(role);
      if (animate && !reduced.matches && typeof screen.animate === 'function') {
        animations[i] = screen.animate([
          { transform: current === 'none' ? destination : current },
          { transform: destination }
        ], { duration: 1050, easing: 'cubic-bezier(.22,.61,.36,1)' });
      }
    });
    labels();
  }
  function stopTimer() {
    if (timer !== null) { window.clearTimeout(timer); timer = null; }
  }
  function schedule() {
    stopTimer();
    if (paused || hovering || focusing || !inView || document.hidden) return;
    timer = window.setTimeout(function () { go(index + 1, false); }, interval);
  }
  function go(next, manual) {
    index = (next + screens.length) % screens.length;
    if (manual) paused = true;
    render(true);
    if (manual) status.textContent = title(screens[index]) + ', ' + (index + 1) + (english() ? ' of ' : ' von ') + screens.length;
    schedule();
  }

  root.querySelectorAll('[data-step]').forEach(function (button) {
    button.addEventListener('click', function () { go(index + Number(button.dataset.step), true); });
  });
  screens.forEach(function (screen, i) {
    screen.addEventListener('click', function () {
      if (Date.now() < suppressClickUntil) return;
      if (index !== i) go(i, true);
    });
  });
  pause.addEventListener('click', function () { paused = !paused; labels(); schedule(); });
  root.addEventListener('keydown', function (event) {
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
    event.preventDefault();
    go(index + (event.key === 'ArrowRight' ? 1 : -1), true);
  });
  stage.addEventListener('pointerdown', function (event) {
    if (event.pointerType === 'mouse' && event.button !== 0) return;
    pointerStart = { x: event.clientX, y: event.clientY, id: event.pointerId };
    stopTimer();
  });
  stage.addEventListener('pointermove', function (event) {
    if (!pointerStart || pointerStart.id !== event.pointerId) return;
    var dx = event.clientX - pointerStart.x;
    var dy = event.clientY - pointerStart.y;
    if (Math.abs(dx) > 15 && Math.abs(dx) > Math.abs(dy) && stage.setPointerCapture) stage.setPointerCapture(event.pointerId);
  });
  stage.addEventListener('pointerup', function (event) {
    if (!pointerStart || pointerStart.id !== event.pointerId) return;
    var dx = event.clientX - pointerStart.x;
    var dy = event.clientY - pointerStart.y;
    pointerStart = null;
    if (Math.abs(dx) > 35 && Math.abs(dx) > Math.abs(dy)) {
      suppressClickUntil = Date.now() + 500;
      go(index + (dx < 0 ? 1 : -1), true);
    } else schedule();
  });
  stage.addEventListener('pointercancel', function () { pointerStart = null; schedule(); });
  stage.addEventListener('pointerenter', function (event) { if (event.pointerType === 'mouse') { hovering = true; schedule(); } });
  stage.addEventListener('pointerleave', function () { hovering = false; schedule(); });
  root.addEventListener('focusin', function () { focusing = true; schedule(); });
  root.addEventListener('focusout', function (event) {
    if (!root.contains(event.relatedTarget)) { focusing = false; schedule(); }
  });
  document.addEventListener('visibilitychange', schedule);
  document.addEventListener('pryvo:languagechange', labels);
  function motionChanged() {
    if (reduced.matches) { paused = true; animations.forEach(function (animation) { if (animation) animation.cancel(); }); }
    render(false); schedule();
  }
  if (reduced.addEventListener) reduced.addEventListener('change', motionChanged);
  else if (reduced.addListener) reduced.addListener(motionChanged);
  if ('ResizeObserver' in window) new ResizeObserver(function () { render(false); }).observe(stage);
  else window.addEventListener('resize', function () { render(false); });
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (entries) {
      inView = entries[0].isIntersecting; schedule();
    }, { threshold: .15 }).observe(root);
  }
  root.dataset.ready = 'true';
  render(false);
  schedule();
})();
