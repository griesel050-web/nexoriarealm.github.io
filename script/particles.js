document.querySelectorAll(".vote-card").forEach(card => {
  card.addEventListener("mouseenter", () => {
    for (let i = 0; i < 6; i++) {
      const p = document.createElement("span");
      p.className = "particle";
      p.style.left = Math.random() * 100 + "%";
      p.style.animationDuration = 0.6 + Math.random() + "s";
      card.appendChild(p);

      setTimeout(() => p.remove(), 1200);
    }
  });
});
