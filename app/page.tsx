"use client";

import { useState, useRef } from "react";
import { ResultDashboard } from "@/components/ResultDashboard";
import { mockEmployeeOnboardingBlueprint } from "@/lib/mockResults";
import { Blueprint } from "@/lib/mockResults";

const examplePrompts = [
  {
    title: "Employee Onboarding",
    description:
      "Multi-department workflow with HR approval, IT provisioning, and task tracking",
  },
  {
    title: "Customer Service Ticketing",
    description:
      "Issue tracking system with escalation, assignment, and knowledge base",
  },
  {
    title: "Invoice Processing",
    description:
      "Automated document processing with validation, approval, and audit trails",
  },
  {
    title: "Leave Management",
    description:
      "Time-off requests with manager approval, calendar sync, and accrual tracking",
  },
];

export default function Home() {
  const [requirement, setRequirement] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [blueprint, setBlueprint] = useState<Blueprint | null>(null);
  const [showResults, setShowResults] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleGenerateBlueprint = async () => {
    if (!requirement.trim()) {
      alert("Please enter a business requirement");
      return;
    }

    setIsLoading(true);
    // Simulate API call with 800ms delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    // Use mock data for now
    setBlueprint(mockEmployeeOnboardingBlueprint);
    setShowResults(true);
    setIsLoading(false);
  };

  const handleExampleClick = (example: (typeof examplePrompts)[0]) => {
    setRequirement(example.description);
    textareaRef.current?.focus();
  };

  const handleReset = () => {
    setShowResults(false);
    setBlueprint(null);
    setRequirement("");
  };

  if (showResults && blueprint) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Back Button */}
          <button
            onClick={handleReset}
            className="mb-6 inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium transition"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back to Designer
          </button>

          {/* Results Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-slate-900 mb-2">
                  Solution Blueprint
                </h1>
                <p className="text-slate-600">
                  Production readiness:{" "}
                  <span className="font-semibold text-slate-900">
                    {blueprint.readinessScore}/100
                  </span>
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-slate-600 mb-1">Generated</p>
                <p className="text-slate-900 font-medium">
                  {new Date(blueprint.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>

          {/* Results Dashboard */}
          <ResultDashboard blueprint={blueprint} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <svg
                className="w-6 h-6 text-white"
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
            <div>
              <h2 className="text-xl font-bold text-slate-900">
                Solution Architect
              </h2>
              <p className="text-xs text-slate-500">Power Platform Agent</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs text-slate-500">Microsoft Agents League</p>
            <p className="text-sm font-semibold text-slate-900">
              Creative Apps
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-slate-900 mb-6">
            Power Platform
            <br />
            <span className="bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
              Solution Architect
            </span>
          </h1>
          <p className="text-xl text-slate-600 mb-8 max-w-2xl mx-auto leading-relaxed">
            Turn business requirements into implementation-ready Power Platform
            blueprints.
          </p>
          <div className="flex justify-center gap-4">
            <div className="px-4 py-2 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium">
              ⚡ AI-Powered Design
            </div>
            <div className="px-4 py-2 bg-green-50 text-green-700 rounded-lg text-sm font-medium">
              📋 Complete Documentation
            </div>
            <div className="px-4 py-2 bg-purple-50 text-purple-700 rounded-lg text-sm font-medium">
              🔐 Enterprise Best Practices
            </div>
          </div>
        </div>

        {/* Problem Statement */}
        <div className="bg-white rounded-xl border border-slate-200 p-8 mb-12">
          <h2 className="text-lg font-semibold text-slate-900 mb-3">
            The Challenge
          </h2>
          <p className="text-slate-600 leading-relaxed">
            Designing Power Platform solutions requires deep expertise in data
            modeling, workflow automation, security, ALM, and compliance.
            Business analysts and makers often spend hours creating
            architectural blueprints from scratch. The Solution Architect Agent
            automates this process, generating complete solution designs in
            minutes—including Dataverse schemas, Power Automate flows, security
            models, and implementation checklists.
          </p>
        </div>

        {/* Input Section */}
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden mb-12">
          <div className="bg-gradient-to-r from-blue-50 to-slate-50 border-b border-slate-200 px-8 py-6">
            <h2 className="text-lg font-semibold text-slate-900">
              Business Requirements
            </h2>
            <p className="text-slate-600 text-sm mt-1">
              Describe what you want to build in natural language
            </p>
          </div>

          <div className="p-8">
            <textarea
              ref={textareaRef}
              value={requirement}
              onChange={(e) => setRequirement(e.target.value)}
              placeholder="Example: We need to streamline employee onboarding by automating task distribution to IT, HR, and Facilities. Managers submit requests, HR approves them, and automated emails route tasks to each department. We track completion, send reminders for overdue items, and maintain an audit trail."
              className="w-full h-48 p-4 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none font-medium text-slate-900 placeholder-slate-400"
            />

            {/* Generate Button */}
            <div className="mt-6 flex justify-end">
              <button
                onClick={handleGenerateBlueprint}
                disabled={isLoading}
                className={`px-8 py-3 rounded-lg font-semibold transition-all flex items-center gap-2 ${
                  isLoading
                    ? "bg-slate-200 text-slate-400 cursor-not-allowed"
                    : "bg-blue-600 text-white hover:bg-blue-700 shadow-lg hover:shadow-xl"
                }`}
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-slate-400 border-t-transparent rounded-full animate-spin" />
                    Generating Blueprint...
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
                        d="M12 5v14m7-7H5"
                      />
                    </svg>
                    Generate Blueprint
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Example Prompts */}
        <div className="mb-12">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">
            Try an Example
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {examplePrompts.map((example, idx) => (
              <button
                key={idx}
                onClick={() => handleExampleClick(example)}
                className="text-left p-4 border border-slate-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-all group"
              >
                <h3 className="font-semibold text-slate-900 group-hover:text-blue-700 mb-1">
                  {example.title}
                </h3>
                <p className="text-sm text-slate-600 group-hover:text-slate-700">
                  {example.description}
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* Features Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg border border-slate-200">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <svg
                className="w-6 h-6 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="font-semibold text-slate-900 mb-2">
              Complete Designs
            </h3>
            <p className="text-sm text-slate-600">
              Get Dataverse schemas, flows, roles, ALM strategy, and risk
              assessment
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg border border-slate-200">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
              <svg
                className="w-6 h-6 text-purple-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
                />
              </svg>
            </div>
            <h3 className="font-semibold text-slate-900 mb-2">
              Best Practices
            </h3>
            <p className="text-sm text-slate-600">
              Designs follow Microsoft architectural patterns and security
              standards
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg border border-slate-200">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mb-4">
              <svg
                className="w-6 h-6 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="font-semibold text-slate-900 mb-2">
              Ready to Implement
            </h3>
            <p className="text-sm text-slate-600">
              Export as Markdown or JSON for immediate team handoff and
              implementation
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
