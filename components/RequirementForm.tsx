import React, { useState } from "react";

interface RequirementFormProps {
  onSubmit?: (requirements: string) => void;
}

export const RequirementForm: React.FC<RequirementFormProps> = ({
  onSubmit,
}) => {
  const [requirements, setRequirements] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit?.(requirements);
  };

  return (
    <div className="w-full max-w-2xl">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="requirements"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Business Requirements
          </label>
          <textarea
            id="requirements"
            value={requirements}
            onChange={(e) => setRequirements(e.target.value)}
            placeholder="Describe your Power Platform requirements..."
            className="w-full h-32 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          Generate Blueprint
        </button>
      </form>
    </div>
  );
};
