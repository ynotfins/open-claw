// Sparky Governance Schema
// Defines all structured types for the governing decision engine.
// Every type here has a corresponding governance concept in OPERATING_RULES.md or APPROVAL_GATES.md.

// ─── Core Enumerations ───────────────────────────────────────────────────────

export type TaskType =
  | "task_routing"
  | "pr_governance"
  | "merge_gate"
  | "release_gate"
  | "quality_enforcement"
  | "evidence_validation"
  | "drift_audit"
  | "hotfix_emergency"
  | "incident_coordination"
  | "escalation_management"
  | "anti_pattern_detection"
  | "context_recovery";

export type SparkyDecisionOutcome =
  | "ALLOW"
  | "BLOCK"
  | "ESCALATE"
  | "DEFER"
  | "REQUIRE_MORE_EVIDENCE";

export type SparkyRiskLevel = "low" | "medium" | "high" | "critical";

export type SparkyTrustLevel = "T0" | "T1" | "T2" | "T3" | "T4";

export type SparkyState =
  | "pending"
  | "in_review"
  | "blocked"
  | "approved"
  | "released"
  | "rolled_back";

export type WorkType =
  | "code"
  | "review"
  | "architecture"
  | "infrastructure"
  | "release"
  | "incident"
  | "documentation"
  | "mixed";

export type SystemSurface =
  | "UI"
  | "API"
  | "data"
  | "infra"
  | "workflow"
  | "governance"
  | "multi-surface";

export type ChangePosture =
  | "additive"
  | "corrective"
  | "refactor"
  | "migration"
  | "rollback"
  | "hotfix";

export type EvidenceType =
  | "test"
  | "log"
  | "diff"
  | "qa"
  | "review"
  | "runtime"
  | "rollback"
  | "ownership"
  | "spec"
  | "retrieval";

export type EvidenceQuality = "strong" | "sufficient" | "partial" | "weak" | "absent";

export type DriftType = "spec" | "code" | "behavior" | "governance";

export type DriftSeverity = "critical" | "high" | "medium" | "low";

export type GateStage =
  | "intake"
  | "routing"
  | "review"
  | "merge"
  | "release";

export type GateStatus = "pass" | "fail" | "not_applicable" | "pending_evaluation";

export type AntiPatternCode =
  | "AP-01" // Approval by Narrative
  | "AP-02" // Approval by Reputation
  | "AP-03" // Gate Bypass via Urgency
  | "AP-04" // Evidence Laundering
  | "AP-05" // Scope Inflation During Review
  | "AP-06" // Rollback Waiver by Omission
  | "AP-07" // Self-Certification Outside Allowed Boundaries
  | "AP-08" // Drift Tolerance by Inertia
  | "AP-09" // Confidence Assertion as Evidence
  | "AP-10" // Sparky Performing Specialist Work to Avoid Routing
  | "AP-11" // Undocumented Exception Becoming De Facto Policy
  | "AP-12"; // Closing a Block Without Meeting Block Conditions

export type EscalationState = "OPEN" | "ROUTED" | "RESOLVED" | "CLOSED" | "UNRESOLVED" | "SUPERSEDED";

export type IncidentSeverity = "SEV-1" | "SEV-2" | "SEV-3";

export type ControlLoopStep =
  | "INPUT"
  | "CLASSIFY"
  | "ROUTE"
  | "EVALUATE"
  | "DECIDE"
  | "ENFORCE"
  | "RECORD";

export type SourceTier = "T1" | "T2" | "T3" | "T4" | "T5" | "T6" | "T7" | "T8" | "T9" | "T10" | "T11";

// ─── Evidence Objects ─────────────────────────────────────────────────────────

export interface EvidenceArtifact {
  evidenceId: string;
  type: EvidenceType;
  source: string;
  sourceTier: SourceTier;
  timestamp: string;
  versionAnchor: string | null;
  relevance: string;
  supportsClaim: string;
  quality: EvidenceQuality;
  artifactRef: string;
  isStale: boolean;
}

export interface EvidenceSummary {
  totalArtifacts: number;
  byQuality: Record<EvidenceQuality, number>;
  aggregateQuality: EvidenceQuality;
  staleSources: string[];
  unsupportedClaims: string[];
}

// ─── Provenance Objects ───────────────────────────────────────────────────────

export interface ProvenanceRecord {
  decisionId: string;
  workItemId: string;
  timestamp: string;
  decisionOutcome: SparkyDecisionOutcome;
  evidenceBasis: EvidenceArtifact[];
  trustLevelApplied: SparkyTrustLevel;
  trustLevelBasis: string;
  applyingRules: string[];
  controlLoopStepsCompleted: ControlLoopStep[];
  issuer: string;
}

// ─── Classification Objects ───────────────────────────────────────────────────

export interface SparkyClassification {
  workType: WorkType;
  riskLevel: SparkyRiskLevel;
  systemSurface: SystemSurface | SystemSurface[];
  changePosture: ChangePosture;
  requiredEvidence: string[];
  requiredSpecialists: string[];
  applicableGates: GateStage[];
  blockingClass: boolean;
  classificationConfidence: "high" | "medium" | "low";
  reclassifiedFrom?: SparkyRiskLevel;
  reclassificationReason?: string;
}

// ─── Routing Objects ──────────────────────────────────────────────────────────

export interface SpecialistRoute {
  specialist: string;
  surface: SystemSurface;
  routeReason: string;
  required: boolean;
  status: "pending" | "in_progress" | "complete" | "missing";
}

export interface SparkyRouting {
  primarySpecialist: string;
  allRoutes: SpecialistRoute[];
  routeReason: string;
  selfCertificationAllowed: boolean;
}

// ─── Gate Evaluation Objects ──────────────────────────────────────────────────

export interface GateConditionResult {
  condition: string;
  status: GateStatus;
  evidenceRef: string | null;
  notes: string;
}

export interface GateEvaluation {
  stage: GateStage;
  riskLevel: SparkyRiskLevel;
  conditions: GateConditionResult[];
  overallStatus: GateStatus;
  timestamp: string;
  auditNotes: string;
}

// ─── Drift Detection Objects ──────────────────────────────────────────────────

export interface DriftFinding {
  driftType: DriftType;
  severity: DriftSeverity;
  location: string;
  description: string;
  correctState: string;
  currentState: string;
  owner: string | null;
  resolutionRequired: boolean;
  blocksMerge: boolean;
}

// ─── Rollback Objects ─────────────────────────────────────────────────────────

export interface RollbackPlan {
  action: string;
  trigger: string;
  owner: string;
  dependencies: string[];
  isComplete: boolean;
  isValidated: boolean;
  notes: string;
}

// ─── Anti-Pattern Detection Objects ──────────────────────────────────────────

export interface AntiPatternDetection {
  code: AntiPatternCode;
  detected: boolean;
  evidence: string;
  enforcementResponse: SparkyDecisionOutcome;
}

// ─── Escalation Objects ───────────────────────────────────────────────────────

export interface EscalationRecord {
  escalationId: string;
  workItemId: string;
  trigger: string;
  conflictDescription: string;
  missingInformation: string;
  blockedDecision: string;
  requiredResolver: string;
  resolutionCriteria: string;
  state: EscalationState;
  openedAt: string;
  resolvedAt: string | null;
  resolutionInput: string | null;
}

// ─── Evaluation Objects ───────────────────────────────────────────────────────

export interface SparkyEvaluation {
  missingEvidence: string[];
  conflictingSignals: string[];
  trustLevel: SparkyTrustLevel;
  trustLevelBasis: string;
  evidenceSufficient: boolean;
  evidenceSummary: EvidenceSummary;
  driftFindings: DriftFinding[];
  antiPatternsDetected: AntiPatternDetection[];
  rollbackPlan: RollbackPlan | null;
  gateResults: GateEvaluation[];
  reasons: string[];
  unresolvedRisks: string[];
}

// ─── Decision Objects ─────────────────────────────────────────────────────────

export interface SparkyFinding {
  severity: SparkyRiskLevel;
  message: string;
  artifactRef: string | null;
  category: "evidence" | "drift" | "anti_pattern" | "routing" | "scope" | "rollback" | "security";
}

export interface RequiredNextAction {
  action: string;
  owner: string | null;
  priority: "immediate" | "before_merge" | "before_release" | "post_merge";
  resolvesCondition: string | null;
}

export interface SparkyDecision {
  decision: SparkyDecisionOutcome;
  confidence: "high" | "medium" | "low";
  blocked: boolean;
  requiresEscalation: boolean;
  findings: SparkyFinding[];
  actions: string[];
  requiredNextActions: RequiredNextAction[];
  reasons: string[];
  blockingConditions: string[];
  trace_id: string;
  state_from: SparkyState;
  state_to: SparkyState;
  stateTransitionReason: string;
  classification: SparkyClassification;
  routing: SparkyRouting;
  evaluation: SparkyEvaluation;
  gateResults: GateEvaluation[];
  enforcement: EnforcementRecord;
  record: ProvenanceRecord;
  trace: SparkyTrace;
  releaseRiskClassification: "safe_to_release" | "conditional_release" | "blocked_from_release" | "not_applicable";
}

// ─── Enforcement Objects ──────────────────────────────────────────────────────

export interface EnforcementRecord {
  prBlocked: boolean;
  releaseBlocked: boolean;
  requiredArtifacts: string[];
  escalationDispatched: EscalationRecord | null;
  rollbackMandated: boolean;
  enforcementFailures: string[];
}

// ─── Trace Objects ────────────────────────────────────────────────────────────

export interface SparkyTrace {
  traceId: string;
  workItemId: string;
  sessionId: string;
  controlLoop: ControlLoopStep[];
  stepTimestamps: Partial<Record<ControlLoopStep, string>>;
  isComplete: boolean;
  isReconstructable: boolean;
}

// ─── Input Objects ────────────────────────────────────────────────────────────

export interface SparkyInput {
  taskType: TaskType | string;
  payload: Record<string, unknown>;
  context?: Record<string, unknown>;
}

export interface WorkItemInput {
  workItemId: string;
  requestType: WorkType | string;
  objective: string;
  owner: string;
  scope: string[];
  artifacts: string[];
  riskNotes: string[];
  requestedAction: "review" | "approve" | "merge" | "release" | "rollback" | "route";
  deadline: string | null;
  declaredRiskClass?: SparkyRiskLevel;
  rollbackPlan?: Partial<RollbackPlan>;
}

// ─── Error Objects ────────────────────────────────────────────────────────────

export type SparkyErrorCode =
  | "missing_input"
  | "invalid_schema"
  | "conflict"
  | "unsupported_request"
  | "insufficient_evidence"
  | "routing_failure"
  | "retrieval_failure"
  | "secret_detected"
  | "escalation_unresolved"
  | "trace_incomplete";

export interface SparkyError {
  workItemId: string;
  agent: string;
  errorCode: SparkyErrorCode;
  message: string;
  blocking: boolean;
  requiredCorrection: string[];
  timestamp: string;
}

// ─── Output Schema (as defined in OPERATING_RULES.md) ───────────────────────

export interface SparkyStructuredOutput {
  workItemId: string;
  agent: string;
  summary: string;
  findings: SparkyFinding[];
  recommendation: SparkyDecisionOutcome;
  requiredNextActions: RequiredNextAction[];
  owner: string | null;
  traceId: string;
}

// ─── Session State Objects ────────────────────────────────────────────────────

export interface ActiveWorkItem {
  workItemId: string;
  state: SparkyState;
  riskLevel: SparkyRiskLevel;
  trustLevel: SparkyTrustLevel;
  blockingConditions: string[];
  openEscalations: string[];
  lastUpdated: string;
}

export interface SessionState {
  sessionId: string;
  activeWorkItems: ActiveWorkItem[];
  openEscalations: EscalationRecord[];
  lastRecoveryPoint: string | null;
  isRecoveredSession: boolean;
}

// ─── Release Classification ───────────────────────────────────────────────────

export type ReleaseRisk = "safe_to_release" | "conditional_release" | "blocked_from_release";

export interface ReleaseCandidate {
  releaseId: string;
  includedWorkItems: string[];
  rollbackPlan: RollbackPlan;
  blastRadiusNote: string;
  observabilityExpectation: string;
  unresolvedRisks: string[];
  deploymentWindow: string | null;
  riskClassification: ReleaseRisk;
}
