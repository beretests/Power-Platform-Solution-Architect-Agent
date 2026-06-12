import React from "react";

interface ChecklistItem {
  name: string;
  description: string;
  completed?: boolean;
}

interface ALMChecklistViewProps {
  items?: ChecklistItem[];
}

export const ALMChecklistView: React.FC<ALMChecklistViewProps> = ({
  items = [],
}) => {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold mb-4">
          Environment & ALM Strategy
        </h3>
      </div>

      {items.length === 0 ? (
        <div className="p-6 bg-gray-50 rounded-lg border border-gray-200 text-center text-gray-500">
          No ALM items defined yet
        </div>
      ) : (
        <div className="space-y-2">
          {items.map((item) => (
            <div
              key={item.name}
              className="flex items-start gap-3 p-3 border border-gray-200 rounded-lg"
            >
              <input
                type="checkbox"
                defaultChecked={item.completed}
                className="mt-1 h-4 w-4 text-blue-600 rounded"
              />
              <div className="flex-1">
                <p className="font-medium text-gray-900">{item.name}</p>
                <p className="text-sm text-gray-600">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
