"use client";

import React from "react";

interface RequirementFormProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  loading: boolean;
}

const examplePrompts = [
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

const MIN_CHARS = 30;

export const RequirementForm: React.FC<RequirementFormProps> = ({
  value,
  onChange,
  onSubmit,
  loading,
}) => {
  const charCount = value.length;
  const isValid = charCount >= MIN_CHARS;
  const isTooShort = charCount > 0 && charCount < MIN_CHARS;

  const handleExampleClick = (exampleText: string) => {
    onChange(exampleText);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isValid) {
      onSubmit();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full space-y-6">
      {/* Textarea Section */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label
            htmlFor="requirements"
            className="block text-sm font-semibold text-gray-900"
          >
            Business Requirements
          </label>
          <span className="text-xs font-medium text-gray-500">
            {charCount}/{MIN_CHARS} characters
          </span>
        </div>

        <textarea
          id="requirements"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Describe your Power Platform solution requirements. For example: automation workflows, data models, user roles, business processes..."
          className={`w-full h-48 p-4 border-2 rounded-lg font-medium text-gray-900 placeholder-gray-400 resize-none transition-all ${
            isTooShort
              ? "border-amber-300 focus:ring-2 focus:ring-amber-400 focus:border-amber-400"
              : isValid
                ? "border-green-300 focus:ring-2 focus:ring-green-400 focus:border-green-400"
                : "border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          }`}
          aria-describedby="requirements-helper"
        />

        {/* Helper Text */}
        <p
          id="requirements-helper"
          className={`mt-2 text-xs font-medium ${
            isTooShort
              ? "text-amber-700"
              : isValid
                ? "text-green-700"
                : "text-gray-600"
          }`}
        >
          {isTooShort ? (
            <>
              <span className="inline-block mr-1">⚠️</span>
              Please provide at least {MIN_CHARS} characters to generate a
              blueprint
            </>
          ) : isValid ? (
            <>
              <span className="inline-block mr-1">✓</span>
              Ready to generate blueprint
            </>
          ) : (
            "Describe your Power Platform solution requirements in detail"
          )}
        </p>
      </div>

      {/* Example Prompts */}
      <div>
        <p className="text-sm font-semibold text-gray-900 mb-3">
          Try an example:
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {examplePrompts.map((example, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleExampleClick(example.text)}
              className="px-3 py-2 text-left text-sm font-medium rounded-lg border border-gray-200 text-gray-700 hover:border-blue-400 hover:bg-blue-50 transition-all"
            >
              {example.label}
            </button>
          ))}
        </div>
      </div>

      {/* Generate Button */}
      <div className="flex justify-end pt-2">
        <button
          type="submit"
          disabled={!isValid || loading}
          className={`px-6 py-3 rounded-lg font-semibold transition-all flex items-center gap-2 ${
            loading
              ? "bg-gray-200 text-gray-400 cursor-not-allowed"
              : isValid
                ? "bg-blue-600 text-white hover:bg-blue-700 shadow-lg hover:shadow-xl"
                : "bg-gray-100 text-gray-400 cursor-not-allowed"
          }`}
        >
          {loading ? (
            <>
              <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <svg
                className="w-5 h-5"
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
              Generate Blueprint
            </>
          )}
        </button>
      </div>
    </form>
  );
};
