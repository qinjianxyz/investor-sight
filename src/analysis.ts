import type {
  AnalystQueueItem,
  DemoReliabilityReport,
  InvestorSightData,
  RankedCompany,
  RecommendedAction,
  ScenarioView,
  SourceTrustReport,
  TimelineItem,
} from "./types.js";

const PRIMARY_SOURCE_TYPES = new Set([
  "SEC filing",
  "SEC filing / 13D",
  "SEC filing / press release",
  "SEC filing / shareholder letter",
  "company press release",
  "earnings release",
  "transaction press release",
]);

export function buildAnalystQueue(ranking: RankedCompany[]): AnalystQueueItem[] {
  return ranking.map((company) => ({
    ticker: company.ticker,
    name: company.name,
    score: company.score.total,
    tier: company.actionabilityTier,
    recommendedAction: recommendedActionFor(company),
    trigger: company.whyNow.recentDevelopments[0] ?? company.memo.whyNow,
    objection: company.score.penalties[0] ?? company.whyNow.counterarguments[0] ?? "No major objection captured.",
    nextStep: company.memo.nextSteps[0] ?? "Assign analyst owner and refresh public-source coverage.",
  }));
}

export function buildScenarioViews(ranking: RankedCompany[]): ScenarioView[] {
  const actionable = ranking.filter((company) => company.status === "public" && company.score.total >= 70);
  const memoReady = ranking.filter((company) => company.status === "public" && company.whyNow.confidence !== "Low");
  const risky = [...ranking].sort((left, right) => {
    const penaltyDelta = Math.abs(right.score.components.uncertaintyPenalty) - Math.abs(left.score.components.uncertaintyPenalty);
    if (penaltyDelta !== 0) return penaltyDelta;
    return left.score.total - right.score.total;
  });

  return [
    {
      id: "activist-triage",
      title: "Activist triage",
      description: "Monday-morning queue for live pressure, board leverage, and near-term catalyst urgency.",
      topTickers: actionable.slice(0, 4).map((company) => company.ticker),
      metric: `${actionable.length} names at High or Immediate`,
      operatorQuestion: "Which situations need outreach before the next filing, earnings print, or annual-meeting milestone?",
    },
    {
      id: "ic-memo",
      title: "IC memo sprint",
      description: "Memo-ready names where the thesis, counterarguments, and source trail are sufficiently structured.",
      topTickers: memoReady.slice(0, 4).map((company) => company.ticker),
      metric: `${memoReady.length} names with usable confidence`,
      operatorQuestion: "Which cases can go to investment committee without another research pass?",
    },
    {
      id: "risk-review",
      title: "Risk review",
      description: "Names where macro noise, deal closure, voting control, or weak causal evidence could fool the model.",
      topTickers: risky.slice(0, 4).map((company) => company.ticker),
      metric: `${risky[0]?.ticker ?? "None"} has the largest uncertainty drag`,
      operatorQuestion: "What would make this ranking wrong, stale, or non-actionable?",
    },
  ];
}

export function buildEventTimeline(ranking: RankedCompany[]): TimelineItem[] {
  return ranking
    .flatMap((company) =>
      company.events.map((event) => {
        const source = company.sources.find((item) => item.id === event.sourceId);
        if (!source) {
          throw new Error(`Missing source ${event.sourceId} for ${company.ticker}`);
        }

        return {
          ticker: company.ticker,
          name: company.name,
          date: event.date,
          type: event.type,
          importance: event.importance,
          confidence: event.confidence,
          description: event.description,
          sourceTitle: source.title,
          sourceUrl: source.url,
        };
      }),
    )
    .sort((left, right) => right.date.localeCompare(left.date) || left.ticker.localeCompare(right.ticker));
}

export function buildSourceTrustReport(ranking: RankedCompany[]): SourceTrustReport {
  const sources = ranking.flatMap((company) => company.sources);
  const typeCounts = new Map<string, number>();
  for (const source of sources) {
    typeCounts.set(source.sourceType, (typeCounts.get(source.sourceType) ?? 0) + 1);
  }

  const primarySourceCount = sources.filter((source) => PRIMARY_SOURCE_TYPES.has(source.sourceType)).length;
  const eventsWithSources = ranking.reduce((count, company) => {
    const ids = new Set(company.sources.map((source) => source.id));
    return count + company.events.filter((event) => ids.has(event.sourceId)).length;
  }, 0);

  return {
    totalSources: sources.length,
    primarySourceCount,
    primarySourceRatio: Number((primarySourceCount / sources.length).toFixed(2)),
    eventsWithSources,
    sourceTypeBreakdown: [...typeCounts.entries()]
      .map(([label, count]) => ({ label, count }))
      .sort((left, right) => right.count - left.count || left.label.localeCompare(right.label)),
  };
}

export function buildDemoReliabilityReport(data: InvestorSightData, ranking: RankedCompany[]): DemoReliabilityReport {
  const sourceTrust = buildSourceTrustReport(ranking);
  const missingEventSources = ranking.reduce((count, company) => {
    const ids = new Set(company.sources.map((source) => source.id));
    return count + company.events.filter((event) => !ids.has(event.sourceId)).length;
  }, 0);
  const requiredViews = ["mission-control", "scenario-lab", "evidence-ledger", "change-timeline", "demo-reliability"];
  const expectedTop = ranking[0]?.ticker === "NCLH" && ranking[0]?.score.total === 92;
  const expectedUniverse = data.companies.length === 10;
  const expectedSources = sourceTrust.totalSources === 54;
  const readinessInputs = [missingEventSources === 0, expectedTop, expectedUniverse, expectedSources];
  const demoReadinessScore = Math.round((readinessInputs.filter(Boolean).length / readinessInputs.length) * 100);

  return {
    demoReadinessScore,
    companies: data.companies.length,
    sources: sourceTrust.totalSources,
    events: ranking.reduce((count, company) => count + company.events.length, 0),
    missingEventSources,
    requiredViews,
    checks: [
      {
        label: "Deterministic top case",
        status: expectedTop ? "pass" : "warn",
        detail: expectedTop ? "NCLH remains top-ranked at 92." : "Top-ranked company changed; inspect scoring deltas.",
      },
      {
        label: "Assigned universe",
        status: expectedUniverse ? "pass" : "warn",
        detail: `${data.companies.length} of 10 assigned companies loaded.`,
      },
      {
        label: "Evidence links",
        status: missingEventSources === 0 ? "pass" : "warn",
        detail: `${missingEventSources} events are missing same-company source links.`,
      },
      {
        label: "Source coverage",
        status: expectedSources ? "pass" : "warn",
        detail: `${sourceTrust.totalSources} public sources, ${sourceTrust.primarySourceRatio * 100}% primary-source coverage.`,
      },
    ],
  };
}

export function stableRankingHash(ranking: RankedCompany[]): string {
  const input = ranking.map((company) => `${company.ticker}:${company.score.total}:${company.events.length}`).join("|");
  let hash = 2166136261;
  for (const char of input) {
    hash ^= char.charCodeAt(0);
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0).toString(16).padStart(8, "0");
}

function recommendedActionFor(company: RankedCompany): RecommendedAction {
  if (company.status === "acquired") return "Exclude";
  if (company.score.total >= 70) return "Act now";
  if (company.score.total >= 50) return "Monitor this week";
  return "Needs diligence";
}
