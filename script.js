// Copy server IP to clipboard with fallback, player modal, and PWA registration
const SERVER_IP = "play.nexoriarealm.xyz";
const STATUS_API = `https://api.mcsrvstat.us/2/${SERVER_IP}`;
const POLL_INTERVAL = 30_000; // 30s

/* ---------- Clipboard ---------- */
function fallbackCopyTextToClipboard(text) {
  const textArea = document.createElement("textarea");
  textArea.value = text;
  textArea.style.position = "fixed";
  textArea.style.left = "-9999px";
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();
  try {
    document.execCommand("copy");
    return true;
  } catch (err) {
    console.error("Fallback: copy failed", err);
    return false;
  } finally {
    document.body.removeChild(textArea);
  }
}

async function copyIP() {
  const copyTextEl = document.getElementById("copy-text");
  try {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(SERVER_IP);
    } else {
      const ok = fallbackCopyTextToClipboard(SERVER_IP);
      if (!ok) throw new Error("Clipboard API and fallback both failed");
    }
    copyTextEl.textContent = "Copied!";
    setTimeout(() => { copyTextEl.textContent = "Click or press enter to copy"; }, 1500);
  } catch (err) {
    console.error("Failed to copy IP:", err);
    copyTextEl.textContent = "Copy failed";
    setTimeout(() => { copyTextEl.textContent = "Click or press enter to copy"; }, 1500);
  }
}

/* ---------- Safe helpers ---------- */
function safeNumber(v) {
  return (typeof v === 'number' && !Number.isNaN(v)) ? v : 0;
}

/* ---------- Server status fetching ---------- */
let lastServerData = null;

async function fetchStatus() {
  const res = await fetch(STATUS_API, { cache: "no-store" });
  if (!res.ok) throw new Error(`Status API returned ${res.status}`);
  return res.json();
}

async function updateServerStatus() {
  const statusEl = document.getElementById("status");
  const playersEl = document.getElementById("players");
  const versionEl = document.getElementById("version");
  const lastUpdatedEl = document.getElementById("last-updated");

  try {
    const data = await fetchStatus();
    lastServerData = data;

    if (data && data.online) {
      statusEl.textContent = "Online";
      statusEl.classList.remove("offline");
      statusEl.classList.add("online");

      const online = safeNumber(data.players?.online);
      const max = safeNumber(data.players?.max);
      playersEl.textContent = `${online} / ${max}`;
      versionEl.textContent = data.version || "—";
    } else {
      statusEl.textContent = "Offline";
      statusEl.classList.remove("online");
      statusEl.classList.add("offline");
      playersEl.textContent = "0 / 0";
      versionEl.textContent = "—";
      lastServerData = data;
    }

    lastUpdatedEl.textContent = `Last updated: ${new Date().toLocaleTimeString()}`;
  } catch (err) {
    statusEl.textContent = "Offline";
    statusEl.classList.remove("online");
    statusEl.classList.add("offline");
    playersEl.textContent = "0 / 0";
    versionEl.textContent = "—";
    lastUpdatedEl.textContent = `Last updated: ${new Date().toLocaleTimeString()} (error)`;
    console.error("Error fetching server status:", err);
  }
}

/* ---------- Player modal ---------- */
function openModal() {
  const modal = document.getElementById("players-modal");
  if (!modal) return;
  modal.hidden = false;
  document.body.style.overflow = "hidden";
  modal.querySelector(".modal-panel").focus();
  modal.setAttribute("aria-hidden", "false");
}

function closeModal() {
  const modal = document.getElementById("players-modal");
  if (!modal) return;
  modal.hidden = true;
  document.body.style.overflow = "";
  modal.setAttribute("aria-hidden", "true");
}

function renderPlayerList(data) {
  const container = document.getElementById("players-list");
  container.innerHTML = ""; // clear

  if (!data) {
    container.innerHTML = '<p class="muted">No status available.</p>';
    return;
  }

  if (data.online) {
    const online = safeNumber(data.players?.online);
    if (online === 0) {
      container.innerHTML = '<p class="muted">No players online right now.</p>';
      return;
    }

    // mcsrvstat may provide players.list (array of names) or not
    const list = data.players?.list;
    if (Array.isArray(list) && list.length > 0) {
      const ul = document.createElement("ul");
      ul.className = "player-list";
      list.forEach(name => {
        const li = document.createElement("li");
        li.textContent = name;
        ul.appendChild(li);
      });
      container.appendChild(ul);
    } else {
      container.innerHTML = `<p class="muted">Players online: ${online} — player list not available from the server.</p>`;
    }
  } else {
    container.innerHTML = '<p class="muted">Server is offline.</p>';
  }
}

async function showPlayers() {
  const container = document.getElementById("players-list");
  container.innerHTML = '<p class="muted">Loading…</p>';
  openModal();

  try {
    // If we already have fresh data, reuse it; otherwise fetch
    if (lastServerData) {
      renderPlayerList(lastServerData);
    } else {
      const data = await fetchStatus();
      lastServerData = data;
      renderPlayerList(data);
    }
  } catch (err) {
    console.error("Failed to load player list:", err);
    container.innerHTML = '<p class="muted">Failed to load player list.</p>';
  }
}

/* ---------- Embers ---------- */
function generateEmbers(count = 40) {
  const emberContainer = document.querySelector(".embers");
  if (!emberContainer) return;

  const reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const actualCount = reduceMotion ? Math.min(count, 8) : count;
  const frag = document.createDocumentFragment();

  for (let i = 0; i < actualCount; i++) {
    const ember = document.createElement("span");
    ember.style.left = `${Math.random() * 100}vw`;
    ember.style.animationDuration = `${6 + Math.random() * 6}s`;
    ember.style.animationDelay = `${Math.random() * 6}s`;
    ember.setAttribute("aria-hidden", "true");
    frag.appendChild(ember);
  }

  emberContainer.appendChild(frag);
}

/* ---------- PWA: service worker registration ---------- */
function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/service-worker.js')
      .then(() => console.log('Service worker registered'))
      .catch(err => console.warn('Service worker registration failed:', err));
  }
}

/* ---------- Initialization ---------- */
function init() {
  const ipBox = document.getElementById("ip-box");
  const refreshBtn = document.getElementById("refresh-btn");
  const playersBtn = document.getElementById("players-btn");
  const closeModalBtn = document.getElementById("close-modal-btn");
  const modalBackdrop = document.querySelector('.modal-backdrop');
  const modalRefresh = document.getElementById("modal-refresh");

  if (ipBox) {
    ipBox.addEventListener("click", copyIP);
    ipBox.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        copyIP();
      }
    });
  }

  if (refreshBtn) {
    refreshBtn.addEventListener("click", () => {
      refreshBtn.disabled = true;
      updateServerStatus().finally(() => setTimeout(() => { refreshBtn.disabled = false; }, 800));
    });
  }

  if (playersBtn) {
    playersBtn.addEventListener("click", showPlayers);
  }

  if (closeModalBtn) closeModalBtn.addEventListener("click", closeModal);
  if (modalBackdrop) modalBackdrop.addEventListener("click", closeModal);
  if (modalRefresh) modalRefresh.addEventListener("click", async () => {
    modalRefresh.disabled = true;
    await updateServerStatus();
    if (lastServerData) renderPlayerList(lastServerData);
    setTimeout(() => { modalRefresh.disabled = false; }, 600);
  });

  // keyboard: close modal on ESC
  document.addEventListener('keydown', (e) => {
    const modal = document.getElementById("players-modal");
    if (!modal || modal.hidden) return;
    if (e.key === "Escape") closeModal();
  });

  // initial load + periodic refresh
  updateServerStatus();
  setInterval(updateServerStatus, POLL_INTERVAL);

  // visuals
  generateEmbers();

  // try to register service worker for PWA
  registerServiceWorker();
}

/* If script loaded with defer, DOMContentLoaded already fired; still safe to call */
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
