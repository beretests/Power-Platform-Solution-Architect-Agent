"use client";

import React from "react";
import { PowerAutomateFlow } from "@/lib/mockResults";

interface FlowDesignViewProps {
  flows?: PowerAutomateFlow[];
}

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
        <div className="space-y-4">
          {flows.map((flow) => (
            <div
              key={flow.name}
              className="border border-gray-200 rounded-lg overflow-hidden"
            >
              <div className="bg-gradient-to-r from-purple-50 to-purple-100 px-6 py-4 border-b border-gray-200">
                <h3 className="font-bold text-purple-900 text-lg mb-1">
                  {flow.displayName}
                </h3>
                <p className="text-sm text-purple-700">
                  {flow.triggerDescription}
                </p>
              </div>

              <div className="p-6 space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Trigger</h4>
                  <div className="bg-blue-50 border-l-4 border-blue-600 px-4 py-3 rounded">
                    <p className="text-gray-800 font-medium">{flow.trigger}</p>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Actions</h4>
                  <div className="space-y-2">
                    {flow.actions.map((action, idx) => (
                      <div key={idx} className="flex gap-3">
                        <div className="flex-shrink-0 w-6 h-6 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center text-sm font-medium">
                          {idx + 1}
                        </div>
                        <div className="flex-grow">
                          <p className="font-medium text-gray-900">
                            {action.name}
                          </p>
                          <p className="text-sm text-gray-600">
                            {action.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">
                    Error Handling
                  </h4>
                  <p className="text-gray-700 bg-yellow-50 border border-yellow-200 px-4 py-3 rounded">
                    {flow.errorHandling}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
