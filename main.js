/* ============================================================
   NEXORIA — main.js  v3  (Full animation overhaul)
   ============================================================ */

const CONFIG = {
  SERVER_IP:     'play.nexoriarealm.xyz',
  DISCORD_URL:   'https://discord.gg/35mFaZxrgZ',
  MAX_PLAYERS:   200,
  PING_INTERVAL: 30000,
};

/* ── CUSTOM CURSOR ─────────────────────────────────────────── */
function initCursor() {
  // Don't run on touch-only devices
  if (window.matchMedia('(hover: none)').matches) return;

  const dot  = document.createElement('div');
  const ring = document.createElement('div');
  dot.id  = 'nex-cursor-dot';
  ring.id = 'nex-cursor-ring';
  document.body.appendChild(dot);
  document.body.appendChild(ring);

  let mx = -200, my = -200;
  let rx = -200, ry = -200;
  let hidden = false;

  // Dot follows exactly; ring lags behind
  window.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    dot.style.left = mx + 'px';
    dot.style.top  = my + 'px';
    if (hidden) { dot.style.opacity = '1'; ring.style.opacity = '1'; hidden = false; }
  }, { passive: true });

  window.addEventListener('mouseleave', () => {
    hidden = true;
    dot.style.opacity = '0';
    ring.style.opacity = '0';
  });

  // Smooth ring lerp
  function lerp(a, b, t) { return a + (b - a) * t; }
  (function animate() {
    rx = lerp(rx, mx, 0.12);
    ry = lerp(ry, my, 0.12);
    ring.style.left = rx + 'px';
    ring.style.top  = ry + 'px';
    requestAnimationFrame(animate);
  })();

  // Hover state on interactive elements
  const hoverTargets = 'a, button, [data-copy-ip], .btn-primary, .btn-ghost, ' +
                       '.nav-links a, .nav-logo, .tilt-card, .feature-card, ' +
                       '.rank-card, .rcard, .product-card, input, textarea, select';

  document.addEventListener('mouseover', e => {
    if (e.target.closest(hoverTargets)) document.body.classList.add('cursor-hover');
  });
  document.addEventListener('mouseout', e => {
    if (e.target.closest(hoverTargets)) document.body.classList.remove('cursor-hover');
  });

  // Click state
  document.addEventListener('mousedown', () => {
    document.body.classList.add('cursor-click');
    document.body.classList.remove('cursor-hover');
  });
  document.addEventListener('mouseup', () => {
    document.body.classList.remove('cursor-click');
  });

  // Click burst ring
  document.addEventListener('click', e => {
    spawnBurstRing(e.clientX, e.clientY);
  });
}

/* ── BURST RING (on click) ─────────────────────────────────── */
function spawnBurstRing(x, y, count = 2) {
  for (let i = 0; i < count; i++) {
    const r    = document.createElement('div');
    r.className = 'cursor-burst-ring';
    const sz   = 18 + i * 16;
    r.style.cssText = `width:${sz}px;height:${sz}px;` +
                      `left:${x - sz/2}px;top:${y - sz/2}px;` +
                      `animation-delay:${i * 0.07}s;`;
    document.body.appendChild(r);
    setTimeout(() => r.remove(), 700);
  }
}

/* ── NAV ───────────────────────────────────────────────────── */
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
    mobileMenu.querySelectorAll('a').forEach(a =>
      a.addEventListener('click', () => {
        mobileMenu.classList.remove('open');
        hamburger.classList.remove('open');
      })
    );
  }
}

/* ── ACTIVE NAV LINK ───────────────────────────────────────── */
function initActiveNav() {
  // Normalize current path: strip trailing slash, default to "/"
  const current = window.location.pathname.replace(/\/$/, '') || '/';

  const allNavLinks = document.querySelectorAll(
    '.nav-links a, .nav-mobile-menu a'
  );

  allNavLinks.forEach(a => {
    // Remove any old inline style that was hardcoded
    a.removeAttribute('style');
    a.classList.remove('nav-active');

    const href = a.getAttribute('href') || '';
    const linkPath = href.startsWith('http')
      ? new URL(href).pathname.replace(/\/$/, '') || '/'
      : href.replace(/\/$/, '') || '/';

    if (linkPath === current) {
      a.classList.add('nav-active');
    }
  });
}

/* ── IP COPY ───────────────────────────────────────────────── */
function initIpCopy() {
  document.querySelectorAll('[data-copy-ip]').forEach(el => {
    el.addEventListener('click', e => {
      navigator.clipboard.writeText(CONFIG.SERVER_IP)
        .then(() => showToast('IP copied — see you in-game! ⚔️'))
        .catch(() => showToast(CONFIG.SERVER_IP));
    });
  });
}

/* ── TOAST ─────────────────────────────────────────────────── */
function showToast(msg) {
  const old = document.getElementById('nexToast');
  if (old) old.remove();
  const t = document.createElement('div');
  t.id = 'nexToast';
  t.textContent = msg;
  Object.assign(t.style, {
    position:'fixed', bottom:'1.5rem', left:'50%',
    transform:'translateX(-50%) translateY(18px)',
    background:'#e8000d', color:'#fff',
    fontFamily:"'Rajdhani',sans-serif", fontWeight:'700',
    fontSize:'0.95rem', letterSpacing:'0.06em',
    padding:'0.65rem 1.4rem', borderRadius:'6px',
    boxShadow:'0 0 24px rgba(232,0,13,0.55)',
    zIndex:'99999', opacity:'0',
    transition:'opacity 0.3s ease, transform 0.3s ease',
    pointerEvents:'none', whiteSpace:'nowrap',
  });
  document.body.appendChild(t);
  requestAnimationFrame(() => requestAnimationFrame(() => {
    t.style.opacity = '1';
    t.style.transform = 'translateX(-50%) translateY(0)';
  }));
  setTimeout(() => {
    t.style.opacity = '0';
    t.style.transform = 'translateX(-50%) translateY(18px)';
    setTimeout(() => t.remove(), 350);
  }, 2500);
}

/* ── PLAYER COUNT ──────────────────────────────────────────── */
async function fetchPlayerCount() {
  try {
    const r    = await fetch(`https://api.mcsrvstat.us/3/${CONFIG.SERVER_IP}`);
    const data = await r.json();
    if (data.online) {
      updatePlayerUI(data.players?.online ?? 0, data.players?.max ?? CONFIG.MAX_PLAYERS, true);
    } else {
      updatePlayerUI(0, CONFIG.MAX_PLAYERS, false);
    }
  } catch { updatePlayerUI('?', CONFIG.MAX_PLAYERS, null); }
}

function updatePlayerUI(online, max, isOnline) {
  document.querySelectorAll('[data-player-count]').forEach(el => {
    el.textContent = `${online} / ${max}`;
  });
  document.querySelectorAll('[data-server-dot]').forEach(dot => {
    dot.classList.remove('dot-online','dot-offline','dot-unknown');
    dot.classList.add(isOnline === true ? 'dot-online' : isOnline === false ? 'dot-offline' : 'dot-unknown');
  });
}

/* ── SCROLL REVEAL ─────────────────────────────────────────── */
function initScrollReveal() {
  const sel = '.reveal, .reveal-group, .reveal-left, .reveal-right, .reveal-scale';
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        // Add stagger delay based on position in parent
        const siblings = Array.from(e.target.parentElement?.children || []);
        const idx      = siblings.indexOf(e.target);
        if (idx > 0 && !e.target.classList.contains('reveal-group')) {
          e.target.style.transitionDelay = (idx * 0.08) + 's';
        }
        e.target.classList.add('visible');
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.07, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll(sel).forEach(el => obs.observe(el));
}

/* ── PARTICLE CANVAS ───────────────────────────────────────── */
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
    reset(init = false) {
      this.x      = Math.random() * W;
      this.y      = init ? Math.random() * H : H + 5;
      this.r      = Math.random() * 1.6 + 0.3;
      this.a      = Math.random() * 0.5 + 0.05;
      this.vx     = (Math.random() - 0.5) * 0.35;
      this.vy     = -(Math.random() * 0.55 + 0.12);
      this.phase  = Math.random() * Math.PI * 2;
    }
    update() {
      this.x     += this.vx;
      this.y     += this.vy;
      this.phase += 0.025;
      if (this.y < -5 || this.x < -5 || this.x > W + 5) this.reset();
    }
    draw() {
      const alpha = this.a * (0.7 + 0.3 * Math.sin(this.phase));
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.shadowColor = '#e8000d';
      ctx.shadowBlur  = 7;
      ctx.fillStyle   = '#e8000d';
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  resize();
  particles = Array.from({ length: 160 }, () => new Particle());
  window.addEventListener('resize', resize, { passive: true });

  (function loop() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(loop);
  })();
}

/* ── COUNTER ANIMATION ─────────────────────────────────────── */
function animCounter(el, target, ms = 1600) {
  const start   = performance.now();
  const isFloat = target % 1 !== 0;
  (function step(now) {
    const p  = Math.min((now - start) / ms, 1);
    const e2 = 1 - Math.pow(1 - p, 3);
    el.textContent = isFloat ? (target * e2).toFixed(1) : Math.round(target * e2).toLocaleString();
    if (p < 1) requestAnimationFrame(step);
  })(start);
}

function initCounters() {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        animCounter(e.target, parseFloat(e.target.dataset.countTo));
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.3 });
  document.querySelectorAll('[data-count-to]').forEach(el => obs.observe(el));
}

/* ── DISCORD LINKS ─────────────────────────────────────────── */
function initDiscordLinks() {
  document.querySelectorAll('[data-discord-link]').forEach(el => {
    el.href = CONFIG.DISCORD_URL;
  });
}

/* ── 3D TILT CARDS ─────────────────────────────────────────── */
function initTiltCards() {
  const sel = '.tilt-card, .feature-card, .rank-card, .rcard, .product-card';
  document.querySelectorAll(sel).forEach(card => {
    card.style.transition = 'transform 0.12s ease, box-shadow 0.12s ease';
    card.style.willChange = 'transform';

    card.addEventListener('mousemove', e => {
      const r  = card.getBoundingClientRect();
      const cx = r.left + r.width  / 2;
      const cy = r.top  + r.height / 2;
      const rx = ((e.clientY - cy) / (r.height / 2)) * -9;
      const ry = ((e.clientX - cx) / (r.width  / 2)) *  9;
      card.style.transform = `perspective(700px) rotateX(${rx}deg) rotateY(${ry}deg) scale(1.03)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
}

/* ── MAGNETIC BUTTONS ──────────────────────────────────────── */
function initMagneticButtons() {
  document.querySelectorAll('.btn-primary, .btn-ghost').forEach(btn => {
    btn.addEventListener('mousemove', e => {
      const r  = btn.getBoundingClientRect();
      const dx = e.clientX - (r.left + r.width  / 2);
      const dy = e.clientY - (r.top  + r.height / 2);
      btn.style.transform = `translate(${dx * 0.22}px, ${dy * 0.22}px)`;
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.transform = '';
    });
  });
}

/* ── AMBIENT ORBS (inject into [data-ambient] sections) ─────── */
function initAmbientOrbs() {
  document.querySelectorAll('[data-ambient]').forEach(section => {
    // Avoid double-injecting
    if (section.querySelector('.ambient-orb')) return;
    for (let i = 1; i <= 3; i++) {
      const orb       = document.createElement('div');
      orb.className   = `ambient-orb ambient-orb-${i}`;
      section.insertBefore(orb, section.firstChild);
    }
  });
}

/* ── PAGE TRANSITION ───────────────────────────────────────── */
function initPageTransition() {
  const veil = document.createElement('div');
  veil.id = 'nex-page-veil';
  document.body.appendChild(veil);

  // Fade in (reveal current page)
  requestAnimationFrame(() => requestAnimationFrame(() => {
    veil.style.transition = 'opacity 0.4s ease';
  }));

  // Intercept internal links
  document.addEventListener('click', e => {
    const link = e.target.closest('a[href]');
    if (!link) return;
    const href = link.getAttribute('href');
    if (!href || href.startsWith('#') || href.startsWith('http') ||
        href.startsWith('mailto') || href.startsWith('tel') || link.target === '_blank') return;

    e.preventDefault();
    veil.classList.add('leaving');
    setTimeout(() => { window.location.href = href; }, 380);
  });
}

/* ── GLITCH TEXT: auto-set data-text attr ──────────────────── */
function initGlitchText() {
  document.querySelectorAll('.anim-glitch').forEach(el => {
    if (!el.dataset.text) el.dataset.text = el.textContent;
  });
}

/* ── BOOT ──────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  initCursor();
  initNav();
  initActiveNav();
  initIpCopy();
  initPlayerCount();
  initScrollReveal();
  initParticles();
  initCounters();
  initDiscordLinks();
  initTiltCards();
  initMagneticButtons();
  initAmbientOrbs();
  initPageTransition();
  initGlitchText();
});

function initPlayerCount() {
  fetchPlayerCount();
  setInterval(fetchPlayerCount, CONFIG.PING_INTERVAL);
}
