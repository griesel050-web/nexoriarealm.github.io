/* ============================================================
   NEXORIA — vote-config.js
   THE ONLY FILE YOU NEED TO EDIT FOR VOTING.

   To add a site    → copy any block and paste it in the array
   To remove a site → delete its block
   To update a link → change the "url" value
   To hide a site   → set active: false
   ============================================================ */

const VOTE_SITES = [

  {
    name:     'Minecraft-Server.net',
    url:      'https://minecraft-server.net/vote/YOUR_SERVER_ID/',  // ← paste real URL
    icon:     '🌐',
    reward:   '500 Coins + 1 Crate Key',
    cooldown: 'Every 24h',
    active:   true,
  },

  {
    name:     'Planet Minecraft',
    url:      'https://www.planetminecraft.com/server/YOUR_SERVER/', // ← paste real URL
    icon:     '🪐',
    reward:   '500 Coins + 50 Points',
    cooldown: 'Every 24h',
    active:   true,
  },

  {
    name:     'Minecraft-MP.com',
    url:      'https://minecraft-mp.com/server/YOUR_ID/vote/',       // ← paste real URL
    icon:     '🗺️',
    reward:   '500 Coins + 1 Crate Key',
    cooldown: 'Every 24h',
    active:   true,
  },

  {
    name:     'TopG.org',
    url:      'https://topg.org/Minecraft/server-YOUR_ID/',          // ← paste real URL
    icon:     '📊',
    reward:   '750 Coins + 50 Points',
    cooldown: 'Every 24h',
    active:   true,
  },

  {
    name:     'MinecraftServers.org',
    url:      'https://minecraftservers.org/vote/YOUR_ID',            // ← paste real URL
    icon:     '🏰',
    reward:   '500 Coins + 1 Crate Key',
    cooldown: 'Every 24h',
    active:   true,
  },

  {
    name:     'Minecraft Server List',
    url:      'https://minecraft.buzz/vote/YOUR_ID',                  // ← paste real URL
    icon:     '⚡',
    reward:   '500 Coins + 50 Points',
    cooldown: 'Every 24h',
    active:   true,
  },

  /* ── ADD MORE SITES HERE ─────────────────────────────────
  {
    name:     'Site Name',
    url:      'https://your-link-here.com',
    icon:     '🔗',
    reward:   '500 Coins',
    cooldown: 'Every 24h',
    active:   true,
  },
  ────────────────────────────────────────────────────────── */

];

/* ── REWARD PILLS (shown at top of page) ─────────────────── */
const VOTE_REWARDS = [
  { icon: '🪙', label: 'Coins',        desc: '500 coins per site'          },
  { icon: '⭐', label: 'PlayerPoints', desc: '50 points per vote'          },
  { icon: '🗝️', label: 'Crate Keys',  desc: 'Common key on select sites'  },
  { icon: '🔥', label: 'Vote Streak',  desc: 'Bonus for daily streaks'     },
];