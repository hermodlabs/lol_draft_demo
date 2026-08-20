# Strategy Engineering motifs in this demo

## DEPENDENCY
Pattern: A REQUIRES X

League example:

- JINX_DAMAGE REQUIRES ATTACK_WINDOW

## RESOURCE_CONTENTION
Pattern: two demands consume the same limited resource

League example:

- TOP_COVER CONSUMES JUNGLE_ATTENTION
- BOT_COVER CONSUMES JUNGLE_ATTENTION

## BRANCHING_RESPONSE
Pattern: an action opens multiple relevant responses

League example:

- PICK_JARVAN OPENS_RESPONSE POPPY
- PICK_JARVAN OPENS_RESPONSE LEE_SIN

## ADAPTATION
Pattern: a changed behavior or build changes an existing relationship

League example:

- OLAF_ITEMIZATION MODIFIES OLAF_VS_LEE_SIN

## REDUNDANCY
Pattern: multiple independent mechanisms satisfy the same condition / affordance

League example:

- ORNN_ENGAGE ENABLES ATTACK_WINDOW
- NAUTILUS_LOCKDOWN ENABLES ATTACK_WINDOW

## SPECIALIZATION
Pattern: a useful response exists but is concentrated in one actor

League example:

- SPECIALIST_PROFICIENCY ENABLES DARIUS_RESPONSE

## OPPORTUNITY_COST
Pattern: using a scarce resource for A prevents its use for B

League example:

- BAN_POPPY CONSUMES BAN_SLOT
- SUPPORT_CONTROL ALSO_CONSUMES BAN_SLOT

## BOTTLENECK
Pattern: many high-value paths require the same condition

League example:

- multiple damage / conversion paths depend on ATTACK_WINDOW

## LOCAL_ADVANTAGE_PROPAGATION
Pattern: a local state creates access that creates remote advantage

League example:

- MID_PUSH ENABLES FOG_ACCESS
- FOG_ACCESS ENABLES CROSS_MAP_ACCESS
- CROSS_MAP_ACCESS ENABLES NUMBERS_ADVANTAGE
