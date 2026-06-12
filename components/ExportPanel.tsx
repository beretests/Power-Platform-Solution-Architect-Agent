"use client";

import React, { useState } from "react";
import { Blueprint } from "@/lib/mockResults";
import { exportToMarkdown, exportToJSON } from "@/lib/exportMarkdown";

interface ExportPanelProps {
  blueprint?: Blueprint;
}

export const ExportPanel: React.FC<ExportPanelProps> = ({ blueprint }) => {
  const [isExporting, setIsExporting] = useState(false);
  const [exported, setExported] = useState<string | null>(null);

  if (!blueprint) {
    return (
      <div className="text-center text-gray-500">
        <p>No blueprint to export</p>
      </div>
    );
  }

  const handleExportMarkdown = async () => {
    setIsExporting(true);
    try {
      const markdown = exportToMarkdown(blueprint);
      const element = document.createElement("a");
      const file = new Blob([markdown], { type: "text/markdown" });
      element.href = URL.createObjectURL(file);
      element.download = `blueprint-${new Date().toISOString().split("T")[0]}.md`;
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);

      setExported("markdown");
      setTimeout(() => setExported(null), 3000);
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportJSON = async () => {
    setIsExporting(true);
    try {
      const json = exportToJSON(blueprint);
      const element = document.createElement("a");
      const file = new Blob([json], { type: "application/json" });
      element.href = URL.createObjectURL(file);
      element.download = `blueprint-${new Date().toISOString().split("T")[0]}.json`;
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);

      setExported("json");
      setTimeout(() => setExported(null), 3000);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Export Blueprint
        </h2>
        <p className="text-gray-600 mb-6">
          Download your solution blueprint in your preferred format. Share with
          your team, version control, or integrate with your development tools.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Markdown Export */}
        <div className="p-6 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-all text-left">
          <div className="flex items-start justify-between mb-3">
            <div>
              <h3 className="font-semibold text-gray-900 text-lg">Markdown</h3>
              <p className="text-sm text-gray-600">.md format</p>
            </div>
            <svg
              className="w-8 h-8 text-blue-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4v.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <p className="text-sm text-gray-600 mb-4">
            Design document with formatted tables, diagrams, and detailed
            explanations. Perfect for documentation and stakeholder review.
          </p>
          <div className="flex gap-2">
            <button
              onClick={handleExportMarkdown}
              disabled={isExporting}
              className={`px-4 py-2 rounded-lg font-medium transition-all w-full ${
                isExporting
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                  : "bg-blue-600 text-white hover:bg-blue-700"
              }`}
            >
              {isExporting ? "Exporting..." : "Download Markdown"}
            </button>
          </div>
        </div>

        {/* JSON Export */}
        <div className="p-6 border border-gray-200 rounded-lg hover:border-green-300 hover:bg-green-50 transition-all text-left">
          <div className="flex items-start justify-between mb-3">
            <div>
              <h3 className="font-semibold text-gray-900 text-lg">JSON</h3>
              <p className="text-sm text-gray-600">.json format</p>
            </div>
            <svg
              className="w-8 h-8 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
          </div>
          <p className="text-sm text-gray-600 mb-4">
            Structured data format for programmatic access. Integrate with CI/CD
            pipelines, development tools, or generate additional artifacts.
          </p>
          <div className="flex gap-2">
            <button
              onClick={handleExportJSON}
              disabled={isExporting}
              className={`px-4 py-2 rounded-lg font-medium transition-all w-full ${
                isExporting
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                  : "bg-green-600 text-white hover:bg-green-700"
              }`}
            >
              {isExporting ? "Exporting..." : "Download JSON"}
            </button>
          </div>
        </div>
      </div>

      {/* Success Message */}
      {exported && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center gap-3">
            <svg
              className="w-5 h-5 text-green-600"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            <p className="text-green-800 font-medium">
              ✓ Blueprint exported as {exported.toUpperCase()}
            </p>
          </div>
        </div>
      )}

      {/* Additional Export Options */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
        <h3 className="font-semibold text-gray-900 mb-3">Next Steps</h3>
        <ul className="space-y-2 text-sm text-gray-700">
          <li className="flex items-center gap-2">
            <span className="text-blue-600">✓</span>
            Share Markdown with stakeholders for review and approval
          </li>
          <li className="flex items-center gap-2">
            <span className="text-blue-600">✓</span>
            Version control JSON in your repository
          </li>
          <li className="flex items-center gap-2">
            <span className="text-blue-600">✓</span>
            Use as reference for solution implementation
          </li>
          <li className="flex items-center gap-2">
            <span className="text-blue-600">✓</span>
            Present to Solution Review Board for governance approval
          </li>
        </ul>
      </div>
    </div>
  );
};
