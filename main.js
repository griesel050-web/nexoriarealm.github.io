/* ============================================================
   NEXORIA — main.js
   Shared script included on every page.
   Each section is clearly labelled so you can find & edit it.
   ============================================================ */

/* ── 1. CONFIG — edit these values ──────────────────────────
   SERVER_IP     : the Minecraft server address shown / copied
   DISCORD_URL   : your Discord invite link
   MAX_PLAYERS   : displayed in the player-count badge
   PING_INTERVAL : how often (ms) to re-fetch the player count
   ──────────────────────────────────────────────────────────── */
const CONFIG = {
  SERVER_IP:     'play.nexoriarealm.xyz',
  DISCORD_URL:   'https://discord.gg/Kg5XtHpwDU', // ← paste your invite
  MAX_PLAYERS:   200,
  PING_INTERVAL: 30000, // 30 seconds
};

/* ── 2. NAV — scroll effect + mobile hamburger ─────────────── */
function initNav() {
  const navbar    = document.getElementById('navbar');
  const hamburger = document.getElementById('navHamburger');
  const mobileMenu = document.getElementById('navMobileMenu');

  if (!navbar) return; // guard — nav must exist on the page

  // Add 'scrolled' class once user scrolls past 20px (darkens the nav)
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 20);
  }, { passive: true });

  // Toggle mobile menu open / closed
  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      mobileMenu.classList.toggle('open');
    });
    // Close menu when a link inside is clicked
    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => mobileMenu.classList.remove('open'));
    });
  }
}

/* ── 3. IP COPY — copy server IP to clipboard ──────────────── */
function initIpCopy() {
  // Any element with data-copy-ip will trigger a clipboard copy + toast
  document.querySelectorAll('[data-copy-ip]').forEach(el => {
    el.addEventListener('click', () => {
      navigator.clipboard.writeText(CONFIG.SERVER_IP).then(() => {
        showToast('IP copied — see you in-game! ⚔️');
      }).catch(() => {
        // Fallback for browsers that block clipboard
        showToast(CONFIG.SERVER_IP);
      });
    });
  });
}

/* ── 4. TOAST — small notification popup ───────────────────── */
function showToast(message) {
  // Remove existing toast if any
  const existing = document.getElementById('nexToast');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.id = 'nexToast';
  toast.textContent = message;
  Object.assign(toast.style, {
    position:        'fixed',
    bottom:          '1.5rem',
    left:            '50%',
    transform:       'translateX(-50%) translateY(20px)',
    background:      '#e8000d',
    color:           '#fff',
    fontFamily:      "'Rajdhani', sans-serif",
    fontWeight:      '700',
    fontSize:        '0.95rem',
    letterSpacing:   '0.06em',
    padding:         '0.65rem 1.4rem',
    borderRadius:    '6px',
    boxShadow:       '0 0 24px rgba(232,0,13,0.5)',
    zIndex:          '9999',
    opacity:         '0',
    transition:      'opacity 0.3s ease, transform 0.3s ease',
    pointerEvents:   'none',
    whiteSpace:      'nowrap',
  });
  document.body.appendChild(toast);

  // Animate in
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      toast.style.opacity = '1';
      toast.style.transform = 'translateX(-50%) translateY(0)';
    });
  });

  // Auto-remove after 2.5s
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(-50%) translateY(20px)';
    setTimeout(() => toast.remove(), 350);
  }, 2500);
}

/* ── 5. LIVE PLAYER COUNT ──────────────────────────────────── */
/* Uses mcsrvstat.us — a free, no-auth public MC server status API */
async function fetchPlayerCount() {
  try {
    const res  = await fetch(`https://api.mcsrvstat.us/3/${CONFIG.SERVER_IP}`);
    const data = await res.json();

    if (data.online) {
      const online = data.players?.online ?? 0;
      const max    = data.players?.max    ?? CONFIG.MAX_PLAYERS;
      updatePlayerCountUI(online, max, true);
    } else {
      updatePlayerCountUI(0, CONFIG.MAX_PLAYERS, false);
    }
  } catch {
    // Network error — show unknown state gracefully
    updatePlayerCountUI('?', CONFIG.MAX_PLAYERS, null);
  }
}

function updatePlayerCountUI(online, max, isOnline) {
  // Update every element carrying the [data-player-count] attribute
  document.querySelectorAll('[data-player-count]').forEach(el => {
    el.textContent = `${online} / ${max}`;
  });

  // Update status dot colour
  document.querySelectorAll('[data-server-dot]').forEach(dot => {
    dot.classList.remove('dot-online', 'dot-offline', 'dot-unknown');
    if (isOnline === true)  dot.classList.add('dot-online');
    else if (isOnline === false) dot.classList.add('dot-offline');
    else dot.classList.add('dot-unknown');
  });
}

function initPlayerCount() {
  // Fetch immediately, then repeat on interval
  fetchPlayerCount();
  setInterval(fetchPlayerCount, CONFIG.PING_INTERVAL);
}

/* ── 6. SCROLL REVEAL — fade-in elements on scroll ─────────── */
function initScrollReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        // Once visible, stop observing (no need to repeat)
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  // Observe all .reveal and .reveal-group elements
  document.querySelectorAll('.reveal, .reveal-group').forEach(el => {
    observer.observe(el);
  });
}

/* ── 7. PARTICLE CANVAS — subtle red particles in hero ─────── */
function initParticles() {
  const canvas = document.getElementById('heroCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let W, H, particles;

  // Resize canvas to fill its container
  function resize() {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }

  // Each particle object
  class Particle {
    constructor() { this.reset(); }
    reset() {
      this.x     = Math.random() * W;
      this.y     = Math.random() * H;
      this.size  = Math.random() * 1.5 + 0.5;
      this.alpha = Math.random() * 0.5 + 0.1;
      this.speedX = (Math.random() - 0.5) * 0.3;
      this.speedY = -Math.random() * 0.4 - 0.1; // drift upward
    }
    update() {
      this.x += this.speedX;
      this.y += this.speedY;
      if (this.y < -5 || this.x < -5 || this.x > W + 5) this.reset();
    }
    draw() {
      ctx.save();
      ctx.globalAlpha = this.alpha;
      ctx.fillStyle   = '#e8000d';
      ctx.shadowColor = '#e8000d';
      ctx.shadowBlur  = 6;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  function init() {
    resize();
    // ~120 particles — increase/decrease for density
    particles = Array.from({ length: 120 }, () => new Particle());
  }

  function loop() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(loop);
  }

  window.addEventListener('resize', () => { resize(); }, { passive: true });
  init();
  loop();
}

/* ── 8. ANIMATED COUNTER — numbers count up when visible ───── */
function animateCounter(el, target, duration = 1500) {
  const start     = performance.now();
  const startVal  = 0;
  const isFloat   = target % 1 !== 0;

  function step(now) {
    const elapsed  = now - start;
    const progress = Math.min(elapsed / duration, 1);
    // Ease-out cubic
    const eased    = 1 - Math.pow(1 - progress, 3);
    const current  = startVal + (target - startVal) * eased;
    el.textContent = isFloat ? current.toFixed(1) : Math.round(current).toLocaleString();
    if (progress < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

function initCounters() {
  // Observe all elements with data-count-to attribute
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el     = entry.target;
        const target = parseFloat(el.dataset.countTo);
        animateCounter(el, target);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.3 });

  document.querySelectorAll('[data-count-to]').forEach(el => observer.observe(el));
}

/* ── 9. DISCORD link — fills in the href automatically ─────── */
function initDiscordLinks() {
  document.querySelectorAll('[data-discord-link]').forEach(el => {
    el.href = CONFIG.DISCORD_URL;
  });
}

/* ── BOOT — runs everything once the DOM is ready ──────────── */
document.addEventListener('DOMContentLoaded', () => {
  initNav();
  initIpCopy();
  initPlayerCount();
  initScrollReveal();
  initParticles();
  initCounters();
  initDiscordLinks();
});
