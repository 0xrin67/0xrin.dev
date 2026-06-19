

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
    const phrases = [
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
        ctx.fillStyle = `rgba(179, 136, 255, ${p.a})`;
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
            ctx.strokeStyle = `rgba(179, 136, 255, ${0.1 * (1 - d / 12000)})`;
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
  const termCommands = [
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
      card.style.setProperty('--mx', ((e.clientX - rect.left) / rect.width * 100) + '%');
      card.style.setProperty('--my', ((e.clientY - rect.top) / rect.height * 100) + '%');
    });
  });

  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  const footerMemeEl = document.getElementById('footerMeme');
  if (footerMemeEl) {
    const memes = [
      'git push --force | pray',
      '0 bugs (that I know of)',
      'built at 3am, deployed at 4',
    ];
    footerMemeEl.textContent = memes[Math.floor(Math.random() * memes.length)];
  }
})();
