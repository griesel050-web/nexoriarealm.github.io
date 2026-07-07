/* ============================================================
   NEXORIA NETWORK — App Logic
   - Loads sites.json + social.json
   - Fetches live meta descriptions from each site via a CORS
     proxy (for sites that haven't set a description in JSON)
   - Smart multi-source favicon loading with fallback chain
   ============================================================ */

let siteData   = null;
let socialData = null;
let activeFilter = 'all';

// ── Social SVG icons ────────────────────────────────────────
const SOCIAL_ICONS = {
  x:         `<svg viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>`,
  instagram: `<svg viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>`,
  github:    `<svg viewBox="0 0 24 24"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>`,
  linkedin:  `<svg viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 23.2 24 22.222 0h.003z"/></svg>`,
  youtube:   `<svg viewBox="0 0 24 24"><path d="M23.495 6.205a3.007 3.007 0 0 0-2.088-2.088c-1.87-.501-9.396-.501-9.396-.501s-7.507-.01-9.396.501A3.007 3.007 0 0 0 .527 6.205a31.247 31.247 0 0 0-.522 5.805 31.247 31.247 0 0 0 .522 5.783 3.007 3.007 0 0 0 2.088 2.088c1.868.502 9.396.502 9.396.502s7.506 0 9.396-.502a3.007 3.007 0 0 0 2.088-2.088 31.247 31.247 0 0 0 .5-5.783 31.247 31.247 0 0 0-.5-5.805zM9.609 15.601V8.408l6.264 3.602z"/></svg>`,
  discord:   `<svg viewBox="0 0 24 24"><path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/></svg>`,
  tiktok:    `<svg viewBox="0 0 24 24"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/></svg>`,
  facebook:  `<svg viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>`
};

// ── Init ────────────────────────────────────────────────────
async function init() {
  try {
    const [sr, so] = await Promise.all([fetch('./sites.json'), fetch('./social.json')]);
    siteData   = await sr.json();
    socialData = await so.json();
  } catch (e) {
    console.error('Failed to load JSON:', e);
    siteData   = { network: { name: 'Nexoria Network', tagline: '', description: '' }, sites: [], contact: {} };
    socialData = { socials: [] };
  }

  applyBranding();

  // Fetch live descriptions in background, then render
  await fetchLiveDescriptions();

  renderHomePage();
  renderNetworkPage();
  renderSocialsSection();
  renderContactPage();
  setupNav();
  setupHexAnimation();
  setupContactForm();

  const hash = location.hash.replace('#', '') || 'home';
  navigateTo(hash);
}

// ── Live description fetcher ────────────────────────────────
// Uses allorigins.win CORS proxy to fetch meta description from each site.
// Falls back to the description in sites.json if fetch fails.
async function fetchLiveDescriptions() {
  const promises = siteData.sites.map(async (site) => {
    // Skip if already has a custom description override flag
    if (site.descriptionOverride) return;
    try {
      const proxy = `https://api.allorigins.win/get?url=${encodeURIComponent(site.url)}`;
      const res = await fetch(proxy, { signal: AbortSignal.timeout(6000) });
      if (!res.ok) return;
      const data = await res.json();
      const html = data.contents || '';
      // Parse meta description
      const match = html.match(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']{10,300})["']/i)
                 || html.match(/<meta[^>]+content=["']([^"']{10,300})["'][^>]+name=["']description["']/i)
                 || html.match(/<meta[^>]+property=["']og:description["'][^>]+content=["']([^"']{10,300})["']/i)
                 || html.match(/<meta[^>]+content=["']([^"']{10,300})["'][^>]+property=["']og:description["']/i);
      if (match && match[1]) {
        site.description = match[1].trim();
        site._liveDesc = true;
      }
      // Also try to find a favicon link tag for better icon
      const iconMatch = html.match(/<link[^>]+rel=["'][^"']*icon[^"']*["'][^>]+href=["']([^"']+)["']/i)
                     || html.match(/<link[^>]+href=["']([^"']+)["'][^>]+rel=["'][^"']*icon[^"']*["']/i);
      if (iconMatch && iconMatch[1]) {
        let iconHref = iconMatch[1].trim();
        // Make absolute if relative
        if (iconHref.startsWith('/')) {
          const origin = new URL(site.url).origin;
          iconHref = origin + iconHref;
        } else if (!iconHref.startsWith('http')) {
          iconHref = site.url.replace(/\/$/, '') + '/' + iconHref;
        }
        site._faviconUrl = iconHref;
      }
    } catch (e) {
      // silently fall back to JSON description
    }
  });
  await Promise.allSettled(promises);
}

// ── Branding ────────────────────────────────────────────────
function applyBranding() {
  const { name } = siteData.network;
  document.title = name;
  document.querySelectorAll('[data-brand-name]').forEach(el => el.textContent = name);
}

// ── Navigation ──────────────────────────────────────────────
function setupNav() {
  document.querySelectorAll('[data-nav]').forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      navigateTo(link.dataset.nav);
      document.getElementById('nav-links').classList.remove('open');
    });
  });
  document.getElementById('mobile-toggle')?.addEventListener('click', () => {
    document.getElementById('nav-links').classList.toggle('open');
  });
  window.addEventListener('popstate', () => navigateTo(location.hash.replace('#', '') || 'home'));
}

function navigateTo(pageId) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('[data-nav]').forEach(l => l.classList.remove('active'));
  const page = document.getElementById('page-' + pageId);
  if (page) page.classList.add('active');
  document.querySelectorAll(`[data-nav="${pageId}"]`).forEach(l => l.classList.add('active'));
  history.pushState(null, '', '#' + pageId);
  window.scrollTo(0, 0);
}

// ── Smart favicon loader ────────────────────────────────────
// Tries: 1) parsed <link> tag from page  2) /favicon.ico direct
//        3) /favicon.png  4) Google service  5) letter fallback
function cardIconHTML(site) {
  const id = 'icon-' + site.id;
  const letter = (site.name || '?')[0].toUpperCase();

  // Build ordered list of URLs to try
  const candidates = [];
  if (site._faviconUrl) candidates.push(site._faviconUrl);
  try {
    const origin = new URL(site.url).origin;
    candidates.push(origin + '/favicon.ico');
    candidates.push(origin + '/favicon.png');
    candidates.push(origin + '/apple-touch-icon.png');
  } catch {}
  candidates.push(`https://www.google.com/s2/favicons?domain=${new URL(site.url).hostname}&sz=64`);
  candidates.push(`https://icons.duckduckgo.com/ip3/${new URL(site.url).hostname}.ico`);

  // Render with JS-driven fallback chain
  return `<div class="card-icon" id="${id}">
    <img src="${candidates[0]}"
         data-candidates='${JSON.stringify(candidates.slice(1))}'
         data-letter="${letter}"
         alt="${site.name} icon"
         onload="this.style.display='block'"
         onerror="tryNextFavicon(this)" />
  </div>`;
}

// Called on each img error — walks the candidates array
window.tryNextFavicon = function(img) {
  try {
    const candidates = JSON.parse(img.dataset.candidates || '[]');
    if (candidates.length > 0) {
      img.dataset.candidates = JSON.stringify(candidates.slice(1));
      img.src = candidates[0];
    } else {
      // All failed — show letter fallback
      const letter = img.dataset.letter || '?';
      img.parentElement.innerHTML = `<span class="icon-letter">${letter}</span>`;
    }
  } catch {
    img.parentElement.innerHTML = `<span class="icon-letter">?</span>`;
  }
};

// ── Card renderer ───────────────────────────────────────────
function renderCard(site) {
  const statusLabel = site.status === 'coming-soon' ? 'Soon'
    : site.status.charAt(0).toUpperCase() + site.status.slice(1);

  return `
    <div class="site-card fade-up">
      <div class="card-top">
        ${cardIconHTML(site)}
        <span class="card-status status-${site.status}">${statusLabel}</span>
      </div>
      <div class="card-category">${site.category}</div>
      <div class="card-name">${site.name}</div>
      <div class="card-desc">${site.description}</div>
      <div class="card-tags">${site.tags.map(t => `<span class="tag">${t}</span>`).join('')}</div>
      ${site.status === 'coming-soon'
        ? `<span class="card-link" style="color:var(--text-muted);cursor:default">Coming soon</span>`
        : `<a class="card-link" href="${site.url}" target="_blank" rel="noopener">
            Visit site
            <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.5">
              <path d="M2.5 9.5l7-7M4 2.5h5.5v5.5"/>
            </svg>
          </a>`}
    </div>`;
}

// ── Home page ───────────────────────────────────────────────
function renderHomePage() {
  const { description } = siteData.network;
  const total = siteData.sites.length;
  const live  = siteData.sites.filter(s => s.status === 'live').length;
  const cats  = [...new Set(siteData.sites.map(s => s.category))].length;

  document.getElementById('hero-sub').textContent = description;
  document.getElementById('stat-total').textContent = total;
  document.getElementById('stat-live').textContent  = live;
  document.getElementById('stat-cats').textContent  = cats;
  document.getElementById('featured-grid').innerHTML = siteData.sites.slice(0, 3).map(renderCard).join('');
}

// ── Network page ─────────────────────────────────────────────
function renderNetworkPage() {
  const categories = ['all', ...new Set(siteData.sites.map(s => s.category))];
  document.getElementById('filter-bar').innerHTML = categories.map(cat => `
    <button class="filter-btn ${cat === 'all' ? 'active' : ''}" data-filter="${cat}">
      ${cat === 'all' ? 'All' : cat}
    </button>`).join('');

  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      activeFilter = btn.dataset.filter;
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderAllCards();
    });
  });
  renderAllCards();
}

function renderAllCards() {
  const sites = activeFilter === 'all'
    ? siteData.sites
    : siteData.sites.filter(s => s.category === activeFilter);
  document.getElementById('all-cards-grid').innerHTML = sites.map(renderCard).join('');
}

// ── Socials section ──────────────────────────────────────────
function renderSocialsSection() {
  const { socials } = socialData;
  if (!socials?.length) return;
  document.getElementById('social-grid').innerHTML = socials.map(s => {
    const svgIcon = SOCIAL_ICONS[s.icon] || SOCIAL_ICONS['x'];
    return `
      <a class="social-card" href="${s.url}" target="_blank" rel="noopener">
        <div class="social-icon-wrap">${svgIcon}</div>
        <div class="social-info">
          <span class="social-platform">${s.platform}</span>
          <span class="social-handle">${s.handle}</span>
        </div>
      </a>`;
  }).join('');
}

// ── Contact page ─────────────────────────────────────────────
function renderContactPage() {
  const { email, twitter, github, linkedin } = siteData.contact || {};
  const links = [
    { icon: '✉', label: email,      href: `mailto:${email}`, show: !!email },
    { icon: '𝕏', label: 'Twitter',  href: twitter,           show: !!twitter },
    { icon: '⌥', label: 'GitHub',   href: github,            show: !!github },
    { icon: '⬡', label: 'LinkedIn', href: linkedin,          show: !!linkedin },
  ].filter(l => l.show);

  document.getElementById('contact-links').innerHTML = links.map(l => `
    <a class="contact-link-row" href="${l.href}" target="_blank" rel="noopener">
      <span class="contact-link-icon">${l.icon}</span>
      <span>${l.label}</span>
    </a>`).join('');
}

// ── Hex animation ────────────────────────────────────────────
function setupHexAnimation() {
  const dots = document.querySelectorAll('.hex-dot');
  if (!dots.length) return;
  setInterval(() => {
    const idx = Math.floor(Math.random() * dots.length);
    dots[idx].classList.add('lit');
    setTimeout(() => dots[idx].classList.remove('lit'), 900 + Math.random() * 500);
  }, 110);
}

// ── Contact form ─────────────────────────────────────────────
function setupContactForm() {
  const form = document.getElementById('contact-form');
  const confirm = document.getElementById('form-confirm');
  form?.addEventListener('submit', e => {
    e.preventDefault();
    form.style.display = 'none';
    confirm.style.display = 'block';
  });
}

// ── Boot ─────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', init);

/* ============================================================
   ANIMATION SYSTEM
   - Particle canvas background
   - Scroll reveal (IntersectionObserver)
   - Nav scroll shadow
   - Theme toggle (dark/light)
   - Stat count-up
   ============================================================ */

// ── Theme toggle ────────────────────────────────────────────
function setupTheme() {
  const btn  = document.getElementById('theme-toggle');
  const body = document.body;
  const saved = localStorage.getItem('nexoria-theme');
  if (saved === 'light') { body.classList.add('light'); btn.textContent = '☀️'; }
  else { btn.textContent = '🌙'; }

  btn.addEventListener('click', () => {
    body.classList.toggle('light');
    const isLight = body.classList.contains('light');
    btn.textContent = isLight ? '☀️' : '🌙';
    localStorage.setItem('nexoria-theme', isLight ? 'light' : 'dark');
    // Restart particles with new colour
    initParticles();
  });
}

// ── Nav scroll shadow ────────────────────────────────────────
function setupNavScroll() {
  const nav = document.getElementById('main-nav');
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 20);
  }, { passive: true });
}

// ── Scroll reveal ────────────────────────────────────────────
function setupScrollReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  const observe = () => {
    document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .stagger').forEach(el => {
      observer.observe(el);
    });
  };

  observe();
  // Re-observe after page switches
  window.addEventListener('nexoria:pagechange', () => {
    setTimeout(observe, 50);
  });
}

// ── Count-up animation ────────────────────────────────────────
function animateCount(el, target, duration = 900) {
  const start = performance.now();
  el.classList.add('counted');
  const update = (now) => {
    const t = Math.min((now - start) / duration, 1);
    const ease = 1 - Math.pow(1 - t, 3);
    el.textContent = Math.round(ease * target);
    if (t < 1) requestAnimationFrame(update);
    else el.textContent = target;
  };
  requestAnimationFrame(update);
}

function setupStatCounters() {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const val = parseInt(el.dataset.target || el.textContent, 10);
        if (!isNaN(val)) animateCount(el, val);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('.stat-number').forEach(el => {
    el.dataset.target = el.textContent;
    observer.observe(el);
  });
}

// ── Particle canvas ──────────────────────────────────────────
let particleAnim = null;

function initParticles() {
  if (particleAnim) cancelAnimationFrame(particleAnim);
  const canvas = document.getElementById('particle-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const isLight = document.body.classList.contains('light');

  let W, H, particles;

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize, { passive: true });

  // Create particles
  const COUNT = Math.min(60, Math.floor(window.innerWidth / 22));
  particles = Array.from({ length: COUNT }, () => ({
    x:   Math.random() * W,
    y:   Math.random() * H,
    vx:  (Math.random() - 0.5) * 0.35,
    vy:  (Math.random() - 0.5) * 0.35,
    r:   Math.random() * 1.4 + 0.4,
    a:   Math.random() * 0.6 + 0.1,
    pulse: Math.random() * Math.PI * 2,
  }));

  // Mouse repulsion
  let mx = -999, my = -999;
  window.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; }, { passive: true });

  function draw(ts) {
    ctx.clearRect(0, 0, W, H);

    const baseColor = isLight ? '160,0,30' : '255,34,68';

    particles.forEach(p => {
      // Mouse repulsion
      const dx = p.x - mx, dy = p.y - my;
      const dist = Math.sqrt(dx*dx + dy*dy);
      if (dist < 100) {
        const force = (100 - dist) / 100 * 0.015;
        p.vx += (dx / dist) * force;
        p.vy += (dy / dist) * force;
      }

      p.vx *= 0.99; p.vy *= 0.99;
      p.x += p.vx; p.y += p.vy;
      p.pulse += 0.015;

      if (p.x < 0) p.x = W; if (p.x > W) p.x = 0;
      if (p.y < 0) p.y = H; if (p.y > H) p.y = 0;

      const alpha = p.a * (0.7 + 0.3 * Math.sin(p.pulse));
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${baseColor},${alpha})`;
      ctx.fill();
    });

    // Draw connecting lines
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const a = particles[i], b = particles[j];
        const dx = a.x - b.x, dy = a.y - b.y;
        const d = Math.sqrt(dx*dx + dy*dy);
        if (d < 130) {
          const alpha = (1 - d / 130) * 0.18;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = `rgba(${baseColor},${alpha})`;
          ctx.lineWidth = 0.6;
          ctx.stroke();
        }
      }
    }

    particleAnim = requestAnimationFrame(draw);
  }

  particleAnim = requestAnimationFrame(draw);
}

// ── Boot all animations ────────────────────────────────────
const _origNavigateTo = navigateTo;
window.navigateTo = function(pageId) {
  _origNavigateTo(pageId);
  window.dispatchEvent(new Event('nexoria:pagechange'));
  setTimeout(setupStatCounters, 100);
};

document.addEventListener('DOMContentLoaded', () => {
  setupTheme();
  setupNavScroll();
  setupScrollReveal();
  initParticles();
  setTimeout(setupStatCounters, 600);
});
