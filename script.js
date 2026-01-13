// Copy server IP to clipboard
function copyIP() {
  const ip = "play.nexoriarealm.xyz";
  navigator.clipboard.writeText(ip)
    .then(() => {
      const text = document.getElementById("copy-text");
      text.textContent = "Copied!";
      setTimeout(() => text.textContent = "Click to copy", 1500);
    })
    .catch(err => console.error("Failed to copy IP:", err));
}

// Fetch Minecraft server status and update DOM
async function updateServerStatus() {
  const statusEl = document.getElementById("status");
  const playersEl = document.getElementById("players");
  try {
    const res = await fetch("https://api.mcsrvstat.us/2/play.nexoriarealm.xyz");
    const data = await res.json();

    if (data.online) {
      statusEl.textContent = "Online";
      playersEl.textContent = `${data.players.online} / ${data.players.max}`;
    } else {
      statusEl.textContent = "Offline";
      playersEl.textContent = "0 / 0";
    }
  } catch (err) {
    statusEl.textContent = "Offline";
    playersEl.textContent = "0 / 0";
    console.error("Error fetching server status:", err);
  }
}

// Create floating ember effects
function generateEmbers(count = 40) {
  const emberContainer = document.querySelector(".embers");

  for (let i = 0; i < count; i++) {
    const ember = document.createElement("span");
    ember.style.left = `${Math.random() * 100}vw`;
    ember.style.animationDuration = `${6 + Math.random() * 6}s`;
    ember.style.animationDelay = `${Math.random() * 6}s`;
    emberContainer.appendChild(ember);
  }
}

// Initialize
updateServerStatus();
generateEmbers();
