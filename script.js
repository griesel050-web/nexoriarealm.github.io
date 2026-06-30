/* ===========================================
   CUSTOM CURSOR
   =========================================== */
const cdot = document.getElementById('cdot');
const cring = document.getElementById('cring');
let mx = 0, my = 0, rx = 0, ry = 0;

window.addEventListener('mousemove', e => {
  mx = e.clientX;
  my = e.clientY;
  cdot.style.left = mx + 'px';
  cdot.style.top = my + 'px';
});

function animRing() {
  rx += (mx - rx) * 0.14;
  ry += (my - ry) * 0.14;
  cring.style.left = rx + 'px';
  cring.style.top = ry + 'px';
  requestAnimationFrame(animRing);
}
animRing();

// hover expand
document.querySelectorAll('a, .build-card, .btn').forEach(el => {
  el.addEventListener('mouseenter', () => { cring.classList.add('hover'); cdot.classList.add('hover'); });
  el.addEventListener('mouseleave', () => { cring.classList.remove('hover'); cdot.classList.remove('hover'); });
});

// click shrink
window.addEventListener('mousedown', () => cring.classList.add('click'));
window.addEventListener('mouseup', () => cring.classList.remove('click'));

/* ===========================================
   3D TILT + SPOTLIGHT ON BUILD CARDS
   =========================================== */
document.querySelectorAll('.build-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const r = card.getBoundingClientRect();
    const x = e.clientX - r.left;
    const y = e.clientY - r.top;
    card.style.setProperty('--mx', x + 'px');
    card.style.setProperty('--my', y + 'px');
    const rotX = ((y / r.height) - 0.5) * -9;
    const rotY = ((x / r.width) - 0.5) * 9;
    card.style.transform = `perspective(900px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(-5px)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = 'perspective(900px) rotateX(0) rotateY(0) translateY(0)';
  });
});

/* ===========================================
   SCROLL REVEAL
   =========================================== */
const reveals = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(en => {
    if (en.isIntersecting) en.target.classList.add('in');
  });
}, { threshold: 0.1 });
reveals.forEach(r => revealObserver.observe(r));

/* ===========================================
   ANIMATED STAT COUNTERS
   =========================================== */
const nums = document.querySelectorAll('.num');
const counterObserver = new IntersectionObserver(entries => {
  entries.forEach(en => {
    if (!en.isIntersecting) return;
    const el = en.target;
    const target = parseInt(el.getAttribute('data-target'));
    const suffix = el.getAttribute('data-suffix') || '';
    const duration = 1800;
    const startTime = performance.now();

    function count(now) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // ease out
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.floor(eased * target) + (progress < 1 ? '' : suffix);
      if (progress < 1) requestAnimationFrame(count);
    }
    requestAnimationFrame(count);
    counterObserver.unobserve(el);
  });
}, { threshold: 0.5 });
nums.forEach(n => counterObserver.observe(n));

/* ===========================================
   NAV ACTIVE LINK HIGHLIGHT ON SCROLL
   =========================================== */
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');

const sectionObserver = new IntersectionObserver(entries => {
  entries.forEach(en => {
    if (en.isIntersecting) {
      navLinks.forEach(link => {
        link.style.color = '';
        if (link.getAttribute('href') === '#' + en.target.id) {
          link.style.color = 'var(--white)';
        }
      });
    }
  });
}, { threshold: 0.5 });
sections.forEach(s => sectionObserver.observe(s));

/* ===========================================
   PARALLAX GLOW ON MOUSE MOVE
   =========================================== */
const glow1 = document.querySelector('.glow1');
const glow2 = document.querySelector('.glow2');

window.addEventListener('mousemove', e => {
  const xFrac = e.clientX / window.innerWidth;
  const yFrac = e.clientY / window.innerHeight;
  glow1.style.transform = `translate(${xFrac * 40}px, ${yFrac * 30}px)`;
  glow2.style.transform = `translate(${-xFrac * 40}px, ${-yFrac * 30}px)`;
});

/* ===========================================
   SMOOTH SCROLL FOR NAV LINKS
   =========================================== */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});

/* ===========================================
   TERMINAL TYPEWRITER EFFECT
   =========================================== */
const typeLine = document.querySelector('.type-line');
if (typeLine) {
  const messages = ['shipping_', 'building_', 'deploying_', 'shipping_'];
  let i = 0;
  setInterval(() => {
    i = (i + 1) % messages.length;
    typeLine.innerHTML = messages[i] + '<span class="cursor-blink">|</span>';
  }, 2400);
}
