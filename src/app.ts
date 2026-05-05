import { investorSightData } from "./data.js";
import { rankCompanies } from "./scoring.js";
import {
  buildAnalystQueue,
  buildDemoReliabilityReport,
  buildEventTimeline,
  buildScenarioViews,
  buildSourceTrustReport,
  stableRankingHash,
} from "./analysis.js";
import type {
  AnalystQueueItem,
  DemoReliabilityReport,
  RankedCompany,
  ScenarioView,
  ScoreComponents,
  SourceTrustReport,
  TimelineItem,
} from "./types.js";

type FilterState = {
  company: string;
  tier: string;
  eventType: string;
};

const state: FilterState = {
  company: "all",
  tier: "all",
  eventType: "all",
};

const ranking = rankCompanies(investorSightData.companies);

const els = {
  asOf: queryElement<HTMLElement>("#as-of"),
  companyCount: queryElement<HTMLElement>("#company-count"),
  sourceCount: queryElement<HTMLElement>("#source-count"),
  eventCount: queryElement<HTMLElement>("#event-count"),
  companyFilter: queryElement<HTMLSelectElement>("#company-filter"),
  tierFilter: queryElement<HTMLSelectElement>("#tier-filter"),
  eventFilter: queryElement<HTMLSelectElement>("#event-filter"),
  topCompany: queryElement<HTMLElement>("#top-company"),
  topRationale: queryElement<HTMLElement>("#top-rationale"),
  topScore: queryElement<HTMLElement>("#top-score"),
  missionControl: queryElement<HTMLElement>("#mission-control"),
  scenarioLab: queryElement<HTMLElement>("#scenario-lab"),
  evidenceLedger: queryElement<HTMLElement>("#evidence-ledger"),
  changeTimeline: queryElement<HTMLElement>("#change-timeline"),
  demoReliability: queryElement<HTMLElement>("#demo-reliability"),
  productNarrative: queryElement<HTMLElement>("#product-narrative"),
  rankingGrid: queryElement<HTMLElement>("#ranking-grid"),
  workflow: queryElement<HTMLElement>("#workflow"),
  systemDesign: queryElement<HTMLElement>("#system-design"),
  companyDetails: queryElement<HTMLElement>("#company-details"),
};

init();

function init(): void {
  const sourceCount = investorSightData.companies.reduce((sum, company) => sum + company.sources.length, 0);
  const eventCount = investorSightData.companies.reduce((sum, company) => sum + company.events.length, 0);
  const [top] = ranking;
  if (!top) {
    throw new Error("InvestorSight requires at least one company to render.");
  }

  els.asOf.textContent = investorSightData.asOf;
  els.companyCount.textContent = String(investorSightData.companies.length);
  els.sourceCount.textContent = String(sourceCount);
  els.eventCount.textContent = String(eventCount);
  els.topCompany.textContent = `${top.name} (${top.ticker})`;
  els.topRationale.textContent = top.memo.whyNow;
  els.topScore.textContent = String(top.score.total);

  populateFilters();
  renderMissionControl(buildAnalystQueue(ranking));
  renderScenarioLab(buildScenarioViews(ranking));
  renderEvidenceLedger(buildSourceTrustReport(ranking));
  renderChangeTimeline(buildEventTimeline(ranking));
  renderDemoReliability(buildDemoReliabilityReport(investorSightData, ranking));
  renderProductNarrative();
  renderWorkflow();
  renderSystemDesign();
  render();

  els.companyFilter.addEventListener("change", (event) => {
    state.company = (event.currentTarget as HTMLSelectElement).value;
    render();
  });
  els.tierFilter.addEventListener("change", (event) => {
    state.tier = (event.currentTarget as HTMLSelectElement).value;
    render();
  });
  els.eventFilter.addEventListener("change", (event) => {
    state.eventType = (event.currentTarget as HTMLSelectElement).value;
    render();
  });
}

function renderMissionControl(queue: AnalystQueueItem[]): void {
  els.missionControl.replaceChildren(
    ...queue.slice(0, 6).map((item) => {
      const card = document.createElement("article");
      card.className = `cockpit-card cockpit-card-${item.recommendedAction.toLowerCase().replaceAll(" ", "-")}`;
      card.innerHTML = `
        <div class="cockpit-card-topline">
          <span class="ticker-pill">${escapeHtml(item.ticker)}</span>
          <span class="action-pill">${escapeHtml(item.recommendedAction)}</span>
        </div>
        <h3>${escapeHtml(item.name)}</h3>
        <div class="score-line">
          <span>${escapeHtml(item.tier)}</span>
          <strong>${item.score}/100</strong>
        </div>
        <p>${escapeHtml(item.trigger)}</p>
        <dl class="cockpit-facts">
          <div><dt>Next move</dt><dd>${escapeHtml(item.nextStep)}</dd></div>
          <div><dt>Objection</dt><dd>${escapeHtml(item.objection)}</dd></div>
        </dl>
      `;
      return card;
    }),
  );
}

function renderScenarioLab(scenarios: ScenarioView[]): void {
  els.scenarioLab.innerHTML = `
    <div class="section-mini-heading">
      <p class="eyebrow">Scenario lab</p>
      <h3>Three real user modes</h3>
    </div>
    <div class="scenario-grid">
      ${scenarios
        .map(
          (scenario) => `
            <article class="scenario-card">
              <span class="type-pill">${escapeHtml(scenario.metric)}</span>
              <h4>${escapeHtml(scenario.title)}</h4>
              <p>${escapeHtml(scenario.description)}</p>
              <div class="ticker-strip">${scenario.topTickers.map((ticker) => `<span>${escapeHtml(ticker)}</span>`).join("")}</div>
              <strong>${escapeHtml(scenario.operatorQuestion)}</strong>
            </article>
          `,
        )
        .join("")}
    </div>
  `;
}

function renderEvidenceLedger(report: SourceTrustReport): void {
  els.evidenceLedger.innerHTML = `
    <div class="section-mini-heading">
      <p class="eyebrow">Evidence ledger</p>
      <h3>Source trust mix</h3>
    </div>
    <div class="ledger-grid">
      <div class="ledger-stat">
        <span>${report.totalSources}</span>
        <label>sources</label>
      </div>
      <div class="ledger-stat">
        <span>${Math.round(report.primarySourceRatio * 100)}%</span>
        <label>primary-source coverage</label>
      </div>
      <div class="ledger-stat">
        <span>${report.eventsWithSources}</span>
        <label>events source-backed</label>
      </div>
    </div>
    <ul class="source-type-list">
      ${report.sourceTypeBreakdown
        .slice(0, 8)
        .map((item) => `<li><span>${escapeHtml(item.label)}</span><strong>${item.count}</strong></li>`)
        .join("")}
    </ul>
  `;
}

function renderChangeTimeline(timeline: TimelineItem[]): void {
  els.changeTimeline.innerHTML = `
    <div class="section-mini-heading">
      <p class="eyebrow">Change timeline</p>
      <h3>Fresh catalysts</h3>
    </div>
    <ol class="timeline-list">
      ${timeline
        .slice(0, 8)
        .map(
          (item) => `
            <li>
              <div class="event-meta">
                <span>${item.date}</span>
                <span class="ticker-pill">${escapeHtml(item.ticker)}</span>
                <span class="type-pill">${escapeHtml(item.type)}</span>
              </div>
              <strong>${escapeHtml(item.description)}</strong>
              <a href="${item.sourceUrl}" target="_blank" rel="noreferrer">${escapeHtml(item.sourceTitle)}</a>
            </li>
          `,
        )
        .join("")}
    </ol>
  `;
}

function renderDemoReliability(report: DemoReliabilityReport): void {
  els.demoReliability.innerHTML = `
    <div class="section-mini-heading">
      <p class="eyebrow">Demo reliability</p>
      <h3>Presenter-safe proof</h3>
    </div>
    <div class="readiness-score">
      <span>${report.demoReadinessScore}</span>
      <label>readiness score</label>
    </div>
    <p class="hash-line">Ranking hash: <strong>${stableRankingHash(ranking)}</strong></p>
    <ul class="reliability-list">
      ${report.checks
        .map(
          (check) => `
            <li class="check-${check.status}">
              <span>${check.status === "pass" ? "PASS" : "WARN"}</span>
              <div><strong>${escapeHtml(check.label)}</strong><p>${escapeHtml(check.detail)}</p></div>
            </li>
          `,
        )
        .join("")}
    </ul>
  `;
}

function populateFilters(): void {
  for (const company of ranking) {
    els.companyFilter.append(option(company.ticker, `${company.name} (${company.ticker})`));
  }

  for (const tier of [...new Set(ranking.map((company) => company.actionabilityTier))]) {
    els.tierFilter.append(option(tier, tier));
  }

  const eventTypes = new Set<string>();
  for (const company of ranking) {
    for (const event of company.events) {
      eventTypes.add(event.type);
    }
  }

  for (const eventType of [...eventTypes].sort()) {
    els.eventFilter.append(option(eventType, eventType));
  }
}

function render(): void {
  const filtered = ranking.filter((company) => {
    const companyMatch = state.company === "all" || company.ticker === state.company;
    const tierMatch = state.tier === "all" || company.actionabilityTier === state.tier;
    const eventMatch = state.eventType === "all" || company.events.some((event) => event.type === state.eventType);
    return companyMatch && tierMatch && eventMatch;
  });

  els.rankingGrid.replaceChildren(...filtered.map(renderRankingCard));
  els.companyDetails.replaceChildren(...filtered.map(renderCompanyDetail));
}

function renderProductNarrative(): void {
  const narrative = investorSightData.productNarrative;
  const cards = [
    ["What we built", narrative.whatWeBuilt],
    ["Why it is valuable", narrative.whyValuable],
    ["How we built it", narrative.howBuilt],
  ].map(([title, body]) => {
    const card = document.createElement("article");
    card.className = "narrative-card";
    card.innerHTML = `<h3>${escapeHtml(title)}</h3><p>${escapeHtml(body)}</p>`;
    return card;
  });

  const extra = document.createElement("article");
  extra.className = "narrative-card narrative-card-wide";
  extra.innerHTML = `
    <h3>Above and beyond</h3>
    <ul class="memo-list">
      ${narrative.aboveAndBeyond.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}
    </ul>
  `;

  els.productNarrative.replaceChildren(...cards, extra);
}

function renderWorkflow(): void {
  els.workflow.replaceChildren(
    ...investorSightData.workflow.map((item, index) => {
      const card = document.createElement("article");
      card.className = "workflow-card";
      card.innerHTML = `
        <p class="eyebrow">${String(index + 1).padStart(2, "0")}</p>
        <h3>${escapeHtml(titleCase(item.step))}</h3>
        <p>${escapeHtml(item.output)}</p>
      `;
      return card;
    }),
  );
}

function renderSystemDesign(): void {
  els.systemDesign.replaceChildren(
    ...investorSightData.systemDesign.map((stage, index) => {
      const card = document.createElement("article");
      card.className = "system-card";
      card.innerHTML = `
        <div class="system-card-header">
          <span class="rank-number">${String(index + 1).padStart(2, "0")}</span>
          <h3>${escapeHtml(titleCase(stage.name))}</h3>
        </div>
        <h4>Prototype</h4>
        <p>${escapeHtml(stage.now)}</p>
        <h4>Production evolution</h4>
        <p>${escapeHtml(stage.next)}</p>
        <h4>Design risk</h4>
        <p>${escapeHtml(stage.risk)}</p>
      `;
      return card;
    }),
  );
}

function renderRankingCard(company: RankedCompany, index: number): HTMLElement {
  const card = document.createElement("article");
  card.className = "ranking-card";
  card.innerHTML = `
    <div class="ranking-topline">
      <div>
        <span class="rank-number">#${index + 1}</span>
        <h3>${escapeHtml(company.name)}</h3>
      </div>
      <span class="ticker-pill">${company.ticker}</span>
    </div>
    <div class="score-line">
      <span>${company.actionabilityTier}</span>
      <strong>${company.score.total}/100</strong>
    </div>
    <div class="score-meter" aria-label="Score ${company.score.total} out of 100">
      <span style="width: ${company.score.total}%"></span>
    </div>
    ${renderScoreComponents(company.score.components, "compact")}
    <span class="tier-pill">${escapeHtml(company.whyNow.label)}</span>
    <ul class="mini-list">
      ${company.score.drivers.slice(0, 3).map((item) => `<li>${escapeHtml(item)}</li>`).join("")}
    </ul>
  `;
  return card;
}

function renderCompanyDetail(company: RankedCompany): HTMLElement {
  const card = document.createElement("article");
  card.className = "detail-card";
  const eventList = company.events
    .map((event) => {
      const source = company.sources.find((item) => item.id === event.sourceId);
      if (!source) {
        throw new Error(`Missing source ${event.sourceId} for ${company.ticker}`);
      }
      return `
        <li class="event-item">
          <div class="event-meta">
            <span>${event.date}</span>
            <span class="type-pill">${escapeHtml(event.type)}</span>
            <span>${escapeHtml(event.importance)} importance</span>
            <span>${escapeHtml(event.confidence)} confidence</span>
          </div>
          <strong>${escapeHtml(event.description)}</strong>
          <a href="${source.url}" target="_blank" rel="noreferrer">${escapeHtml(source.title)}</a>
        </li>
      `;
    })
    .join("");

  card.innerHTML = `
    <div class="detail-header">
      <div>
        <p class="eyebrow">${company.ticker} · ${escapeHtml(company.sector)}</p>
        <h3>${escapeHtml(company.name)}</h3>
      </div>
      <span class="tier-pill">${company.actionabilityTier} · ${company.score.total}/100 · ${escapeHtml(company.whyNow.confidence)}</span>
    </div>
    <div class="detail-grid">
      <section class="detail-section">
        <h4>Score waterfall</h4>
        ${renderScoreComponents(company.score.components, "detail")}
      </section>
      <section class="detail-section">
        <h4>Recent developments</h4>
        <ul class="memo-list">${company.whyNow.recentDevelopments.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>
      </section>
      <section class="detail-section">
        <h4>Why it matters now</h4>
        <p>${escapeHtml(company.whyNow.whyItMattersNow)}</p>
      </section>
      <section class="detail-section">
        <h4>Pressure thesis</h4>
        <p>${escapeHtml(company.whyNow.thesis)}</p>
      </section>
      <section class="detail-section">
        <h4>Counterarguments</h4>
        <ul class="memo-list">${company.whyNow.counterarguments.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>
      </section>
      <section class="detail-section">
        <h4>Evidence supports</h4>
        <ul class="memo-list">${company.whyNow.supportingEvidence.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>
      </section>
      <section class="detail-section">
        <h4>Evidence weakens</h4>
        <ul class="memo-list">${company.whyNow.weakeningEvidence.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>
      </section>
      <section class="detail-section">
        <h4>Main uncertainties</h4>
        <ul class="memo-list">${company.whyNow.uncertainties.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>
      </section>
      <section class="detail-section">
        <h4>Decision memo</h4>
        <p>${escapeHtml(company.memo.whyNow)}</p>
        <h4>Supporting points</h4>
        <ul class="memo-list">${company.memo.supportingPoints.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>
        <h4>Risks / objections</h4>
        <ul class="memo-list">${company.memo.risks.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>
        <h4>Investigate next</h4>
        <ul class="memo-list">${company.memo.nextSteps.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>
      </section>
    </div>
    <div class="detail-grid">
      <section class="detail-section">
        <h4>Structured events</h4>
        <ul class="event-list">${eventList}</ul>
      </section>
      <section class="detail-section">
        <h4>Sources</h4>
        <ul class="source-list">
          ${company.sources
            .map(
              (source) => `
                <li>
                  <a href="${source.url}" target="_blank" rel="noreferrer">${escapeHtml(source.title)}</a>
                  <span>${source.date} · ${escapeHtml(source.publisher)} · ${escapeHtml(source.sourceType)}</span>
                </li>
              `,
            )
            .join("")}
        </ul>
      </section>
    </div>
  `;
  return card;
}

function renderScoreComponents(components: ScoreComponents, density: "compact" | "detail"): string {
  const entries: Array<[string, number]> = [
    ["Activist pressure", components.activistPressure],
    ["Recent change", components.recentChange],
    ["Business severity", components.businessSeverity],
    ["Thesis clarity", components.thesisClarity],
    ["Evidence quality", components.evidenceQuality],
    ["Uncertainty", components.uncertaintyPenalty],
  ];

  return `
    <div class="component-grid component-grid-${density}" aria-label="Score factor waterfall">
      ${entries
        .map(([label, value]) => {
          const isPenalty = value < 0;
          const width = Math.max(8, Math.min(100, Math.abs(value) * 3.3));
          return `
            <div class="component-row ${isPenalty ? "component-row-penalty" : ""}">
              <span>${escapeHtml(label)}</span>
              <div class="component-bar" aria-hidden="true"><i style="width: ${width}%"></i></div>
              <strong>${value > 0 ? "+" : ""}${value}</strong>
            </div>
          `;
        })
        .join("")}
    </div>
  `;
}

function option(value: string, label: string): HTMLOptionElement {
  const element = document.createElement("option");
  element.value = value;
  element.textContent = label;
  return element;
}

function titleCase(value: string): string {
  return value.replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function escapeHtml(value: unknown): string {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function queryElement<T extends HTMLElement>(selector: string): T {
  const element = document.querySelector<T>(selector);
  if (!element) {
    throw new Error(`Missing required element: ${selector}`);
  }
  return element;
}
