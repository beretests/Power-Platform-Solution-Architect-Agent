import React from "react";

interface ReadinessScoreProps {
  score?: number; // 0-100
  maxScore?: number;
  feedback?: string[];
}

export const ReadinessScore: React.FC<ReadinessScoreProps> = ({
  score = 0,
  maxScore = 100,
  feedback = [],
}) => {
  const percentage = (score / maxScore) * 100;
  const getScoreColor = (pct: number) => {
    if (pct >= 80) return "bg-green-600";
    if (pct >= 60) return "bg-yellow-600";
    if (pct >= 40) return "bg-orange-600";
    return "bg-red-600";
  };

  return (
    <div className="space-y-4 p-6 bg-white border border-gray-200 rounded-lg">
      <div>
        <h3 className="text-lg font-semibold mb-4">
          Production Readiness Score
        </h3>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between items-center mb-1">
          <span className="text-sm font-medium text-gray-700">Readiness</span>
          <span className="text-2xl font-bold text-gray-900">
            {score}/{maxScore}
          </span>
        </div>
        <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-300 ${getScoreColor(percentage)}`}
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>

      {feedback.length > 0 && (
        <div className="mt-4 space-y-2">
          <p className="text-sm font-medium text-gray-700">
            Improvement Areas:
          </p>
          <ul className="space-y-1">
            {feedback.map((item, idx) => (
              <li
                key={idx}
                className="text-sm text-gray-600 flex items-start gap-2"
              >
                <span className="text-orange-500 mt-0.5">◆</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
