/* ============================================================
   NEXORIA NETWORK — App Logic
   Loads sites.json, handles SPA routing, renders all content
   ============================================================ */

let siteData = null;
let activeFilter = 'all';

// ── Bootstrap ──────────────────────────────────────────────
async function init() {
  try {
    const res = await fetch('./sites.json');
    siteData = await res.json();
  } catch (e) {
    console.error('Could not load sites.json:', e);
    siteData = { network: { name: 'Nexoria Network', tagline: '', description: '' }, sites: [], contact: {} };
  }

  applyBranding();
  renderHomePage();
  renderNetworkPage();
  renderContactPage();
  setupNav();
  setupHexAnimation();

  const hash = location.hash.replace('#', '') || 'home';
  navigateTo(hash);
}

// ── Branding ───────────────────────────────────────────────
function applyBranding() {
  const { name, tagline } = siteData.network;
  document.title = name;
  document.querySelectorAll('[data-brand-name]').forEach(el => el.textContent = name);
  document.querySelectorAll('[data-brand-tagline]').forEach(el => el.textContent = tagline);
}

// ── Navigation ─────────────────────────────────────────────
function setupNav() {
  document.querySelectorAll('[data-nav]').forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      navigateTo(link.dataset.nav);
      // close mobile menu if open
      document.getElementById('nav-links').classList.remove('open');
    });
  });

  document.getElementById('mobile-toggle')?.addEventListener('click', () => {
    document.getElementById('nav-links').classList.toggle('open');
  });

  window.addEventListener('popstate', () => {
    navigateTo(location.hash.replace('#', '') || 'home');
  });
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

// ── Home Page ──────────────────────────────────────────────
function renderHomePage() {
  const { name, tagline, description } = siteData.network;
  const total = siteData.sites.length;
  const live  = siteData.sites.filter(s => s.status === 'live').length;
  const cats  = [...new Set(siteData.sites.map(s => s.category))].length;

  document.getElementById('hero-title-main').textContent = name;
  document.getElementById('hero-sub').textContent = description;
  document.getElementById('stat-total').textContent = total;
  document.getElementById('stat-live').textContent = live;
  document.getElementById('stat-cats').textContent = cats;

  // Featured cards (first 3)
  const featured = siteData.sites.slice(0, 3);
  document.getElementById('featured-grid').innerHTML = featured.map(renderCard).join('');
}

// ── Network Page ───────────────────────────────────────────
function renderNetworkPage() {
  const categories = ['all', ...new Set(siteData.sites.map(s => s.category))];

  document.getElementById('filter-bar').innerHTML = categories.map(cat => `
    <button class="filter-btn ${cat === 'all' ? 'active' : ''}" data-filter="${cat}">
      ${cat === 'all' ? 'All' : cat}
    </button>
  `).join('');

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

function renderCard(site) {
  const statusLabel = site.status === 'coming-soon' ? 'Soon' :
                      site.status.charAt(0).toUpperCase() + site.status.slice(1);

  const isComingSoon = site.status === 'coming-soon';

  return `
    <div class="site-card fade-up">
      <div class="card-top">
        <div class="card-icon">${site.icon}</div>
        <span class="card-status status-${site.status}">${statusLabel}</span>
      </div>
      <div class="card-category">${site.category}</div>
      <div class="card-name">${site.name}</div>
      <div class="card-desc">${site.description}</div>
      <div class="card-tags">
        ${site.tags.map(t => `<span class="tag">${t}</span>`).join('')}
      </div>
      ${isComingSoon
        ? `<span class="card-link" style="color:var(--text-muted);cursor:default">Coming soon</span>`
        : `<a class="card-link" href="${site.url}" target="_blank" rel="noopener">
            Visit site
            <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.5">
              <path d="M2.5 9.5l7-7M4 2.5h5.5v5.5"/>
            </svg>
          </a>`
      }
    </div>
  `;
}

// ── Contact Page ───────────────────────────────────────────
function renderContactPage() {
  const { email, twitter, github, linkedin } = siteData.contact;

  const links = [
    { icon: '✉', label: email,    href: `mailto:${email}`,    show: !!email },
    { icon: '𝕏', label: 'Twitter / X', href: twitter,        show: !!twitter },
    { icon: '⌥', label: 'GitHub',  href: github,              show: !!github },
    { icon: '⬡', label: 'LinkedIn',href: linkedin,            show: !!linkedin },
  ].filter(l => l.show);

  document.getElementById('contact-links').innerHTML = links.map(l => `
    <a class="contact-link-row" href="${l.href}" target="_blank" rel="noopener">
      <span class="contact-link-icon">${l.icon}</span>
      <span>${l.label}</span>
    </a>
  `).join('');
}

// ── Hex Animation ──────────────────────────────────────────
function setupHexAnimation() {
  const dots = document.querySelectorAll('.hex-dot');
  if (!dots.length) return;

  function pulse() {
    const idx = Math.floor(Math.random() * dots.length);
    dots[idx].classList.add('lit');
    setTimeout(() => dots[idx].classList.remove('lit'), 800 + Math.random() * 600);
  }

  setInterval(pulse, 120);
}

// ── Contact form (no backend — shows confirmation) ─────────
function setupContactForm() {
  const form = document.getElementById('contact-form');
  const confirm = document.getElementById('form-confirm');

  form?.addEventListener('submit', e => {
    e.preventDefault();
    form.style.display = 'none';
    confirm.style.display = 'block';
  });
}

// ── Start ──────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  init().then(setupContactForm);
});
