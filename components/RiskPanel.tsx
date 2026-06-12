import React from "react";

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

export const RiskPanel: React.FC<RiskPanelProps> = ({ risks = [] }) => {
  const severityColors = {
    low: "bg-green-100 text-green-800 border-green-300",
    medium: "bg-yellow-100 text-yellow-800 border-yellow-300",
    high: "bg-red-100 text-red-800 border-red-300",
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold mb-4">Risks & Considerations</h3>
      </div>

      {risks.length === 0 ? (
        <div className="p-6 bg-gray-50 rounded-lg border border-gray-200 text-center text-gray-500">
          No risks identified
        </div>
      ) : (
        <div className="space-y-3">
          {risks.map((risk) => (
            <div
              key={risk.id}
              className={`border-l-4 p-4 rounded-lg ${severityColors[risk.severity]}`}
            >
              <div className="flex items-start justify-between mb-2">
                <p className="font-semibold">{risk.category}</p>
                <span
                  className={`text-xs font-bold px-2 py-1 rounded border ${severityColors[risk.severity]}`}
                >
                  {risk.severity.toUpperCase()}
                </span>
              </div>
              <p className="text-sm mb-2">{risk.description}</p>
              <p className="text-xs font-medium">
                Mitigation: {risk.mitigation}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
