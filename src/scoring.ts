import type { ActionabilityTier, Company, CompanyScore, Importance, RankedCompany } from "./types.js";

const IMPORTANCE_WEIGHT: Record<Importance, number> = {
  low: 1,
  medium: 2,
  high: 3,
  "very high": 4,
};

export function scoreCompany(company: Company): CompanyScore {
  const input = company.scoreInputs;
  const gross =
    input.activistPressure +
    input.recentChange +
    input.businessSeverity +
    input.thesisClarity +
    input.evidenceQuality;
  const total = clampScore(gross - input.uncertaintyPenalty);
  const drivers = buildDrivers(company);
  const penalties = buildPenalties(company);

  return {
    total,
    components: {
      activistPressure: input.activistPressure,
      recentChange: input.recentChange,
      businessSeverity: input.businessSeverity,
      thesisClarity: input.thesisClarity,
      evidenceQuality: input.evidenceQuality,
      uncertaintyPenalty: -input.uncertaintyPenalty,
    },
    drivers,
    penalties,
  };
}

export function rankCompanies(companies: Company[]): RankedCompany[] {
  return companies
    .map((company) => {
      const score = scoreCompany(company);
      return {
        ...company,
        score,
        actionabilityTier: tierForScore(score.total),
      };
    })
    .sort((left, right) => {
      if (right.score.total !== left.score.total) {
        return right.score.total - left.score.total;
      }

      return eventIntensity(right) - eventIntensity(left);
    });
}

export function tierForScore(score: number): ActionabilityTier {
  if (score >= 85) return "Immediate";
  if (score >= 70) return "High";
  if (score >= 50) return "Watchlist";
  if (score >= 30) return "Low";
  return "Why Not Now";
}

function clampScore(score: number): number {
  return Math.max(0, Math.min(100, Math.round(score)));
}

function eventIntensity(company: Company): number {
  return company.events.reduce((total, event) => total + IMPORTANCE_WEIGHT[event.importance], 0);
}

function buildDrivers(company: Company): string[] {
  const drivers = [...company.primaryDrivers];

  if (company.scoreInputs.activistPressure >= 24) {
    drivers.unshift("active activist or strategic-buyer pressure is already visible.");
  }

  if (company.events.some((event) => event.type.includes("governance") || event.type.includes("board"))) {
    drivers.push("Board or governance change makes the pressure path unusually concrete.");
  }

  return [...new Set(drivers)];
}

function buildPenalties(company: Company): string[] {
  const penalties = [...company.primaryPenalties];

  if (company.whyNow.uncertainties.some((item) => item.toLowerCase().includes("cyclical"))) {
    penalties.push("Cyclical demand and macro sensitivity could explain part of the underperformance.");
  }

  if (company.status === "acquired") {
    penalties.push("Public-company actionability is structurally limited after acquisition close.");
  }

  return [...new Set(penalties)];
}
