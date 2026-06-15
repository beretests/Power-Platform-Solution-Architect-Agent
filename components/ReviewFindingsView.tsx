"use client";

import { type ReviewFinding } from "@/lib/schemas";

interface ReviewFindingsViewProps {
  findings: ReviewFinding[];
}

const severityOrder = ["High", "Medium", "Low"] as const;

const severityStyles = {
  High: {
    section: "border-red-300 bg-red-50",
    header: "text-red-950",
    badge: "border-red-300 bg-red-600 text-white",
    card: "border-red-200 bg-white shadow-sm ring-1 ring-red-100",
    accent: "border-red-500",
  },
  Medium: {
    section: "border-amber-200 bg-amber-50",
    header: "text-amber-950",
    badge: "border-amber-300 bg-amber-100 text-amber-900",
    card: "border-amber-200 bg-white shadow-sm",
    accent: "border-amber-500",
  },
  Low: {
    section: "border-blue-200 bg-blue-50",
    header: "text-blue-950",
    badge: "border-blue-300 bg-blue-100 text-blue-900",
    card: "border-blue-200 bg-white shadow-sm",
    accent: "border-blue-500",
  },
} as const;

export const ReviewFindingsView: React.FC<ReviewFindingsViewProps> = ({
  findings,
}) => {
  if (findings.length === 0) {
    return (
      <div className="rounded-lg border border-slate-200 bg-white p-6 text-sm text-slate-600">
        No review findings were returned.
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {severityOrder.map((severity) => {
        const groupedFindings = findings.filter(
          (finding) => finding.severity === severity,
        );

        if (groupedFindings.length === 0) {
          return null;
        }

        const styles = severityStyles[severity];

        return (
          <section
            key={severity}
            className={`rounded-lg border p-4 ${styles.section}`}
          >
            <div className="mb-4 flex items-center justify-between gap-3">
              <h3 className={`text-lg font-bold ${styles.header}`}>
                {severity} Severity
              </h3>
              <span
                className={`rounded-full border px-3 py-1 text-xs font-bold ${styles.badge}`}
              >
                {groupedFindings.length}{" "}
                {groupedFindings.length === 1 ? "finding" : "findings"}
              </span>
            </div>

            <div className="space-y-3">
              {groupedFindings.map((finding) => (
                <article
                  key={`${finding.category}-${finding.finding}`}
                  className={`rounded-lg border border-l-4 p-5 ${styles.card} ${styles.accent}`}
                >
                  <div className="mb-3 flex flex-wrap items-center gap-2">
                    <span
                      className={`rounded-full border px-3 py-1 text-xs font-bold ${styles.badge}`}
                    >
                      {finding.severity}
                    </span>
                    <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                      {finding.category}
                    </span>
                  </div>

                  <h4 className="text-base font-semibold text-slate-950">
                    {finding.finding}
                  </h4>

                  <div className="mt-4 grid gap-3 md:grid-cols-2">
                    <div className="rounded-md border border-slate-200 bg-slate-50 px-3 py-3">
                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Why It Matters
                      </p>
                      <p className="mt-1 text-sm leading-6 text-slate-800">
                        {finding.whyItMatters}
                      </p>
                    </div>

                    <div className="rounded-md border border-green-200 bg-green-50 px-3 py-3">
                      <p className="text-xs font-semibold uppercase tracking-wide text-green-700">
                        Recommendation
                      </p>
                      <p className="mt-1 text-sm leading-6 text-green-950">
                        {finding.recommendation}
                      </p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
};
