"use client";

import React from "react";
import {
  CheckCircle2,
  FileStack,
  ListChecks,
  RotateCcw,
  Settings2,
  ShieldCheck,
} from "lucide-react";
import { ALMPlan } from "@/lib/schemas";

interface ALMChecklistViewProps {
  almPlan?: ALMPlan;
}

interface ChecklistSection {
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  tone: string;
  items: string[];
}

const stageAccentClasses = [
  "border-blue-200 bg-blue-50 text-blue-700",
  "border-purple-200 bg-purple-50 text-purple-700",
  "border-green-200 bg-green-50 text-green-700",
];

const getToneClasses = (tone: string) => {
  switch (tone) {
    case "blue":
      return "border-blue-200 bg-blue-50 text-blue-700";
    case "purple":
      return "border-purple-200 bg-purple-50 text-purple-700";
    case "cyan":
      return "border-cyan-200 bg-cyan-50 text-cyan-700";
    case "green":
      return "border-green-200 bg-green-50 text-green-700";
    case "amber":
      return "border-amber-200 bg-amber-50 text-amber-700";
    default:
      return "border-gray-200 bg-gray-50 text-gray-700";
  }
};

export const ALMChecklistView: React.FC<ALMChecklistViewProps> = ({
  almPlan,
}) => {
  if (!almPlan) {
    return (
      <div className="p-6 bg-gray-50 rounded-lg border border-gray-200 text-center text-gray-500">
        No ALM plan defined yet
      </div>
    );
  }

  const checklistSections: ChecklistSection[] = [
    {
      title: "Solution Strategy",
      description: "Package and release solution components consistently.",
      icon: FileStack,
      tone: "blue",
      items: almPlan.solutionStrategy,
    },
    {
      title: "Connection References",
      description: "Keep connector ownership explicit across environments.",
      icon: Settings2,
      tone: "purple",
      items: almPlan.connectionReferences,
    },
    {
      title: "Environment Variables",
      description: "Move environment-specific configuration out of solution logic.",
      icon: Settings2,
      tone: "cyan",
      items: almPlan.environmentVariables,
    },
    {
      title: "Deployment Steps",
      description: "Promote changes through controlled release gates.",
      icon: ListChecks,
      tone: "green",
      items: almPlan.deploymentSteps,
    },
    {
      title: "Rollback Plan",
      description: "Prepare recovery steps before production change windows.",
      icon: RotateCcw,
      tone: "amber",
      items: almPlan.rollbackPlan,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-5">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded bg-white border border-indigo-200 text-indigo-700">
            <ShieldCheck className="h-5 w-5" aria-hidden="true" />
          </div>
          <div>
            <h3 className="font-bold text-indigo-950">
              Production deployment should use managed solutions and
              environment-specific configuration.
            </h3>
            <p className="text-sm text-indigo-800 mt-1">
              Treat this checklist as the release control surface for promoting
              changes from development through production.
            </p>
          </div>
        </div>
      </div>

      <section>
        <div className="flex items-center justify-between gap-3 mb-3">
          <div>
            <h3 className="text-lg font-bold text-gray-900">Environments</h3>
            <p className="text-sm text-gray-600">
              Validate each environment before promoting the next solution
              package.
            </p>
          </div>
          <span className="rounded bg-gray-100 px-2.5 py-1 text-xs font-semibold text-gray-700">
            {almPlan.environments.length} stages
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {almPlan.environments.map((environment, idx) => {
            const accent =
              stageAccentClasses[idx] ??
              stageAccentClasses[stageAccentClasses.length - 1];

            return (
              <div
                key={environment}
                className="bg-white border border-gray-200 rounded-lg p-5"
              >
                <div className="flex items-start gap-3 mb-4">
                  <span
                    className={`flex h-8 w-8 items-center justify-center rounded border text-sm font-bold ${accent}`}
                  >
                    {idx + 1}
                  </span>
                  <div>
                    <h4 className="font-bold text-gray-900">
                      Environment {idx + 1}
                    </h4>
                  </div>
                </div>

                <ul className="space-y-3">
                  <li className="flex gap-2 text-sm text-gray-700">
                    <CheckCircle2
                      className="h-4 w-4 flex-shrink-0 text-green-600 mt-0.5"
                      aria-hidden="true"
                    />
                    <span>{environment}</span>
                  </li>
                </ul>
              </div>
            );
          })}
        </div>
      </section>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {checklistSections.map((section) => {
          const Icon = section.icon;
          const toneClasses = getToneClasses(section.tone);

          return (
            <section
              key={section.title}
              className="bg-white border border-gray-200 rounded-lg overflow-hidden"
            >
              <div className="px-5 py-4 border-b border-gray-200">
                <div className="flex items-start gap-3">
                  <div
                    className={`flex h-9 w-9 items-center justify-center rounded border ${toneClasses}`}
                  >
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">
                      {section.title}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {section.description}
                    </p>
                  </div>
                </div>
              </div>

              <ul className="divide-y divide-gray-100">
                {section.items.map((item) => (
                  <li key={item} className="flex gap-3 px-5 py-3">
                    <CheckCircle2
                      className="h-4 w-4 flex-shrink-0 text-green-600 mt-0.5"
                      aria-hidden="true"
                    />
                    <span className="text-sm text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
            </section>
          );
        })}
      </div>
    </div>
  );
};
