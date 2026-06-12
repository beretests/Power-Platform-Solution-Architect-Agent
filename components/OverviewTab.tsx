import React from "react";

interface OverviewTabProps {
  summary?: string;
  appType?: string;
  riskLevel?: "low" | "medium" | "high";
}

export const OverviewTab: React.FC<OverviewTabProps> = ({
  summary = "Executive summary placeholder",
  appType = "Not specified",
  riskLevel = "medium",
}) => {
  const riskColors = {
    low: "bg-green-100 text-green-800",
    medium: "bg-yellow-100 text-yellow-800",
    high: "bg-red-100 text-red-800",
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Executive Summary</h3>
        <p className="text-gray-700">{summary}</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
          <p className="text-sm text-gray-600 mb-1">Recommended App Type</p>
          <p className="text-lg font-semibold">{appType}</p>
        </div>
        <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
          <p className="text-sm text-gray-600 mb-1">Risk Level</p>
          <span
            className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${riskColors[riskLevel]}`}
          >
            {riskLevel.charAt(0).toUpperCase() + riskLevel.slice(1)}
          </span>
        </div>
      </div>
    </div>
  );
};
