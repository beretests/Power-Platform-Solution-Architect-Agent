"use client";

import React from "react";
import {
  CheckCircle2,
  Database,
  FileStack,
  ListChecks,
  RotateCcw,
  Settings2,
  ShieldCheck,
} from "lucide-react";
import { ALMStage } from "@/lib/mockResults";

interface ALMChecklistViewProps {
  almPlan?: ALMStage[];
}

interface ChecklistSection {
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  tone: string;
  items: string[];
}

const solutionStrategyItems = [
  "Use a dedicated publisher and structured solution naming convention.",
  "Keep Dataverse tables, apps, flows, security roles, and supporting assets in one deployable solution set.",
  "Export unmanaged solutions from development only; import managed solutions into test and production.",
  "Version every solution package and retain release notes for each deployment.",
];

const connectionReferenceItems = [
  "Create connection references for every Power Automate connector used by the solution.",
  "Use service-owned or platform-owned connections for production flows where appropriate.",
  "Validate connector permissions during UAT before production import.",
  "Document who owns each production connection and how credentials are rotated.",
];

const environmentVariableItems = [
  "Store environment-specific URLs, mailbox addresses, team IDs, queue IDs, and feature flags as environment variables.",
  "Set values per environment during import rather than hardcoding them in apps or flows.",
  "Review secret values and sensitive configuration with platform administrators.",
  "Confirm production values before activating flows.",
];

const deploymentStepItems = [
  "Freeze changes in development and export a versioned unmanaged solution backup.",
  "Export the release candidate as a managed solution.",
  "Import into test/UAT, set connection references and environment variables, then run smoke tests.",
  "Collect approval from business owner, security owner, and platform administrator.",
  "Import the managed solution into production and validate app launch, flow ownership, and core records.",
];

const rollbackPlanItems = [
  "Keep the previous managed solution package available for rollback.",
  "Capture production configuration values before deployment.",
  "Disable newly introduced flows if validation fails.",
  "Restore prior solution version or apply a forward-fix solution depending on impact.",
  "Communicate rollback status and confirm data integrity after recovery.",
];

const checklistSections: ChecklistSection[] = [
  {
    title: "Solution Strategy",
    description: "Package and release solution components consistently.",
    icon: FileStack,
    tone: "blue",
    items: solutionStrategyItems,
  },
  {
    title: "Connection References",
    description: "Keep connector ownership explicit across environments.",
    icon: Settings2,
    tone: "purple",
    items: connectionReferenceItems,
  },
  {
    title: "Environment Variables",
    description: "Move environment-specific configuration out of solution logic.",
    icon: Database,
    tone: "cyan",
    items: environmentVariableItems,
  },
  {
    title: "Deployment Steps",
    description: "Promote changes through controlled release gates.",
    icon: ListChecks,
    tone: "green",
    items: deploymentStepItems,
  },
  {
    title: "Rollback Plan",
    description: "Prepare recovery steps before production change windows.",
    icon: RotateCcw,
    tone: "amber",
    items: rollbackPlanItems,
  },
];

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
  almPlan = [],
}) => {
  if (almPlan.length === 0) {
    return (
      <div className="p-6 bg-gray-50 rounded-lg border border-gray-200 text-center text-gray-500">
        No ALM plan defined yet
      </div>
    );
  }

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
            {almPlan.length} stages
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {almPlan.map((stage, idx) => {
            const accent =
              stageAccentClasses[idx] ??
              stageAccentClasses[stageAccentClasses.length - 1];

            return (
              <div
                key={stage.name}
                className="bg-white border border-gray-200 rounded-lg p-5"
              >
                <div className="flex items-start gap-3 mb-4">
                  <span
                    className={`flex h-8 w-8 items-center justify-center rounded border text-sm font-bold ${accent}`}
                  >
                    {idx + 1}
                  </span>
                  <div>
                    <h4 className="font-bold text-gray-900">{stage.name}</h4>
                    <p className="text-sm text-gray-600 mt-1">
                      {stage.description}
                    </p>
                  </div>
                </div>

                <ul className="space-y-3">
                  <li className="flex gap-2 text-sm text-gray-700">
                    <CheckCircle2
                      className="h-4 w-4 flex-shrink-0 text-green-600 mt-0.5"
                      aria-hidden="true"
                    />
                    <span>{stage.purpose}</span>
                  </li>
                  <li className="flex gap-2 text-sm text-gray-700">
                    <CheckCircle2
                      className="h-4 w-4 flex-shrink-0 text-green-600 mt-0.5"
                      aria-hidden="true"
                    />
                    <span>{stage.userBase}</span>
                  </li>
                  <li className="flex gap-2 text-sm text-gray-700">
                    <CheckCircle2
                      className="h-4 w-4 flex-shrink-0 text-green-600 mt-0.5"
                      aria-hidden="true"
                    />
                    <span>{stage.deploymentFrequency}</span>
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
