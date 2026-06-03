/* ============================================================
   NEXORIA — main.js  (Enhanced with animations v2)
   Shared script included on every page.
   ============================================================ */

/* ── 1. CONFIG ───────────────────────────────────────────────── */
const CONFIG = {
  SERVER_IP:     'play.nexoriarealm.xyz',
  DISCORD_URL:   'https://discord.gg/35mFaZxrgZ',
  MAX_PLAYERS:   200,
  PING_INTERVAL: 30000,
};

/* ── 2. NAV ──────────────────────────────────────────────────── */
function initNav() {
  const navbar     = document.getElementById('navbar');
  const hamburger  = document.getElementById('navHamburger');
  const mobileMenu = document.getElementById('navMobileMenu');
  if (!navbar) return;

  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 20);
  }, { passive: true });

  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      const open = mobileMenu.classList.toggle('open');
      hamburger.classList.toggle('open', open);
    });
    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.remove('open');
        hamburger.classList.remove('open');
      });
    });
  }
}

/* ── 3. IP COPY ──────────────────────────────────────────────── */
function initIpCopy() {
  document.querySelectorAll('[data-copy-ip]').forEach(el => {
    el.addEventListener('click', (e) => {
      navigator.clipboard.writeText(CONFIG.SERVER_IP).then(() => {
        showToast('IP copied — see you in-game! ⚔️');
        burstParticles(e.clientX, e.clientY);
      }).catch(() => {
        showToast(CONFIG.SERVER_IP);
      });
    });
  });
}

/* ── 4. TOAST ────────────────────────────────────────────────── */
function showToast(message) {
  const existing = document.getElementById('nexToast');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.id = 'nexToast';
  toast.textContent = message;
  Object.assign(toast.style, {
    position: 'fixed', bottom: '1.5rem', left: '50%',
    transform: 'translateX(-50%) translateY(20px)',
    background: '#e8000d', color: '#fff',
    fontFamily: "'Rajdhani', sans-serif", fontWeight: '700',
    fontSize: '0.95rem', letterSpacing: '0.06em',
    padding: '0.65rem 1.4rem', borderRadius: '6px',
    boxShadow: '0 0 24px rgba(232,0,13,0.5)', zIndex: '9999',
    opacity: '0', transition: 'opacity 0.3s ease, transform 0.3s ease',
    pointerEvents: 'none', whiteSpace: 'nowrap',
  });
  document.body.appendChild(toast);

  requestAnimationFrame(() => requestAnimationFrame(() => {
    toast.style.opacity = '1';
    toast.style.transform = 'translateX(-50%) translateY(0)';
  }));

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(-50%) translateY(20px)';
    setTimeout(() => toast.remove(), 350);
  }, 2500);
}

/* ── 5. LIVE PLAYER COUNT ────────────────────────────────────── */
async function fetchPlayerCount() {
  try {
    const res  = await fetch(`https://api.mcsrvstat.us/3/${CONFIG.SERVER_IP}`);
    const data = await res.json();
    if (data.online) {
      updatePlayerCountUI(data.players?.online ?? 0, data.players?.max ?? CONFIG.MAX_PLAYERS, true);
    } else {
      updatePlayerCountUI(0, CONFIG.MAX_PLAYERS, false);
    }
  } catch {
    updatePlayerCountUI('?', CONFIG.MAX_PLAYERS, null);
  }
}

function updatePlayerCountUI(online, max, isOnline) {
  document.querySelectorAll('[data-player-count]').forEach(el => {
    el.textContent = `${online} / ${max}`;
  });
  document.querySelectorAll('[data-server-dot]').forEach(dot => {
    dot.classList.remove('dot-online', 'dot-offline', 'dot-unknown');
    if (isOnline === true)       dot.classList.add('dot-online');
    else if (isOnline === false) dot.classList.add('dot-offline');
    else                         dot.classList.add('dot-unknown');
  });
}

function initPlayerCount() {
  fetchPlayerCount();
  setInterval(fetchPlayerCount, CONFIG.PING_INTERVAL);
}

/* ── 6. SCROLL REVEAL (multi-direction) ─────────────────────── */
function initScrollReveal() {
  const selectors = '.reveal, .reveal-group, .reveal-left, .reveal-right, .reveal-scale';
  const observer  = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08 });

  document.querySelectorAll(selectors).forEach(el => observer.observe(el));
}

/* ── 7. PARTICLE CANVAS ──────────────────────────────────────── */
function initParticles() {
  const canvas = document.getElementById('heroCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let W, H, particles;

  function resize() {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }

  class Particle {
    constructor() { this.reset(true); }
    reset(initial = false) {
      this.x      = Math.random() * W;
      this.y      = initial ? Math.random() * H : H + 5;
      this.size   = Math.random() * 1.8 + 0.4;
      this.alpha  = Math.random() * 0.55 + 0.05;
      this.speedX = (Math.random() - 0.5) * 0.4;
      this.speedY = -Math.random() * 0.5 - 0.1;
      this.twinkle = Math.random() * Math.PI * 2;
    }
    update() {
      this.x       += this.speedX;
      this.twinkle += 0.03;
      this.y       += this.speedY;
      if (this.y < -5 || this.x < -5 || this.x > W + 5) this.reset();
    }
    draw() {
      const a = this.alpha * (0.75 + 0.25 * Math.sin(this.twinkle));
      ctx.save();
      ctx.globalAlpha = a;
      ctx.fillStyle   = '#e8000d';
      ctx.shadowColor = '#e8000d';
      ctx.shadowBlur  = 8;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  function init() {
    resize();
    particles = Array.from({ length: 150 }, () => new Particle());
  }

  function loop() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(loop);
  }

  window.addEventListener('resize', resize, { passive: true });
  init();
  loop();
}

/* ── 8. ANIMATED COUNTER ─────────────────────────────────────── */
function animateCounter(el, target, duration = 1500) {
  const start = performance.now();
  const isFloat = target % 1 !== 0;
  function step(now) {
    const progress = Math.min((now - start) / duration, 1);
    const eased    = 1 - Math.pow(1 - progress, 3);
    const current  = target * eased;
    el.textContent = isFloat ? current.toFixed(1) : Math.round(current).toLocaleString();
    if (progress < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

function initCounters() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target, parseFloat(entry.target.dataset.countTo));
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });
  document.querySelectorAll('[data-count-to]').forEach(el => observer.observe(el));
}

/* ── 9. DISCORD LINKS ────────────────────────────────────────── */
function initDiscordLinks() {
  document.querySelectorAll('[data-discord-link]').forEach(el => {
    el.href = CONFIG.DISCORD_URL;
  });
}

/* ── 10. CURSOR PARTICLE TRAIL ───────────────────────────────── */
function initCursorTrail() {
  // Only on non-touch devices
  if (window.matchMedia('(hover: none)').matches) return;

  const dots = [];
  const MAX  = 12;
  let mx = 0, my = 0;

  for (let i = 0; i < MAX; i++) {
    const d = document.createElement('div');
    Object.assign(d.style, {
      position: 'fixed', borderRadius: '50%', pointerEvents: 'none',
      zIndex: '9990', opacity: '0',
      background: `rgba(232,0,13,${0.6 - i * 0.045})`,
      transition: `transform 0.05s ease, opacity 0.15s ease`,
      willChange: 'transform',
    });
    document.body.appendChild(d);
    dots.push({ el: d, x: 0, y: 0 });
  }

  window.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; }, { passive: true });

  let active = false;
  window.addEventListener('mouseenter', () => { active = true; });
  window.addEventListener('mouseleave', () => {
    active = false;
    dots.forEach(d => { d.el.style.opacity = '0'; });
  });

  function tick() {
    let px = mx, py = my;
    dots.forEach((dot, i) => {
      const size = Math.max(2, 8 - i * 0.5);
      dot.el.style.width  = size + 'px';
      dot.el.style.height = size + 'px';
      dot.x += (px - dot.x) * (0.35 - i * 0.022);
      dot.y += (py - dot.y) * (0.35 - i * 0.022);
      dot.el.style.transform = `translate(${dot.x - size/2}px, ${dot.y - size/2}px)`;
      dot.el.style.opacity   = active ? (0.7 - i * 0.05).toString() : '0';
      px = dot.x;
      py = dot.y;
    });
    requestAnimationFrame(tick);
  }
  tick();
}

/* ── 11. PARTICLE RING BURST (click feedback) ────────────────── */
function burstParticles(x, y) {
  for (let i = 0; i < 3; i++) {
    const ring = document.createElement('div');
    ring.className = 'particle-burst';
    const size = 20 + i * 18;
    Object.assign(ring.style, {
      width: size + 'px', height: size + 'px',
      left: (x - size/2) + 'px', top: (y - size/2) + 'px',
      animationDelay: (i * 0.08) + 's',
    });
    document.body.appendChild(ring);
    setTimeout(() => ring.remove(), 800);
  }
}

function initClickBurst() {
  document.querySelectorAll('.btn-primary, .btn-ghost, .card').forEach(el => {
    el.addEventListener('click', e => {
      const r = el.getBoundingClientRect();
      burstParticles(r.left + r.width/2, r.top + r.height/2);
    });
  });
}

/* ── 12. 3D TILT CARDS ───────────────────────────────────────── */
function initTiltCards() {
  document.querySelectorAll('.tilt-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const r  = card.getBoundingClientRect();
      const cx = r.left + r.width  / 2;
      const cy = r.top  + r.height / 2;
      const rx = ((e.clientY - cy) / (r.height / 2)) * -8;
      const ry = ((e.clientX - cx) / (r.width  / 2)) *  8;
      card.style.transform = `perspective(600px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-4px)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
}

/* ── 13. MAGNETIC BUTTONS ────────────────────────────────────── */
function initMagneticButtons() {
  document.querySelectorAll('.btn-primary, .btn-ghost').forEach(btn => {
    btn.addEventListener('mousemove', e => {
      const r   = btn.getBoundingClientRect();
      const dx  = e.clientX - (r.left + r.width  / 2);
      const dy  = e.clientY - (r.top  + r.height / 2);
      btn.style.transform = `translate(${dx * 0.18}px, ${dy * 0.18}px) translateY(-2px)`;
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.transform = '';
    });
  });
}

/* ── 14. TYPEWRITER ──────────────────────────────────────────── */
function typewrite(el, text, speed = 55, onDone) {
  el.textContent = '';
  let i = 0;
  el.classList.add('anim-cursor');
  function tick() {
    if (i <= text.length) {
      el.textContent = text.slice(0, i++);
      setTimeout(tick, speed + Math.random() * 30);
    } else {
      if (onDone) onDone();
    }
  }
  tick();
}

function initTypewriter() {
  document.querySelectorAll('[data-typewrite]').forEach(el => {
    const text = el.dataset.typewrite || el.textContent;
    el.textContent = '';
    const obs = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        obs.disconnect();
        setTimeout(() => typewrite(el, text, 50), 300);
      }
    }, { threshold: 0.5 });
    obs.observe(el);
  });
}

/* ── 15. PAGE TRANSITION ─────────────────────────────────────── */
function initPageTransition() {
  const overlay = document.createElement('div');
  overlay.id = 'pageTransition';
  document.body.appendChild(overlay);

  // Fade in on arrival
  overlay.style.opacity = '1';
  overlay.style.transition = 'none';
  requestAnimationFrame(() => requestAnimationFrame(() => {
    overlay.style.transition = 'opacity 0.4s ease';
    overlay.style.opacity    = '0';
  }));

  // Fade out on internal link click
  document.querySelectorAll('a[href]').forEach(link => {
    const href = link.getAttribute('href');
    // Only internal links, not anchors or external
    if (!href || href.startsWith('#') || href.startsWith('http') ||
        href.startsWith('mailto') || link.target === '_blank') return;

    link.addEventListener('click', e => {
      e.preventDefault();
      overlay.style.opacity = '1';
      setTimeout(() => { window.location.href = href; }, 380);
    });
  });
}

/* ── 16. AMBIENT ORBS (auto-inject) ──────────────────────────── */
function initAmbientOrbs() {
  // Inject into sections that have position:relative and are tall enough
  document.querySelectorAll('[data-ambient]').forEach(section => {
    section.style.position = 'relative';
    section.style.overflow = 'hidden';
    [1, 2, 3].forEach(n => {
      const orb = document.createElement('div');
      orb.className = `ambient-orb ambient-orb-${n}`;
      section.insertBefore(orb, section.firstChild);
    });
  });
}

/* ── 17. NAVBAR ACTIVE LINK ───────────────────────────────────── */
function initActiveNavLink() {
  const path = window.location.pathname.replace(/\/$/, '') || '/';
  document.querySelectorAll('.nav-links a, .nav-mobile-menu a').forEach(link => {
    const lpath = new URL(link.href, window.location.origin).pathname.replace(/\/$/, '') || '/';
    if (lpath === path) {
      link.style.color     = 'var(--red-bright)';
      link.style.fontWeight = '900';
    }
  });
}

/* ── BOOT ─────────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  initNav();
  initIpCopy();
  initPlayerCount();
  initScrollReveal();
  initParticles();
  initCounters();
  initDiscordLinks();
  initCursorTrail();
  initClickBurst();
  initTiltCards();
  initMagneticButtons();
  initTypewriter();
  initPageTransition();
  initAmbientOrbs();
  initActiveNavLink();
});
