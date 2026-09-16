/* motion.js — scroll reveals, custom cursor, metric counters, page transitions */
(function () {
  'use strict';

  /* ── Scroll Reveal ─────────────────────────── */
  function initReveal() {
    var els = document.querySelectorAll('[data-reveal]');
    if (!els.length) return;

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.06, rootMargin: '0px 0px -56px 0px' });

    els.forEach(function (el) { io.observe(el); });
  }

  /* ── Custom Cursor ─────────────────────────── */
  function initCursor() {
    var cursor = document.getElementById('cardCursor');
    if (!cursor) return;
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

    var tx = window.innerWidth / 2;
    var ty = window.innerHeight / 2;
    var cx = tx, cy = ty;
    var raf;

    document.addEventListener('mousemove', function (e) {
      tx = e.clientX;
      ty = e.clientY;
    }, { passive: true });

    function loop() {
      /* Lerp factor: 0.10 = silky smooth lag */
      cx += (tx - cx) * 0.10;
      cy += (ty - cy) * 0.10;
      cursor.style.left = cx + 'px';
      cursor.style.top  = cy + 'px';
      raf = requestAnimationFrame(loop);
    }
    loop();

    document.querySelectorAll('[data-case-card]').forEach(function (card) {
      card.addEventListener('mouseenter', function () {
        cursor.classList.add('is-active');
      });
      card.addEventListener('mouseleave', function () {
        cursor.classList.remove('is-active');
      });
    });
  }

  /* ── Metric Counter ────────────────────────── */
  function animateCount(el) {
    var raw    = String(el.dataset.count).replace(/[^0-9.]/g, '') || '0';
    var prefix = el.dataset.prefix || '';
    var suffix = el.dataset.suffix || '';
    var target = parseFloat(raw);
    var isFloat = raw.indexOf('.') !== -1;
    var duration = 1500;
    var t0 = null;

    function easeOutQuart(t) { return 1 - Math.pow(1 - t, 4); }

    function tick(now) {
      if (!t0) t0 = now;
      var progress = Math.min((now - t0) / duration, 1);
      var val = target * easeOutQuart(progress);
      el.textContent = prefix + (isFloat ? val.toFixed(1) : Math.round(val)) + suffix;
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  function initCounters() {
    var els = document.querySelectorAll('[data-count]');
    if (!els.length) return;

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animateCount(entry.target);
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    els.forEach(function (el) { io.observe(el); });
  }

  /* ── Magnetic Buttons ──────────────────────── */
  function initMagnetic() {
    document.querySelectorAll('[data-magnetic]').forEach(function (el) {
      el.addEventListener('mousemove', function (e) {
        var r  = el.getBoundingClientRect();
        var dx = (e.clientX - r.left - r.width  / 2) * 0.28;
        var dy = (e.clientY - r.top  - r.height / 2) * 0.28;
        el.style.transform = 'translate(' + dx + 'px, ' + dy + 'px)';
      });
      el.addEventListener('mouseleave', function () {
        el.style.transform = '';
      });
    });
  }

  /* ── Smooth Anchor Scroll ──────────────────── */
  function initAnchors() {
    document.querySelectorAll('a[href^="#"]').forEach(function (a) {
      a.addEventListener('click', function (e) {
        var id = a.getAttribute('href').slice(1);
        var target = document.getElementById(id);
        if (!target) return;
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    });
  }

  /* ── Page Transitions ──────────────────────── */
  function initPageTransitions() {
    /* Mark as entering on load */
    document.body.classList.add('is-entering');
    setTimeout(function () {
      document.body.classList.remove('is-entering');
    }, 500);

    document.querySelectorAll('a[href]').forEach(function (a) {
      var href = a.getAttribute('href') || '';
      /* Skip anchor links, external links, mailto */
      if (!href || href.charAt(0) === '#' || href.indexOf('http') === 0 || href.indexOf('mailto') === 0) return;

      a.addEventListener('click', function (e) {
        e.preventDefault();
        document.body.classList.add('is-leaving');
        var dest = href;
        setTimeout(function () { window.location.href = dest; }, 340);
      });
    });
  }

  /* ── Parallax on hero orbs (subtle) ────────── */
  function initParallax() {
    var orbs = document.querySelectorAll('.hero__orb');
    if (!orbs.length) return;

    window.addEventListener('scroll', function () {
      var y = window.scrollY;
      orbs.forEach(function (orb, i) {
        var speed = [0.06, 0.10, 0.04][i] || 0.06;
        orb.style.transform = orb.style.transform.replace(/translateY\([^)]*\)/, '') +
          ' translateY(' + (y * speed) + 'px)';
      });
    }, { passive: true });
  }

  /* ── Scroll-to-top ────────────────────────── */
  function initScrollTop() {
    var btn = document.getElementById('scrollTop');
    if (!btn) return;

    window.addEventListener('scroll', function () {
      if (window.scrollY > 320) {
        btn.classList.add('is-visible');
      } else {
        btn.classList.remove('is-visible');
      }
    }, { passive: true });

    btn.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ── Hero Flash Images ────────────────────── */
  function initHeroFlash() {
    var titleEl = document.querySelector('.hero__title');
    var heroEl  = document.querySelector('.hero');
    if (!titleEl || !heroEl) return;

    /* Build the floating image element */
    var wrap = document.createElement('div');
    wrap.className = 'hero__flash-wrap';
    wrap.setAttribute('aria-hidden', 'true');
    var img = document.createElement('img');
    img.className = 'hero__flash-img';
    img.alt = '';
    wrap.appendChild(img);
    document.body.appendChild(wrap);

    var srcs = [
      'MyImgs/ChatGPT Image 16 сент. 2026 г., 19_21_11 (1).png',
      'MyImgs/ChatGPT Image 16 сент. 2026 г., 19_21_12 (2).png',
      'MyImgs/ChatGPT Image 16 сент. 2026 г., 19_21_14 (3).png',
      'MyImgs/ChatGPT Image 16 сент. 2026 г., 19_21_15 (4).png',
      'MyImgs/ChatGPT Image 16 сент. 2026 г., 19_21_16 (5).png'
    ];

    /* Preload all images */
    srcs.forEach(function(s) { var p = new Image(); p.src = s; });

    var idx = 0;
    var mx = 0, my = 0;
    var iv = null;

    document.addEventListener('mousemove', function(e) {
      mx = e.clientX;
      my = e.clientY;
    }, { passive: true });

    function showNext() {
      img.src = srcs[idx % srcs.length];
      idx++;
      var ox = (Math.random() - 0.5) * 32;
      var oy = (Math.random() - 0.5) * 20;
      var rot = (Math.random() - 0.5) * 10;
      wrap.style.left = (mx + ox) + 'px';
      wrap.style.top  = (my + oy) + 'px';
      img.style.transform = 'rotate(' + rot + 'deg)';
    }

    titleEl.addEventListener('mouseenter', function() {
      showNext();
      wrap.classList.add('is-active');
      iv = setInterval(showNext, 120);
    });

    titleEl.addEventListener('mouseleave', function() {
      clearInterval(iv);
      iv = null;
      wrap.classList.remove('is-active');
    });
  }

  /* ── Hero Text Motion ─────────────────────── */
  function initHeroTextMotion() {
    var titleEl = document.querySelector('.hero__title');
    if (!titleEl) return;

    var wordEls = [
      titleEl.querySelector('.hero__title-top'),
      titleEl.querySelector('.hero__title-main'),
      titleEl.querySelector('.hero__title-bottom')
    ].filter(Boolean);

    /* Split each word into individual char spans */
    wordEls.forEach(function(el) {
      var text = el.textContent;
      el.textContent = '';
      el.setAttribute('aria-label', text);
      text.split('').forEach(function(ch, i) {
        var s = document.createElement('span');
        s.className = 'char';
        s.setAttribute('aria-hidden', 'true');
        s.dataset.orig = ch;
        s.textContent = ch;
        s.style.setProperty('--i', i);
        el.appendChild(s);
      });
    });

    /* Scramble-decode effect for "Designer" */
    var POOL = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ#@!%/\\·×';
    var mainEl = titleEl.querySelector('.hero__title-main');

    function scrambleMain(extraDelay) {
      if (!mainEl) return;
      Array.from(mainEl.querySelectorAll('.char')).forEach(function(c, i) {
        setTimeout(function() {
          var orig = c.dataset.orig;
          var ticks = 0;
          var max = 8 + Math.floor(Math.random() * 5);
          var iv = setInterval(function() {
            if (ticks++ >= max) {
              c.textContent = orig;
              clearInterval(iv);
            } else {
              c.textContent = POOL[Math.floor(Math.random() * POOL.length)];
            }
          }, 52);
        }, (extraDelay || 0) + i * 60);
      });
    }

    titleEl.addEventListener('mouseenter', function() { scrambleMain(0); });

    /* Auto-play on page entry — fires after loader clears (~900 ms) */
    setTimeout(function() {
      titleEl.classList.add('is-animating');
      scrambleMain(120);
      setTimeout(function() {
        titleEl.classList.remove('is-animating');
      }, 3200);
    }, 900);

    /* Per-word magnetic parallax via RAF lerp */
    var hMults  = [-26, 14, 30];
    var vMults  = [-10, -5, 13];
    var targets  = [[0,0],[0,0],[0,0]];
    var currents = [[0,0],[0,0],[0,0]];
    var inside = false;
    var raf = null;

    function lerp(a, b, f) { return a + (b - a) * f; }

    function tick() {
      var stillMoving = false;
      wordEls.forEach(function(el, i) {
        var nx = lerp(currents[i][0], targets[i][0], 0.065);
        var ny = lerp(currents[i][1], targets[i][1], 0.065);
        if (Math.abs(nx - currents[i][0]) > 0.05 || Math.abs(ny - currents[i][1]) > 0.05) stillMoving = true;
        currents[i][0] = nx;
        currents[i][1] = ny;
        el.style.transform = 'translate(' + nx.toFixed(2) + 'px,' + ny.toFixed(2) + 'px)';
      });
      if (stillMoving || inside) raf = requestAnimationFrame(tick);
      else raf = null;
    }

    titleEl.addEventListener('mousemove', function(e) {
      if (!inside) { inside = true; if (!raf) raf = requestAnimationFrame(tick); }
      var r = titleEl.getBoundingClientRect();
      var mx = (e.clientX - (r.left + r.width  * 0.5)) / (r.width  * 0.5);
      var my = (e.clientY - (r.top  + r.height * 0.5)) / (r.height * 0.5);
      targets.forEach(function(t, i) {
        t[0] = mx * hMults[i];
        t[1] = my * vMults[i];
      });
    });

    titleEl.addEventListener('mouseleave', function() {
      inside = false;
      targets.forEach(function(t) { t[0] = 0; t[1] = 0; });
      if (!raf) raf = requestAnimationFrame(tick);
    });
  }

  /* ── Init ──────────────────────────────────── */
  function init() {
    document.body.classList.add('is-loaded');
    initReveal();
    initCursor();
    initCounters();
    initMagnetic();
    initAnchors();
    initPageTransitions();
    initParallax();
    initScrollTop();
    initHeroTextMotion();
    initHeroFlash();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
