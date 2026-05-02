/* ============================================================
   NEXORIA — vote-config.js
   THIS IS THE ONLY FILE YOU NEED TO EDIT FOR VOTING SITES.

   To add a site:    Copy any block and paste it into the array.
   To remove a site: Delete its block.
   To update a link: Change the "url" field.
   To disable a site temporarily: Set "active: false"
   ============================================================ */

const VOTE_SITES = [

  /* ── SITE 1 ──────────────────────────────────────────────
     Fill in your actual voting URL for each site.
     "reward" = what players get for voting on this site.
     "cooldown" = how often they can vote (shown as a label).
  ──────────────────────────────────────────────────────── */
  {
    name:     'Minecraft-Server.net',       // Display name
    url:      'https://minecraft-server.net/vote/YOUR_SERVER_ID/', // ← paste your URL
    icon:     '🌐',                         // Emoji shown on the card
    reward:   '500 Coins + 1 Crate Key',    // What the player earns
    cooldown: 'Every 24h',                  // Vote cooldown
    active:   true,                         // true = shown, false = hidden
  },

  {
    name:     'Planet Minecraft',
    url:      'https://www.planetminecraft.com/server/YOUR_SERVER/', // ← paste your URL
    icon:     '🪐',
    reward:   '500 Coins + 50 Points',
    cooldown: 'Every 24h',
    active:   true,
  },

  {
    name:     'Minecraft-MP.com',
    url:      'https://minecraft-mp.com/server/YOUR_ID/vote/', // ← paste your URL
    icon:     '🗺️',
    reward:   '500 Coins + 1 Crate Key',
    cooldown: 'Every 24h',
    active:   true,
  },

  {
    name:     'TopG.org',
    url:      'https://topg.org/Minecraft/server-YOUR_ID/', // ← paste your URL
    icon:     '📊',
    reward:   '750 Coins + 50 Points',
    cooldown: 'Every 24h',
    active:   true,
  },

  {
    name:     'MinecraftServers.org',
    url:      'https://minecraftservers.org/vote/YOUR_ID', // ← paste your URL
    icon:     '🏰',
    reward:   '500 Coins + 1 Crate Key',
    cooldown: 'Every 24h',
    active:   true,
  },

  {
    name:     'Minecraft Server List',
    url:      'https://minecraft.buzz/vote/YOUR_ID', // ← paste your URL
    icon:     '⚡',
    reward:   '500 Coins + 50 Points',
    cooldown: 'Every 24h',
    active:   true,
  },

  /* ── ADD MORE SITES BELOW THIS LINE ─────────────────────
     Copy this block and fill in the fields:

  {
    name:     'Site Name Here',
    url:      'https://your-voting-link-here.com',
    icon:     '🔗',
    reward:   '500 Coins',
    cooldown: 'Every 24h',
    active:   true,
  },

  ──────────────────────────────────────────────────────── */

];

/* ── VOTE REWARDS CONFIG ─────────────────────────────────
   These appear in the "What you earn" rewards strip.
   Edit the label and description to match your VotingPlugin setup.
──────────────────────────────────────────────────────── */
const VOTE_REWARDS = [
  { icon: '🪙', label: 'Coins',         desc: '500 coins per vote site'          },
  { icon: '⭐', label: 'PlayerPoints',  desc: '50 points per vote'               },
  { icon: '🗝️', label: 'Crate Keys',   desc: 'Common key on select sites'       },
  { icon: '🔥', label: 'Vote Streak',   desc: 'Bonus rewards for daily streaks'  },
  { icon: '🎉', label: 'Vote Party',    desc: 'Server-wide reward when goal hit' },
];

/* ── VOTE PARTY CONFIG ───────────────────────────────────
   Shown in the Vote Party progress section.
   PARTY_GOAL = total votes needed to trigger the party.
   PARTY_CURRENT = current vote count (update manually or
   hook to an API if your host exposes one).
──────────────────────────────────────────────────────── */
const VOTE_PARTY = {
  goal:    50,   // votes needed for a party ← edit this
  current: 0,    // current vote count ← update this manually or via API
  reward:  'Legendary Crate Key for ALL online players', // party prize
};
