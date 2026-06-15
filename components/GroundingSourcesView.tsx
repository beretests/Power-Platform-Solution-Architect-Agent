import React from "react";
import {
  BadgeCheck,
  BookOpenCheck,
  FileText,
  Info,
  TriangleAlert,
} from "lucide-react";
import {
  type GroundingMode,
  type GroundingSource,
} from "@/lib/schemas";

interface GroundingSourcesViewProps {
  groundingMode: GroundingMode;
  groundingSources: GroundingSource[];
}

interface GroundingModeBadgeProps {
  groundingMode: GroundingMode;
  compact?: boolean;
}

interface GroundingModeConfig {
  label: string;
  description: string;
  badgeClass: string;
  panelClass: string;
  icon: React.ComponentType<{ className?: string }>;
}

const groundingConfig: Record<GroundingMode, GroundingModeConfig> = {
  "foundry-iq": {
    label: "Grounded by Foundry IQ",
    description:
      "Recommendations were grounded with retrieved Power Platform guidance from the Foundry IQ knowledge base.",
    badgeClass: "border-emerald-200 bg-emerald-100 text-emerald-800",
    panelClass: "border-emerald-200 bg-emerald-50 text-emerald-950",
    icon: BadgeCheck,
  },
  "local-fallback": {
    label: "Local fallback grounding",
    description:
      "Foundry IQ retrieval was unavailable or disabled, so local knowledge files were used as grounding context.",
    badgeClass: "border-amber-200 bg-amber-100 text-amber-800",
    panelClass: "border-amber-200 bg-amber-50 text-amber-950",
    icon: BookOpenCheck,
  },
  mock: {
    label: "Mock mode",
    description:
      "This result came from demo data because live Azure OpenAI generation was not configured.",
    badgeClass: "border-violet-200 bg-violet-100 text-violet-800",
    panelClass: "border-violet-200 bg-violet-50 text-violet-950",
    icon: Info,
  },
  none: {
    label: "No grounding source",
    description:
      "No external grounding context was attached to this generated result.",
    badgeClass: "border-slate-200 bg-slate-100 text-slate-700",
    panelClass: "border-slate-200 bg-slate-50 text-slate-900",
    icon: TriangleAlert,
  },
};

export const GroundingModeBadge: React.FC<GroundingModeBadgeProps> = ({
  groundingMode,
  compact = false,
}) => {
  const config = groundingConfig[groundingMode];
  const Icon = config.icon;

  return (
    <span
      className={`inline-flex w-fit items-center gap-1.5 rounded-full border font-semibold ${
        compact ? "px-2.5 py-1 text-xs" : "px-3 py-1.5 text-sm"
      } ${config.badgeClass}`}
    >
      <Icon className={compact ? "h-3.5 w-3.5" : "h-4 w-4"} />
      {config.label}
    </span>
  );
};

export const GroundingSourcesView: React.FC<GroundingSourcesViewProps> = ({
  groundingMode,
  groundingSources,
}) => {
  const config = groundingConfig[groundingMode];
  const Icon = config.icon;

  return (
    <div className="space-y-6">
      <section className={`rounded-lg border p-5 ${config.panelClass}`}>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-current/15 bg-white/70">
              <Icon className="h-5 w-5" aria-hidden="true" />
            </div>
            <div>
              <h2 className="text-lg font-bold">{config.label}</h2>
              <p className="mt-1 max-w-3xl text-sm leading-6">
                {config.description}
              </p>
            </div>
          </div>
          <GroundingModeBadge groundingMode={groundingMode} />
        </div>
      </section>

      <section>
        <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h3 className="text-lg font-semibold text-slate-900">
              Grounding Sources
            </h3>
            <p className="mt-1 text-sm text-slate-600">
              Source references used to ground architecture guidance,
              mitigations, assumptions, and review findings.
            </p>
          </div>
          <span className="inline-flex w-fit rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-600">
            {groundingSources.length} sources
          </span>
        </div>

        {groundingSources.length === 0 ? (
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-6 text-center">
            <p className="text-sm font-semibold text-slate-700">
              No grounding sources supplied.
            </p>
            <p className="mt-1 text-sm text-slate-500">
              Treat recommendations as ungrounded until reviewed against your
              organization&apos;s Power Platform standards.
            </p>
          </div>
        ) : (
          <div className="grid gap-4 lg:grid-cols-2">
            {groundingSources.map((source, index) => (
              <article
                key={`${source.reference}-${index}`}
                className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm"
              >
                <div className="flex items-start gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-blue-100 bg-blue-50 text-blue-700">
                    <FileText className="h-4 w-4" aria-hidden="true" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                      <h4 className="text-base font-bold text-slate-950">
                        {source.title}
                      </h4>
                      <span className="inline-flex w-fit shrink-0 rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-semibold text-slate-600">
                        {source.sourceType}
                      </span>
                    </div>

                    <dl className="mt-4 space-y-3 text-sm">
                      <div>
                        <dt className="font-semibold text-slate-700">
                          Reference
                        </dt>
                        <dd className="mt-1 break-words rounded-md bg-slate-50 px-3 py-2 font-mono text-xs text-slate-700">
                          {source.reference}
                        </dd>
                      </div>
                      <div>
                        <dt className="font-semibold text-slate-700">
                          Used For
                        </dt>
                        <dd className="mt-1 leading-6 text-slate-600">
                          {source.usedFor}
                        </dd>
                      </div>
                      {source.excerpt && (
                        <div>
                          <dt className="font-semibold text-slate-700">
                            Excerpt
                          </dt>
                          <dd className="mt-1 rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm leading-6 text-slate-600">
                            {source.excerpt}
                          </dd>
                        </div>
                      )}
                    </dl>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};
