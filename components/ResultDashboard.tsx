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

export const ResultDashboard: React.FC<ResultDashboardProps> = ({
  blueprint,
  isLoading = false,
}) => {
  const [activeTab, setActiveTab] = useState("overview");

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
          Enter your requirements and click "Generate Blueprint" to get started
        </p>
      </div>
    );
  }

  const tabs = [
    { id: "overview", label: "Overview", icon: "📋" },
    { id: "dataverse", label: "Dataverse", icon: "📦" },
    { id: "flows", label: "Flows", icon: "⚙️" },
    { id: "security", label: "Security", icon: "🔐" },
    { id: "alm", label: "ALM", icon: "🚀" },
    { id: "architecture", label: "Architecture", icon: "🏗️" },
    { id: "risks", label: "Risks", icon: "⚠️" },
    { id: "export", label: "Export", icon: "💾" },
  ];

  return (
    <div className="w-full">
      {/* Tab Navigation */}
      <div className="border-b border-gray-200 overflow-x-auto">
        <div className="flex gap-0 flex-nowrap">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-3 font-medium text-sm whitespace-nowrap transition-all ${
                activeTab === tab.id
                  ? "border-b-2 border-blue-600 text-blue-600"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              }`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="bg-white">
        {/* Overview */}
        {activeTab === "overview" && (
          <div className="p-8 space-y-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Executive Summary
              </h2>
              <p className="text-gray-700 leading-relaxed mb-6">
                {blueprint.executiveSummary}
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-sm text-blue-600 font-medium mb-1">
                    Detected Pattern
                  </p>
                  <p className="text-gray-900 font-semibold">
                    {blueprint.detectedPattern}
                  </p>
                </div>
                <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                  <p className="text-sm text-purple-600 font-medium mb-1">
                    Recommended App Type
                  </p>
                  <p className="text-gray-900 font-semibold capitalize">
                    {blueprint.recommendedAppType.replace("-", " ")}
                  </p>
                </div>
                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <p className="text-sm text-green-600 font-medium mb-1">
                    Readiness Score
                  </p>
                  <p className="text-gray-900 font-semibold">
                    {blueprint.readinessScore}/100
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Key Assumptions
              </h3>
              <ul className="space-y-2">
                {blueprint.assumptions.map((assumption, idx) => (
                  <li key={idx} className="flex gap-3 text-gray-700">
                    <span className="text-blue-600 font-bold flex-shrink-0">
                      ✓
                    </span>
                    <span>{assumption}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Licensing & Cost
              </h3>
              <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
                <p className="text-yellow-900 text-sm whitespace-pre-wrap font-mono leading-relaxed">
                  {blueprint.licensingNotes}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Dataverse */}
        {activeTab === "dataverse" && (
          <div className="p-8">
            <DataverseSchemaView tables={blueprint.dataverseTables} />
          </div>
        )}

        {/* Flows */}
        {activeTab === "flows" && (
          <div className="p-8">
            <FlowDesignView flows={blueprint.powerAutomateFlows} />
          </div>
        )}

        {/* Security */}
        {activeTab === "security" && (
          <div className="p-8">
            <SecurityModelView roles={blueprint.securityRoles} />
          </div>
        )}

        {/* ALM */}
        {activeTab === "alm" && (
          <div className="p-8 space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Environment & ALM Strategy
              </h2>
              <p className="text-gray-600 mb-6">
                Three-stage approach: Development → Test/UAT → Production with
                clear responsibilities
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {blueprint.almPlan.map((stage, idx) => (
                  <div
                    key={idx}
                    className="border border-gray-200 rounded-lg p-6"
                  >
                    <h3 className="font-bold text-gray-900 mb-2">
                      {stage.name}
                    </h3>
                    <p className="text-sm text-gray-600 mb-3">
                      {stage.description}
                    </p>
                    <div className="space-y-2 text-sm">
                      <div>
                        <span className="text-gray-600">Purpose:</span>
                        <p className="text-gray-900">{stage.purpose}</p>
                      </div>
                      <div>
                        <span className="text-gray-600">Users:</span>
                        <p className="text-gray-900">{stage.userBase}</p>
                      </div>
                      <div>
                        <span className="text-gray-600">Frequency:</span>
                        <p className="text-gray-900">
                          {stage.deploymentFrequency}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Architecture */}
        {activeTab === "architecture" && (
          <div className="p-8">
            <MermaidDiagram
              diagram={blueprint.architectureDiagramMermaid}
              title="Solution Architecture"
            />
          </div>
        )}

        {/* Risks */}
        {activeTab === "risks" && (
          <div className="p-8">
            <RiskPanel risks={blueprint.risks} />
          </div>
        )}

        {/* Export */}
        {activeTab === "export" && (
          <div className="p-8">
            <ExportPanel blueprint={blueprint} />
          </div>
        )}
      </div>

      {/* Bottom Action Bar */}
      <div className="border-t border-gray-200 bg-gray-50 p-6 flex justify-between items-center">
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
  );
};
