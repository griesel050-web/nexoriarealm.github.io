const commandData = [
  {
    category: "General",
    commands: [
      {
        name: "/menu",
        description: "Open the main server menu",
        permission: "Everyone"
      },
      {
        name: "/spawn",
        description: "Teleport to the spawn area",
        permission: "Everyone"
      },
      {
        name: "/rules",
        description: "View server rules",
        permission: "Everyone"
      }
    ]
  },
  {
    category: "Gameplay",
    commands: [
      {
        name: "/team create <name>",
        description: "Create a new team",
        permission: "Everyone"
      },
      {
        name: "/team invite <player>",
        description: "Invite a player to your team",
        permission: "Everyone"
      }
    ]
  },
  {
    category: "Staff",
    commands: [
      {
        name: "/ban <player>",
        description: "Ban a player from the server",
        permission: "Staff Only"
      },
      {
        name: "/mute <player>",
        description: "Mute a player in chat",
        permission: "Staff Only"
      }
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

    categoryDiv.innerHTML = `<h2>${section.category}</h2>`;

    filteredCommands.forEach(cmd => {
      const card = document.createElement("div");
      card.className = "command-card";

      card.innerHTML = `
        <div class="command-name">${cmd.name}</div>
        <div class="command-desc">${cmd.description}</div>
        <div class="command-permission">Permission: ${cmd.permission}</div>
      `;

      categoryDiv.appendChild(card);
    });

    container.appendChild(categoryDiv);
  });
}

searchInput.addEventListener("input", e => {
  renderCommands(e.target.value.toLowerCase());
});

renderCommands();
