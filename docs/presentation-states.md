# Presentation states and page architecture

The prototype separates **analysis** from **comparison**. Analysis asks what the current graph means; comparison asks what happens when one node is replaced.

## Page A — Draft Analysis

### State A1 — Draft Setup

Purpose: define the baseline 10-pick draft.

Visible:
- Blue 5 picks with champion portraits
- Red 5 picks with champion portraits
- role-specific candidate selectors

Primary action: set the 10 champions.

### State A2 — Choice Structure

Purpose: answer **what structural consequences does this selected choice introduce in this draft?**

The user clicks a champion portrait/name in the 10-pick rail.

Presentation order:
1. Selected champion portrait + role
2. **Global consequences** — always visible
3. Gives
4. Needs
5. Unlocks
6. Exposes
7. Costs
8. Player
9. Can change
10. Downstream

A contextual CTA deep-links to the separate comparison page with that slot preloaded.

### State A3 — Strategy Lens

Purpose: explain, in plain language, what the user wants the draft to accomplish before judging it. The champions stay the same; the lens changes which kinds of structure matter most.

The page introduces the concept with simple questions such as:
- Can we reliably reach the targets that matter?
- Can we keep good draft choices open?
- Can we keep our main damage dealer safe?

Each selectable lens includes a description of what it means and why a user would choose it:
- TARGET_ACCESS_FIRST
- DRAFT_OPTIONALITY
- PROTECT_PRIMARY_CARRY

### State A4 — Meta Motifs

Purpose: ontology/expert debugging.

Shows inferred Strategy Engineering motifs such as Dependency, Redundancy, Resource Contention, Bottleneck, Branching Response, and Local Advantage Propagation.

### State A5 — Narrative Projection

Purpose: show a compressed user-facing explanation without exposing internal graph topology.

---

## Page B — Compare Alternatives

### State B1 — Choose mutation

The completed 10-pick draft is shown as the baseline with champion portraits.

The user chooses **any of the 10 slots**, then chooses an alternative pick for that role.

The interface explicitly shows:

```text
[current champion portrait + name]
                →
[alternative champion portrait + name]
```

### State B2 — Query changed graph

The system creates:

```text
G_current
    -> replace one slot
G_alternative
```

Then it re-evaluates both graphs.

### State B3 — Explicit global delta

Presentation order:

1. **Global consequences**
   - composition-wide statements that appear/disappear after the mutation
   - phrased using named champions/pathways rather than numeric source totals

2. **Structural sources changed**
   - no `3 → 2` or similar aggregate counts
   - each structural role names who entered, left, and remains

Example:

```text
INITIATION
− Nautilus no longer supplies initiation.
Still supplied by: Ornn, Jarvan IV
```

or:

```text
PROTECTION
+ Lulu now supplies protection.
− Nautilus no longer supplies protection.
Still supplied by: Ornn, Orianna
```

3. **Where the change belongs**
   - Gives / Needs / Unlocks / Exposes / Costs / Player / Can change / Downstream
   - `+` introduced/increased
   - `−` removed/decreased
   - no symbol preserved

4. **Strategy Engineering motif delta**
   - motifs introduced or removed by the graph mutation

`+` and `−` never mean good/bad. Strategy decides desirability later.


## Persistent strategy state

The selected Strategy Lens persists across presentation states and across the Analysis / Compare Alternatives page boundary. All views may display the active strategy context, while Global Consequences must be generated through that lens. Strategy changes interpretation/relevance; it does not mutate the underlying World/domain graph.
