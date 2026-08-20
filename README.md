# Hermod Draft Structure Demo — Explicit UI

A static prototype illustrating a graph-first UX for League draft analysis.

## Open it

Open `index.html` directly in a browser. No build step or server is required.

Champion portraits are loaded from Riot Games Data Dragon, so the browser needs internet access for the images. The reasoning/data in the prototype remains local.

## What changed in this version

- Champion portraits appear in the 10-pick rail, draft setup, selected-choice header, and alternative comparison preview.
- The comparison page no longer presents structural changes as aggregate counts such as `3 → 2`.
- Instead it names the actual sources that enter, leave, or remain in each structural role.
- Example:

```text
Frontline
− Nautilus no longer supplies frontline.
Still supplied by: Ornn
```

- Global consequences are also phrased with named champions/pathways instead of source totals.
- `+` and `−` continue to mean graph delta only, not strategic desirability.

## Primary workflow

### 1. Draft analysis (`index.html`)

1. Use **Draft setup** to choose the 10 champions.
2. Click any champion in the left rail.
3. Inspect **Global consequences** first.
4. Inspect what the choice **Gives / Needs / Unlocks / Exposes / Costs**, plus Actor/Context and downstream consequences.
5. Optionally inspect Strategy, Meta motifs, or Narrative. The Strategy Lens now explains each approach in plain language, including what it means and why you would use it.
6. Click **Compare alternatives for this slot** or the top-level **Compare alternatives** page link.

### 2. Compare alternatives (`compare.html`)

1. Start from the same completed 10-pick draft.
2. Choose any one of the 10 slots.
3. Choose an alternative champion for that role.
4. The current and alternative champion portraits are shown side-by-side.
5. Click **Query changed graph**.
6. Review:
   - Global consequences
   - Structural sources changed, with the champion names that were added/removed/preserved
   - Gives / Needs / Unlocks / Exposes / Costs / Player / Can change / Downstream
   - Strategy Engineering motif changes

There is intentionally no separate self/ally/enemy comparison mode. Every slot is simply a node owned by a team and role.

## Important product thesis

The champion is an entry point into the graph, not the ontology center.

The comparison primitive is:

```text
G_current -> replace one slot -> G_alternative -> Delta G
```

The UI avoids overall draft scores and pseudo-quantitative source totals. It tells the user **which structural source changed and who supplies it**.

## Files

- `index.html` — Draft Analysis page
- `compare.html` — separate Compare Alternatives page
- `graph.js` — shared prototype graph/model/query logic
- `app.js` — analysis-page interaction
- `compare.js` — comparison-page interaction
- `styles.css` — shared styling
- `ontology/assertions.txt` — concrete pre-schema assertions
- `src/model.ts` — lightweight TypeScript direction
- `docs/layers.md` — conceptual layers
- `docs/presentation-states.md` — page/state architecture
- `docs/strategy-engineering-motifs.md` — Meta motif mapping
- `docs/grounding-notes.md` — transcript-grounding notes

## Asset note

Champion portraits use Riot Games Data Dragon square champion assets. This prototype is not endorsed by Riot Games.


## Interaction fix

- Alternative pick changes rerender immediately; no extra query click is required.


## Strategy lens state and consequences

The Strategy Lens is application state, not a one-tab decoration. Selecting a lens now:

- persists while switching among Draft setup, Choice structure, Meta motifs, and Narrative;
- persists when navigating to Compare alternatives and back;
- is encoded in the URL and mirrored in local browser storage;
- is shown outside the Strategy Lens page as an **Active strategy** indicator; and
- changes the Global Consequences interpretation.

The same graph can therefore produce different high-salience consequences under `TARGET_ACCESS_FIRST`, `DRAFT_OPTIONALITY`, and `PROTECT_PRIMARY_CARRY`. The underlying domain facts and structural motifs do not change merely because the strategy changes; the strategy changes which consequences matter and how they are interpreted.
