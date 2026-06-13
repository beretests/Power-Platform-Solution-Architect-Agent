"use client";

import React from "react";
import { SolutionArchitectureResult } from "@/lib/schemas";

interface OverviewTabProps {
  blueprint?: SolutionArchitectureResult;
}

const appTypeDetails: Record<
  string,
  { icon: string; rationale: string; description: string }
> = {
  "model-driven": {
    icon: "📊",
    rationale: "Complex workflows, role-based access, and audit requirements",
    description:
      "Powerful form-based apps with deep data model integration, ideal for enterprise processes",
  },
  canvas: {
    icon: "🎨",
    rationale: "User-friendly interface needed for diverse user groups",
    description:
      "Flexible, customizable apps for modern user experiences, great for quick adoption",
  },
  hybrid: {
    icon: "⚡",
    rationale: "Combined needs for power and flexibility",
    description:
      "Model-driven backbone with canvas experiences for specific workflows",
  },
  pages: {
    icon: "📄",
    rationale: "Public-facing or self-service portal requirements",
    description:
      "Secure, branded web experiences for external or internal portals",
  },
};

export const OverviewTab: React.FC<OverviewTabProps> = ({ blueprint }) => {
  if (!blueprint) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        <p>No blueprint data available</p>
      </div>
    );
  }

  const appTypeKey = blueprint.recommendedAppType.appType;
  const appTypeInfo =
    appTypeDetails[appTypeKey] || appTypeDetails["model-driven"];
  const displayAppType = blueprint.recommendedAppType.appType.replace("-", " ");

  return (
    <div className="space-y-6">
      {/* Executive Summary Card */}
      <div className="bg-gradient-to-r from-blue-50 to-blue-100 border-2 border-blue-200 rounded-lg p-6">
        <div className="flex items-start gap-3">
          <span className="text-2xl">📋</span>
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-blue-900 mb-1 uppercase tracking-wide">
              Executive Summary
            </h3>
            <p className="text-gray-800 leading-relaxed font-medium">
              {blueprint.executiveSummary}
            </p>
          </div>
        </div>
      </div>

      {/* Recommended App Type Card */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white border-2 border-purple-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-start gap-3 mb-3">
            <span className="text-3xl">{appTypeInfo.icon}</span>
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                Recommended App Type
              </p>
              <h4 className="text-2xl font-bold text-gray-900 capitalize">
                {displayAppType}
              </h4>
            </div>
          </div>
          <p className="text-sm text-gray-700 font-medium mb-3">
            {blueprint.recommendedAppType.rationale || appTypeInfo.description}
          </p>
          <div className="bg-purple-50 rounded border border-purple-200 p-2">
            <p className="text-xs text-purple-900 font-semibold">
              ✓ {appTypeInfo.rationale}
            </p>
          </div>
          {blueprint.recommendedAppType.alternatives.length > 0 && (
            <p className="text-xs text-gray-500 mt-3">
              Alternatives: {blueprint.recommendedAppType.alternatives.join(", ")}
            </p>
          )}
        </div>

        {/* Detected Pattern Card */}
        <div className="bg-white border-2 border-green-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-start gap-3 mb-3">
            <span className="text-3xl">🔍</span>
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                Detected Pattern
              </p>
              <h4 className="text-lg font-bold text-gray-900">
                {blueprint.detectedPattern}
              </h4>
            </div>
          </div>
          <p className="text-xs text-gray-600">
            This pattern suggests best practices for solution design and
            architecture
          </p>
        </div>
      </div>

      {/* Assumptions Section */}
      <div className="bg-white border-2 border-amber-200 rounded-lg p-6">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-2xl">⚠️</span>
          <h3 className="text-lg font-bold text-gray-900">Key Assumptions</h3>
          <span className="ml-auto bg-amber-100 text-amber-800 text-xs font-semibold px-2 py-1 rounded">
            {blueprint.assumptions.length} items
          </span>
        </div>
        <ul className="space-y-2">
          {blueprint.assumptions.map((assumption, idx) => (
            <li key={idx} className="flex items-start gap-3">
              <span className="text-amber-600 font-bold flex-shrink-0 mt-0.5">
                ✓
              </span>
              <span className="text-gray-700 font-medium">{assumption}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Licensing Notes Section */}
      <div className="bg-white border-2 border-indigo-200 rounded-lg p-6">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-2xl">💰</span>
          <h3 className="text-lg font-bold text-gray-900">
            Licensing & Cost Notes
          </h3>
        </div>
        <div className="bg-indigo-50 rounded border border-indigo-200 p-4">
          <ul className="space-y-2">
            {blueprint.licensingNotes.map((note, idx) => (
              <li key={idx} className="flex gap-2 text-gray-800 font-medium">
                <span className="text-indigo-600 flex-shrink-0">✓</span>
                <span>{note}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Follow-Up Questions Section */}
      {blueprint.followUpQuestions &&
        blueprint.followUpQuestions.length > 0 && (
          <div className="bg-white border-2 border-cyan-200 rounded-lg p-6">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl">❓</span>
              <h3 className="text-lg font-bold text-gray-900">
                Follow-Up Discovery Questions
              </h3>
              <span className="ml-auto bg-cyan-100 text-cyan-800 text-xs font-semibold px-2 py-1 rounded">
                {blueprint.followUpQuestions.length} questions
              </span>
            </div>
            <ol className="space-y-2">
              {blueprint.followUpQuestions.map((question, idx) => (
                <li
                  key={idx}
                  className="border border-gray-200 rounded-lg px-4 py-3 flex items-start gap-3"
                >
                  <span className="text-cyan-600 font-bold flex-shrink-0 mt-0.5">
                    {idx + 1}.
                  </span>
                  <span className="flex-1 font-medium text-gray-900">
                    {question}
                  </span>
                </li>
              ))}
            </ol>
          </div>
        )}
    </div>
  );
};
