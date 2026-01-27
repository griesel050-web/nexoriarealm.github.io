const commandData = [
  {
    category: "Core Commands",
    commands: [
      { name: "/menu", description: "Opens server main menu", permission: "Everyone" },
      { name: "/spawn", description: "Teleport to the server spawn", permission: "Everyone" },
      { name: "/home <home_name>", description: "Teleport to your home", permission: "Everyone" },
      { name: "/sethome <home_name>", description: "Set a home location", permission: "Everyone" },
      { name: "/delhome <home_name>", description: "Delete a home", permission: "Everyone" },
      { name: "/warp", description: "Teleport to a public warp", permission: "Everyone" },
      { name: "/tpa <player>", description: "Request to teleport to a player", permission: "Everyone" },
      { name: "/tpahere <player>", description: "Request player to teleport to you", permission: "Everyone" },
      { name: "/tpaccept", description: "Accept a teleport request", permission: "Everyone" },
      { name: "/balance", description: "View your balance", permission: "Everyone" },
      { name: "/pay <player> <amount>", description: "Send money to another player", permission: "Everyone" },
      { name: "/tournaments", description: "Opens the tournaments GUI", permission: "Everyone" },
      { name: "/leaderboards", description: "Opens the server leaderboards", permission: "Everyone" }
    ]
  },
  {
    category: "Land Claims",
    commands: [
      { name: "/claim", description: "Start claiming land (or use golden shovel)", permission: "Everyone" },
      { name: "/trust <player>", description: "Give a player full access to your claim", permission: "Everyone" },
      { name: "/accesstrust <player>", description: "Allow a player to use doors/buttons", permission: "Everyone" },
      { name: "/containertrust <player>", description: "Allow chest & container access", permission: "Everyone" },
      { name: "/untrust <player>", description: "Remove a player from your claim", permission: "Everyone" },
      { name: "/claimslist", description: "View your claims", permission: "Everyone" },
      { name: "/abandonclaim", description: "Delete the claim you are standing in", permission: "Everyone" },
      { name: "/abandonallclaims", description: "Delete all the claims you own", permission: "Everyone" }
    ]
  },
  {
    category: "Teams",
    commands: [
      { name: "/team", description: "Opens team GUI", permission: "Everyone" },
      { name: "/team create <name>", description: "Create a team", permission: "Everyone" },
      { name: "/team invite <player>", description: "Invite a player to your team", permission: "Everyone" },
      { name: "/team join <team name>", description: "Accept a team invite", permission: "Everyone" },
      { name: "/team leave", description: "Leave your current team", permission: "Everyone" },
      { name: "/team chat", description: "Toggle team chat", permission: "Everyone" }
    ]
  },
  {
    category: "Teleportation",
    commands: [
      { name: "/mrtp", description: "Random teleport into the world", permission: "Everyone" },
      { name: "/pw", description: "Open player warps", permission: "Everyone" },
      { name: "/setwarp", description: "Create a public warp", permission: "Everyone" }
    ]
  },
  {
    category: "Economy & Crates",
    commands: [
      { name: "/shop", description: "Open the server shop", permission: "Everyone" },
      { name: "/ah", description: "Open the auction house", permission: "Everyone" },
      { name: "/coinflip", description: "Gamble coins with other players", permission: "Everyone" }
    ]
  },
  {
    category: "Skills & Cosmetics",
    commands: [
      { name: "/skills", description: "View your skill progression", permission: "Everyone" },
      { name: "/cosmetics", description: "Open cosmetics menu", permission: "Everyone" }
    ]
  },
  {
    category: "Voting",
    commands: [
      { name: "/vote", description: "View voting links", permission: "Everyone" }
    ]
  },
  {
    category: "Social & Fun",
    commands: [
      { name: "/stats", description: "View your own stats", permission: "Everyone" },
      { name: "/sit", description: "Sit anywhere", permission: "Everyone" },
      { name: "/gsit", description: "Sit on blocks or stairs", permission: "Everyone" },
      { name: "/nick", description: "Change your nickname", permission: "Ranks Only" },
      { name: "/tags", description: "Select a chat tag", permission: "Everyone" }
    ]
  }
];

const container = document.getElementById("commands");
const searchInput = document.getElementById("commandSearch");

function renderCommands(filter = "") {
  container.innerHTML = "";

  commandData.forEach(section => {
    const filteredCommands = section.commands.filter(cmd =>
      cmd.name.toLowerCase().includes(filter) ||
      cmd.description.toLowerCase().includes(filter)
    );

    if (filteredCommands.length === 0) return;

    const categoryDiv = document.createElement("div");
    categoryDiv.className = "command-category";

    const header = document.createElement("div");
    header.className = "category-header";
    header.innerHTML = `<span>${section.category}</span><span class="arrow">▼</span>`;

    const commandsWrapper = document.createElement("div");
    commandsWrapper.className = "commands-wrapper";

    filteredCommands.forEach(cmd => {
      const card = document.createElement("div");
      card.className = "command-card";

      card.innerHTML = `
        <div class="command-name">${cmd.name}</div>
        <div class="command-desc">${cmd.description}</div>
        <div class="command-permission">Permission: ${cmd.permission}</div>
      `;

      commandsWrapper.appendChild(card);
    });

    header.addEventListener("click", () => {
      commandsWrapper.classList.toggle("collapsed");
      header.classList.toggle("collapsed");
    });

    categoryDiv.appendChild(header);
    categoryDiv.appendChild(commandsWrapper);
    container.appendChild(categoryDiv);
  });
}

searchInput.addEventListener("input", e => {
  renderCommands(e.target.value.toLowerCase());
});

renderCommands();


searchInput.addEventListener("input", e => {
  renderCommands(e.target.value.toLowerCase());
});

renderCommands();
