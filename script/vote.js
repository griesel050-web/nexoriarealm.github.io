const voteSites = [
  { name: "MCRank", url: "https://mcrank.com/server/nexoria" },
  { name: "Crafty", url: "https://crafty.gg/servers/play.nexoriarealm.xyz" },
  { name: "MinecraftServers.org", url: "https://minecraftservers.org/server/682443" },
  { name: "Minecraft Server List", url: "https://minecraft-server-list.com/server/517241/" },
  { name: "Minecraft Menu", url: "https://minecraft.menu/server-nexoria.5696" },
  { name: "MC ServerTime", url: "https://mcservertime.com/server-nexoria.2784" },
  { name: "MinecraftServers.me", url: "https://minecraftservers.me/server/nexoria.22037" },
  { name: "MCList", url: "https://mclist.io/server/67761-play-nexoriarealm-xyz-survival-realmip-nexor/vote" },
  { name: "Minecraft Buzz", url: "https://minecraft.buzz/server/18581" },
  { name: "Play Minecraft Servers", url: "https://play-minecraft-servers.com/minecraft-servers/nexoria/" },
  { name: "TopMinecraftServers", url: "https://topminecraftservers.org/vote/42550" }
];

const grid = document.getElementById("voteGrid");

voteSites.forEach(site => {
  const card = document.createElement("div");
  card.className = "vote-card";

  card.innerHTML = `
    <h3>${site.name}</h3>
    <span class="vote-btn">Vote Now</span>
  `;

  card.addEventListener("click", () => {
    window.open(site.url, "_blank", "noopener");
  });

  grid.appendChild(card);
});

