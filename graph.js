const DEFAULT_DRAFT = {
  blue: { top: "Ornn", jungle: "Jarvan IV", mid: "Orianna", adc: "Jinx", support: "Nautilus" },
  red: { top: "Renekton", jungle: "Sejuani", mid: "Syndra", adc: "Kai'Sa", support: "Rakan" }
};

const ROLE_LABEL = { top: "Top", jungle: "Jungle", mid: "Mid", adc: "ADC", support: "Support" };
const TEAM_LABEL = { blue: "Blue", red: "Red" };

const DDRAGON_VERSION = "16.16.1";
const CHAMPION_IMAGE_KEYS = {
  "Ornn":"Ornn", "Renekton":"Renekton", "K'Sante":"KSante", "Jayce":"Jayce",
  "Jarvan IV":"JarvanIV", "Sejuani":"Sejuani", "Vi":"Vi", "Poppy":"Poppy", "Lee Sin":"LeeSin",
  "Orianna":"Orianna", "Syndra":"Syndra", "Twisted Fate":"TwistedFate", "LeBlanc":"Leblanc",
  "Jinx":"Jinx", "Kai'Sa":"Kaisa", "Caitlyn":"Caitlyn", "Kalista":"Kalista",
  "Nautilus":"Nautilus", "Rakan":"Rakan", "Lulu":"Lulu", "Braum":"Braum", "Lux":"Lux"
};

function championImage(name) {
  const key = CHAMPION_IMAGE_KEYS[name] || String(name).replace(/[^A-Za-z0-9]/g, "");
  return `https://ddragon.leagueoflegends.com/cdn/${DDRAGON_VERSION}/img/champion/${key}.png`;
}

const ROLE_POOLS = {
  top: ["Ornn", "Renekton", "K'Sante", "Jayce"],
  jungle: ["Jarvan IV", "Sejuani", "Vi", "Poppy", "Lee Sin"],
  mid: ["Orianna", "Syndra", "Twisted Fate", "LeBlanc"],
  adc: ["Jinx", "Kai'Sa", "Caitlyn", "Kalista"],
  support: ["Nautilus", "Rakan", "Lulu", "Braum", "Lux"]
};

const CHAMPIONS = {
  "Ornn": {
    role: "top",
    gives: ["Frontline", "Long-range initiation", "Durable space creation"],
    needs: ["Allies able to follow engage", "Time to absorb pressure"],
    unlocks: ["Stable backline space", "Layered engage", "Safer carry positioning"],
    exposes: ["Can be bypassed by direct backline access"],
    costs: ["Top slot supplies less early lane pressure than a dedicated pressure pick"],
    player: ["Actor assumptions not specified"],
    change: ["Enemy side-lane pressure", "Top matchup", "Team need for initiation"],
    downstream: ["Reduces carry-space dependency on other roles", "Adds engage redundancy"],
    signals: { engage:1, frontline:1, protection:1, lockdown:1, weakside:1 }
  },
  "Renekton": {
    role: "top",
    gives: ["Early pressure", "Counter-dive", "Short-range target access"],
    needs: ["Access to short-range fights", "Useful early windows"],
    unlocks: ["Weak-side operation", "Early skirmish pressure"],
    exposes: ["Can lose relative value if the draft delays too long"],
    costs: ["Top slot committed toward early pressure rather than maximum scaling"],
    player: ["Actor assumptions not specified"],
    change: ["Lane matchup", "Game pace"],
    downstream: ["Can reduce jungle cover demand on top"],
    signals: { engage:0, frontline:1, protection:0, lockdown:1, targetAccess:1, weakside:1 }
  },
  "K'Sante": {
    role: "top",
    gives: ["Dive resistance", "Frontline", "Weak-side resilience"],
    needs: ["Time to stabilize lane"],
    unlocks: ["Jungle attention reallocation", "Safer weak-side operation"],
    exposes: ["Less long-range initiation than Ornn"],
    costs: ["Lower direct pressure contribution"],
    player: ["Actor assumptions not specified"],
    change: ["Enemy dive profile", "Lane state"],
    downstream: ["Can free jungle attention for another lane"],
    signals: { frontline:1, protection:1, weakside:1 }
  },
  "Jayce": {
    role: "top",
    gives: ["Lane pressure", "Range pressure", "Poke"],
    needs: ["Priority", "Cover against punish windows"],
    unlocks: ["Early tower pressure", "Poke-based objective setup"],
    exposes: ["Punishment when isolated or denied push"],
    costs: ["Can demand jungle attention to preserve pressure"],
    player: ["Actor assumptions not specified"],
    change: ["Jungle pathing", "Lane matchup"],
    downstream: ["May compete with another pushing lane for jungle attention"],
    signals: { lanePriorityDemand:1, poke:1, rangePressure:1, jungleAttentionDemand:1 }
  },
  "Jarvan IV": {
    role: "jungle",
    gives: ["Forced engage", "Direct target access", "Backline pressure"],
    needs: ["Follow-up after commitment", "A tolerable response matchup", "Enough survivability to finish the entry"],
    unlocks: ["Orianna delivery", "Access to low-mobility carries", "A second initiation path"],
    exposes: ["Poppy response branch", "Lee Sin response branch", "Counter-engage after commitment"],
    costs: ["Potential jungle protection bans", "Earlier jungle role commitment", "Entry resources in fights"],
    player: ["Blue jungler: high Jarvan proficiency", "Rejects Jarvan vs Poppy", "Accepts Jarvan vs Lee Sin"],
    change: ["Poppy availability", "Lee Sin availability", "Different matchup belief"],
    downstream: ["Creates delivery paths for follow-up", "Can reduce support burden as sole initiator"],
    signals: { engage:1, lockdown:1, targetAccess:1, dive:1, responseExposure:2, banDemand:1 }
  },
  "Sejuani": {
    role: "jungle",
    gives: ["Frontline", "Lockdown", "Fight initiation"],
    needs: ["Follow-up after engage"],
    unlocks: ["Reliable follow-up windows", "Layered frontline"],
    exposes: ["Counter-engage after commitment"],
    costs: ["Jungle slot committed to setup and frontline"],
    player: ["Actor assumptions not specified"],
    change: ["Team follow-up", "Enemy disengage"],
    downstream: ["Raises the value of allied dive follow-up"],
    signals: { engage:1, lockdown:1, frontline:1, protection:1 }
  },
  "Vi": {
    role: "jungle",
    gives: ["Reliable single-target lockdown", "Direct target access", "Committed dive"],
    needs: ["Follow-up after entry", "Enough protection or tempo to survive commitment"],
    unlocks: ["Predictable Orianna delivery", "Focused backline pressure"],
    exposes: ["Counterpressure after committed entry"],
    costs: ["High commitment to one target"],
    player: ["Blue jungler: Vi proficiency not specified"],
    change: ["Enemy peel", "Target mobility"],
    downstream: ["Concentrates team follow-up onto one target"],
    signals: { engage:1, lockdown:1, targetAccess:1, dive:1 }
  },
  "Poppy": {
    role: "jungle",
    gives: ["Anti-dash control", "Frontline", "Disengage"],
    needs: ["Enemy movement patterns she can punish"],
    unlocks: ["Protection against committed access", "Counter-engage"],
    exposes: ["Lower direct access when enemies do not need to dash"],
    costs: ["Jungle slot leans defensive/control"],
    player: ["Actor assumptions not specified"],
    change: ["Enemy mobility profile"],
    downstream: ["Can reduce enemy dive value"],
    signals: { frontline:1, protection:1, disengage:1, antiDive:1 }
  },
  "Lee Sin": {
    role: "jungle",
    gives: ["Early kill pressure", "Mobility", "Backline displacement"],
    needs: ["Execution windows", "Tempo"],
    unlocks: ["Early skirmish branches", "Backline disruption"],
    exposes: ["Execution and scaling dependence"],
    costs: ["High player execution requirement"],
    player: ["Actor assumptions not specified"],
    change: ["Player proficiency", "Early game state"],
    downstream: ["Can convert early pressure into map access"],
    signals: { targetAccess:1, dive:1, earlyPressure:1, specializationDemand:1 }
  },
  "Orianna": {
    role: "mid",
    gives: ["Area follow-up", "Control around committed fights", "Protection"],
    needs: ["A delivery path", "Predictable contact"],
    unlocks: ["High-value follow-up on allied engage"],
    exposes: ["Reduced value when allies cannot enter cleanly"],
    costs: ["Some value depends on composition timing and delivery"],
    player: ["Actor assumptions not specified"],
    change: ["Engage source", "Enemy disengage"],
    downstream: ["Amplifies committed engage", "Can protect a carry attack window"],
    signals: { followup:1, protection:1, areaControl:1, rangePressure:1 }
  },
  "Syndra": {
    role: "mid",
    gives: ["Range pressure", "Burst threat", "Lane control"],
    needs: ["Safe positioning", "Cover in threatening long lanes"],
    unlocks: ["Pressure on shorter-range mids", "Pick threat"],
    exposes: ["Side-lane vulnerability in some matchups"],
    costs: ["May need cover outside lane"],
    player: ["Actor assumptions not specified"],
    change: ["Game phase", "Enemy side-lane threat"],
    downstream: ["Can constrain enemy mid movement"],
    signals: { rangePressure:1, lockdown:1, immobileCarry:1 }
  },
  "Twisted Fate": {
    role: "mid",
    gives: ["Global map access", "Point-and-click setup", "Cross-map pressure"],
    needs: ["Roam access", "Acceptable lane sacrifice", "Safe enough side movement"],
    unlocks: ["Numbers advantages away from mid"],
    exposes: ["Push-based confinement", "Lane counter branches"],
    costs: ["Can trade early lane pressure for map value"],
    player: ["Actor assumptions not specified"],
    change: ["Mid matchup", "Jungle support", "Itemization"],
    downstream: ["Local lane state can propagate into remote numbers advantages"],
    signals: { crossMap:1, lockdown:1, propagation:1 }
  },
  "LeBlanc": {
    role: "mid",
    gives: ["Kill pressure", "Mobility", "Side threat"],
    needs: ["Enough jungle pressure or matchup access to create kill windows"],
    unlocks: ["Pick threat", "Side-lane pressure"],
    exposes: ["Value drops when pressure windows are denied"],
    costs: ["High execution requirement"],
    player: ["Actor assumptions not specified"],
    change: ["Jungle pairing", "Player proficiency"],
    downstream: ["Can convert local kill pressure into map freedom"],
    signals: { targetAccess:1, earlyPressure:1, specializationDemand:1, propagation:1 }
  },
  "Jinx": {
    role: "adc",
    gives: ["Sustained damage", "Reset-driven cleanup", "Backline carry threat"],
    needs: ["Stable attack window", "Protection from dive", "Frontline or lockdown"],
    unlocks: ["High conversion when allies hold targets in place"],
    exposes: ["Mobile engage", "Hard lockdown", "Backline access"],
    costs: ["Team must invest in attack-window creation"],
    player: ["Actor assumptions not specified"],
    change: ["More peel", "Less enemy dive", "Different support pairing"],
    downstream: ["Raises the value of frontline and lockdown", "Makes fight cleanup more valuable"],
    signals: { sustainedDamage:1, immobileCarry:1, carry:1, protectionDemand:1 }
  },
  "Kai'Sa": {
    role: "adc",
    gives: ["Dive follow-up", "Burst conversion", "Target access after setup"],
    needs: ["Allied setup or immobilization"],
    unlocks: ["Fast conversion on isolated targets"],
    exposes: ["Punishment on deep entry"],
    costs: ["Some value depends on reliable setup"],
    player: ["Actor assumptions not specified"],
    change: ["Support and jungle setup"],
    downstream: ["Amplifies allied lockdown value"],
    signals: { dive:1, targetAccess:1, followup:1, carry:1 }
  },
  "Caitlyn": {
    role: "adc",
    gives: ["Range pressure", "Push pressure", "Poke"],
    needs: ["Lane priority", "Support that preserves push"],
    unlocks: ["Tower pressure", "Objective setup through poke"],
    exposes: ["All-in pressure if push control collapses"],
    costs: ["Can demand lane and jungle resources to preserve priority"],
    player: ["Actor assumptions not specified"],
    change: ["Support pairing", "Enemy all-in lane"],
    downstream: ["Can pull jungle pathing toward bot"],
    signals: { lanePriorityDemand:1, rangePressure:1, poke:1, jungleAttentionDemand:1, carry:1 }
  },
  "Kalista": {
    role: "adc",
    gives: ["Early all-in pressure", "Lane priority pressure", "Fight initiation support"],
    needs: ["Early access", "Support coordination"],
    unlocks: ["Aggressive bot-side play", "Early objective control"],
    exposes: ["Value loss if early pressure fails"],
    costs: ["Can demand early bot-side attention"],
    player: ["Actor assumptions not specified"],
    change: ["Support pairing", "Level-one setup"],
    downstream: ["Can pull jungle pathing toward bot"],
    signals: { lanePriorityDemand:1, earlyPressure:1, jungleAttentionDemand:1, carry:1 }
  },
  "Nautilus": {
    role: "support",
    gives: ["Hard lockdown", "Primary or secondary engage", "Frontline contact"],
    needs: ["Follow-up damage", "A safe enough entry timing"],
    unlocks: ["Carry attack windows", "Orianna follow-up", "Layered engage"],
    exposes: ["Commitment can be punished by counter-engage"],
    costs: ["Support slot used on initiation rather than pure protection"],
    player: ["Actor assumptions not specified"],
    change: ["Enemy disengage", "Alternative protection support"],
    downstream: ["Reduces other roles' burden as sole initiator", "Creates direct carry windows"],
    signals: { engage:1, lockdown:1, frontline:1 }
  },
  "Rakan": {
    role: "support",
    gives: ["Mobile engage", "Backline access", "Repositioning"],
    needs: ["Timing and follow-up"],
    unlocks: ["Dive follow-up", "Backline disruption"],
    exposes: ["Counter-engage after deep entry"],
    costs: ["Support slot committed to mobile initiation"],
    player: ["Actor assumptions not specified"],
    change: ["Enemy peel", "Alternative support"],
    downstream: ["Threatens immobile carry attack windows"],
    signals: { engage:1, targetAccess:1, dive:1 }
  },
  "Lulu": {
    role: "support",
    gives: ["Carry protection", "Attack-window protection", "Disengage"],
    needs: ["A carry worth protecting"],
    unlocks: ["More stable front-to-back", "Safer sustained damage"],
    exposes: ["Less direct initiation"],
    costs: ["Support slot contributes less primary engage"],
    player: ["Actor assumptions not specified"],
    change: ["Carry choice", "Enemy dive profile"],
    downstream: ["Shifts initiation burden onto other roles"],
    signals: { protection:2, disengage:1 }
  },
  "Braum": {
    role: "support",
    gives: ["Peel", "Defensive frontline", "Disengage"],
    needs: ["Enemies entering his defensive space"],
    unlocks: ["Backline protection", "Counter-engage"],
    exposes: ["Less proactive long-range engage"],
    costs: ["Support slot leans reactive"],
    player: ["Actor assumptions not specified"],
    change: ["Enemy dive profile"],
    downstream: ["Reduces enemy access value", "Shifts engage burden elsewhere"],
    signals: { protection:2, frontline:1, disengage:1, antiDive:1 }
  },
  "Lux": {
    role: "support",
    gives: ["Range pressure", "Poke", "Pick setup"],
    needs: ["Lane priority", "Safe spacing"],
    unlocks: ["Push-and-poke bot structure"],
    exposes: ["Hard all-in if spacing or priority collapses"],
    costs: ["Can demand bot-side cover to preserve push"],
    player: ["Actor assumptions not specified"],
    change: ["ADC pairing", "Enemy engage lane"],
    downstream: ["Can pull jungle attention toward bot"],
    signals: { lanePriorityDemand:1, rangePressure:1, poke:1, jungleAttentionDemand:1, lockdown:1 }
  }
};

const PARAMS = {
  "blue:top":"bt", "blue:jungle":"bj", "blue:mid":"bm", "blue:adc":"ba", "blue:support":"bs",
  "red:top":"rt", "red:jungle":"rj", "red:mid":"rm", "red:adc":"ra", "red:support":"rs"
};

function cloneDraft(draft) {
  return { blue: { ...draft.blue }, red: { ...draft.red } };
}

function draftFromSearch(search) {
  const out = cloneDraft(DEFAULT_DRAFT);
  const params = new URLSearchParams(search || "");
  Object.entries(PARAMS).forEach(([slot,key]) => {
    const [team,role] = slot.split(":");
    const value = params.get(key);
    if (value && CHAMPIONS[value] && CHAMPIONS[value].role === role) out[team][role] = value;
  });
  return out;
}

function draftSearch(draft, extra = {}) {
  const params = new URLSearchParams();
  Object.entries(PARAMS).forEach(([slot,key]) => {
    const [team,role] = slot.split(":");
    params.set(key, draft[team][role]);
  });
  Object.entries(extra).forEach(([key,value]) => { if (value !== undefined && value !== null && value !== "") params.set(key, value); });
  return `?${params.toString()}`;
}

function signalCounts(draft, team) {
  const counts = {};
  Object.values(draft[team]).forEach(name => {
    const signals = CHAMPIONS[name]?.signals || {};
    Object.entries(signals).forEach(([key,value]) => counts[key] = (counts[key] || 0) + value);
  });
  return counts;
}

function teamNames(draft, team) { return Object.values(draft[team]); }
function otherTeam(team) { return team === "blue" ? "red" : "blue"; }

function providersForSignal(draft, team, signal) {
  return Object.values(draft[team]).filter(name => (CHAMPIONS[name]?.signals?.[signal] || 0) > 0);
}

function joinNames(names) {
  if (!names.length) return "none modeled";
  if (names.length === 1) return names[0];
  if (names.length === 2) return `${names[0]} and ${names[1]}`;
  return `${names.slice(0, -1).join(", ")}, and ${names[names.length - 1]}`;
}

function derivedStatements(draft, team) {
  const names = teamNames(draft, team);
  const statements = [];
  const motifs = [];

  const engageProviders = providersForSignal(draft, team, "engage");
  if (engageProviders.length >= 2) {
    statements.push(`${TEAM_LABEL[team]} has multiple initiation routes through ${joinNames(engageProviders)}.`);
    motifs.push(`REDUNDANCY · initiation can come from ${joinNames(engageProviders)}`);
  } else if (engageProviders.length === 1) {
    statements.push(`${TEAM_LABEL[team]} initiation is concentrated in ${engageProviders[0]}.`);
    motifs.push(`BOTTLENECK · primary initiation is concentrated in ${engageProviders[0]}`);
  }

  if (names.includes("Jinx")) {
    const attackWindowProviders = [...new Set([
      ...providersForSignal(draft, team, "lockdown"),
      ...providersForSignal(draft, team, "frontline"),
      ...providersForSignal(draft, team, "protection")
    ])].filter(x => x !== "Jinx");
    statements.push(`Jinx's attack window is supported by ${joinNames(attackWindowProviders)} through lockdown, frontline, or protection.`);
    motifs.push("DEPENDENCY · Jinx conversion depends on attack-window support");
    if (attackWindowProviders.length >= 3) motifs.push("REDUNDANCY · Jinx's attack-window dependency has multiple supporting picks");
  }

  if (names.includes("Orianna")) {
    const deliveryProviders = [...new Set([
      ...providersForSignal(draft, team, "engage"),
      ...providersForSignal(draft, team, "dive")
    ])].filter(x => x !== "Orianna");
    if (deliveryProviders.length) statements.push(`Orianna can be delivered into fights by ${joinNames(deliveryProviders)}.`);
    else {
      statements.push("Orianna has no modeled allied engage or dive source to act as a delivery path.");
      motifs.push("BOTTLENECK · Orianna lacks a modeled delivery path");
    }
  }

  if (names.includes("Kai'Sa")) {
    const setupProviders = providersForSignal(draft, team, "lockdown").filter(x => x !== "Kai'Sa");
    statements.push(`Kai'Sa can follow allied lockdown from ${joinNames(setupProviders)}.`);
    motifs.push("DEPENDENCY · Kai'Sa follow-up depends on allied setup");
  }

  const pressureProviders = [...new Set([
    ...providersForSignal(draft, team, "lanePriorityDemand"),
    ...providersForSignal(draft, team, "jungleAttentionDemand")
  ])];
  if (pressureProviders.length >= 2) {
    statements.push(`${TEAM_LABEL[team]} has competing lane-pressure demands from ${joinNames(pressureProviders)}, which can pull jungle attention in different directions.`);
    motifs.push(`RESOURCE_CONTENTION · ${joinNames(pressureProviders)} can compete for jungle attention`);
    motifs.push("OPPORTUNITY_COST · covering one pressure lane can leave another exposed");
  }
  const weaksideProviders = providersForSignal(draft, team, "weakside");
  if (weaksideProviders.length && pressureProviders.length) {
    statements.push(`${joinNames(weaksideProviders)} can operate with lower cover demand, giving the jungler more freedom to support another pressure lane.`);
  }

  const enemyAccessProviders = [...new Set([
    ...providersForSignal(draft, otherTeam(team), "targetAccess"),
    ...providersForSignal(draft, otherTeam(team), "dive"),
    ...providersForSignal(draft, otherTeam(team), "engage")
  ])];
  const immobileCarries = providersForSignal(draft, team, "immobileCarry");
  if (immobileCarries.length && enemyAccessProviders.length >= 2) {
    statements.push(`${joinNames(immobileCarries)} ${immobileCarries.length === 1 ? "faces" : "face"} access or engage pressure from ${joinNames(enemyAccessProviders)}.`);
    motifs.push("DEPENDENCY · carry output depends on surviving enemy access");
  }

  const accessProviders = providersForSignal(draft, team, "targetAccess");
  const enemyProtection = [...new Set([
    ...providersForSignal(draft, otherTeam(team), "protection"),
    ...providersForSignal(draft, otherTeam(team), "disengage")
  ])];
  if (accessProviders.length && enemyProtection.length) {
    statements.push(`${joinNames(accessProviders)} ${accessProviders.length === 1 ? "provides" : "provide"} target access, but ${joinNames(enemyProtection)} can protect or disengage against that access.`);
  }

  const propagationProviders = [...new Set([
    ...providersForSignal(draft, team, "propagation"),
    ...providersForSignal(draft, team, "crossMap")
  ])];
  if (propagationProviders.length) {
    statements.push(`${joinNames(propagationProviders)} can convert local pressure into access elsewhere on the map.`);
    motifs.push(`LOCAL_ADVANTAGE_PROPAGATION · ${joinNames(propagationProviders)} can turn local pressure into remote advantage`);
  }

  const responseProviders = providersForSignal(draft, team, "responseExposure");
  if (responseProviders.length) motifs.push(`BRANCHING_RESPONSE · ${joinNames(responseProviders)} open explicit opponent response branches`);

  return { statements, motifs: [...new Set(motifs)] };
}


const STRATEGY_LENSES = {
  target_access_first: {
    label: "TARGET_ACCESS_FIRST",
    short: "Get onto the targets that matter"
  },
  draft_optionality: {
    label: "DRAFT_OPTIONALITY",
    short: "Keep good choices open"
  },
  protect_carry: {
    label: "PROTECT_PRIMARY_CARRY",
    short: "Keep the main damage dealer safe"
  }
};

function strategyConsequences(draft, team, strategyId, focusName = null) {
  const strategy = STRATEGY_LENSES[strategyId] ? strategyId : "target_access_first";
  const own = team;
  const enemy = otherTeam(team);
  const focus = focusName && CHAMPIONS[focusName] ? CHAMPIONS[focusName] : null;
  const out = [];

  const ownAccess = [...new Set([
    ...providersForSignal(draft, own, "targetAccess"),
    ...providersForSignal(draft, own, "dive"),
    ...providersForSignal(draft, own, "engage")
  ])];
  const enemyImmobile = providersForSignal(draft, enemy, "immobileCarry");
  const enemyDefense = [...new Set([
    ...providersForSignal(draft, enemy, "protection"),
    ...providersForSignal(draft, enemy, "disengage"),
    ...providersForSignal(draft, enemy, "antiDive")
  ])];
  const engageProviders = providersForSignal(draft, own, "engage");
  const responseProviders = providersForSignal(draft, own, "responseExposure");
  const banDemandProviders = providersForSignal(draft, own, "banDemand");
  const pressureProviders = [...new Set([
    ...providersForSignal(draft, own, "lanePriorityDemand"),
    ...providersForSignal(draft, own, "jungleAttentionDemand")
  ])];
  const weaksideProviders = providersForSignal(draft, own, "weakside");
  const carries = providersForSignal(draft, own, "carry");
  const protectionProviders = [...new Set([
    ...providersForSignal(draft, own, "protection"),
    ...providersForSignal(draft, own, "frontline"),
    ...providersForSignal(draft, own, "lockdown"),
    ...providersForSignal(draft, own, "disengage")
  ])];
  const enemyAccess = [...new Set([
    ...providersForSignal(draft, enemy, "targetAccess"),
    ...providersForSignal(draft, enemy, "dive"),
    ...providersForSignal(draft, enemy, "engage")
  ])];

  if (strategy === "target_access_first") {
    if (focus) {
      const contributesAccess = ["targetAccess", "dive", "engage"].some(sig => (focus.signals?.[sig] || 0) > 0);
      if (contributesAccess) {
        out.push(`${focusName} directly contributes to ${TEAM_LABEL[team]}'s ability to start contact or reach priority targets.`);
      } else {
        out.push(`${focusName} does not add a direct access route, so this lens makes ${joinNames(ownAccess.filter(x => x !== focusName))} more important for reaching priority targets.`);
      }
    }
    if (enemyImmobile.length && ownAccess.length) {
      out.push(`${joinNames(ownAccess)} can pressure the low-mobility carries ${joinNames(enemyImmobile)}; this is the main structure this lens rewards.`);
    }
    if (enemyDefense.length && ownAccess.length) {
      out.push(`${joinNames(enemyDefense)} can protect or disengage against that access, so reaching the target is not the same as converting the fight.`);
    }
    if (engageProviders.length === 1) {
      out.push(`${engageProviders[0]} is the only modeled initiation source, making target access fragile if that route is denied.`);
    } else if (engageProviders.length >= 2) {
      out.push(`Initiation can come from ${joinNames(engageProviders)}, so the team has more than one way to begin the target-access sequence.`);
    }
  }

  if (strategy === "draft_optionality") {
    if (focus && (focus.signals?.responseExposure || 0) > 0) {
      out.push(`${focusName} opens explicit opponent response branches; this lens treats those new branches as a flexibility cost.`);
    } else if (focus) {
      out.push(`${focusName} does not add an explicit modeled counter-response branch, which preserves more response freedom under this lens.`);
    }
    if (banDemandProviders.length) {
      out.push(`${joinNames(banDemandProviders)} can create protection-ban demand, which can consume draft resources that could have been spent on other roles.`);
    }
    if (responseProviders.length) {
      out.push(`The opponent gains explicit response branches against ${joinNames(responseProviders)}; optionality falls when those branches must be covered with bans or later picks.`);
    }
    if (pressureProviders.length >= 2) {
      out.push(`${joinNames(pressureProviders)} can demand jungle attention at the same time, reducing freedom over where early resources can be allocated.`);
    }
    if (weaksideProviders.length && pressureProviders.length) {
      out.push(`${joinNames(weaksideProviders)} can absorb lower cover, preserving jungle allocation flexibility for the rest of the map.`);
    }
  }

  if (strategy === "protect_carry") {
    if (carries.length) {
      out.push(`This lens treats ${joinNames(carries)} as the ${carries.length === 1 ? "damage source" : "damage sources"} whose safe operating window matters most.`);
    }
    if (focus) {
      const contributesProtection = ["protection", "frontline", "lockdown", "disengage", "antiDive"].some(sig => (focus.signals?.[sig] || 0) > 0);
      if (contributesProtection) {
        out.push(`${focusName} contributes directly to protecting or stabilizing the carry's attack window.`);
      } else {
        out.push(`${focusName} does not directly add protection, so the carry remains more dependent on ${joinNames(protectionProviders.filter(x => x !== focusName))}.`);
      }
    }
    if (protectionProviders.length) {
      out.push(`Protection and space for the backline can come from ${joinNames(protectionProviders)}.`);
    }
    if (enemyAccess.length && carries.length) {
      out.push(`${joinNames(enemyAccess)} can reach or engage onto ${joinNames(carries)}, so this lens treats surviving that access as a central draft problem.`);
    }
    if (teamNames(draft, own).includes("Jinx")) {
      const attackWindowProviders = [...new Set([
        ...providersForSignal(draft, own, "lockdown"),
        ...providersForSignal(draft, own, "frontline"),
        ...providersForSignal(draft, own, "protection")
      ])].filter(x => x !== "Jinx");
      out.push(`Jinx's stable attack window is supported by ${joinNames(attackWindowProviders)}.`);
    }
  }

  return [...new Set(out)].filter(Boolean);
}

function globalEvaluation(draft) {
  const blueCounts = signalCounts(draft, "blue");
  const redCounts = signalCounts(draft, "red");
  const blue = derivedStatements(draft, "blue");
  const red = derivedStatements(draft, "red");
  return { counts: { blue: blueCounts, red: redCounts }, derived: { blue, red } };
}

const METRIC_LABELS = {
  engage: "Initiation sources",
  lockdown: "Lockdown sources",
  frontline: "Frontline sources",
  protection: "Protection sources",
  targetAccess: "Target-access sources",
  dive: "Dive sources",
  rangePressure: "Range-pressure sources",
  lanePriorityDemand: "Lane-priority demands",
  jungleAttentionDemand: "Jungle-attention demands",
  weakside: "Weak-side relief sources",
  responseExposure: "Explicit response branches"
};

function diffSet(before, after) {
  const b = new Set(before);
  const a = new Set(after);
  return {
    added: after.filter(x => !b.has(x)),
    removed: before.filter(x => !a.has(x)),
    unchanged: after.filter(x => b.has(x))
  };
}

const SOURCE_LABELS = {
  engage: "Initiation",
  lockdown: "Lockdown",
  frontline: "Frontline",
  protection: "Protection",
  targetAccess: "Target access",
  dive: "Dive",
  rangePressure: "Range pressure",
  lanePriorityDemand: "Lane-priority demand",
  jungleAttentionDemand: "Jungle-attention demand",
  weakside: "Weak-side relief"
};

function structuralSourceChanges(beforeDraft, afterDraft, team) {
  return Object.entries(SOURCE_LABELS).map(([key, label]) => {
    const before = providersForSignal(beforeDraft, team, key);
    const after = providersForSignal(afterDraft, team, key);
    const diff = diffSet(before, after);
    return { key, label, before, after, ...diff };
  }).filter(x => x.added.length || x.removed.length);
}

function compareDrafts(beforeDraft, afterDraft, changedSlot, strategyId = "target_access_first") {
  const [team, role] = changedSlot.split(":");
  const beforeName = beforeDraft[team][role];
  const afterName = afterDraft[team][role];
  const beforeProfile = CHAMPIONS[beforeName];
  const afterProfile = CHAMPIONS[afterName];
  const beforeEval = globalEvaluation(beforeDraft);
  const afterEval = globalEvaluation(afterDraft);

  const categoryDiffs = {};
  ["gives", "needs", "unlocks", "exposes", "costs", "player", "change", "downstream"].forEach(key => {
    categoryDiffs[key] = diffSet(beforeProfile[key] || [], afterProfile[key] || []);
  });

  const metricChanges = [];
  Object.keys(METRIC_LABELS).forEach(key => {
    const before = beforeEval.counts[team][key] || 0;
    const after = afterEval.counts[team][key] || 0;
    if (before !== after) metricChanges.push({ key, label: METRIC_LABELS[key], before, after });
  });

  const ownDerived = diffSet(beforeEval.derived[team].statements, afterEval.derived[team].statements);
  const enemyDerived = diffSet(beforeEval.derived[otherTeam(team)].statements, afterEval.derived[otherTeam(team)].statements);
  const ownMotifs = diffSet(beforeEval.derived[team].motifs, afterEval.derived[team].motifs);
  const enemyMotifs = diffSet(beforeEval.derived[otherTeam(team)].motifs, afterEval.derived[otherTeam(team)].motifs);
  const strategyGlobalChanges = diffSet(
    strategyConsequences(beforeDraft, team, strategyId, beforeName),
    strategyConsequences(afterDraft, team, strategyId, afterName)
  );

  return {
    team, role, beforeName, afterName,
    categoryDiffs,
    sourceChanges: structuralSourceChanges(beforeDraft, afterDraft, team),
    metricChanges,
    globalChanges: {
      added: [...ownDerived.added, ...enemyDerived.added],
      removed: [...ownDerived.removed, ...enemyDerived.removed],
      unchanged: [...ownDerived.unchanged, ...enemyDerived.unchanged]
    },
    strategyId,
    strategyGlobalChanges,
    motifChanges: {
      added: [...ownMotifs.added, ...enemyMotifs.added],
      removed: [...ownMotifs.removed, ...enemyMotifs.removed],
      unchanged: [...ownMotifs.unchanged, ...enemyMotifs.unchanged]
    }
  };
}

window.HermodGraph = {
  DEFAULT_DRAFT, ROLE_LABEL, TEAM_LABEL, ROLE_POOLS, CHAMPIONS,
  cloneDraft, draftFromSearch, draftSearch, signalCounts, globalEvaluation, compareDrafts,
  championImage, providersForSignal, structuralSourceChanges, strategyConsequences, STRATEGY_LENSES
};
