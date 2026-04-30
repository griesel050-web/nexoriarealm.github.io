/* ─────────────────────────────────────────
   NEXORIA  |  script.js
───────────────────────────────────────── */

/* ── NAVBAR SCROLL STATE ── */
const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
  if (window.scrollY > 40) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
}, { passive: true });

/* ── MOBILE BURGER ── */
const burger    = document.getElementById('burger');
const navLinks  = document.getElementById('navLinks');

burger.addEventListener('click', () => {
  burger.classList.toggle('open');
  navLinks.classList.toggle('open');
});

// Close menu on link click
navLinks.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    burger.classList.remove('open');
    navLinks.classList.remove('open');
  });
});

/* ── SCROLL REVEAL ── */
const revealEls = document.querySelectorAll('[data-reveal]');

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

revealEls.forEach(el => observer.observe(el));

/* ── PARTICLE CANVAS ── */
(function () {
  const canvas = document.getElementById('particles');
  const ctx    = canvas.getContext('2d');

  let W, H, particles = [];

  const PARTICLE_COUNT = 80;
  const COLORS = [
    'rgba(192, 57, 43,',   // red-vivid
    'rgba(139, 0, 0,',     // red-deep
    'rgba(201, 168, 76,',  // gold
    'rgba(231, 76, 60,',   // red-bright
  ];

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  function rand(min, max) {
    return Math.random() * (max - min) + min;
  }

  function createParticle() {
    return {
      x:     rand(0, W),
      y:     rand(0, H),
      r:     rand(0.5, 2.2),
      vx:    rand(-0.18, 0.18),
      vy:    rand(-0.35, -0.08),
      alpha: rand(0.15, 0.65),
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      life:  rand(0.003, 0.007),
      age:   0,
    };
  }

  function init() {
    resize();
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const p = createParticle();
      p.y = rand(0, H); // scatter initial positions
      particles.push(p);
    }
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);

    particles.forEach((p, i) => {
      p.x  += p.vx;
      p.y  += p.vy;
      p.age += p.life;

      // Fade in then fade out
      const fade = p.age < 0.5
        ? p.age * 2
        : (1 - p.age) * 2;
      const a = Math.max(0, Math.min(p.alpha * fade, 1));

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `${p.color}${a})`;
      ctx.fill();

      // Reset when aged out or off-screen
      if (p.age >= 1 || p.y < -10 || p.x < -10 || p.x > W + 10) {
        particles[i] = createParticle();
        particles[i].y = H + rand(0, 20); // start from bottom
      }
    });

    requestAnimationFrame(draw);
  }

  window.addEventListener('resize', resize, { passive: true });

  init();
  draw();
})();

/* ── ACTIVE NAV LINK ── */
// Highlights the correct nav link based on current page
(function () {
  const path   = window.location.pathname.split('/').pop() || 'index.html';
  const links  = document.querySelectorAll('.nav-link');

  links.forEach(link => {
    const href = link.getAttribute('href');
    if (href === path || (path === '' && href === 'index.html')) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
})();

/* ── SMOOTH PARALLAX ON HERO GlOW ── */
const heroGlow = document.querySelector('.hero-glow');

if (heroGlow) {
  window.addEventListener('mousemove', (e) => {
    const dx = (e.clientX / window.innerWidth  - 0.5) * 30;
    const dy = (e.clientY / window.innerHeight - 0.5) * 30;
    heroGlow.style.transform = `translate(calc(-50% + ${dx}px), calc(-55% + ${dy}px))`;
  }, { passive: true });
}
