/* ═══════════════════════════════════════
   NEXORIA  ·  script.js
   Handles: Navbar, Burger, Reveal,
            Carousel, Filter, Particles, Form
═══════════════════════════════════════ */

/* ────────────────────────────────
   1. NAVBAR SCROLL
──────────────────────────────── */
const navbar = document.getElementById('navbar');
if (navbar) {
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
  }, { passive: true });
}

/* ────────────────────────────────
   2. BURGER / MOBILE MENU  ← FIXED
──────────────────────────────── */
const burger   = document.getElementById('burger');
const navLinks = document.getElementById('navLinks');

if (burger && navLinks) {
  burger.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    burger.classList.toggle('open', isOpen);
    burger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    // Prevent body scroll while menu is open
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  // Close when a link is clicked
  navLinks.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      burger.classList.remove('open');
      burger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });

  // Close when clicking outside
  document.addEventListener('click', (e) => {
    if (navLinks.classList.contains('open') &&
        !navLinks.contains(e.target) &&
        !burger.contains(e.target)) {
      navLinks.classList.remove('open');
      burger.classList.remove('open');
      burger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }
  });
}

/* ────────────────────────────────
   3. SCROLL REVEAL
──────────────────────────────── */
const revealEls = document.querySelectorAll('.reveal');

if (revealEls.length) {
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  revealEls.forEach(el => revealObserver.observe(el));
}

/* ────────────────────────────────
   4. VERSE CAROUSEL
──────────────────────────────── */
(function () {
  const track   = document.getElementById('carTrack');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  const dotsWrap = document.getElementById('carDots');

  if (!track || !prevBtn || !nextBtn) return;

  const slides = track.querySelectorAll('.car-slide');
  const total  = slides.length;
  let current  = 0;
  let autoTimer;

  // Build dots
  slides.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.className = 'car-dot' + (i === 0 ? ' active' : '');
    dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
    dot.addEventListener('click', () => goTo(i));
    dotsWrap.appendChild(dot);
  });

  function updateDots() {
    dotsWrap.querySelectorAll('.car-dot').forEach((d, i) => {
      d.classList.toggle('active', i === current);
    });
  }

  function goTo(idx) {
    current = (idx + total) % total;
    track.style.transform = `translateX(-${current * 100}%)`;
    updateDots();
  }

  function startAuto() {
    autoTimer = setInterval(() => goTo(current + 1), 5000);
  }

  function stopAuto() {
    clearInterval(autoTimer);
  }

  prevBtn.addEventListener('click', () => { stopAuto(); goTo(current - 1); startAuto(); });
  nextBtn.addEventListener('click', () => { stopAuto(); goTo(current + 1); startAuto(); });

  // Touch/swipe support
  let startX = 0;
  track.parentElement.addEventListener('touchstart', e => { startX = e.touches[0].clientX; }, { passive: true });
  track.parentElement.addEventListener('touchend', e => {
    const diff = startX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) {
      stopAuto();
      goTo(diff > 0 ? current + 1 : current - 1);
      startAuto();
    }
  }, { passive: true });

  startAuto();
})();

/* ────────────────────────────────
   5. SCRIPTURE FILTER TABS
──────────────────────────────── */
(function () {
  const tabs = document.querySelectorAll('.filter-tab');
  const cards = document.querySelectorAll('.scr-card');

  if (!tabs.length || !cards.length) return;

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      // Update active tab
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const filter = tab.dataset.filter;

      cards.forEach(card => {
        if (filter === 'all' || card.dataset.cat === filter) {
          card.classList.remove('hidden');
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });
})();

/* ────────────────────────────────
   6. CONTACT FORM
──────────────────────────────── */
(function () {
  const sendBtn     = document.getElementById('sendBtn');
  const formCard    = document.getElementById('formCard');
  const formSuccess = document.getElementById('formSuccess');
  const formNotice  = document.getElementById('formNotice');

  if (!sendBtn) return;

  sendBtn.addEventListener('click', () => {
    const name    = document.getElementById('fname').value.trim();
    const email   = document.getElementById('femail').value.trim();
    const subject = document.getElementById('fsubject').value;
    const message = document.getElementById('fmessage').value.trim();

    // Basic validation
    if (!name) {
      showNotice('Please enter your name.', false);
      return;
    }
    if (!email || !email.includes('@')) {
      showNotice('Please enter a valid email address.', false);
      return;
    }
    if (!subject) {
      showNotice('Please select a topic.', false);
      return;
    }
    if (!message || message.length < 10) {
      showNotice('Please write a message (at least 10 characters).', false);
      return;
    }

    // Simulate send
    sendBtn.textContent = 'Sending…';
    sendBtn.disabled = true;

    setTimeout(() => {
      formCard.style.display = 'none';
      formSuccess.style.display = 'block';
    }, 1200);
  });

  function showNotice(msg, success) {
    if (!formNotice) return;
    formNotice.textContent = msg;
    formNotice.className = 'form-notice' + (success ? ' success' : '');
  }
})();

/* ────────────────────────────────
   7. PARTICLE CANVAS
──────────────────────────────── */
(function () {
  const canvas = document.getElementById('particles');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let W, H, particles = [];
  const COUNT = 70;
  const COLORS = [
    'rgba(181,42,42,',
    'rgba(122,0,0,',
    'rgba(201,168,76,',
    'rgba(192,57,43,',
  ];

  function rand(a, b) { return Math.random() * (b - a) + a; }

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  function newParticle(fromBottom) {
    return {
      x:     rand(0, W),
      y:     fromBottom ? H + rand(0, 30) : rand(0, H),
      r:     rand(0.5, 2),
      vx:    rand(-0.15, 0.15),
      vy:    rand(-0.3, -0.07),
      alpha: rand(0.15, 0.6),
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      life:  rand(0.003, 0.006),
      age:   fromBottom ? 0 : rand(0, 1),
    };
  }

  function init() {
    resize();
    for (let i = 0; i < COUNT; i++) particles.push(newParticle(false));
  }

  function frame() {
    ctx.clearRect(0, 0, W, H);
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.age += p.life;

      const fade = p.age < 0.5 ? p.age * 2 : (1 - p.age) * 2;
      const a = Math.max(0, Math.min(p.alpha * fade, 1));

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `${p.color}${a.toFixed(3)})`;
      ctx.fill();

      if (p.age >= 1 || p.y < -10) {
        particles[i] = newParticle(true);
      }
    }
    requestAnimationFrame(frame);
  }

  window.addEventListener('resize', resize, { passive: true });
  init();
  frame();

  // Subtle parallax on hero glow
  const heroGlow = document.querySelector('.hero-glow');
  if (heroGlow) {
    window.addEventListener('mousemove', (e) => {
      const dx = (e.clientX / W - 0.5) * 25;
      const dy = (e.clientY / H - 0.5) * 25;
      heroGlow.style.transform = `translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px))`;
    }, { passive: true });
  }
})();
