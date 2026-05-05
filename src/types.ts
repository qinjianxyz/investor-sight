export type Importance = "low" | "medium" | "high" | "very high";

export type EventConfidence = "low" | "medium" | "high";

export type AssessmentConfidence = "Low" | "Medium-Low" | "Medium" | "Medium-High" | "High";

export type CompanyStatus = "public" | "acquired";

export type ActionabilityTier = "Immediate" | "High" | "Watchlist" | "Low" | "Why Not Now";

export interface ProductNarrative {
  whatWeBuilt: string;
  whyValuable: string;
  howBuilt: string;
  aboveAndBeyond: string[];
}

export interface SystemDesignStage {
  name: string;
  now: string;
  next: string;
  risk: string;
}

export interface WorkflowStep {
  step: string;
  output: string;
}

export interface ScoringLogic {
  activistPressure: string;
  recentChange: string;
  businessSeverity: string;
  thesisClarity: string;
  evidenceQuality: string;
  uncertaintyPenalty: string;
}

export interface ScoreInputs {
  activistPressure: number;
  recentChange: number;
  businessSeverity: number;
  thesisClarity: number;
  evidenceQuality: number;
  uncertaintyPenalty: number;
}

export interface Source {
  id: string;
  title: string;
  publisher: string;
  date: string;
  url: string;
  sourceType: string;
}

export interface EvidenceEvent {
  type: string;
  date: string;
  description: string;
  sourceId: string;
  importance: Importance;
  confidence: EventConfidence;
}

export interface WhyNow {
  label: "Why Now" | "Why Not Now" | "Why Not Now / Watch";
  recentDevelopments: string[];
  whyItMattersNow: string;
  thesis: string;
  counterarguments: string[];
  supportingEvidence: string[];
  weakeningEvidence: string[];
  uncertainties: string[];
  confidence: AssessmentConfidence;
}

export interface Memo {
  whyNow: string;
  supportingPoints: string[];
  risks: string[];
  nextSteps: string[];
}

export interface Company {
  ticker: string;
  name: string;
  sector: string;
  status: CompanyStatus;
  scoreInputs: ScoreInputs;
  primaryDrivers: string[];
  primaryPenalties: string[];
  sources: Source[];
  events: EvidenceEvent[];
  whyNow: WhyNow;
  memo: Memo;
}

export interface ScoreComponents {
  activistPressure: number;
  recentChange: number;
  businessSeverity: number;
  thesisClarity: number;
  evidenceQuality: number;
  uncertaintyPenalty: number;
}

export interface CompanyScore {
  total: number;
  components: ScoreComponents;
  drivers: string[];
  penalties: string[];
}

export interface RankedCompany extends Company {
  score: CompanyScore;
  actionabilityTier: ActionabilityTier;
}

export type RecommendedAction = "Act now" | "Monitor this week" | "Needs diligence" | "Exclude";

export interface AnalystQueueItem {
  ticker: string;
  name: string;
  score: number;
  tier: ActionabilityTier;
  recommendedAction: RecommendedAction;
  trigger: string;
  objection: string;
  nextStep: string;
}

export interface ScenarioView {
  id: "activist-triage" | "ic-memo" | "risk-review";
  title: string;
  description: string;
  topTickers: string[];
  metric: string;
  operatorQuestion: string;
}

export interface TimelineItem {
  ticker: string;
  name: string;
  date: string;
  type: string;
  importance: Importance;
  confidence: EventConfidence;
  description: string;
  sourceTitle: string;
  sourceUrl: string;
}

export interface SourceTypeBreakdown {
  label: string;
  count: number;
}

export interface SourceTrustReport {
  totalSources: number;
  primarySourceCount: number;
  primarySourceRatio: number;
  eventsWithSources: number;
  sourceTypeBreakdown: SourceTypeBreakdown[];
}

export interface ReliabilityCheck {
  label: string;
  status: "pass" | "warn";
  detail: string;
}

export interface DemoReliabilityReport {
  demoReadinessScore: number;
  companies: number;
  sources: number;
  events: number;
  missingEventSources: number;
  requiredViews: string[];
  checks: ReliabilityCheck[];
}

export interface InvestorSightData {
  asOf: string;
  generatedBy: string;
  productNarrative: ProductNarrative;
  systemDesign: SystemDesignStage[];
  workflow: WorkflowStep[];
  scoringLogic: ScoringLogic;
  companies: Company[];
}
