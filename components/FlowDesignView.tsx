"use client";

import React from "react";
import { Flow } from "@/lib/schemas";

interface FlowDesignViewProps {
  flows?: Flow[];
}

const ownerWarningPattern =
  /\b(service account|service principal|privileged connector)\b/i;

export const FlowDesignView: React.FC<FlowDesignViewProps> = ({
  flows = [],
}) => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Power Automate Flow Design
        </h2>
        <p className="text-gray-600">
          Automated workflows that handle business logic, notifications, and
          integrations.
        </p>
      </div>

      {flows.length === 0 ? (
        <div className="p-6 bg-gray-50 rounded-lg border border-gray-200 text-center text-gray-500">
          No flows defined
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {flows.map((flow) => {
            return (
              <div
                key={flow.name}
                className="bg-white border border-gray-200 rounded-lg overflow-hidden"
              >
                <div className="bg-gradient-to-r from-purple-50 to-purple-100 px-6 py-4 border-b border-gray-200">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <h3 className="font-bold text-purple-900 text-lg mb-1">
                        {flow.name}
                      </h3>
                    </div>
                    {ownerWarningPattern.test(flow.ownerRecommendation) && (
                      <span className="inline-flex w-fit items-center rounded bg-amber-100 px-2.5 py-1 text-xs font-semibold text-amber-800 border border-amber-200">
                        Owner review
                      </span>
                    )}
                  </div>
                </div>

                <div className="p-6 space-y-4">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2 text-sm">
                      Trigger
                    </h4>
                    <div className="bg-blue-50 border-l-4 border-blue-600 px-4 py-3 rounded">
                      <p className="text-gray-800 font-medium">
                        {flow.trigger}
                      </p>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2 text-sm">
                      Numbered Steps
                    </h4>
                    <ol className="space-y-3">
                      {flow.steps.map((step, idx) => (
                        <li key={idx} className="flex gap-3">
                          <div className="flex-shrink-0 w-6 h-6 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center text-sm font-medium">
                            {idx + 1}
                          </div>
                          <div className="flex-grow">
                            <p className="text-sm text-gray-700">{step}</p>
                          </div>
                        </li>
                      ))}
                    </ol>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2 text-sm">
                      Connectors
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {flow.connectors.length > 0 ? (
                        flow.connectors.map((connector) => (
                          <span
                            key={connector}
                            className="px-2.5 py-1 bg-indigo-50 text-indigo-700 border border-indigo-100 rounded text-xs font-semibold"
                          >
                            {connector}
                          </span>
                        ))
                      ) : (
                        <span className="text-sm text-gray-500">
                          No connectors specified
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2 text-sm">
                        Error Handling
                      </h4>
                      <p className="text-gray-700 bg-yellow-50 border border-yellow-200 px-4 py-3 rounded text-sm">
                        {flow.errorHandling}
                      </p>
                    </div>

                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2 text-sm">
                        Retry Policy
                      </h4>
                      <p className="text-gray-700 bg-cyan-50 border border-cyan-200 px-4 py-3 rounded text-sm">
                        {flow.retryPolicy}
                      </p>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2 text-sm">
                      Owner Recommendation
                    </h4>
                    <p className="text-gray-700 bg-gray-50 border border-gray-200 px-4 py-3 rounded text-sm">
                      {flow.ownerRecommendation}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
