// Live player count (placeholder)
const playersElement = document.getElementById('players');

function fetchPlayerCount() {
  // Replace this with your server API call
  const fakeCount = Math.floor(Math.random() * 100);
  playersElement.textContent = fakeCount;
}
setInterval(fetchPlayerCount, 3000);

// Particle effect (embers)
const canvas = document.getElementById('particles');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const particles = [];
for (let i = 0; i < 80; i++) {
  particles.push({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    radius: Math.random() * 3 + 1,
    speedY: Math.random() * 1 + 0.3,
    alpha: Math.random() * 0.5 + 0.5
  });
}

function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach(p => {
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255, ${Math.floor(Math.random() * 150)}, 0, ${p.alpha})`;
    ctx.fill();
    p.y -= p.speedY;
    if (p.y < 0) p.y = canvas.height;
  });
  requestAnimationFrame(animateParticles);
}
animateParticles();

window.addEventListener('resize', () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});

