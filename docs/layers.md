# Layers in the draft prototype

## 1. Draft State

The concrete state being analyzed.

For the current full-draft prototype:
- 10 selected champion slots
- team and role ownership

Later partial-draft state can add:
- bans remaining
- pick order
- open champions
- role ambiguity / flexes
- unresolved response branches

Draft State is temporary runtime state, not the persistent ontology.

## 2. Domain / World graph

League-specific mechanisms and relationships.

Examples:
- JARVAN PROVIDES TARGET_ACCESS
- JINX REQUIRES ATTACK_WINDOW
- CAITLYN PUSH PRESSURE REQUIRES LANE_PRIORITY
- LULU PROVIDES CARRY_PROTECTION

User-facing projections:
- Gives
- Needs
- Unlocks
- Exposes
- Costs
- Downstream

## 3. Actor

How a particular player changes realizability.

Examples:
- player proficiency
- matchup acceptance/rejection
- specialist capability
- playstyle tendencies

Actor should modify which World pathways are realistically available; it should not redefine champion mechanics.

## 4. Strategy

What structures/outcomes are preferred.

Examples in the prototype:
- TARGET_ACCESS_FIRST
- DRAFT_OPTIONALITY
- PROTECT_PRIMARY_CARRY

Strategy changes interpretation while the draft graph remains fixed.

## 5. Meta / Strategy Engineering

Domain-independent structural recognition.

Examples:
- DEPENDENCY
- RESOURCE_CONTENTION
- BRANCHING_RESPONSE
- ADAPTATION
- REDUNDANCY
- SPECIALIZATION
- OPPORTUNITY_COST
- BOTTLENECK
- LOCAL_ADVANTAGE_PROPAGATION

These are inferred from graph structure rather than attached to champions.

## 6. Narrative Projection

A safe/compressed explanation generated from the derived graph.

It may expose:
- conclusion / interpretation
- primary reason
- caveat
- downstream consequence
- sensitivity / what would change it

It should not reveal proprietary internal graph topology.

## Comparison operation

Comparison is not a layer. It is an operation over two Draft States:

```text
G_current
    -> mutate one slot
G_alternative
    -> compare
Delta G
```

The comparison page queries both graphs and presents the global structural delta.
