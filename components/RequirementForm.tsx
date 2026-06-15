"use client";

import React from "react";
import {
  ClipboardCheck,
  FileText,
  Loader2,
  Play,
  Sparkles,
} from "lucide-react";

export type WorkMode = "generate" | "review";

interface RequirementFormProps {
  value: string;
  mode: WorkMode;
  onChange: (value: string) => void;
  onModeChange: (mode: WorkMode) => void;
  onSubmit: () => void;
  onUseDemoResult: () => void;
  loading: boolean;
}

interface ExamplePrompt {
  text: string;
  label: string;
}

const generateExamples: ExamplePrompt[] = [
  {
    text: "We need to streamline employee onboarding by automating task distribution to IT, HR, and Facilities. Managers submit requests, HR approves them, and automated emails route tasks to each department. We track completion, send reminders for overdue items, and maintain an audit trail.",
    label: "Employee Onboarding",
  },
  {
    text: "Build a customer service ticket system where customers submit issues, support staff prioritize and assign tickets, managers review metrics, and we automatically escalate tickets that are overdue. Include knowledge base integration and satisfaction surveys after resolution.",
    label: "Customer Service",
  },
  {
    text: "We need to process incoming invoices from suppliers. Validate amounts against purchase orders, route to appropriate approvers based on amount thresholds, track payment status, and maintain an audit log of all changes. Support bulk uploads via Excel.",
    label: "Invoice Processing",
  },
  {
    text: "Automate time-off requests where employees submit requests, managers approve or deny, we check team coverage, update shared calendars, and track accrual balances. Generate monthly reports for payroll integration and ensure compliance with company policies.",
    label: "Leave Management",
  },
];

const reviewExamples: ExamplePrompt[] = [
  {
    text: "We will build an onboarding canvas app in the default environment. All onboarding requests will be stored in a SharePoint list. All users will have edit access. A flow owned by the maker will send emails to IT. No test environment is planned. We will manually recreate the app in production when ready.",
    label: "Weak Onboarding Design",
  },
  {
    text: "Our inspection solution uses a canvas app with SharePoint lists for inspection headers, findings, photos, and follow-up tasks. Supervisors and inspectors share the same permissions. The flow sends Teams messages but has no retry policy, connection references, or rollback plan.",
    label: "Inspection App Review",
  },
  {
    text: "The asset tracking app will use Dataverse tables and a model-driven app, but we have not defined security roles, environment variables, managed solution deployment, connection ownership, audit settings, or a production support process.",
    label: "Asset Tracking Review",
  },
  {
    text: "The approval workflow stores request data in Excel, uses a maker-owned flow, sends approvals through Outlook, and will be copied manually from development to production. Licensing has not been reviewed and there is no UAT environment.",
    label: "Approval Workflow Review",
  },
];

const MIN_CHARS = 30;

const modeContent = {
  generate: {
    title: "Generate Architecture",
    description: "Create a new implementation-ready Power Platform blueprint.",
    label: "Describe the business requirement",
    helper:
      "Describe the business requirement in enough detail to generate a useful blueprint.",
    placeholder:
      "Example: We need to streamline employee onboarding by automating task distribution to IT, HR, and Facilities. Managers submit requests, HR approves them, and automated emails route tasks to each department. We track completion, send reminders for overdue items, and maintain an audit trail.",
    submitLabel: "Generate Blueprint",
    loadingLabel: "Generating Blueprint...",
    examples: generateExamples,
  },
  review: {
    title: "Solution Review Board",
    description:
      "Review an existing Power Platform design for risks and production readiness.",
    label: "Paste an existing Power Platform design",
    helper:
      "Paste enough design detail to review data, security, ALM, environments, flows, and readiness.",
    placeholder:
      "Example: We plan to build a canvas app in the default environment with data in SharePoint lists, a maker-owned flow, shared edit permissions, and manual deployment to production.",
    submitLabel: "Review Design",
    loadingLabel: "Reviewing Design...",
    examples: reviewExamples,
  },
} satisfies Record<
  WorkMode,
  {
    title: string;
    description: string;
    label: string;
    helper: string;
    placeholder: string;
    submitLabel: string;
    loadingLabel: string;
    examples: ExamplePrompt[];
  }
>;

export const RequirementForm: React.FC<RequirementFormProps> = ({
  value,
  mode,
  onChange,
  onModeChange,
  onSubmit,
  onUseDemoResult,
  loading,
}) => {
  const content = modeContent[mode];
  const charCount = value.trim().length;
  const isValid = charCount >= MIN_CHARS;
  const isTooShort = charCount > 0 && charCount < MIN_CHARS;

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (isValid) {
      onSubmit();
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full space-y-5"
      autoComplete="off"
    >
      <div
        className="grid gap-2 rounded-lg border border-slate-200 bg-slate-50 p-1 sm:grid-cols-2"
        role="tablist"
        aria-label="Select workflow mode"
      >
        {(["generate", "review"] as const).map((modeOption) => {
          const isSelected = mode === modeOption;
          const option = modeContent[modeOption];
          const Icon = modeOption === "generate" ? Sparkles : ClipboardCheck;

          return (
            <button
              key={modeOption}
              type="button"
              onClick={() => onModeChange(modeOption)}
              className={`rounded-md border px-3 py-3 text-left transition-all ${
                isSelected
                  ? "border-blue-200 bg-white text-blue-950 shadow-sm"
                  : "border-transparent text-slate-700 hover:bg-white/70"
              }`}
              aria-selected={isSelected}
              role="tab"
            >
              <span className="flex items-center gap-2 text-sm font-semibold">
                <Icon className="h-4 w-4" />
                {option.title}
              </span>
              <span className="mt-1 block text-xs leading-5 text-slate-600">
                {option.description}
              </span>
            </button>
          );
        })}
      </div>

      <div>
        <div className="mb-2 flex items-center justify-between gap-3">
          <label
            htmlFor="requirements"
            className="block text-sm font-semibold text-slate-900"
          >
            {content.label}
          </label>
          <span className="shrink-0 text-xs font-medium text-slate-500">
            {charCount}/{MIN_CHARS} characters
          </span>
        </div>

        <textarea
          id="requirements"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={content.placeholder}
          disabled={loading}
          className={`h-56 w-full resize-none rounded-lg border p-4 text-sm font-medium leading-6 text-slate-900 shadow-sm placeholder:text-slate-400 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-500 ${
            isTooShort
              ? "border-amber-300 focus:border-amber-400 focus:ring-4 focus:ring-amber-100"
              : isValid
                ? "border-green-300 focus:border-green-400 focus:ring-4 focus:ring-green-100"
                : "border-slate-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
          }`}
          aria-describedby="requirements-helper"
        />

        <p
          id="requirements-helper"
          className={`mt-2 text-xs font-medium ${
            isTooShort
              ? "text-amber-700"
              : isValid
                ? "text-green-700"
                : "text-slate-600"
          }`}
        >
          {isTooShort
            ? `Please provide at least ${MIN_CHARS} characters.`
            : isValid
              ? `Ready to ${mode === "generate" ? "generate" : "review"}.`
              : content.helper}
        </p>
      </div>

      <div>
        <div className="mb-3 flex items-center gap-2">
          <FileText className="h-4 w-4 text-slate-500" />
          <p className="text-sm font-semibold text-slate-900">
            Try an example
          </p>
        </div>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {content.examples.map((example) => (
            <button
              key={example.label}
              type="button"
              onClick={() => onChange(example.text)}
              disabled={loading}
              className="rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-left text-sm font-medium text-slate-700 shadow-sm transition-all hover:border-blue-300 hover:bg-blue-50 hover:text-blue-900 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {example.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:justify-end">
        <button
          type="button"
          onClick={onUseDemoResult}
          disabled={loading}
          className="rounded-lg border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 shadow-sm transition-all hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
        >
          Use demo result
        </button>
        <button
          type="submit"
          disabled={!isValid || loading}
          className={`flex items-center justify-center gap-2 rounded-lg px-5 py-3 text-sm font-semibold transition-all ${
            loading
              ? "cursor-not-allowed bg-slate-200 text-slate-400"
            : isValid
                ? "bg-blue-600 text-white shadow-lg hover:bg-blue-700 hover:shadow-xl"
                : "cursor-not-allowed bg-slate-100 text-slate-400"
          }`}
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              {content.loadingLabel}
            </>
          ) : (
            <>
              <Play className="h-4 w-4" />
              {content.submitLabel}
            </>
          )}
        </button>
      </div>
    </form>
  );
};
