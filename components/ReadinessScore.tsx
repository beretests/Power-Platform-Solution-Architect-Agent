import React from "react";

type CategoryKey = "accuracy" | "security" | "alm" | "scalability" | "usability";

interface CategoryScore {
  label: string;
  score: number;
}

interface ReadinessScoreProps {
  score?: number; // 0-100
  maxScore?: number;
  feedback?: string[];
  categoryScores?: Partial<Record<CategoryKey, number>>;
}

const categoryLabels: Record<CategoryKey, string> = {
  accuracy: "Accuracy",
  security: "Security",
  alm: "ALM",
  scalability: "Scalability",
  usability: "Usability",
};

const categoryOrder: CategoryKey[] = [
  "accuracy",
  "security",
  "alm",
  "scalability",
  "usability",
];

const clampScore = (value: number) => Math.max(0, Math.min(100, value));

const getStatus = (score: number) => {
  if (score >= 85) {
    return {
      label: "Demo Ready",
      badgeClass: "bg-green-100 text-green-800 border-green-200",
      barClass: "bg-green-600",
    };
  }

  if (score >= 70) {
    return {
      label: "Promising",
      badgeClass: "bg-blue-100 text-blue-800 border-blue-200",
      barClass: "bg-blue-600",
    };
  }

  return {
    label: "Needs Review",
    badgeClass: "bg-amber-100 text-amber-800 border-amber-200",
    barClass: "bg-amber-600",
  };
};

const getCategoryBarClass = (score: number) => {
  if (score >= 85) return "bg-green-600";
  if (score >= 70) return "bg-blue-600";
  return "bg-amber-600";
};

const getDerivedCategoryScores = (
  score: number,
  categoryScores?: Partial<Record<CategoryKey, number>>,
): CategoryScore[] => {
  const derivedScores: Record<CategoryKey, number> = {
    accuracy: clampScore(score + 3),
    security: clampScore(score - 8),
    alm: clampScore(score - 5),
    scalability: clampScore(score - 2),
    usability: clampScore(score + 1),
  };

  return categoryOrder.map((key) => ({
    label: categoryLabels[key],
    score: clampScore(categoryScores?.[key] ?? derivedScores[key]),
  }));
};

interface ScoreBarProps {
  label: string;
  score: number;
  barClass: string;
  size?: "default" | "large";
}

const ScoreBar: React.FC<ScoreBarProps> = ({
  label,
  score,
  barClass,
  size = "default",
}) => {
  const heightClass = size === "large" ? "h-4" : "h-2.5";

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-3">
        <span className="text-sm font-medium text-gray-700">{label}</span>
        <span className="text-sm font-bold text-gray-900">{score}/100</span>
      </div>
      <div
        role="progressbar"
        aria-label={`${label} score`}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={score}
        className={`w-full ${heightClass} bg-gray-200 rounded-full overflow-hidden`}
      >
        <div
          className={`h-full rounded-full transition-all duration-300 ${barClass}`}
          style={{ width: `${score}%` }}
        />
      </div>
    </div>
  );
};

export const ReadinessScore: React.FC<ReadinessScoreProps> = ({
  score = 0,
  maxScore = 100,
  feedback = [],
  categoryScores,
}) => {
  const normalizedScore = clampScore(Math.round((score / maxScore) * 100));
  const status = getStatus(normalizedScore);
  const categories = getDerivedCategoryScores(normalizedScore, categoryScores);

  return (
    <div className="w-full space-y-5 p-6 bg-white border border-gray-200 rounded-lg">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h3 className="text-lg font-bold text-gray-900">
            Production Readiness Score
          </h3>
          <p className="text-sm text-gray-600">
            Composite review across architecture quality, security, ALM, scale,
            and usability.
          </p>
        </div>
        <span
          className={`inline-flex w-fit rounded border px-3 py-1.5 text-sm font-bold ${status.badgeClass}`}
        >
          {status.label}
        </span>
      </div>

      <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
        <div className="flex items-end justify-between gap-3 mb-4">
          <div>
            <p className="text-sm font-semibold text-gray-600">Total Score</p>
            <p className="text-4xl font-bold text-gray-900">
              {normalizedScore}
              <span className="text-lg text-gray-500">/100</span>
            </p>
          </div>
        </div>
        <ScoreBar
          label="Overall readiness"
          score={normalizedScore}
          barClass={status.barClass}
          size="large"
        />
      </div>

      <div>
        <h4 className="font-semibold text-gray-900 mb-3 text-sm">
          Category Scores
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {categories.map((category) => (
            <div
              key={category.label}
              className="rounded-lg border border-gray-200 bg-white p-4"
            >
              <ScoreBar
                label={category.label}
                score={category.score}
                barClass={getCategoryBarClass(category.score)}
              />
            </div>
          ))}
        </div>
      </div>

      {feedback.length > 0 && (
        <div className="border-t border-gray-200 pt-4">
          <p className="text-sm font-semibold text-gray-700 mb-2">
            Improvement Areas
          </p>
          <ul className="space-y-1">
            {feedback.map((item, idx) => (
              <li
                key={idx}
                className="text-sm text-gray-600 flex items-start gap-2"
              >
                <span className="text-amber-500 mt-0.5" aria-hidden="true">
                  ◆
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
