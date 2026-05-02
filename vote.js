/* ============================================================
   NEXORIA — vote.js
   Reads VOTE_SITES, VOTE_REWARDS, and VOTE_PARTY from
   vote-config.js and renders the entire vote page.

   You should NOT need to edit this file.
   All content changes go in vote-config.js.
   ============================================================ */

/* ── 1. RENDER REWARDS STRIP ─────────────────────────────────
   Loops through VOTE_REWARDS and builds the strip of reward pills.
──────────────────────────────────────────────────────────── */
function renderRewardsStrip() {
  const container = document.getElementById('rewardsStrip');
  if (!container || !window.VOTE_REWARDS) return;

  container.innerHTML = VOTE_REWARDS.map(r => `
    <div class="reward-pill">
      <span class="reward-pill-icon">${r.icon}</span>
      <div>
        <span class="reward-pill-label">${r.label}</span>
        <span class="reward-pill-desc">${r.desc}</span>
      </div>
    </div>
  `).join('');
}

/* ── 2. RENDER VOTE PARTY PROGRESS BAR ──────────────────────
   Reads VOTE_PARTY.current / VOTE_PARTY.goal and fills the bar.
──────────────────────────────────────────────────────────── */
function renderVoteParty() {
  if (!window.VOTE_PARTY) return;

  const { goal, current, reward } = VOTE_PARTY;
  const pct = Math.min((current / goal) * 100, 100);

  const countEl  = document.getElementById('partyCount');
  const barEl    = document.getElementById('partyBar');
  const rewardEl = document.getElementById('partyReward');

  if (countEl)  countEl.textContent  = `${current} / ${goal} votes`;
  if (barEl)    barEl.style.width    = pct + '%';
  if (rewardEl) rewardEl.textContent = reward;
}

/* ── 3. RENDER VOTING SITE CARDS ─────────────────────────────
   Loops through VOTE_SITES (filtering active: false sites)
   and injects a card into #sitesGrid for each one.
──────────────────────────────────────────────────────────── */
function renderSiteCards() {
  const grid  = document.getElementById('sitesGrid');
  const count = document.getElementById('sitesCount');
  if (!grid || !window.VOTE_SITES) return;

  // Filter to only active sites
  const activeSites = VOTE_SITES.filter(s => s.active !== false);

  // Update count label
  if (count) {
    count.innerHTML = `<strong>${activeSites.length}</strong> sites available`;
  }

  // Build cards HTML
  grid.innerHTML = activeSites.map((site, index) => `
    <div class="site-card reveal" id="siteCard-${index}" style="transition-delay:${index * 0.06}s">

      <div class="site-card-top">
        <span class="site-card-icon">${site.icon}</span>
        <div>
          <div class="site-card-name">${site.name}</div>
          <div class="site-card-cooldown">⏱ ${site.cooldown}</div>
        </div>
      </div>

      <div class="site-card-reward">🏆 ${site.reward}</div>

      <a
        class="site-card-btn"
        href="${site.url}"
        target="_blank"
        rel="noopener noreferrer"
        data-site-index="${index}"
        onclick="markVoted(${index})"
      >
        Vote Now <span>→</span>
      </a>

    </div>
  `).join('');

  // Restore any previously voted sites from sessionStorage
  restoreVotedState(activeSites.length);

  // Re-run scroll reveal on newly injected cards
  if (typeof initScrollReveal === 'function') {
    initScrollReveal();
  } else {
    // Fallback if called before main.js observer is ready
    document.querySelectorAll('.site-card.reveal').forEach(el => {
      el.classList.add('visible');
    });
  }
}

/* ── 4. MARK VOTED STATE ─────────────────────────────────────
   When a player clicks a vote button, the card turns green.
   State is saved to sessionStorage so it persists on page refresh.
──────────────────────────────────────────────────────────── */
function markVoted(index) {
  // Small delay so the link opens first
  setTimeout(() => {
    const card = document.getElementById('siteCard-' + index);
    if (card) card.classList.add('voted');

    // Persist to sessionStorage (resets when browser tab closes)
    try {
      const voted = JSON.parse(sessionStorage.getItem('nexoria_voted') || '[]');
      if (!voted.includes(index)) voted.push(index);
      sessionStorage.setItem('nexoria_voted', JSON.stringify(voted));
    } catch (e) { /* sessionStorage unavailable */ }

    // Update vote progress tip
    updateVotedSummary();
  }, 300);
}

function restoreVotedState(total) {
  try {
    const voted = JSON.parse(sessionStorage.getItem('nexoria_voted') || '[]');
    voted.forEach(index => {
      const card = document.getElementById('siteCard-' + index);
      if (card) card.classList.add('voted');
    });
    updateVotedSummary();
  } catch (e) { /* sessionStorage unavailable */ }
}

/* ── 5. VOTED SUMMARY TOAST ──────────────────────────────────
   After voting on sites, shows a summary toast message.
──────────────────────────────────────────────────────────── */
function updateVotedSummary() {
  try {
    const voted   = JSON.parse(sessionStorage.getItem('nexoria_voted') || '[]');
    const total   = VOTE_SITES.filter(s => s.active !== false).length;
    const done    = voted.length;

    if (done === 0) return;

    if (done === total) {
      // All sites voted
      if (typeof showToast === 'function') {
        showToast(`🎉 You voted on all ${total} sites! Claim rewards with /voterewards`);
      }
    }
  } catch (e) {}
}

/* ── 6. CLEAR VOTED STATE (utility) ─────────────────────────
   Call clearVotedState() in the browser console to reset.
   Useful for testing or when a new 24h cycle starts.
──────────────────────────────────────────────────────────── */
function clearVotedState() {
  sessionStorage.removeItem('nexoria_voted');
  document.querySelectorAll('.site-card.voted').forEach(c => c.classList.remove('voted'));
  console.log('[Nexoria Vote] Voted state cleared.');
}

/* ── 7. BOOT — runs everything once DOM is ready ─────────────
   vote-config.js must be loaded before this file.
──────────────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  // Safety check — make sure config loaded
  if (typeof VOTE_SITES === 'undefined') {
    console.error('[Nexoria Vote] vote-config.js not loaded! Make sure it is included before vote.js.');
    return;
  }

  renderRewardsStrip();
  renderVoteParty();
  renderSiteCards();
});
 