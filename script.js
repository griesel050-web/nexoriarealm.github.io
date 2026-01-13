// Copy server IP to clipboard with fallback, PWA registration, and server status
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
