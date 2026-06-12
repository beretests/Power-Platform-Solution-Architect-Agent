"use client";

import React, { useState } from "react";
import { Blueprint } from "@/lib/mockResults";
import { OverviewTab } from "./OverviewTab";
import { DataverseSchemaView } from "./DataverseSchemaView";
import { FlowDesignView } from "./FlowDesignView";
import { SecurityModelView } from "./SecurityModelView";
import { ALMChecklistView } from "./ALMChecklistView";
import { RiskPanel } from "./RiskPanel";
import { MermaidDiagram } from "./MermaidDiagram";
import { ReadinessScore } from "./ReadinessScore";
import { ExportPanel } from "./ExportPanel";

interface ResultDashboardProps {
  blueprint?: Blueprint;
  isLoading?: boolean;
}

type TabId =
  | "overview"
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
  icon: string;
}

export const ResultDashboard: React.FC<ResultDashboardProps> = ({
  blueprint,
  isLoading = false,
}) => {
  const [activeTab, setActiveTab] = useState<TabId>("overview");

  if (isLoading) {
    return (
      <div className="w-full p-8 text-center">
        <div className="inline-block">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
        <p className="mt-2 text-gray-600">Generating blueprint...</p>
      </div>
    );
  }

  if (!blueprint) {
    return (
      <div className="w-full border border-gray-200 rounded-lg p-8 text-center text-gray-500">
        <p>
          Enter your requirements and click &quot;Generate Blueprint&quot; to get
          started
        </p>
      </div>
    );
  }

  const tabs: Tab[] = [
    { id: "overview", label: "Overview", icon: "📋" },
    { id: "dataverse", label: "Dataverse", icon: "📦" },
    { id: "flows", label: "Flows", icon: "⚙️" },
    { id: "security", label: "Security", icon: "🔐" },
    { id: "alm", label: "ALM", icon: "🚀" },
    { id: "architecture", label: "Architecture", icon: "🏗️" },
    { id: "risks", label: "Risks", icon: "⚠️" },
    { id: "export", label: "Export", icon: "💾" },
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
    <div className="w-full space-y-0">
      {/* Header Section with Badges and Metadata */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 text-white px-8 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Top row: Title and Created Date */}
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">Solution Blueprint</h1>
              <p className="text-blue-200 text-sm">
                Power Platform Architecture Design
              </p>
            </div>
            <div className="text-right text-sm text-blue-200">
              <p className="font-mono">{createdDate}</p>
            </div>
          </div>

          {/* Badges Row */}
          <div className="flex flex-wrap gap-3">
            {/* Detected Pattern Badge */}
            <div className="bg-blue-500/30 border border-blue-400 rounded-full px-4 py-2 flex items-center gap-2 backdrop-blur-sm">
              <span className="text-lg">🔍</span>
              <div>
                <p className="text-xs text-blue-200 uppercase tracking-wider">
                  Pattern
                </p>
                <p className="font-semibold text-white text-sm">
                  {blueprint.detectedPattern}
                </p>
              </div>
            </div>

            {/* Recommended App Type Badge */}
            <div className="bg-purple-500/30 border border-purple-400 rounded-full px-4 py-2 flex items-center gap-2 backdrop-blur-sm">
              <span className="text-lg">⚡</span>
              <div>
                <p className="text-xs text-purple-200 uppercase tracking-wider">
                  App Type
                </p>
                <p className="font-semibold text-white text-sm capitalize">
                  {blueprint.recommendedAppType.replace("-", " ")}
                </p>
              </div>
            </div>

            {/* Readiness Score Badge */}
            <div className="bg-green-500/30 border border-green-400 rounded-full px-4 py-2 flex items-center gap-2 backdrop-blur-sm">
              <span className="text-lg">📊</span>
              <div>
                <p className="text-xs text-green-200 uppercase tracking-wider">
                  Readiness
                </p>
                <p className="font-semibold text-white text-sm">
                  {blueprint.readinessScore}/100
                </p>
              </div>
            </div>

            {/* Mode Badge */}
            <div className="bg-amber-500/30 border border-amber-400 rounded-full px-4 py-2 flex items-center gap-2 backdrop-blur-sm">
              <span className="text-lg">🎯</span>
              <div>
                <p className="text-xs text-amber-200 uppercase tracking-wider">
                  Mode
                </p>
                <p className="font-semibold text-white text-sm capitalize">
                  {blueprint.mode}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200 bg-white sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-0">
          <div className="flex gap-0 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-4 font-medium text-sm whitespace-nowrap transition-all border-b-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-0 ${
                  activeTab === tab.id
                    ? "border-blue-600 text-blue-600 bg-blue-50"
                    : "border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                }`}
                aria-selected={activeTab === tab.id}
                role="tab"
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-8 py-8">
          {/* Overview Tab */}
          {activeTab === "overview" && <OverviewTab blueprint={blueprint} />}

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
      <div className="border-t border-gray-200 bg-gray-50 px-8 py-6">
        <div className="max-w-7xl mx-auto flex justify-between items-start">
          <ReadinessScore
            score={blueprint.readinessScore}
            maxScore={100}
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
