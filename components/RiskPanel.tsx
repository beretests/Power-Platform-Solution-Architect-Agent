import React from "react";
import { AlertTriangle, CheckCircle2, ShieldAlert } from "lucide-react";

interface Risk {
  id: string;
  category: string;
  description: string;
  severity: "low" | "medium" | "high";
  mitigation: string;
}

interface RiskPanelProps {
  risks?: Risk[];
}

type Severity = Risk["severity"];

interface SeverityConfig {
  label: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  sectionClass: string;
  headerClass: string;
  badgeClass: string;
  iconClass: string;
}

const severityOrder: Severity[] = ["high", "medium", "low"];

const severityConfig: Record<Severity, SeverityConfig> = {
  high: {
    label: "High",
    description: "Requires explicit ownership before production approval.",
    icon: ShieldAlert,
    sectionClass: "border-red-300 bg-red-50",
    headerClass: "text-red-950",
    badgeClass: "bg-red-100 text-red-800 border-red-200",
    iconClass: "text-red-700 bg-white border-red-200",
  },
  medium: {
    label: "Medium",
    description: "Track during delivery and verify mitigation in UAT.",
    icon: AlertTriangle,
    sectionClass: "border-amber-200 bg-amber-50",
    headerClass: "text-amber-950",
    badgeClass: "bg-amber-100 text-amber-800 border-amber-200",
    iconClass: "text-amber-700 bg-white border-amber-200",
  },
  low: {
    label: "Low",
    description: "Monitor as part of normal solution governance.",
    icon: CheckCircle2,
    sectionClass: "border-green-200 bg-green-50",
    headerClass: "text-green-950",
    badgeClass: "bg-green-100 text-green-800 border-green-200",
    iconClass: "text-green-700 bg-white border-green-200",
  },
};

export const RiskPanel: React.FC<RiskPanelProps> = ({ risks = [] }) => {
  const groupedRisks = severityOrder.map((severity) => ({
    severity,
    risks: risks.filter((risk) => risk.severity === severity),
  }));

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-900 font-medium">
          AI-generated architecture must be validated by a human solution
          architect before production use.
        </p>
      </div>

      {risks.length === 0 ? (
        <div className="p-6 bg-gray-50 rounded-lg border border-gray-200 text-center text-gray-500">
          No risks identified
        </div>
      ) : (
        <div className="space-y-5">
          {groupedRisks.map(({ severity, risks: risksForSeverity }) => {
            const config = severityConfig[severity];
            const Icon = config.icon;
            const isHigh = severity === "high";

            return (
              <section
                key={severity}
                className={`border rounded-lg overflow-hidden ${config.sectionClass}`}
              >
                <div className="px-5 py-4 border-b border-current/10">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-start gap-3">
                      <div
                        className={`flex h-10 w-10 items-center justify-center rounded border ${config.iconClass}`}
                      >
                        <Icon className="h-5 w-5" aria-hidden="true" />
                      </div>
                      <div>
                        <h3
                          className={`text-lg font-bold ${config.headerClass}`}
                        >
                          {config.label} Severity
                        </h3>
                        <p className="text-sm text-gray-700">
                          {config.description}
                        </p>
                      </div>
                    </div>
                    <span
                      className={`inline-flex w-fit rounded border px-2.5 py-1 text-xs font-semibold ${config.badgeClass}`}
                    >
                      {risksForSeverity.length} risks
                    </span>
                  </div>
                </div>

                {risksForSeverity.length === 0 ? (
                  <div className="bg-white/70 px-5 py-4 text-sm text-gray-500">
                    No {config.label.toLowerCase()} severity risks identified.
                  </div>
                ) : (
                  <div
                    className={`grid grid-cols-1 gap-3 p-4 ${
                      isHigh ? "lg:grid-cols-1" : "lg:grid-cols-2"
                    }`}
                  >
                    {risksForSeverity.map((risk) => (
                      <article
                        key={risk.id}
                        className={`bg-white border rounded-lg p-4 ${
                          isHigh
                            ? "border-red-300 shadow-sm"
                            : "border-gray-200"
                        }`}
                      >
                        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between mb-3">
                          <div>
                            <p className="text-xs font-semibold text-gray-500 uppercase">
                              Area
                            </p>
                            <h4 className="font-bold text-gray-900">
                              {risk.category}
                            </h4>
                          </div>
                          {isHigh && (
                            <span className="inline-flex w-fit rounded bg-red-100 px-2 py-1 text-xs font-semibold text-red-800 border border-red-200">
                              Priority review
                            </span>
                          )}
                        </div>

                        <div className="space-y-3">
                          <div>
                            <p className="text-xs font-semibold text-gray-500 uppercase mb-1">
                              Description
                            </p>
                            <p className="text-sm text-gray-700">
                              {risk.description}
                            </p>
                          </div>

                          <div className="bg-gray-50 border border-gray-200 rounded px-3 py-2">
                            <p className="text-xs font-semibold text-gray-500 uppercase mb-1">
                              Mitigation
                            </p>
                            <p className="text-sm text-gray-700">
                              {risk.mitigation}
                            </p>
                          </div>
                        </div>
                      </article>
                    ))}
                  </div>
                )}
              </section>
            );
          })}
        </div>
      )}
    </div>
  );
};
