"use client";

import React, { useMemo, useState } from "react";
import {
  Check,
  Clipboard,
  Code2,
  Download,
  FileCode2,
  FileText,
} from "lucide-react";
import { SolutionArchitectureResult } from "@/lib/schemas";
import {
  downloadBlueprint,
  exportToJSON,
  exportToMarkdown,
} from "@/lib/exportMarkdown";

interface ExportPanelProps {
  blueprint?: SolutionArchitectureResult;
}

type ExportAction = "markdown" | "json" | "mermaid";

const getDateStamp = () => new Date().toISOString().split("T")[0];

const getBaseFilename = (blueprint: SolutionArchitectureResult) =>
  `blueprint-${blueprint.id || getDateStamp()}`;

export const ExportPanel: React.FC<ExportPanelProps> = ({ blueprint }) => {
  const [status, setStatus] = useState<string | null>(null);
  const [busyAction, setBusyAction] = useState<ExportAction | null>(null);

  const markdown = useMemo(
    () => (blueprint ? exportToMarkdown(blueprint) : ""),
    [blueprint],
  );
  const json = useMemo(
    () => (blueprint ? exportToJSON(blueprint) : ""),
    [blueprint],
  );

  if (!blueprint) {
    return (
      <div className="p-6 bg-gray-50 rounded-lg border border-gray-200 text-center text-gray-500">
        No blueprint to export
      </div>
    );
  }

  const showStatus = (message: string) => {
    setStatus(message);
    window.setTimeout(() => setStatus(null), 2400);
  };

  const copyText = async (
    action: ExportAction,
    content: string,
    successMessage: string,
  ) => {
    setBusyAction(action);
    try {
      await navigator.clipboard.writeText(content);
      showStatus(successMessage);
    } catch {
      showStatus("Copy failed. Use download instead or copy from the source view.");
    } finally {
      setBusyAction(null);
    }
  };

  const handleDownloadMarkdown = () => {
    setBusyAction("markdown");
    downloadBlueprint(markdown, `${getBaseFilename(blueprint)}.md`, "markdown");
    setBusyAction(null);
    showStatus("Markdown download started.");
  };

  const handleDownloadJSON = () => {
    setBusyAction("json");
    downloadBlueprint(json, `${getBaseFilename(blueprint)}.json`, "json");
    setBusyAction(null);
    showStatus("JSON download started.");
  };

  const actionCards = [
    {
      title: "Copy Markdown",
      description:
        "Copy the complete stakeholder-ready blueprint document to the clipboard.",
      icon: Clipboard,
      tone: "blue",
      onClick: () =>
        copyText("markdown", markdown, "Markdown copied to clipboard."),
      disabled: busyAction === "markdown",
    },
    {
      title: "Download Markdown",
      description:
        "Download a .md file with requirements, design, roles, ALM, risks, and checklist.",
      icon: FileText,
      tone: "indigo",
      onClick: handleDownloadMarkdown,
      disabled: busyAction === "markdown",
    },
    {
      title: "Download JSON",
      description:
        "Download the full structured blueprint payload for tooling or version control.",
      icon: FileCode2,
      tone: "green",
      onClick: handleDownloadJSON,
      disabled: busyAction === "json",
    },
    {
      title: "Copy Mermaid",
      description:
        "Copy only the Mermaid diagram source for diagrams, docs, or review comments.",
      icon: Code2,
      tone: "amber",
      onClick: () =>
        copyText(
          "mermaid",
          blueprint.architectureDiagramMermaid,
          "Mermaid source copied to clipboard.",
        ),
      disabled: busyAction === "mermaid",
    },
  ];

  const getToneClasses = (tone: string) => {
    switch (tone) {
      case "blue":
        return "border-blue-200 bg-blue-50 text-blue-700";
      case "indigo":
        return "border-indigo-200 bg-indigo-50 text-indigo-700";
      case "green":
        return "border-green-200 bg-green-50 text-green-700";
      case "amber":
        return "border-amber-200 bg-amber-50 text-amber-700";
      default:
        return "border-gray-200 bg-gray-50 text-gray-700";
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Export Blueprint
        </h2>
        <p className="text-gray-600">
          Export documentation and source artifacts for review, implementation,
          and version control. PDF export is intentionally not included yet.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {actionCards.map((action) => {
          const Icon = action.icon;
          const toneClasses = getToneClasses(action.tone);

          return (
            <button
              key={action.title}
              type="button"
              onClick={action.onClick}
              disabled={action.disabled}
              className="group rounded-lg border border-gray-200 bg-white p-5 text-left transition-all hover:border-blue-300 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <div className="flex items-start gap-4">
                <div
                  className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded border ${toneClasses}`}
                >
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </div>
                <div className="min-w-0">
                  <h3 className="font-bold text-gray-900">{action.title}</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    {action.description}
                  </p>
                </div>
                <Download
                  className="ml-auto h-4 w-4 flex-shrink-0 text-gray-400 opacity-0 transition-opacity group-hover:opacity-100"
                  aria-hidden="true"
                />
              </div>
            </button>
          );
        })}
      </div>

      {status && (
        <div className="flex items-center gap-3 rounded-lg border border-green-200 bg-green-50 p-4">
          <Check className="h-5 w-5 text-green-600" aria-hidden="true" />
          <p className="text-sm font-medium text-green-800">{status}</p>
        </div>
      )}

      <div className="bg-gray-50 border border-gray-200 rounded-lg p-5">
        <h3 className="font-semibold text-gray-900 mb-3">Markdown Includes</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 text-sm text-gray-700">
          {[
            "Original requirement",
            "Executive summary",
            "Recommended app type",
            "Assumptions",
            "Dataverse tables",
            "Power Automate flows",
            "Security roles",
            "ALM plan",
            "Risks",
            "Implementation checklist",
            "Follow-up questions",
            "Mermaid diagram source",
          ].map((item) => (
            <div key={item} className="flex items-center gap-2">
              <Check className="h-4 w-4 text-green-600" aria-hidden="true" />
              <span>{item}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
