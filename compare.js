const G = window.HermodGraph;
let draft = G.draftFromSearch(window.location.search);
const params = new URLSearchParams(window.location.search);
const STRATEGY_STORAGE_KEY = "hermod.strategyLens.v1";
const VALID_STRATEGIES = new Set(["target_access_first", "draft_optionality", "protect_carry"]);

function readInitialStrategy() {
  const fromUrl = params.get("strategy");
  if (VALID_STRATEGIES.has(fromUrl)) return fromUrl;
  try {
    const saved = window.localStorage.getItem(STRATEGY_STORAGE_KEY);
    if (VALID_STRATEGIES.has(saved)) return saved;
  } catch (_) {}
  return "target_access_first";
}

let activeStrategy = readInitialStrategy();
try { window.localStorage.setItem(STRATEGY_STORAGE_KEY, activeStrategy); } catch (_) {}
let selectedSlot = params.get("slot") || "blue:jungle";
if (!selectedSlot.includes(":")) selectedSlot = "blue:jungle";
let [selectedTeam, selectedRole] = selectedSlot.split(":");
if (!draft[selectedTeam] || !draft[selectedTeam][selectedRole]) {
  selectedSlot = "blue:jungle";
  [selectedTeam, selectedRole] = selectedSlot.split(":");
}
let alternative = firstAlternative(selectedTeam, selectedRole, draft[selectedTeam][selectedRole]);

const el = id => document.getElementById(id);

function renderStrategyStatus() {
  const host = el("active-strategy-pill");
  if (!host) return;
  const lens = G.STRATEGY_LENSES[activeStrategy];
  host.innerHTML = `<span>Active strategy</span><strong>${lens.short}</strong><code>${lens.label}</code>`;
}

const portrait = (name, cls = "champion-portrait") => `<img class="${cls}" src="${G.championImage(name)}" alt="${name} champion portrait" loading="lazy" />`;

function championUsedElsewhere(name, currentTeam, currentRole) {
  return ["blue", "red"].some(team =>
    Object.entries(draft[team]).some(([role, pick]) =>
      pick === name && !(team === currentTeam && role === currentRole)
    )
  );
}

function firstAlternative(team, role, current) {
  return G.ROLE_POOLS[role].find(x => x !== current && !championUsedElsewhere(x, team, role)) || current;
}

function updateAnalysisLink() {
  el("analysis-page-link").href = `index.html${G.draftSearch(draft, { slot: selectedSlot, strategy: activeStrategy })}`;
}

function renderDraft() {
  for (const team of ["blue", "red"]) {
    const holder = el(`${team}-team`);
    holder.innerHTML = "";
    Object.entries(draft[team]).forEach(([role, pick]) => {
      const slot = `${team}:${role}`;
      const b = document.createElement("button");
      b.className = `slot ${slot === selectedSlot ? "selected" : ""}`;
      b.innerHTML = `${portrait(pick, "slot-portrait")}<span class="slot-copy"><span class="role">${G.ROLE_LABEL[role]}</span><span class="pick">${pick}</span></span>`;
      b.addEventListener("click", () => {
        selectedSlot = slot;
        [selectedTeam, selectedRole] = selectedSlot.split(":");
        alternative = firstAlternative(selectedTeam, selectedRole, draft[selectedTeam][selectedRole]);
        renderDraft();
        renderControls();
        renderComparison();
      });
      holder.appendChild(b);
    });
  }
  updateAnalysisLink();
}

function renderControls() {
  const slotSelect = el("slot-select");
  slotSelect.innerHTML = ["blue", "red"].flatMap(team => Object.keys(draft[team]).map(role => {
    const slot = `${team}:${role}`;
    return `<option value="${slot}" ${slot === selectedSlot ? "selected" : ""}>${team.toUpperCase()} · ${G.ROLE_LABEL[role]} · ${draft[team][role]}</option>`;
  })).join("");

  const current = draft[selectedTeam][selectedRole];
  const candidates = G.ROLE_POOLS[selectedRole].filter(x => x !== current && !championUsedElsewhere(x, selectedTeam, selectedRole));
  if (!candidates.includes(alternative)) alternative = candidates[0] || current;
  el("pick-select").innerHTML = candidates.length
    ? candidates.map(name => `<option value="${name}" ${name === alternative ? "selected" : ""}>${name}</option>`).join("")
    : `<option value="${current}">No unused alternatives available</option>`;
  el("pick-select").disabled = candidates.length === 0;
  el("query-button").disabled = candidates.length === 0;
  el("compare-title").textContent = `${current} → ${alternative}`;
  renderPickPreview(current, alternative);
}

function renderPickPreview(current, next) {
  const host = el("pick-preview");
  if (!host) return;
  host.innerHTML = `
    <div class="pick-preview-card">
      ${portrait(current, "compare-portrait")}
      <div><div class="preview-label">Current</div><strong>${current}</strong></div>
    </div>
    <div class="compare-arrow" aria-hidden="true">→</div>
    <div class="pick-preview-card">
      ${portrait(next, "compare-portrait")}
      <div><div class="preview-label">Alternative</div><strong>${next}</strong></div>
    </div>`;
}

function markerRow(symbol, text, kind) {
  return `<li class="change-row ${kind}"><span class="change-symbol" aria-hidden="true">${symbol}</span><span>${text}</span></li>`;
}

function changeList(diff, { includeUnchanged = true, emptyText = "No modeled change in this area." } = {}) {
  const rows = [
    ...(diff.added || []).map(x => markerRow("+", x, "change-plus")),
    ...(diff.removed || []).map(x => markerRow("−", x, "change-minus")),
    ...(includeUnchanged ? (diff.unchanged || []).map(x => markerRow("", x, "change-same")) : [])
  ];
  return rows.length ? `<ul class="change-list">${rows.join("")}</ul>` : `<p class="note">${emptyText}</p>`;
}

function semanticCard(title, diff) {
  return `<section class="card semantic-delta-card"><h3>${title}</h3>${changeList(diff)}</section>`;
}

function globalConsequencesSection(result) {
  const changed = {
    added: result.strategyGlobalChanges.added,
    removed: result.strategyGlobalChanges.removed,
    unchanged: []
  };
  const lens = G.STRATEGY_LENSES[activeStrategy];
  return `
    <section class="global-consequences compare-global">
      <div class="section-heading"><h3>Global consequences</h3><span>composition-wide effects interpreted through the active strategy</span></div>
      <div class="strategy-context"><strong>Strategy lens:</strong> ${lens.short} <span class="strategy-code">${lens.label}</span></div>
      <div class="change-legend"><span><strong>+</strong> introduced / increased</span><span><strong>−</strong> removed / decreased</span><span>no symbol = preserved inside semantic sections</span></div>
      <div class="global-consequence-body">${changeList(changed, { includeUnchanged: false, emptyText: "This substitution does not change a high-salience consequence under the active strategy lens." })}</div>
    </section>`;
}

function sourceChangeCard(change) {
  const added = change.added.map(name => markerRow("+", `${name} now supplies ${change.label.toLowerCase()}.`, "change-plus"));
  const removed = change.removed.map(name => markerRow("−", `${name} no longer supplies ${change.label.toLowerCase()}.`, "change-minus"));
  const preserved = change.unchanged.length
    ? `<div class="source-preserved"><span>Still supplied by</span><div class="source-chip-row">${change.unchanged.map(name => `<span class="source-chip">${portrait(name, "source-chip-portrait")}<span>${name}</span></span>`).join("")}</div></div>`
    : `<div class="source-preserved"><span>No other modeled source remains in this category.</span></div>`;
  return `
    <section class="source-change-card">
      <div class="source-change-title">${change.label}</div>
      <ul class="change-list">${[...added, ...removed].join("")}</ul>
      ${preserved}
    </section>`;
}

function sourceChangesSection(result) {
  const body = result.sourceChanges.length
    ? `<div class="source-change-grid">${result.sourceChanges.map(sourceChangeCard).join("")}</div>`
    : `<p class="note">The replacement does not change any tracked structural source category. Its differences are expressed in the semantic sections below.</p>`;
  return `
    <section class="compare-section">
      <div class="section-heading"><h3>Structural sources changed</h3><span>which champions actually enter or leave each structural role</span></div>
      ${body}
    </section>`;
}

function motifSection(result) {
  const changed = {
    added: result.motifChanges.added,
    removed: result.motifChanges.removed,
    unchanged: []
  };
  return `
    <section class="compare-section">
      <div class="section-heading"><h3>Strategy-engineering motifs</h3><span>higher-order structures changed by the graph mutation</span></div>
      <div class="card full-card">${changeList(changed, { includeUnchanged: false, emptyText: "No tracked Strategy Engineering motif changed." })}</div>
    </section>`;
}

function renderComparison() {
  const after = G.cloneDraft(draft);
  after[selectedTeam][selectedRole] = alternative;
  const result = G.compareDrafts(draft, after, selectedSlot, activeStrategy);
  el("compare-title").textContent = `${result.beforeName} → ${result.afterName}`;
  renderPickPreview(result.beforeName, result.afterName);

  const c = result.categoryDiffs;

  el("comparison-output").innerHTML = `
    <div class="callout"><strong>${result.beforeName} → ${result.afterName}</strong><br><span class="note">One slot is mutated and the entire 10-pick graph is re-evaluated. Change markers indicate graph delta only—not whether a change is strategically good or bad.</span></div>

    ${globalConsequencesSection(result)}
    ${sourceChangesSection(result)}

    <section class="compare-section">
      <div class="section-heading"><h3>Where the change belongs</h3><span>each difference stays inside its semantic category</span></div>
      <div class="grid">
        ${semanticCard("Gives", c.gives)}
        ${semanticCard("Needs", c.needs)}
        ${semanticCard("Unlocks", c.unlocks)}
        ${semanticCard("Exposes", c.exposes)}
        ${semanticCard("Costs", c.costs)}
        ${semanticCard("Player", c.player)}
        ${semanticCard("Can change", c.change)}
        ${semanticCard("Downstream", c.downstream)}
      </div>
    </section>

    ${motifSection(result)}`;
}

el("slot-select").addEventListener("change", e => {
  selectedSlot = e.target.value;
  [selectedTeam, selectedRole] = selectedSlot.split(":");
  alternative = firstAlternative(selectedTeam, selectedRole, draft[selectedTeam][selectedRole]);
  renderDraft();
  renderControls();
  renderComparison();
});

el("pick-select").addEventListener("change", e => {
  alternative = e.target.value;
  renderControls();
  renderComparison();
});

el("query-button").addEventListener("click", renderComparison);

renderStrategyStatus();
renderDraft();
renderControls();
renderComparison();
