/* ==========================================================================
   LESSLIE NEWBIGIN — PORTFOLIO INTERACTIONS (multi-page)
   Vanilla JS, no dependencies. Respects prefers-reduced-motion.
   ========================================================================== */

(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  document.addEventListener('DOMContentLoaded', function () {
    var yearEl = document.getElementById('year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();
  });

  /* ---------- NAV ---------- */
  var nav = document.getElementById('nav');
  var navToggle = document.getElementById('navToggle');
  var navLinks = document.getElementById('navLinks');

  if (nav) {
    window.addEventListener('scroll', function () {
      nav.classList.toggle('is-scrolled', window.scrollY > 20);
    }, { passive: true });
  }
  if (navToggle) {
    navToggle.addEventListener('click', function () {
      var isOpen = navLinks.classList.toggle('is-open');
      navToggle.classList.toggle('is-open', isOpen);
      navToggle.setAttribute('aria-expanded', isOpen);
    });
  }

  /* ---------- SCROLL REVEAL ---------- */
  var revealEls = document.querySelectorAll('.reveal');
  if (revealEls.length) {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    revealEls.forEach(function (el) { revealObserver.observe(el); });
  }

  /* ---------- HERO TYPED ROLE (index page only) ---------- */
  var roles = [
    'Cybersecurity Student',
    'Ethical Hacking Enthusiast',
    'Network Security Learner',
    'Fortinet NSE 3 Certified',
    'Building CheCore'
  ];
  var typedEl = document.getElementById('typedRole');
  if (typedEl) {
    if (reduceMotion) {
      typedEl.textContent = roles[0];
    } else {
      (function typeLoop() {
        var roleIndex = 0, charIndex = 0, deleting = false;
        function tick() {
          var current = roles[roleIndex];
          if (!deleting) {
            charIndex++;
            typedEl.textContent = current.slice(0, charIndex);
            if (charIndex === current.length) { deleting = true; return setTimeout(tick, 1400); }
          } else {
            charIndex--;
            typedEl.textContent = current.slice(0, charIndex);
            if (charIndex === 0) { deleting = false; roleIndex = (roleIndex + 1) % roles.length; }
          }
          setTimeout(tick, deleting ? 35 : 65);
        }
        tick();
      })();
    }
  }

  /* ---------- HERO CONSOLE READOUT ---------- */
  var consoleBody = document.getElementById('consoleBody');
  if (consoleBody) {
    var lines = [
      '<span class="k">user@portfolio</span>:<span class="v">~$</span> whoami',
      '<span class="v">Lesslie Newbigin</span>',
      '<span class="k">degree</span>       <span class="v">B.E. Cybersecurity (Incoming)</span>',
      '<span class="k">institution</span>  <span class="v">CMS College of Engineering &amp; Technology</span>',
      '<span class="k">certs</span>        <span class="ok">Fortinet NSE 3 · COFPS · 10+ UNITAR/HP</span>',
      '<span class="k">status</span>       <span class="ok">available for opportunities</span>'
    ];
    var delayAcc = reduceMotion ? 0 : 2200;
    lines.forEach(function (html, i) {
      var p = document.createElement('span');
      p.className = 'cline';
      p.innerHTML = html;
      p.style.animationDelay = (reduceMotion ? 0 : delayAcc + i * 260) + 'ms';
      consoleBody.appendChild(p);
    });
  }

  /* ---------- ANIMATED STAT COUNTERS ---------- */
  var statEls = document.querySelectorAll('.stat-card__num');
  if (statEls.length) {
    var statObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        var target = parseInt(el.dataset.count, 10) || 0;
        if (reduceMotion) { el.textContent = target; statObserver.unobserve(el); return; }
        var duration = 1200, startTime = null;
        function step(ts) {
          if (!startTime) startTime = ts;
          var progress = Math.min((ts - startTime) / duration, 1);
          var eased = 1 - Math.pow(1 - progress, 3);
          el.textContent = Math.round(eased * target);
          if (progress < 1) requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
        statObserver.unobserve(el);
      });
    }, { threshold: 0.6 });
    statEls.forEach(function (el) { statObserver.observe(el); });
  }

  /* ---------- SKILL BAR FILL ---------- */
  var skillBars = document.querySelectorAll('.skill-bar');
  if (skillBars.length) {
    var skillObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var bar = entry.target;
        var level = bar.dataset.level || 0;
        var fill = bar.querySelector('.skill-bar__fill');
        requestAnimationFrame(function () { fill.style.width = level + '%'; });
        skillObserver.unobserve(bar);
      });
    }, { threshold: 0.4 });
    skillBars.forEach(function (b) { skillObserver.observe(b); });
  }

  /* ---------- CONTACT FORM (mailto, static-site friendly) ---------- */
  var form = document.getElementById('contactForm');
  var formNote = document.getElementById('formNote');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var name = form.name.value.trim();
      var email = form.email.value.trim();
      var message = form.message.value.trim();
      var subject = encodeURIComponent('Portfolio contact from ' + name);
      var body = encodeURIComponent(message + '\n\n— ' + name + ' (' + email + ')');
      window.location.href = 'mailto:lesslie.cysec@gmail.com?subject=' + subject + '&body=' + body;
      if (formNote) { formNote.textContent = 'Opening your email client...'; formNote.style.color = '#FFFFFF'; }
    });
  }

  /* ---------- BACKGROUND NETWORK CANVAS ---------- */
  var canvas = document.getElementById('netCanvas');
  if (canvas && !reduceMotion) {
    var ctx = canvas.getContext('2d');
    var W, H, nodes;
    var MAX_DIST = 150;

    function resize() {
      W = canvas.width = window.innerWidth;
      H = canvas.height = window.innerHeight;
      var count = Math.max(24, Math.min(60, Math.floor((W * H) / 26000)));
      nodes = [];
      for (var i = 0; i < count; i++) {
        nodes.push({ x: Math.random() * W, y: Math.random() * H, vx: (Math.random() - 0.5) * 0.25, vy: (Math.random() - 0.5) * 0.25 });
      }
    }
    function step() {
      ctx.clearRect(0, 0, W, H);
      for (var i = 0; i < nodes.length; i++) {
        var n = nodes[i];
        n.x += n.vx; n.y += n.vy;
        if (n.x < 0 || n.x > W) n.vx *= -1;
        if (n.y < 0 || n.y > H) n.vy *= -1;
      }
      for (var i = 0; i < nodes.length; i++) {
        for (var j = i + 1; j < nodes.length; j++) {
          var a = nodes[i], b = nodes[j];
          var dx = a.x - b.x, dy = a.y - b.y;
          var dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < MAX_DIST) {
            ctx.strokeStyle = 'rgba(255,255,255,' + (0.12 * (1 - dist / MAX_DIST)) + ')';
            ctx.lineWidth = 1;
            ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
          }
        }
      }
      for (var i = 0; i < nodes.length; i++) {
        ctx.fillStyle = 'rgba(255,255,255,0.5)';
        ctx.beginPath(); ctx.arc(nodes[i].x, nodes[i].y, 1.6, 0, Math.PI * 2); ctx.fill();
      }
      requestAnimationFrame(step);
    }
    resize(); step();
    var resizeTimer;
    window.addEventListener('resize', function () { clearTimeout(resizeTimer); resizeTimer = setTimeout(resize, 200); });
  }

  /* ==========================================================================
     BINARY / DOT PORTRAIT RENDERER
     Renders any <img> as a grid of "0"/"1" characters (or dots), sized and
     colored by the brightness of the source pixel underneath. No direct photo
     is ever shown — only the derived character/dot pattern.

     Usage: <div class="ascii-portrait" data-ascii-src="assets/images/profile-source.png" data-ascii-mode="binary"></div>
     data-ascii-mode: "binary" (0/1 characters) or "dot" (circles)
     ========================================================================== */
  function initAsciiPortraits() {
    var containers = document.querySelectorAll('[data-ascii-src]');
    containers.forEach(function (container) {
      var src = container.getAttribute('data-ascii-src');
      var mode = container.getAttribute('data-ascii-mode') || 'binary';
      var cols = parseInt(container.getAttribute('data-ascii-cols'), 10) || 46;

      var canvas = document.createElement('canvas');
      container.appendChild(canvas);
      var ctx = canvas.getContext('2d');

      var img = new Image();
      img.onload = function () {
        render();
        window.addEventListener('resize', debounce(render, 200));
      };
      img.onerror = function () {
        container.innerHTML = '<div style="display:flex;align-items:center;justify-content:center;height:100%;color:#5C6D78;font-family:IBM Plex Mono,monospace;font-size:12px;text-align:center;padding:20px;">binary_portrait.src<br>not found — add<br>' + src + '</div>';
      };
      img.src = src;

      function debounce(fn, wait) {
        var t;
        return function () { clearTimeout(t); t = setTimeout(fn, wait); };
      }

      function render() {
        var displaySize = container.clientWidth;
        var dpr = Math.min(window.devicePixelRatio || 1, 2);
        canvas.width = displaySize * dpr;
        canvas.height = displaySize * dpr;
        canvas.style.width = displaySize + 'px';
        canvas.style.height = displaySize + 'px';
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        ctx.clearRect(0, 0, displaySize, displaySize);

        // sample source image into a small offscreen canvas matching grid resolution
        var rows = cols;
        var off = document.createElement('canvas');
        off.width = cols; off.height = rows;
        var offCtx = off.getContext('2d');

        // cover-fit crop from source image into square
        var iw = img.naturalWidth, ih = img.naturalHeight;
        var side = Math.min(iw, ih);
        var sx = (iw - side) / 2, sy = (ih - side) / 2;
        offCtx.drawImage(img, sx, sy, side, side, 0, 0, cols, rows);

        var data;
        try {
          data = offCtx.getImageData(0, 0, cols, rows).data;
        } catch (e) {
          return; // CORS-restricted local file access fallback
        }

        var cell = displaySize / cols;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.font = (cell * 0.9) + 'px IBM Plex Mono, monospace';

        var tealRGB = [255, 255, 255];
        var amberRGB = [214, 214, 214];

        for (var y = 0; y < rows; y++) {
          for (var x = 0; x < cols; x++) {
            var idx = (y * cols + x) * 4;
            var r = data[idx], g = data[idx + 1], b = data[idx + 2];
            var brightness = (r * 0.299 + g * 0.587 + b * 0.114) / 255; // 0 (dark) - 1 (light)

            // mix teal -> amber based on brightness for a signal-style palette
            var mix = brightness;
            var cr = tealRGB[0] + (amberRGB[0] - tealRGB[0]) * mix;
            var cg = tealRGB[1] + (amberRGB[1] - tealRGB[1]) * mix;
            var cb = tealRGB[2] + (amberRGB[2] - tealRGB[2]) * mix;
            var alpha = 0.18 + brightness * 0.82;

            var px = x * cell + cell / 2;
            var py = y * cell + cell / 2;

            ctx.fillStyle = 'rgba(' + Math.round(cr) + ',' + Math.round(cg) + ',' + Math.round(cb) + ',' + alpha.toFixed(2) + ')';

            if (mode === 'dot') {
              var radius = (0.15 + brightness * 0.38) * cell;
              ctx.beginPath();
              ctx.arc(px, py, radius, 0, Math.PI * 2);
              ctx.fill();
            } else {
              var char = brightness > 0.5 ? '1' : '0';
              ctx.fillText(char, px, py);
            }
          }
        }
      }
    });
  }
  document.addEventListener('DOMContentLoaded', initAsciiPortraits);

})();

/* ==========================================================================
   PREMIUM LAYER — custom cursor, magnetic buttons, command palette,
   contact card interactions, expandable timeline, skill filters
   ========================================================================== */
(function () {
  'use strict';
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var isFinePointer = window.matchMedia('(pointer: fine)').matches;

  /* ---------- CUSTOM CURSOR ---------- */
  if (isFinePointer && !reduceMotion) {
    document.body.classList.add('has-custom-cursor');
    var dot = document.createElement('div');
    dot.className = 'cursor-dot';
    var ring = document.createElement('div');
    ring.className = 'cursor-ring';
    document.body.appendChild(dot);
    document.body.appendChild(ring);

    var mouseX = window.innerWidth / 2, mouseY = window.innerHeight / 2;
    var ringX = mouseX, ringY = mouseY;

    window.addEventListener('mousemove', function (e) {
      mouseX = e.clientX; mouseY = e.clientY;
      dot.style.transform = 'translate(' + mouseX + 'px,' + mouseY + 'px) translate(-50%,-50%)';
    }, { passive: true });

    document.addEventListener('mouseleave', function () { dot.classList.add('is-hidden'); ring.classList.add('is-hidden'); });
    document.addEventListener('mouseenter', function () { dot.classList.remove('is-hidden'); ring.classList.remove('is-hidden'); });

    function ringLoop() {
      ringX += (mouseX - ringX) * 0.18;
      ringY += (mouseY - ringY) * 0.18;
      ring.style.transform = 'translate(' + ringX + 'px,' + ringY + 'px) translate(-50%,-50%)';
      requestAnimationFrame(ringLoop);
    }
    ringLoop();

    var hoverables = document.querySelectorAll('a, button, .contact-card, .chip, .timeline__card, .cert-card');
    hoverables.forEach(function (el) {
      el.addEventListener('mouseenter', function () { ring.classList.add('is-hover'); });
      el.addEventListener('mouseleave', function () { ring.classList.remove('is-hover'); });
    });

    /* Magnetic buttons */
    var magnets = document.querySelectorAll('.btn, .nav__logo');
    magnets.forEach(function (el) {
      el.addEventListener('mousemove', function (e) {
        var rect = el.getBoundingClientRect();
        var relX = e.clientX - (rect.left + rect.width / 2);
        var relY = e.clientY - (rect.top + rect.height / 2);
        el.style.transform = 'translate(' + (relX * 0.22) + 'px,' + (relY * 0.28) + 'px)';
      });
      el.addEventListener('mouseleave', function () { el.style.transform = ''; });
    });
  }

  /* ---------- AURORA BACKDROP (inject once per page) ---------- */
  if (!document.querySelector('.aurora')) {
    var aurora = document.createElement('div');
    aurora.className = 'aurora';
    aurora.innerHTML = '<div class="aurora__blob aurora__blob--1"></div><div class="aurora__blob aurora__blob--2"></div><div class="aurora__blob aurora__blob--3"></div>';
    document.body.insertBefore(aurora, document.body.firstChild);
  }

  /* ---------- COMMAND PALETTE (Ctrl/Cmd + K) ---------- */
  var pages = [
    { label: 'Home', tag: 'go', href: 'index.html' },
    { label: 'About', tag: 'go', href: 'about.html' },
    { label: 'Expertise (Skills + Projects)', tag: 'go', href: 'expertise.html' },
    { label: 'Certificates', tag: 'go', href: 'certificates.html' },
    { label: 'Contact', tag: 'go', href: 'contact.html' },
    { label: 'Download Resume', tag: 'file', href: 'Lesslie_Newbigin_Resume.pdf' }
  ];

  var overlay = document.createElement('div');
  overlay.className = 'cmdk-overlay';
  overlay.innerHTML =
    '<div class="cmdk-panel">' +
      '<input class="cmdk-input" type="text" placeholder="Jump to a page... (Esc to close)" />' +
      '<div class="cmdk-list"></div>' +
    '</div>';
  document.body.appendChild(overlay);

  var cmdkInput = overlay.querySelector('.cmdk-input');
  var cmdkList = overlay.querySelector('.cmdk-list');
  var activeIndex = 0;
  var filtered = pages.slice();

  function renderList() {
    cmdkList.innerHTML = '';
    filtered.forEach(function (item, i) {
      var row = document.createElement('div');
      row.className = 'cmdk-item' + (i === activeIndex ? ' is-active' : '');
      row.innerHTML = '<span>' + item.label + '</span><span class="tag">' + item.tag + '</span>';
      row.addEventListener('click', function () { window.location.href = item.href; });
      cmdkList.appendChild(row);
    });
  }

  function openPalette() {
    overlay.classList.add('is-open');
    cmdkInput.value = '';
    filtered = pages.slice();
    activeIndex = 0;
    renderList();
    setTimeout(function () { cmdkInput.focus(); }, 60);
  }
  function closePalette() { overlay.classList.remove('is-open'); }

  document.addEventListener('keydown', function (e) {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      overlay.classList.contains('is-open') ? closePalette() : openPalette();
    }
    if (e.key === 'Escape') closePalette();
    if (overlay.classList.contains('is-open')) {
      if (e.key === 'ArrowDown') { e.preventDefault(); activeIndex = Math.min(activeIndex + 1, filtered.length - 1); renderList(); }
      if (e.key === 'ArrowUp') { e.preventDefault(); activeIndex = Math.max(activeIndex - 1, 0); renderList(); }
      if (e.key === 'Enter' && filtered[activeIndex]) { window.location.href = filtered[activeIndex].href; }
    }
  });
  overlay.addEventListener('click', function (e) { if (e.target === overlay) closePalette(); });
  cmdkInput.addEventListener('input', function () {
    var q = cmdkInput.value.toLowerCase();
    filtered = pages.filter(function (p) { return p.label.toLowerCase().indexOf(q) !== -1; });
    activeIndex = 0;
    renderList();
  });

  /* Add a visible hint near the resume button if present */
  var navCta = document.querySelector('.nav__cta');
  if (navCta) {
    var hint = document.createElement('button');
    hint.className = 'cmdk-hint';
    hint.type = 'button';
    hint.innerHTML = '⌘K <span>Search</span>';
    hint.addEventListener('click', openPalette);
    navCta.parentNode.insertBefore(hint, navCta);
  }

  /* ---------- CONTACT CARDS: ripple + copy-to-clipboard ---------- */
  document.querySelectorAll('.contact-card').forEach(function (card) {
    card.addEventListener('click', function (e) {
      var rect = card.getBoundingClientRect();
      var ripple = document.createElement('span');
      ripple.className = 'contact-card__ripple';
      var size = 10;
      ripple.style.width = ripple.style.height = size + 'px';
      ripple.style.left = (e.clientX - rect.left - size / 2) + 'px';
      ripple.style.top = (e.clientY - rect.top - size / 2) + 'px';
      card.appendChild(ripple);
      setTimeout(function () { ripple.remove(); }, 650);

      var copyVal = card.getAttribute('data-copy');
      if (copyVal) {
        e.preventDefault();
        var note = card.querySelector('.contact-card__note');
        if (navigator.clipboard) {
          navigator.clipboard.writeText(copyVal).then(function () {
            if (note) { var old = note.textContent; note.textContent = 'Copied to clipboard ✓'; setTimeout(function () { note.textContent = old; }, 1600); }
          });
        }
      }
    });
  });

  /* ---------- EXPANDABLE TIMELINE ---------- */
  document.querySelectorAll('.timeline__card[data-expandable]').forEach(function (card) {
    var item = card.closest('.timeline__item');
    card.addEventListener('click', function () {
      var wasOpen = item.classList.contains('is-expanded');
      document.querySelectorAll('.timeline__item.is-expanded').forEach(function (i) { i.classList.remove('is-expanded'); });
      if (!wasOpen) item.classList.add('is-expanded');
    });
  });

  /* ---------- SKILL / CHIP FILTER ---------- */
  var filterRow = document.querySelector('.filter-row');
  if (filterRow) {
    var pills = filterRow.querySelectorAll('.filter-pill');
    var chips = document.querySelectorAll('.chip[data-cat]');
    pills.forEach(function (pill) {
      pill.addEventListener('click', function () {
        pills.forEach(function (p) { p.classList.remove('is-active'); });
        pill.classList.add('is-active');
        var cat = pill.getAttribute('data-filter');
        chips.forEach(function (chip) {
          var show = cat === 'all' || chip.getAttribute('data-cat') === cat;
          chip.classList.toggle('is-hidden', !show);
        });
      });
    });
  }

})();

/* ---------- LIVE CLOCK (real local time, updates every second) ---------- */
(function () {
  var liveEl = document.getElementById('consoleLive');
  if (!liveEl) return;
  function updateClock() {
    var now = new Date();
    var timeStr = now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
    var dateStr = now.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });
    liveEl.innerHTML = '<span><span class="live-dot"></span>' + dateStr + '</span><span class="live-time">' + timeStr + '</span>';
  }
  updateClock();
  setInterval(updateClock, 1000);
})();

/* ==========================================================================
   CINEMATIC LAYER — smooth scroll, split-text hero reveal, scroll progress,
   blur-to-focus reveals, context-aware cursor labels
   ========================================================================== */
(function () {
  'use strict';
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var isFinePointer = window.matchMedia('(pointer: fine)').matches;

  /* ---------- SCROLL PROGRESS BAR ---------- */
  var progressBar = document.createElement('div');
  progressBar.className = 'scroll-progress';
  document.body.appendChild(progressBar);
  function updateProgress() {
    var h = document.documentElement;
    var scrolled = (h.scrollTop) / (h.scrollHeight - h.clientHeight) * 100;
    progressBar.style.width = (scrolled || 0) + '%';
  }
  window.addEventListener('scroll', updateProgress, { passive: true });
  updateProgress();

  /* ---------- LIGHTWEIGHT SMOOTH SCROLL (eased, no external library) ----------
     Intercepts wheel input and animates scroll position with easing, giving a
     "Lenis-style" glide instead of native instant-jump scrolling. Falls back
     to native scrolling entirely on touch devices and reduced-motion. */
  if (isFinePointer && !reduceMotion) {
    var currentY = window.scrollY;
    var targetY = window.scrollY;
    var ticking = false;

    function clampTarget() {
      var max = document.documentElement.scrollHeight - window.innerHeight;
      targetY = Math.max(0, Math.min(targetY, max));
    }

    function smoothTick() {
      currentY += (targetY - currentY) * 0.12;
      if (Math.abs(targetY - currentY) < 0.5) currentY = targetY;
      window.scrollTo(0, currentY);
      updateProgress();
      if (currentY !== targetY) requestAnimationFrame(smoothTick);
      else ticking = false;
    }

    window.addEventListener('wheel', function (e) {
      // Let native behavior handle it if focus is inside a scrollable inner element (e.g. cmdk list)
      if (e.target.closest('.cmdk-list')) return;
      e.preventDefault();
      targetY += e.deltaY;
      clampTarget();
      if (!ticking) { ticking = true; requestAnimationFrame(smoothTick); }
    }, { passive: false });

    // Keep target in sync if user uses keyboard/scrollbar directly
    window.addEventListener('scroll', function () {
      if (!ticking) { currentY = window.scrollY; targetY = window.scrollY; }
    }, { passive: true });
  }

  /* ---------- SPLIT-TEXT HERO REVEAL ---------- */
  document.querySelectorAll('[data-split-text]').forEach(function (el) {
    var text = el.textContent;
    el.textContent = '';
    el.setAttribute('aria-label', text);
    var charIndex = 0;
    text.split(' ').forEach(function (word, wi, arr) {
      var wordSpan = document.createElement('span');
      wordSpan.className = 'split-line';
      wordSpan.style.display = 'inline-block';
      word.split('').forEach(function (ch) {
        var span = document.createElement('span');
        span.className = 'split-char';
        span.textContent = ch;
        span.style.animationDelay = (reduceMotion ? 0 : charIndex * 28) + 'ms';
        span.setAttribute('aria-hidden', 'true');
        wordSpan.appendChild(span);
        charIndex++;
      });
      el.appendChild(wordSpan);
      if (wi < arr.length - 1) el.appendChild(document.createTextNode(' '));
    });
  });

  /* ---------- UPGRADE EXISTING .reveal ELEMENTS TO CINEMATIC BLUR VARIANT ---------- */
  document.querySelectorAll('.reveal').forEach(function (el) {
    el.classList.add('reveal--cinematic');
  });

  /* ---------- CONTEXT-AWARE CURSOR LABEL ---------- */
  if (isFinePointer && !reduceMotion) {
    var label = document.createElement('div');
    label.className = 'cursor-label';
    document.body.appendChild(label);
    window.addEventListener('mousemove', function (e) {
      label.style.transform = 'translate(' + e.clientX + 'px,' + e.clientY + 'px) translate(-50%, 18px)';
    }, { passive: true });

    document.querySelectorAll('[data-cursor-label]').forEach(function (el) {
      el.addEventListener('mouseenter', function () {
        label.textContent = el.getAttribute('data-cursor-label');
        label.classList.add('is-active');
      });
      el.addEventListener('mouseleave', function () { label.classList.remove('is-active'); });
    });
  }

})();
