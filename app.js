const G = window.HermodGraph;
let draft = G.draftFromSearch(window.location.search);
let selected = { team: "blue", role: "jungle" };
let activeView = "structure";
let activeStrategy = "target_access_first";

const strategies = {
  target_access_first: {
    label: "TARGET_ACCESS_FIRST",
    title: "Get onto the targets that matter",
    simple: "This strategy asks one simple question: can our team reliably reach the enemy champions we most need to shut down?",
    purpose: "Use this lens when your plan depends on starting fights on specific carries or low-mobility targets before they can safely do their job.",
    values: ["Backline access", "Reliable initiation", "Pressure on low-mobility carries"],
    accepts: ["Some resource spend to protect the access mechanism"],
    disfavors: ["Losing the primary access route"],
    narrative: "This lens prioritizes securing a reliable way to reach and hold priority targets, even if doing so consumes some draft or execution resources."
  },
  draft_optionality: {
    label: "DRAFT_OPTIONALITY",
    title: "Keep good choices open",
    simple: "This strategy asks: after we make this pick, do we still have several good ways to finish the draft, or did we box ourselves into one narrow plan?",
    purpose: "Use this lens when you care about preserving flexibility, avoiding easy counter-picks, and keeping bans and later picks available for other problems.",
    values: ["Response flexibility", "Ban flexibility", "Open role branches"],
    accepts: ["Deferring a locally attractive pick"],
    disfavors: ["Early counter exposure", "Protection requirements that consume scarce draft resources"],
    narrative: "This lens values keeping future branches open. A pick can fit the current composition and still be unattractive if it collapses too much response space."
  },
  protect_carry: {
    label: "PROTECT_PRIMARY_CARRY",
    title: "Keep the main damage dealer safe",
    simple: "This strategy asks: can our main carry stay alive, get enough space, and keep attacking while the fight is happening?",
    purpose: "Use this lens when the team's win condition depends heavily on one damage dealer being able to survive enemy access and keep dealing damage.",
    values: ["Stable attack windows", "Protection", "Threat interception"],
    accepts: ["Shifting initiation burden into another role"],
    disfavors: ["Unprotected backline access"],
    narrative: "This lens cares most about whether the composition can preserve enough space and protection for its primary damage source to operate."
  }
};

const el = id => document.getElementById(id);
const list = items => `<ul>${items.map(x => `<li>${x}</li>`).join("")}</ul>`;
const card = (title, items) => `<section class="card"><h3>${title}</h3>${list(items)}</section>`;
const portrait = (name, cls = "champion-portrait") => `<img class="${cls}" src="${G.championImage(name)}" alt="${name} champion portrait" loading="lazy" />`;

function selectedName() { return draft[selected.team][selected.role]; }

function updateLinks() {
  const query = G.draftSearch(draft, { slot: `${selected.team}:${selected.role}` });
  el("compare-page-link").href = `compare.html${query}`;
}

function renderDraft() {
  for (const team of ["blue", "red"]) {
    const holder = el(`${team}-team`);
    holder.innerHTML = "";
    Object.entries(draft[team]).forEach(([role, pick]) => {
      const b = document.createElement("button");
      b.className = `slot ${selected.team === team && selected.role === role ? "selected" : ""}`;
      b.innerHTML = `${portrait(pick, "slot-portrait")}<span class="slot-copy"><span class="role">${G.ROLE_LABEL[role]}</span><span class="pick">${pick}</span></span>`;
      b.addEventListener("click", () => {
        selected = { team, role };
        activeView = "structure";
        document.querySelectorAll(".tab").forEach(x => x.classList.toggle("active", x.dataset.view === activeView));
        renderDraft();
        renderMain();
      });
      holder.appendChild(b);
    });
  }
  updateLinks();
}

function contextualExtras() {
  const evaln = G.globalEvaluation(draft);
  const own = evaln.derived[selected.team].statements;
  return own.filter(x => {
    const n = selectedName();
    return x.includes(n) ||
      (n === "Jinx" && x.includes("Jinx")) ||
      (n === "Orianna" && x.includes("Orianna")) ||
      (n === "Kai'Sa" && x.includes("Kai'Sa")) ||
      (["Ornn", "Jarvan IV", "Nautilus", "Sejuani", "Vi", "Rakan"].includes(n) && x.includes("initiation"));
  });
}

function renderStructure() {
  const name = selectedName();
  const s = G.CHAMPIONS[name];
  const compareHref = `compare.html${G.draftSearch(draft, { slot: `${selected.team}:${selected.role}` })}`;
  const consequences = contextualExtras();
  const consequenceBody = consequences.length
    ? list(consequences)
    : `<p class="note">No high-salience global consequence is currently derived for this choice. The section remains visible because system-level consequences are a primary output.</p>`;
  return `
    <div class="hero">
      <div class="champion-hero">
        ${portrait(name, "hero-portrait")}
        <div>
          <div class="eyebrow">Choice structure</div>
          <h2>${name}</h2>
          <div class="meta">${selected.team.toUpperCase()} · ${G.ROLE_LABEL[selected.role]}</div>
        </div>
      </div>
      <a class="action-link" href="${compareHref}">Compare alternatives for this slot →</a>
    </div>

    <section class="global-consequences">
      <div class="section-heading"><h3>Global consequences</h3><span>what this choice changes elsewhere in the 10-pick graph</span></div>
      <div class="global-consequence-body">${consequenceBody}</div>
    </section>

    <div class="section-gap"></div>
    <div class="grid">
      ${card("Gives", s.gives)}
      ${card("Needs", s.needs)}
      ${card("Unlocks", s.unlocks)}
      ${card("Exposes", s.exposes)}
      ${card("Costs", s.costs)}
      ${card("Player", s.player)}
      ${card("Can change", s.change)}
      ${card("Downstream", s.downstream)}
    </div>`;
}

function championUsedElsewhere(name, currentTeam, currentRole) {
  return ["blue", "red"].some(team =>
    Object.entries(draft[team]).some(([role, pick]) =>
      pick === name && !(team === currentTeam && role === currentRole)
    )
  );
}

function renderOverview() {
  const selectors = ["blue", "red"].map(team => `
    <section class="draft-editor-team">
      <h3>${team.toUpperCase()}</h3>
      ${Object.entries(draft[team]).map(([role, pick]) => `
        <label class="draft-editor-row">
          ${portrait(pick, "editor-portrait")}
          <span class="editor-role">${G.ROLE_LABEL[role]}</span>
          <select data-draft-team="${team}" data-draft-role="${role}" aria-label="${team} ${G.ROLE_LABEL[role]} champion">
            ${G.ROLE_POOLS[role].map(name => {
              const unavailable = championUsedElsewhere(name, team, role);
              return `<option value="${name}" ${name === pick ? "selected" : ""} ${unavailable ? "disabled" : ""}>${name}${unavailable ? " — already picked" : ""}</option>`;
            }).join("")}
          </select>
        </label>`).join("")}
    </section>`).join("");

  return `
    <div class="hero"><div><div class="eyebrow">Draft setup</div><h2>Choose the 10-pick draft</h2><div class="meta">This is the baseline graph used by both analysis and comparison. Each champion can appear only once in the draft.</div></div></div>
    <div class="draft-editor">${selectors}</div>
    <div class="draft-rule"><strong>Unique picks:</strong> once a champion is selected, that champion is disabled in every other slot.</div>
    <div class="callout">Once the 10 picks are set, click any champion in the left rail to inspect that choice. Use <strong>Compare alternatives</strong> as a separate workflow when you want to mutate one slot and query the global delta.</div>`;
}

function renderStrategy() {
  const s = strategies[activeStrategy];
  return `
    <div class="hero"><div><h2>Change the Strategy lens</h2><div class="meta strategy-intro">A strategy lens is just a way of saying <strong>what you care about most</strong> before judging the draft. The champions stay the same, but you ask a different question: “Can we reach them?”, “Can we keep our options open?”, or “Can we keep our carry safe?”</div></div></div>
    <div class="strategy-list">${Object.entries(strategies).map(([id, x]) => `<button class="strategy-btn ${id === activeStrategy ? "active" : ""}" data-strategy="${id}">${x.label}</button>`).join("")}</div>
    <section class="strategy-explainer" aria-live="polite">
      <div class="strategy-explainer-label">Selected strategy</div>
      <h3>${s.title}</h3>
      <p>${s.simple}</p>
      <p><strong>Why use it:</strong> ${s.purpose}</p>
    </section>
    <div class="section-gap"></div>
    <div class="grid">
      ${card("Values", s.values)}
      ${card("Accepts", s.accepts)}
      ${card("Disfavors", s.disfavors)}
      <section class="card"><h3>How it reads this draft</h3><p class="body-copy">${s.narrative}</p></section>
    </div>`;
}

function renderMotifs() {
  const evaln = G.globalEvaluation(draft);
  const all = [
    ...evaln.derived.blue.motifs.map(x => ({ team: "BLUE", text: x })),
    ...evaln.derived.red.motifs.map(x => ({ team: "RED", text: x }))
  ];
  return `
    <div class="hero"><div><div class="eyebrow">Meta / Strategy Engineering</div><h2>Derived structural motifs</h2><div class="meta">These come from graph patterns, not champion labels or aggregate scores.</div></div></div>
    <div class="motifs">${all.map(m => {
      const [name, evidence] = m.text.split(" · ");
      return `<div class="motif"><div class="name">${name}</div><div class="evidence"><strong>${m.team}</strong> · ${evidence || "detected"}</div></div>`;
    }).join("")}</div>
    <div class="layer-map">
      <div class="layer-row"><div class="layer-name">Draft state</div><div class="layer-desc">The 10 selected picks plus temporary availability/resources when the simulator becomes partial-draft aware.</div></div>
      <div class="layer-row"><div class="layer-name">Domain</div><div class="layer-desc">Mechanisms, conditions, affordances, exposures, resource demands, adaptation, propagation.</div></div>
      <div class="layer-row"><div class="layer-name">Actor</div><div class="layer-desc">What this player can and will actually realize.</div></div>
      <div class="layer-row"><div class="layer-name">Strategy</div><div class="layer-desc">What structures and outcomes are preferred.</div></div>
      <div class="layer-row"><div class="layer-name">Meta</div><div class="layer-desc">Dependency, contention, branching, redundancy, bottlenecks, opportunity cost, propagation.</div></div>
    </div>`;
}

function renderNarrative() {
  const name = selectedName();
  const s = G.CHAMPIONS[name];
  const context = contextualExtras();
  const firstContext = context[0] || `${name} changes the composition through the mechanisms and requirements shown in the structural view.`;
  return `
    <div class="hero"><div class="champion-hero">${portrait(name, "hero-portrait")}<div><div class="eyebrow">Narrative projection</div><h2>${name} in this draft</h2><div class="meta">Compressed reasoning; internal graph paths stay hidden.</div></div></div></div>
    <div class="callout"><strong>${name}</strong> contributes ${s.gives.slice(0,2).join(" and ").toLowerCase()}. ${firstContext} The main caveat is ${s.exposes[0].toLowerCase()}.</div>
    <div class="section-gap"></div>
    <section class="card"><h3>Projection contract</h3>${list(["Structural interpretation", "Primary reason", "Main caveat", "Downstream consequence", "What would change the conclusion"])}</section>`;
}

function renderMain() {
  const views = { overview: renderOverview, structure: renderStructure, strategy: renderStrategy, motifs: renderMotifs, narrative: renderNarrative };
  el("main-panel").innerHTML = views[activeView]();
  bindDynamic();
}

function bindDynamic() {
  document.querySelectorAll("[data-draft-team]").forEach(select => select.addEventListener("change", e => {
    const team = e.target.dataset.draftTeam;
    const role = e.target.dataset.draftRole;
    const nextPick = e.target.value;

    // Disabled options prevent this in normal use; keep the guard so the
    // draft state cannot become invalid through a scripted/manual change.
    if (championUsedElsewhere(nextPick, team, role)) {
      renderMain();
      return;
    }

    draft[team][role] = nextPick;
    selected = { team, role };
    renderDraft();
    renderMain();
  }));
  document.querySelectorAll(".strategy-btn").forEach(b => b.addEventListener("click", () => {
    activeStrategy = b.dataset.strategy;
    renderMain();
  }));
}

document.querySelectorAll(".tab").forEach(b => b.addEventListener("click", () => {
  activeView = b.dataset.view;
  document.querySelectorAll(".tab").forEach(x => x.classList.toggle("active", x === b));
  renderMain();
}));

const initialSlot = new URLSearchParams(window.location.search).get("slot");
if (initialSlot && initialSlot.includes(":")) {
  const [team, role] = initialSlot.split(":");
  if (draft[team] && draft[team][role]) selected = { team, role };
}

renderDraft();
renderMain();
