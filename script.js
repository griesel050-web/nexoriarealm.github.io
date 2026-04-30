// ========================= // script.js // =========================

// COPY IP FUNCTION function copyIP() { navigator.clipboard.writeText("play.nexoriarealm.xyz"); alert("IP copied to clipboard!"); }

// LIVE PLAYER COUNT (EDIT API IF NEEDED) async function fetchPlayerCount() { try { // Public API for Minecraft server status const response = await fetch("https://api.mcsrvstat.us/2/play.nexoriarealm.xyz:25697"); const data = await response.json();

if (data.online) {
        document.getElementById("playerCount").innerText = data.players.online;
    } else {
        document.getElementById("playerCount").innerText = "Offline";
    }
} catch (error) {
    document.getElementById("playerCount").innerText = "Error";
}

}

// Refresh every 30 seconds setInterval(fetchPlayerCount, 30000); fetchPlayerCount();