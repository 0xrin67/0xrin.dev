

(function () {
  var THEMES = {
    violet:  { neon: '#b388ff', bright: '#d4b3ff', dim: '#7c4dff', magenta: '#e879f9', rgb: '179, 136, 255' },
    slate:   { neon: '#aab8d4', bright: '#cdd7ea', dim: '#7f8db0', magenta: '#c4b8da', rgb: '170, 184, 212' },
    cyan:    { neon: '#6fd3e6', bright: '#a8e9f3', dim: '#3aacc4', magenta: '#7fb8e0', rgb: '111, 211, 230' },
    emerald: { neon: '#4dd39e', bright: '#86e8c2', dim: '#2aa87a', magenta: '#4fc7c0', rgb: '77, 211, 158' },
    amber:   { neon: '#e8b366', bright: '#f3d199', dim: '#c98f3d', magenta: '#e89a6b', rgb: '232, 179, 102' },
  };
  function applyTheme(name) {
    var t = THEMES[name] || THEMES.violet;
    var s = document.documentElement.style;
    s.setProperty('--neon', t.neon);
    s.setProperty('--neon-bright', t.bright);
    s.setProperty('--neon-dim', t.dim);
    s.setProperty('--magenta', t.magenta);
    s.setProperty('--neon-glow', 'rgba(' + t.rgb + ', 0.55)');
    s.setProperty('--border', 'rgba(' + t.rgb + ', 0.2)');
    s.setProperty('--border-strong', 'rgba(' + t.rgb + ', 0.4)');
    window.__accentRGB = t.rgb;
    window.__accentHex = t.neon;
  }
  var current = 'violet';
  try { current = localStorage.getItem('0xrin_theme') || 'violet'; } catch (e) {}
  if (!THEMES[current]) current = 'violet';
  applyTheme(current);
  function wireDots() {
    var dots = document.querySelectorAll('.theme-dot');
    dots.forEach(function (dot) {
      if (dot.dataset.theme === current) dot.classList.add('active');
      dot.addEventListener('click', function () {
        current = dot.dataset.theme;
        applyTheme(current);
        try { localStorage.setItem('0xrin_theme', current); } catch (e) {}
        dots.forEach(function (d) { d.classList.toggle('active', d === dot); });
      });
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', wireDots);
  else wireDots();
})();


(function () {
  'use strict';

  console.log('%c[0xrin] main.js loaded', 'color:#b388ff');

  const prefersReduced = false;

  const navbar = document.getElementById('navbar');
  const progress = document.getElementById('scrollProgress');

  function onScroll() {
    const y = window.scrollY;
    navbar.classList.toggle('scrolled', y > 30);
    const h = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.width = (h > 0 ? (y / h) * 100 : 0) + '%';
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  const menuToggle = document.getElementById('menuToggle');
  const navLinks = document.getElementById('navLinks');

  function closeMenu() {
    menuToggle.classList.remove('active');
    navLinks.classList.remove('open');
    menuToggle.setAttribute('aria-expanded', 'false');
  }
  menuToggle.addEventListener('click', () => {
    const open = navLinks.classList.toggle('open');
    menuToggle.classList.toggle('active', open);
    menuToggle.setAttribute('aria-expanded', String(open));
  });
  navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));
  document.addEventListener('click', (e) => {
    if (navLinks.classList.contains('open') &&
        !navLinks.contains(e.target) && !menuToggle.contains(e.target)) {
      closeMenu();
    }
  });

  const reveals = document.querySelectorAll('.reveal');
  if (prefersReduced || !('IntersectionObserver' in window)) {
    reveals.forEach(el => el.classList.add('visible'));
  } else {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          const delay = Math.min(i * 50, 200);
          setTimeout(() => entry.target.classList.add('visible'), delay);
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    reveals.forEach(el => io.observe(el));
  }

  try {
    const typedEl = document.getElementById('typed');
    let phrases = (window.I18N && window.I18N.dyn('typed')) || [
      'building bots',
      'training AI',
      'shipping code',
      'mining minecraft',
      'breaking limits',
    ];

    if (typedEl) {
      if (prefersReduced) {
        typedEl.textContent = phrases[0];
      } else {
        console.log('%c[0xrin] typewriter started', 'color:#b388ff');
        let pi = 0, ci = 0, deleting = false;

        function tick() {
          if (pi >= phrases.length) pi = 0;
          const word = phrases[pi];
          if (!deleting) {

            typedEl.textContent = word.slice(0, ci + 1);
            ci++;
            if (ci === word.length) {

              deleting = true;
              setTimeout(tick, 1800);
              return;
            }
            setTimeout(tick, 90 + Math.random() * 60);
          } else {

            typedEl.textContent = word.slice(0, ci - 1);
            ci--;
            if (ci === 0) {

              deleting = false;
              pi = (pi + 1) % phrases.length;
              setTimeout(tick, 400);
              return;
            }
            setTimeout(tick, 45);
          }
        }

        window.addEventListener('langchange', function () {
          phrases = (window.I18N && window.I18N.dyn('typed')) || phrases;
          pi = pi % phrases.length;
          ci = 0;
          deleting = false;
        });

        setTimeout(tick, 600);
      }
    } else {
      console.warn('[0xrin] #typed element not found');
    }
  } catch (err) {
    console.error('[0xrin] typewriter error:', err);
  }

  const counters = document.querySelectorAll('.stat-num');
  function animateCounter(el) {
    const target = parseInt(el.dataset.target, 10);
    const suffix = el.dataset.suffix || '';
    if (prefersReduced) { el.textContent = target + suffix; return; }
    const dur = 1400;
    const start = performance.now();
    function step(now) {
      const p = Math.min((now - start) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(target * eased) + suffix;
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  if ('IntersectionObserver' in window) {
    const cObs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          cObs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.6 });
    counters.forEach(c => cObs.observe(c));
  } else {
    counters.forEach(animateCounter);
  }

  const canvas = document.getElementById('particles');
  if (canvas && !prefersReduced) {
    const ctx = canvas.getContext('2d');
    let particles = [];
    let w, h, rafId;

    function resize() {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
      const density = Math.min(Math.floor((w * h) / 22000), 60);
      particles = Array.from({ length: density }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        r: Math.random() * 1.2 + 0.3,
        vx: (Math.random() - 0.5) * 0.2,
        vy: (Math.random() - 0.5) * 0.2,
        a: Math.random() * 0.4 + 0.15,
      }));
    }

    function draw() {
      ctx.clearRect(0, 0, w, h);
      for (const p of particles) {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x = w; if (p.x > w) p.x = 0;
        if (p.y < 0) p.y = h; if (p.y > h) p.y = 0;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${window.__accentRGB || '179, 136, 255'}, ${p.a})`;
        ctx.fill();
      }

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const d = dx * dx + dy * dy;
          if (d < 12000) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(${window.__accentRGB || '179, 136, 255'}, ${0.1 * (1 - d / 12000)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
      rafId = requestAnimationFrame(draw);
    }

    resize();
    draw();
    window.addEventListener('resize', resize);
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) cancelAnimationFrame(rafId);
      else draw();
    });
  }

  const termTypeEl = document.getElementById('termType');
  const termCommands = (window.I18N && window.I18N.common('terminalCommands')) || [
    'git push origin main',
    'npm run dev',
    'node bot.js',
    'python main.py',
    'python train.py --epochs 100',
    'python -m http.server',
    'docker compose up -d',
    'cargo run --release',
    'neofetch',
    'ssh 0xrin@0xrin.dev',
    'echo "available · dm me"',
  ];

  function runTermTyper() {
    if (!termTypeEl) return;
    if (prefersReduced) { termTypeEl.textContent = '_'; return; }

    let pi = 0, ci = 0, deleting = false;

    function tick() {
      const word = termCommands[pi];
      if (!deleting) {
        termTypeEl.textContent = word.slice(0, ci + 1);
        ci++;
        if (ci === word.length) {
          deleting = true;
          setTimeout(tick, 2000);
          return;
        }
        setTimeout(tick, 70 + Math.random() * 50);
      } else {
        termTypeEl.textContent = word.slice(0, ci - 1);
        ci--;
        if (ci === 0) {
          deleting = false;
          pi = (pi + 1) % termCommands.length;
          setTimeout(tick, 400);
          return;
        }
        setTimeout(tick, 35);
      }
    }
    tick();
  }

  const contactSection = document.getElementById('contact');
  if (contactSection && 'IntersectionObserver' in window) {
    const tObs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) { runTermTyper(); tObs.disconnect(); }
      });
    }, { threshold: 0.3 });
    tObs.observe(contactSection);
  } else {
    runTermTyper();
  }

  document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width;
      const py = (e.clientY - rect.top) / rect.height;
      card.style.setProperty('--mx', (px * 100) + '%');
      card.style.setProperty('--my', (py * 100) + '%');
      const rx = (0.5 - py) * 9;
      const ry = (px - 0.5) * 9;
      card.style.transform = 'perspective(900px) rotateX(' + rx.toFixed(2) + 'deg) rotateY(' + ry.toFixed(2) + 'deg) translateY(-6px)';
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });

  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  const footerMemeEl = document.getElementById('footerMeme');
  if (footerMemeEl) {
    const pickMeme = function () {
      const memes = (window.I18N && window.I18N.dyn('memes')) || [
        'git push --force | pray',
        '0 bugs (that I know of)',
        'built at 3am, deployed at 4',
      ];
      footerMemeEl.textContent = memes[Math.floor(Math.random() * memes.length)];
    };
    pickMeme();
    window.addEventListener('langchange', pickMeme);
  }
})();


(function () {
  const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  if (!fine) return;
  let targetY = window.scrollY;
  let curY = window.scrollY;
  let raf = null;
  const ease = 0.14;
  const maxY = () => Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
  function tick() {
    curY += (targetY - curY) * ease;
    if (Math.abs(targetY - curY) < 0.4) { curY = targetY; window.scrollTo(0, curY); raf = null; return; }
    window.scrollTo(0, curY);
    raf = requestAnimationFrame(tick);
  }
  function innerScrollable(el) {
    while (el && el !== document.body && el !== document.documentElement) {
      if (el.scrollHeight > el.clientHeight) {
        const oy = getComputedStyle(el).overflowY;
        if (oy === 'auto' || oy === 'scroll') return true;
      }
      el = el.parentElement;
    }
    return false;
  }
  window.addEventListener('wheel', (e) => {
    if (e.ctrlKey || e.deltaMode !== 0) return;
    if (innerScrollable(e.target)) return;
    e.preventDefault();
    targetY = Math.max(0, Math.min(maxY(), targetY + e.deltaY));
    if (raf === null) { curY = window.scrollY; raf = requestAnimationFrame(tick); }
  }, { passive: false });
  window.addEventListener('scroll', () => { if (raf === null) targetY = window.scrollY; }, { passive: true });
  window.addEventListener('resize', () => { targetY = Math.min(targetY, maxY()); });
})();


(function () {
  const fab = document.getElementById('playerFab');
  const player = document.getElementById('player');
  if (!fab || !player) return;
  fab.addEventListener('click', () => {
    const shown = player.classList.toggle('show-mobile');
    fab.classList.toggle('active', shown);
    fab.setAttribute('aria-label', shown ? 'Hide music player' : 'Show music player');
  });
})();


(function () {
  const orbs = [
    { el: document.querySelector('.bg-orb-1'), depth: 0.5 },
    { el: document.querySelector('.bg-orb-2'), depth: -0.7 },
    { el: document.querySelector('.bg-orb-3'), depth: 0.4 },
  ].filter(o => o.el);
  if (!orbs.length) return;
  if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
  let mx = 0, my = 0;
  function apply() {
    const sy = window.scrollY;
    for (const o of orbs) {
      const x = mx * o.depth * 18;
      const y = my * o.depth * 18 + sy * o.depth * 0.04;
      o.el.style.translate = x.toFixed(1) + 'px ' + y.toFixed(1) + 'px';
    }
  }
  window.addEventListener('mousemove', (e) => {
    mx = (e.clientX / window.innerWidth - 0.5) * 2;
    my = (e.clientY / window.innerHeight - 0.5) * 2;
    apply();
  }, { passive: true });
  window.addEventListener('scroll', apply, { passive: true });
})();


(function () {
  const boot = document.getElementById('boot');
  const log = document.getElementById('bootLog');
  if (!boot) return;
  const root = document.documentElement;
  root.classList.add('booting');
  const steps = [
    'booting 0xrin.dev',
    'loading kernel modules',
    'mounting /dev/skills',
    'initializing runtime',
    'connecting to network',
    'fetching projects',
    'compiling assets',
    'starting services',
    'establishing uplink',
    'system ready',
  ];
  let i = 0;
  function done() {
    if (boot.classList.contains('done')) return;
    boot.classList.add('done');
    root.classList.remove('booting');
    setTimeout(() => { if (boot.parentNode) boot.parentNode.removeChild(boot); }, 650);
  }
  function next() {
    if (!log || i >= steps.length) { setTimeout(done, 400); return; }
    const line = document.createElement('div');
    line.className = 'boot-line';
    line.innerHTML = '<span class="boot-prompt">&gt;</span> ' + steps[i] + ' <span class="boot-ok">[ ok ]</span>';
    log.appendChild(line);
    i++;
    setTimeout(next, 360 + Math.random() * 150);
  }
  boot.addEventListener('click', done);
  setTimeout(next, 250);
})();


(function () {
  if (!window.matchMedia || !window.matchMedia('(pointer: fine)').matches) return;
  var root = document.documentElement;
  var arrow = document.createElement('div');
  arrow.className = 'cur-arrow';
  arrow.innerHTML = '<svg viewBox="0 0 24 24"><path d="M3 2 L3 21 L8 16 L11 22.5 L13.7 21.4 L10.8 15 L17 15 Z" stroke="rgba(8,4,16,0.55)" stroke-width="1.2" stroke-linejoin="round"></path></svg>';
  var glow = document.createElement('div');
  glow.className = 'cur-glow';
  function attach() {
    if (!document.body) return;
    document.body.appendChild(glow);
    document.body.appendChild(arrow);
    root.classList.add('has-cursor');
  }
  if (document.body) attach();
  else document.addEventListener('DOMContentLoaded', attach);
  var path = arrow.querySelector('path');

  var mx = window.innerWidth / 2, my = window.innerHeight / 2;
  var gx = mx, gy = my;
  var visible = false;
  var lastHex = '';
  var hoverSel = 'a, button, input, textarea, select, summary, label, [role="button"], .theme-dot, .project-card';

  window.addEventListener('mousemove', function (e) {
    mx = e.clientX; my = e.clientY;
    if (!visible) {
      visible = true;
      arrow.classList.add('visible');
      glow.classList.add('visible');
    }
  });
  document.addEventListener('mouseleave', function () {
    visible = false;
    arrow.classList.remove('visible');
    glow.classList.remove('visible');
  });
  document.addEventListener('mousedown', function () { arrow.classList.add('down'); });
  document.addEventListener('mouseup', function () { arrow.classList.remove('down'); });
  document.addEventListener('mouseover', function (e) {
    if (e.target.closest && e.target.closest(hoverSel)) {
      arrow.classList.add('hover'); glow.classList.add('hover');
    }
  });
  document.addEventListener('mouseout', function (e) {
    if (e.target.closest && e.target.closest(hoverSel)) {
      arrow.classList.remove('hover'); glow.classList.remove('hover');
    }
  });

  function frame() {
    gx += (mx - gx) * 0.18;
    gy += (my - gy) * 0.18;
    arrow.style.transform = 'translate(' + mx + 'px, ' + my + 'px)';
    glow.style.transform = 'translate(' + gx + 'px, ' + gy + 'px)';
    var hex = window.__accentHex || '#b388ff';
    if (hex !== lastHex) { lastHex = hex; if (path) path.setAttribute('fill', hex); }
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
})();
