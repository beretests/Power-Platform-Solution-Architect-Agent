"use client";

import { useState } from "react";
import {
  AlertCircle,
  ArrowLeft,
  Bot,
  CheckCircle2,
  ClipboardCheck,
  FileJson,
  Layers3,
  Loader2,
  ShieldCheck,
  Sparkles,
  Workflow,
} from "lucide-react";
import {
  RequirementForm,
  type WorkMode,
} from "@/components/RequirementForm";
import { ResultDashboard } from "@/components/ResultDashboard";
import {
  getMockArchitectureResult,
  getMockReviewResult,
} from "@/lib/mockResults";
import {
  type ReviewResult,
  type SolutionArchitectureResult,
} from "@/lib/schemas";
import {
  safeParseArchitectureResult,
  safeParseReviewResult,
} from "@/lib/validators";

type DashboardResult = SolutionArchitectureResult | ReviewResult;

const hasMockModeFlag = (data: unknown) => {
  if (!data || typeof data !== "object" || !("mockMode" in data)) {
    return false;
  }

  return (data as { mockMode?: unknown }).mockMode === true;
};

const capabilities = [
  {
    title: "Architecture blueprint",
    description: "Dataverse schema, app type, flows, security, and ALM plan.",
    icon: Layers3,
  },
  {
    title: "Solution review",
    description: "Review Board findings, priority fixes, and readiness score.",
    icon: ClipboardCheck,
  },
  {
    title: "Export-ready",
    description: "Markdown, JSON, and Mermaid outputs for team handoff.",
    icon: FileJson,
  },
];

export default function Home() {
  const [mode, setMode] = useState<WorkMode>("generate");
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [blueprint, setBlueprint] = useState<DashboardResult | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [demoFallbackActive, setDemoFallbackActive] = useState(false);

  const handleSubmit = async () => {
    const trimmedInput = inputText.trim();

    if (!trimmedInput) {
      setApiError(
        mode === "generate"
          ? "Please enter a business requirement before generating."
          : "Please paste an existing design before requesting a review.",
      );
      return;
    }

    if (trimmedInput.length < 30) {
      setApiError("Please provide at least 30 characters.");
      return;
    }

    setIsLoading(true);
    setApiError(null);
    setDemoFallbackActive(false);

    try {
      const endpoint = mode === "generate" ? "/api/architect" : "/api/review";
      const body =
        mode === "generate"
          ? { requirement: trimmedInput }
          : { designText: trimmedInput };

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      const responseBody: unknown = await response.json().catch(() => null);

      if (!response.ok) {
        const message =
          responseBody &&
          typeof responseBody === "object" &&
          "error" in responseBody &&
          typeof responseBody.error === "string"
            ? responseBody.error
            : mode === "generate"
              ? "The architecture service could not generate a blueprint."
              : "The review service could not review the design.";

        setApiError(message);
        return;
      }

      const parsedResult =
        mode === "generate"
          ? safeParseArchitectureResult(responseBody)
          : safeParseReviewResult(responseBody);

      if (!parsedResult.success) {
        setApiError(parsedResult.error);
        return;
      }

      setBlueprint(parsedResult.data);
      setDemoFallbackActive(hasMockModeFlag(responseBody));
      setShowResults(true);
    } catch {
      setApiError(
        mode === "generate"
          ? "We could not reach the architecture service. You can try again or use the demo result."
          : "We could not reach the review service. You can try again or use the demo result.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleUseDemoResult = () => {
    setApiError(null);
    setDemoFallbackActive(false);
    setBlueprint(
      mode === "generate" ? getMockArchitectureResult() : getMockReviewResult(),
    );
    setShowResults(true);
  };

  const handleModeChange = (nextMode: WorkMode) => {
    setMode(nextMode);
    setInputText("");
    setApiError(null);
    setDemoFallbackActive(false);
  };

  const handleReset = () => {
    setShowResults(false);
    setBlueprint(null);
    setInputText("");
    setApiError(null);
    setDemoFallbackActive(false);
  };

  if (showResults && blueprint) {
    return (
      <div className="min-h-screen bg-slate-50">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <button
            onClick={handleReset}
            className="mb-5 inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Designer
          </button>

          <div className="mb-6 rounded-xl border border-slate-200 bg-white px-5 py-5 shadow-sm sm:px-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-blue-700">
                  Power Platform Architect Agent
                </p>
                <h1 className="text-2xl font-bold text-slate-950 sm:text-3xl">
                  {blueprint.mode === "review"
                    ? "Solution Review Board Report"
                    : "Solution Blueprint"}
                </h1>
                <p className="mt-2 text-sm text-slate-600">
                  Production readiness:{" "}
                  <span className="font-semibold text-slate-900">
                    {blueprint.readinessScore.total}/100
                  </span>
                </p>
              </div>
              <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 sm:text-right">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Generated
                </p>
                <p className="mt-1 text-sm font-semibold text-slate-900">
                  {new Date(blueprint.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>

          {demoFallbackActive && (
            <div className="mb-6 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-medium text-amber-900">
              Demo fallback active — Azure OpenAI environment variables are not
              configured.
            </div>
          )}

          <ResultDashboard blueprint={blueprint} />

          <div className="mt-5 rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm leading-6 text-slate-600 shadow-sm">
            <span className="font-semibold text-slate-800">
              Responsible AI notice:
            </span>{" "}
            AI-generated architecture is a starting point. Validate security,
            licensing, data model, ALM, and compliance requirements with your
            organization&apos;s standards before production use.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-950">
      <div className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600 text-white shadow-sm">
              <Bot className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-950 sm:text-lg">
                Solution Architect
              </h2>
              <p className="text-xs text-slate-500">Power Platform Agent</p>
            </div>
          </div>
          <div className="hidden text-right sm:block">
            <p className="text-xs text-slate-500">Microsoft Agents League</p>
            <p className="text-sm font-semibold text-slate-950">
              Creative Apps
            </p>
          </div>
        </div>
      </div>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
        <section className="grid gap-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(500px,1.1fr)] lg:items-start">
          <div className="pt-2 lg:pt-8">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-sm font-semibold text-blue-800">
              <Sparkles className="h-4 w-4" />
              Hackathon-ready enterprise demo
            </div>
            <h1 className="max-w-3xl text-4xl font-bold leading-tight text-slate-950 sm:text-5xl lg:text-6xl">
              Generate and review Power Platform solution designs.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
              Convert business requirements into implementation-ready
              blueprints, or run an existing design through a Solution Review
              Board lens before the team commits to build.
            </p>

            <div className="mt-7 grid gap-3 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
              <div className="rounded-lg border border-slate-200 bg-white px-4 py-3 shadow-sm">
                <p className="text-2xl font-bold text-slate-950">2</p>
                <p className="mt-1 text-xs font-medium uppercase tracking-wide text-slate-500">
                  Operating modes
                </p>
              </div>
              <div className="rounded-lg border border-slate-200 bg-white px-4 py-3 shadow-sm">
                <p className="text-2xl font-bold text-slate-950">100</p>
                <p className="mt-1 text-xs font-medium uppercase tracking-wide text-slate-500">
                  Readiness scale
                </p>
              </div>
              <div className="rounded-lg border border-slate-200 bg-white px-4 py-3 shadow-sm">
                <p className="text-2xl font-bold text-slate-950">JSON</p>
                <p className="mt-1 text-xs font-medium uppercase tracking-wide text-slate-500">
                  Structured output
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white shadow-xl shadow-slate-200/60">
            <div className="border-b border-slate-200 px-5 py-5 sm:px-6">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-700">
                  {mode === "generate" ? (
                    <Workflow className="h-5 w-5" />
                  ) : (
                    <ShieldCheck className="h-5 w-5" />
                  )}
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-slate-950">
                    {mode === "generate"
                      ? "Generate Architecture"
                      : "Solution Review Board"}
                  </h2>
                  <p className="mt-1 text-sm leading-6 text-slate-600">
                    {mode === "generate"
                      ? "Describe the business need and receive a structured Power Platform blueprint."
                      : "Paste an existing design and receive prioritized review findings."}
                  </p>
                </div>
              </div>
            </div>

            <div className="p-5 sm:p-6">
              <RequirementForm
                value={inputText}
                mode={mode}
                onChange={setInputText}
                onModeChange={handleModeChange}
                onSubmit={handleSubmit}
                onUseDemoResult={handleUseDemoResult}
                loading={isLoading}
              />

              {isLoading && (
                <div className="mt-5 rounded-lg border border-blue-200 bg-blue-50 px-4 py-4">
                  <div className="flex gap-3">
                    <Loader2 className="mt-0.5 h-5 w-5 shrink-0 animate-spin text-blue-700" />
                    <div>
                      <p className="text-sm font-semibold text-blue-950">
                        {mode === "generate"
                          ? "Generating your architecture blueprint"
                          : "Reviewing the design"}
                      </p>
                      <p className="mt-1 text-sm leading-6 text-blue-800">
                        Checking data model, security, flows, ALM, readiness,
                        and production risks.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {apiError && (
                <div className="mt-5 rounded-lg border border-red-200 bg-red-50 px-4 py-4">
                  <div className="flex gap-3">
                    <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-700" />
                    <div>
                      <p className="text-sm font-semibold text-red-950">
                        Request could not be completed
                      </p>
                      <p className="mt-1 text-sm leading-6 text-red-800">
                        {apiError}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        <section className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-3">
          {capabilities.map((capability) => {
            const Icon = capability.icon;

            return (
              <div
                key={capability.title}
                className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm"
              >
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 text-slate-700">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="font-semibold text-slate-950">
                  {capability.title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  {capability.description}
                </p>
              </div>
            );
          })}
        </section>

        <section className="mt-6 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3">
          <div className="flex gap-3">
            <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-amber-700" />
            <p className="text-sm leading-6 text-amber-900">
              Outputs are architecture accelerators. A human solution architect
              should validate security, licensing, ALM, and production readiness
              before implementation.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}
