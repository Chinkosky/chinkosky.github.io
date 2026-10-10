// Registros compartidos hasta ahora. Agrega nuevos niveles dentro de este arreglo.
const levelsData = [
  {name:"Nullscapes", world:10, latam:1, players:[{name:"Theitha", country:"Panamá"}]},
  {name:"Every End", world:14, latam:2, players:[{name:"Samot", country:"Argentina"}]},
  {name:"Silent Clubstep", world:16, latam:3, players:[
    {name:"Aless50", country:"Venezuela"},
    {name:"Thiagar", country:"Argentina"},
    {name:"Horuszed", country:"Chile"},
    {name:"Agatha", country:"Paraguay"}
  ]},
  {name:"Andromeda", world:19, latam:4, players:[
    {name:"xmercurylamp", country:"Brasil"},
    {name:"Pizi", country:"Chile"},
    {name:"Abdieldevil", country:"Perú"}
  ]}
];

const list = document.getElementById("levels");
const search = document.getElementById("search");
const country = document.getElementById("country");
const overlay = document.getElementById("overlay");

document.getElementById("levelTotal").textContent = levelsData.length;
document.getElementById("playerTotal").textContent = levelsData.reduce((sum, level) => sum + level.players.length, 0);

[...new Set(levelsData.flatMap(level => level.players.map(player => player.country)))]
  .sort((a,b) => a.localeCompare(b, "es"))
  .forEach(name => {
    const option = document.createElement("option");
    option.value = name;
    option.textContent = name;
    country.appendChild(option);
  });

function render() {
  const term = search.value.trim().toLocaleLowerCase("es");
  const selectedCountry = country.value;
  const shown = levelsData.filter(level => {
    const foundText = level.name.toLocaleLowerCase("es").includes(term) ||
      level.players.some(player => player.name.toLocaleLowerCase("es").includes(term));
    const foundCountry = !selectedCountry || level.players.some(player => player.country === selectedCountry);
    return foundText && foundCountry;
  }).sort((a,b) => a.world - b.world);

  list.replaceChildren();
  if (!shown.length) {
    const empty = document.createElement("div");
    empty.className = "level";
    empty.textContent = "No se encontraron resultados.";
    list.appendChild(empty);
    return;
  }

  shown.forEach(level => {
    const card = document.createElement("article");
    card.className = "level";
    card.tabIndex = 0;
    card.setAttribute("role", "button");
    card.setAttribute("aria-label", `Abrir detalles de ${level.name}`);

    const rank = document.createElement("div");
    rank.className = "latam-rank";
    rank.textContent = `#${level.latam}`;

    const info = document.createElement("div");
    const name = document.createElement("div");
    name.className = "name";
    name.textContent = level.name;
    const sub = document.createElement("div");
    sub.className = "sub";
    sub.textContent = `${level.players.length} jugador${level.players.length === 1 ? "" : "es"} registrado${level.players.length === 1 ? "" : "s"}`;
    const preview = document.createElement("div");
    preview.className = "player-preview";
    preview.textContent = level.players.map(p => `${p.name} · ${p.country}`).join("  /  ");
    info.append(name, sub, preview);

    const world = document.createElement("div");
    world.className = "world";
    world.textContent = `TOP ${level.world}`;

    card.append(rank, info, world);
    card.addEventListener("click", () => openDetails(level));
    card.addEventListener("keydown", event => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        openDetails(level);
      }
    });
    list.appendChild(card);
  });
}

function openDetails(level) {
  document.getElementById("detailLatam").textContent = `POSICIÓN LATAM #${level.latam}`;
  document.getElementById("detailName").textContent = level.name;
  document.getElementById("detailGlobal").textContent = `Posición mundial: Top ${level.world}`;
  const players = document.getElementById("detailPlayers");
  players.replaceChildren();

  level.players.forEach(player => {
    const row = document.createElement("div");
    row.className = "player";
    const playerName = document.createElement("b");
    playerName.textContent = player.name;
    const playerCountry = document.createElement("span");
    playerCountry.textContent = player.country;
    row.append(playerName, playerCountry);
    players.appendChild(row);
  });
  overlay.classList.remove("hidden");
  document.getElementById("close").focus();
}
function closeDetails() { overlay.classList.add("hidden"); }

search.addEventListener("input", render);
country.addEventListener("change", render);
document.getElementById("close").addEventListener("click", closeDetails);
overlay.addEventListener("click", event => { if (event.target === overlay) closeDetails(); });
document.addEventListener("keydown", event => { if (event.key === "Escape") closeDetails(); });
render();
