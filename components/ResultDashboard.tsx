"use client";

import React, { useState } from "react";
import {
  Activity,
  Boxes,
  ClipboardList,
  Database,
  Download,
  FileSearch,
  Gauge,
  GitBranch,
  Loader2,
  Network,
  ShieldCheck,
  TriangleAlert,
} from "lucide-react";
import {
  type ReviewResult,
  type SolutionArchitectureResult,
} from "@/lib/schemas";
import { OverviewTab } from "./OverviewTab";
import { DataverseSchemaView } from "./DataverseSchemaView";
import { FlowDesignView } from "./FlowDesignView";
import { SecurityModelView } from "./SecurityModelView";
import { ALMChecklistView } from "./ALMChecklistView";
import { RiskPanel } from "./RiskPanel";
import { MermaidDiagram } from "./MermaidDiagram";
import { ReadinessScore } from "./ReadinessScore";
import { ExportPanel } from "./ExportPanel";
import { ReviewFindingsView } from "./ReviewFindingsView";
import { PriorityFixesView } from "./PriorityFixesView";

interface ResultDashboardProps {
  blueprint?: SolutionArchitectureResult | ReviewResult;
  isLoading?: boolean;
}

type TabId =
  | "overview"
  | "review"
  | "dataverse"
  | "flows"
  | "security"
  | "alm"
  | "architecture"
  | "risks"
  | "export";

interface Tab {
  id: TabId;
  label: string;
  icon: React.ElementType;
}

const getReviewFindings = (
  blueprint: SolutionArchitectureResult | ReviewResult,
): ReviewResult["reviewFindings"] =>
  "reviewFindings" in blueprint && Array.isArray(blueprint.reviewFindings)
    ? blueprint.reviewFindings
    : [];

const getPriorityFixes = (
  blueprint: SolutionArchitectureResult | ReviewResult,
): ReviewResult["priorityFixes"] =>
  "priorityFixes" in blueprint && Array.isArray(blueprint.priorityFixes)
    ? blueprint.priorityFixes
    : [];

const getOriginalDesignSummary = (
  blueprint: SolutionArchitectureResult | ReviewResult,
) =>
  "originalDesignSummary" in blueprint &&
  typeof blueprint.originalDesignSummary === "string"
    ? blueprint.originalDesignSummary
    : null;

export const ResultDashboard: React.FC<ResultDashboardProps> = ({
  blueprint,
  isLoading = false,
}) => {
  const [activeTab, setActiveTab] = useState<TabId>("overview");

  if (isLoading) {
    return (
      <div className="w-full rounded-xl border border-blue-200 bg-blue-50 p-8 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-white text-blue-700 shadow-sm">
          <Loader2 className="h-6 w-6 animate-spin" />
        </div>
        <p className="mt-4 text-sm font-semibold text-blue-950">
          Generating blueprint
        </p>
        <p className="mt-1 text-sm text-blue-800">
          Building tables, flows, security, ALM, risks, and readiness scoring.
        </p>
      </div>
    );
  }

  if (!blueprint) {
    return (
      <div className="w-full rounded-xl border border-slate-200 bg-white p-8 text-center shadow-sm">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-600">
          <FileSearch className="h-6 w-6" />
        </div>
        <p className="mt-4 text-sm font-semibold text-slate-950">
          No result yet
        </p>
        <p className="mx-auto mt-1 max-w-md text-sm leading-6 text-slate-600">
          Enter a requirement or paste an existing design to generate a Power
          Platform architecture report.
        </p>
      </div>
    );
  }

  const reviewFindings = getReviewFindings(blueprint);
  const priorityFixes = getPriorityFixes(blueprint);
  const originalDesignSummary = getOriginalDesignSummary(blueprint);
  const showReviewTab =
    ("reviewFindings" in blueprint &&
      Array.isArray(blueprint.reviewFindings)) ||
    ("priorityFixes" in blueprint && Array.isArray(blueprint.priorityFixes));

  const tabs: Tab[] = [
    { id: "overview", label: "Overview", icon: ClipboardList },
    ...(showReviewTab
      ? [{ id: "review" as const, label: "Review", icon: FileSearch }]
      : []),
    { id: "dataverse", label: "Dataverse", icon: Database },
    { id: "flows", label: "Flows", icon: GitBranch },
    { id: "security", label: "Security", icon: ShieldCheck },
    { id: "alm", label: "ALM", icon: Boxes },
    { id: "architecture", label: "Architecture", icon: Network },
    { id: "risks", label: "Risks", icon: TriangleAlert },
    { id: "export", label: "Export", icon: Download },
  ];

  const createdDate = new Date(blueprint.createdAt).toLocaleDateString(
    "en-US",
    {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    },
  );
  return (
    <div className="w-full overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-800 bg-slate-950 px-5 py-6 text-white sm:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-blue-300">
                Structured architecture output
              </p>
              <h1 className="text-2xl font-bold sm:text-3xl">
                {blueprint.mode === "review"
                  ? "Solution Review Board Report"
                  : "Solution Blueprint"}
              </h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-300">
                Power Platform architecture, risk, ALM, and production
                readiness details for demo review.
              </p>
            </div>
            <div className="rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-300 md:text-right">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                Created
              </p>
              <p className="mt-1 font-mono text-slate-100">{createdDate}</p>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <div className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/5 px-4 py-3">
              <Activity className="h-5 w-5 text-blue-300" />
              <div>
                <p className="text-xs uppercase tracking-wide text-slate-400">
                  Pattern
                </p>
                <p className="mt-1 text-sm font-semibold text-white">
                  {blueprint.detectedPattern}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/5 px-4 py-3">
              <Network className="h-5 w-5 text-cyan-300" />
              <div>
                <p className="text-xs uppercase tracking-wide text-slate-400">
                  App Type
                </p>
                <p className="mt-1 text-sm font-semibold capitalize text-white">
                  {blueprint.recommendedAppType.appType.replace("-", " ")}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/5 px-4 py-3">
              <Gauge className="h-5 w-5 text-emerald-300" />
              <div>
                <p className="text-xs uppercase tracking-wide text-slate-400">
                  Readiness
                </p>
                <p className="mt-1 text-sm font-semibold text-white">
                  {blueprint.readinessScore.total}/100
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/5 px-4 py-3">
              <ShieldCheck className="h-5 w-5 text-amber-300" />
              <div>
                <p className="text-xs uppercase tracking-wide text-slate-400">
                  Mode
                </p>
                <p className="mt-1 text-sm font-semibold capitalize text-white">
                  {blueprint.mode}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="sticky top-0 z-10 border-b border-slate-200 bg-white/95 shadow-sm backdrop-blur">
        <div className="mx-auto max-w-7xl px-2 sm:px-4">
          <div className="flex gap-1 overflow-x-auto py-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;

              return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold whitespace-nowrap transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 sm:px-4 ${
                  activeTab === tab.id
                    ? "bg-blue-600 text-white shadow-sm"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-950"
                }`}
                aria-selected={activeTab === tab.id}
                role="tab"
              >
                <Icon className="h-4 w-4" />
                {tab.label}
              </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="bg-white">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-8 sm:py-8">
          {/* Overview Tab */}
          {activeTab === "overview" && <OverviewTab blueprint={blueprint} />}

          {/* Review Findings Tab */}
          {activeTab === "review" && showReviewTab && (
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Review
                </h2>
                <p className="text-gray-600">
                  Solution Review Board assessment with prioritized fixes before
                  production use.
                </p>
              </div>

              {originalDesignSummary && (
                <section className="rounded-lg border border-slate-200 bg-slate-50 p-5">
                  <h3 className="text-lg font-semibold text-slate-900">
                    Original Design Summary
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-slate-700">
                    {originalDesignSummary}
                  </p>
                </section>
              )}

              <section>
                <div className="mb-4 flex items-center justify-between gap-4">
                  <h3 className="text-lg font-semibold text-slate-900">
                    Top Priority Fixes
                  </h3>
                  <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-600">
                    {priorityFixes.length} fixes
                  </span>
                </div>
                <PriorityFixesView fixes={priorityFixes} />
              </section>

              <section className="space-y-4">
                <div className="mb-4 flex items-center justify-between gap-4">
                  <h3 className="text-lg font-semibold text-slate-900">
                    Findings
                  </h3>
                  <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-600">
                    {reviewFindings.length} findings
                  </span>
                </div>
                <ReviewFindingsView findings={reviewFindings} />
              </section>
            </div>
          )}

          {/* Dataverse Tab */}
          {activeTab === "dataverse" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Dataverse Schema Design
                </h2>
                <p className="text-gray-600 mb-6">
                  Database tables and columns required for this solution
                </p>
              </div>
              <DataverseSchemaView tables={blueprint.dataverseTables} />
            </div>
          )}

          {/* Flows Tab */}
          {activeTab === "flows" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Power Automate Flows
                </h2>
                <p className="text-gray-600 mb-6">
                  {blueprint.powerAutomateFlows.length} automated workflows to
                  orchestrate your solution
                </p>
              </div>
              <FlowDesignView flows={blueprint.powerAutomateFlows} />
            </div>
          )}

          {/* Security Tab */}
          {activeTab === "security" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Security & Access Control
                </h2>
                <p className="text-gray-600 mb-6">
                  Role-based security model with{" "}
                  {blueprint.securityRoles.length} roles
                </p>
              </div>
              <SecurityModelView roles={blueprint.securityRoles} />
            </div>
          )}

          {/* ALM Tab */}
          {activeTab === "alm" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Environment & ALM Strategy
                </h2>
                <p className="text-gray-600 mb-6">
                  Application Lifecycle Management across development, testing,
                  and production stages
                </p>
              </div>
              <ALMChecklistView almPlan={blueprint.almPlan} />
            </div>
          )}

          {/* Architecture Diagram Tab */}
          {activeTab === "architecture" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Solution Architecture
                </h2>
                <p className="text-gray-600 mb-6">
                  Visual overview of components and integrations
                </p>
              </div>
              <MermaidDiagram diagram={blueprint.architectureDiagramMermaid} />
            </div>
          )}

          {/* Risks Tab */}
          {activeTab === "risks" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Risk Assessment
                </h2>
                <p className="text-gray-600 mb-6">
                  {blueprint.risks.length} identified risks with mitigation
                  strategies
                </p>
              </div>
              <RiskPanel risks={blueprint.risks} />
            </div>
          )}

          {/* Export Tab */}
          {activeTab === "export" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Export & Documentation
                </h2>
                <p className="text-gray-600 mb-6">
                  Download your blueprint in multiple formats
                </p>
              </div>
              <ExportPanel blueprint={blueprint} />
            </div>
          )}
        </div>
      </div>

      {/* Bottom Action Bar with Readiness Score */}
      <div className="border-t border-slate-200 bg-slate-50 px-4 py-6 sm:px-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <ReadinessScore
            readinessScore={blueprint.readinessScore}
            feedback={[
              "Ensure IT system integrations are planned",
              "Validate compliance requirements with legal team",
              "Conduct user adoption training 2 weeks before go-live",
            ]}
          />
        </div>
      </div>
    </div>
  );
};
