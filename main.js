/* ============================================================
   NEXUS SOCIAL — main.js
   ============================================================ */

const CONFIG = {
  DISCORD_URL: 'https://discord.gg/tPj26Vaxx5',
  SOCIALS: {
    discord:  'https://discord.gg/tPj26Vaxx5',
    youtube:  'https://www.youtube.com/@nxrealm08',
    x:        'https://x.com/w050g',
    tiktok:   'https://www.tiktok.com/@nxrealm08',
    instagram:'https://www.instagram.com/nxrealm08/',
    roblox:   'https://www.roblox.com/users/5689237397/profile',
    linkedin: 'https://www.linkedin.com/in/nexosites/',
  }
};

/* ── CUSTOM CURSOR ─────────────────────────────────────────── */
function initCursor() {
  if (window.matchMedia('(hover: none)').matches) return;
  const dot  = document.createElement('div');
  const ring = document.createElement('div');
  dot.id  = 'nex-cursor-dot';
  ring.id = 'nex-cursor-ring';
  document.body.appendChild(dot);
  document.body.appendChild(ring);

  let mx = -200, my = -200, rx = -200, ry = -200, hidden = false;
  window.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    dot.style.left = mx + 'px'; dot.style.top = my + 'px';
    if (hidden) { dot.style.opacity = '1'; ring.style.opacity = '1'; hidden = false; }
  }, { passive: true });
  window.addEventListener('mouseleave', () => {
    hidden = true; dot.style.opacity = '0'; ring.style.opacity = '0';
  });
  function lerp(a, b, t) { return a + (b - a) * t; }
  (function animate() {
    rx = lerp(rx, mx, 0.12); ry = lerp(ry, my, 0.12);
    ring.style.left = rx + 'px'; ring.style.top = ry + 'px';
    requestAnimationFrame(animate);
  })();
  const hoverTargets = 'a, button, .social-card, .btn-primary, .btn-ghost';
  document.addEventListener('mouseover', e => {
    if (e.target.closest(hoverTargets)) document.body.classList.add('cursor-hover');
  });
  document.addEventListener('mouseout', e => {
    if (e.target.closest(hoverTargets)) document.body.classList.remove('cursor-hover');
  });
}

/* ── PARTICLE CANVAS ───────────────────────────────────────── */
function initParticles() {
  const canvas = document.getElementById('heroCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H, particles = [];
  const PARTICLE_COUNT = 55;

  function resize() {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }
  resize();
  window.addEventListener('resize', resize, { passive: true });

  function randomParticle() {
    return {
      x: Math.random() * W,
      y: Math.random() * H,
      r: Math.random() * 1.6 + 0.4,
      dx: (Math.random() - 0.5) * 0.35,
      dy: (Math.random() - 0.5) * 0.35,
      o: Math.random() * 0.5 + 0.1,
    };
  }
  for (let i = 0; i < PARTICLE_COUNT; i++) particles.push(randomParticle());

  function draw() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(148,97,255,${p.o})`;
      ctx.fill();
      p.x += p.dx; p.y += p.dy;
      if (p.x < 0 || p.x > W || p.y < 0 || p.y > H) Object.assign(p, randomParticle(), { x: Math.random() * W, y: Math.random() * H });
    });
    requestAnimationFrame(draw);
  }
  draw();
}

/* ── NAVBAR SCROLL ─────────────────────────────────────────── */
function initNavbar() {
  const nav = document.getElementById('navbar');
  if (!nav) return;
  const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 40);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Hamburger
  const hamburger = document.getElementById('navHamburger');
  const mobileMenu = document.getElementById('navMobileMenu');
  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('open');
      mobileMenu.classList.toggle('open');
    });
    mobileMenu.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        hamburger.classList.remove('open');
        mobileMenu.classList.remove('open');
      });
    });
  }

  // Active nav link
  const currentPath = window.location.pathname.replace(/\/$/, '') || '/';
  document.querySelectorAll('.nav-links a, .nav-mobile-menu a').forEach(a => {
    const href = a.getAttribute('href').replace(/\/$/, '') || '/';
    if (href === currentPath) a.classList.add('active');
  });
}

/* ── SCROLL REVEAL ─────────────────────────────────────────── */
function initReveal() {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); observer.unobserve(e.target); } });
  }, { threshold: 0.12 });
  document.querySelectorAll('.reveal, .reveal-group').forEach(el => observer.observe(el));
}

/* ── SOCIAL LINKS ──────────────────────────────────────────── */
function initSocialLinks() {
  document.querySelectorAll('[data-social]').forEach(el => {
    const key = el.dataset.social;
    const url = CONFIG.SOCIALS[key];
    if (url) {
      el.href = url;
      el.target = '_blank';
      el.rel = 'noopener noreferrer';
    }
  });
}

/* ── COUNT UP ──────────────────────────────────────────────── */
function initCountUp() {
  const els = document.querySelectorAll('[data-count-to]');
  if (!els.length) return;
  const observer = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      observer.unobserve(e.target);
      const target = +e.target.dataset.countTo;
      const suffix = e.target.dataset.suffix || '';
      let start = 0;
      const dur = 1600;
      const step = ts => {
        if (!start) start = ts;
        const prog = Math.min((ts - start) / dur, 1);
        e.target.textContent = Math.floor(prog * target) + suffix;
        if (prog < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    });
  }, { threshold: 0.4 });
  els.forEach(el => observer.observe(el));
}

/* ── TILT CARDS ─────────────────────────────────────────────── */
function initTiltCards() {
  if (window.matchMedia('(hover: none)').matches) return;
  document.querySelectorAll('.tilt-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const { left, top, width, height } = card.getBoundingClientRect();
      const x = ((e.clientX - left) / width  - 0.5) * 12;
      const y = ((e.clientY - top)  / height - 0.5) * -12;
      card.style.transform = `perspective(600px) rotateX(${y}deg) rotateY(${x}deg) translateY(-4px)`;
    });
    card.addEventListener('mouseleave', () => { card.style.transform = ''; });
  });
}

/* ── INIT ───────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  initCursor();
  initParticles();
  initNavbar();
  initReveal();
  initSocialLinks();
  initCountUp();
  initTiltCards();
});
