"use client";

import { type PriorityFix } from "@/lib/schemas";

interface PriorityFixesViewProps {
  fixes: PriorityFix[];
}

export const PriorityFixesView: React.FC<PriorityFixesViewProps> = ({
  fixes,
}) => {
  if (fixes.length === 0) {
    return (
      <div className="rounded-lg border border-slate-200 bg-white p-6 text-sm text-slate-600">
        No priority fixes were returned.
      </div>
    );
  }

  const orderedFixes = [...fixes].sort((a, b) => a.priority - b.priority);

  return (
    <div className="space-y-4">
      {orderedFixes.map((fix) => (
        <article
          key={`${fix.priority}-${fix.title}`}
          className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm"
        >
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-blue-600 text-lg font-bold text-white shadow-sm">
              {fix.priority}
            </div>

            <div className="min-w-0 flex-1">
              <div className="mb-3">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Priority Fix
                </p>
                <h4 className="mt-1 text-lg font-semibold text-slate-950">
                  {fix.title}
                </h4>
              </div>

              <div className="grid gap-3 lg:grid-cols-2">
                <div className="rounded-md border border-slate-200 bg-slate-50 px-4 py-3">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Action
                  </p>
                  <p className="mt-1 text-sm leading-6 text-slate-800">
                    {fix.action}
                  </p>
                </div>

                <div className="rounded-md border border-green-200 bg-green-50 px-4 py-3">
                  <p className="text-xs font-semibold uppercase tracking-wide text-green-700">
                    Expected Impact
                  </p>
                  <p className="mt-1 text-sm leading-6 text-green-950">
                    {fix.expectedImpact}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
};
