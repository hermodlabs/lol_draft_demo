// Illustrative TypeScript model for a future real implementation.
// This is intentionally smaller than a final schema.

type Team = "blue" | "red";
type Role = "top" | "jungle" | "mid" | "adc" | "support";

type StructuralBucket =
  | "mechanism"
  | "condition"
  | "affordance"
  | "exposure"
  | "resource"
  | "actor"
  | "adaptation"
  | "propagation";

type Relation =
  | "is"
  | "provides"
  | "requires"
  | "enables"
  | "opens_response"
  | "threatens"
  | "consumes"
  | "accepts"
  | "rejects"
  | "modifies"
  | "reduces"
  | "amplifies";

export type Assertion = {
  subject: string;
  relation: Relation;
  object: string;
  bucket: StructuralBucket;
  context?: string[];
};

export type DraftSlot = {
  team: Team;
  role: Role;
  pick: string;
  actor?: string;
};

export type StrategyLens = {
  id: string;
  label: string;
  values: string[];
  accepts: string[];
  disfavors: string[];
};

export type StructuralDelta = {
  added: string[];
  removed: string[];
  strengthened: string[];
  weakened: string[];
  resourceEffects: string[];
  responseEffects: string[];
};

export type NarrativeProjection = {
  conclusion: string;
  gives: string[];
  needs: string[];
  unlocks: string[];
  exposes: string[];
  costs: string[];
  player: string[];
  canChange: string[];
  downstream: string[];
  metaMotifs: string[];
};
