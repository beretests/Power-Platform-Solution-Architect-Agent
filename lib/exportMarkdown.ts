/**
 * Export utilities for schema-native solution architecture results.
 */

import { SolutionArchitectureResult } from "./schemas";

export interface ExportOptions {
  includeRisks?: boolean;
  includeALM?: boolean;
  includeDiagram?: boolean;
}

const formatDate = (value: string) => {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleDateString();
};

const escapeTableCell = (value: string | number | boolean | undefined) =>
  String(value ?? "")
    .replace(/\|/g, "\\|")
    .replace(/\n/g, "<br />");

const addList = (items: string[]) =>
  items.length > 0
    ? items.map((item) => `- ${item}`).join("\n")
    : "- None specified";

export const exportToMarkdown = (
  blueprint: SolutionArchitectureResult,
  options: ExportOptions = {},
): string => {
  const {
    includeRisks = true,
    includeALM = true,
    includeDiagram = true,
  } = options;

  const lines: string[] = [];

  lines.push("# Power Platform Solution Blueprint");
  lines.push("");
  lines.push(`Generated: ${formatDate(blueprint.createdAt)}`);
  lines.push(`Blueprint ID: ${blueprint.id}`);
  lines.push(`Mode: ${blueprint.mode}`);
  lines.push("");

  lines.push("## Original Requirement");
  lines.push("");
  lines.push(blueprint.requirement.trim());
  lines.push("");

  lines.push("## Executive Summary");
  lines.push("");
  lines.push(blueprint.executiveSummary.trim());
  lines.push("");

  lines.push("## Recommended App Type");
  lines.push("");
  lines.push(`**${blueprint.recommendedAppType.appType}**`);
  lines.push("");
  lines.push(`Rationale: ${blueprint.recommendedAppType.rationale}`);
  lines.push(
    `Alternatives: ${
      blueprint.recommendedAppType.alternatives.length > 0
        ? blueprint.recommendedAppType.alternatives.join(", ")
        : "None specified"
    }`,
  );
  lines.push(`Detected pattern: ${blueprint.detectedPattern}`);
  lines.push("");

  lines.push("## Assumptions");
  lines.push("");
  lines.push(addList(blueprint.assumptions));
  lines.push("");

  lines.push("## Grounding");
  lines.push("");
  lines.push(`Grounding mode: ${blueprint.groundingMode}`);
  lines.push("");

  if (blueprint.groundingSources.length === 0) {
    lines.push("- No grounding sources specified");
    lines.push("");
  } else {
    blueprint.groundingSources.forEach((source) => {
      lines.push(`### ${source.title}`);
      lines.push("");
      lines.push(`- Source type: ${source.sourceType}`);
      lines.push(`- Reference: ${source.reference}`);
      lines.push(`- Used for: ${source.usedFor}`);

      if (source.excerpt) {
        lines.push(`- Excerpt: ${source.excerpt}`);
      }

      lines.push("");
    });
  }

  lines.push("## Dataverse Tables");
  lines.push("");
  blueprint.dataverseTables.forEach((table) => {
    lines.push(`### ${table.name}`);
    lines.push("");
    lines.push(table.description);
    lines.push("");
    lines.push(`- Ownership: ${table.ownershipType}`);
    lines.push(
      `- Keys: ${table.keys.length > 0 ? table.keys.join(", ") : "None specified"}`,
    );
    lines.push(`- Auditing: ${table.auditingRecommendation}`);
    lines.push("");

    lines.push("| Column | Type | Required | Description |");
    lines.push("| --- | --- | --- | --- |");
    table.columns.forEach((column) => {
      lines.push(
        `| ${escapeTableCell(column.displayName ?? column.name)} | ${escapeTableCell(
          column.type,
        )} | ${column.required ? "Yes" : "No"} | ${escapeTableCell(
          column.description,
        )} |`,
      );
    });
    lines.push("");

    if (table.relationships.length > 0) {
      lines.push("Relationships:");
      table.relationships.forEach((relationship) => {
        lines.push(`- ${relationship.target}: ${relationship.relationship}`);
      });
      lines.push("");
    }
  });

  lines.push("## Power Automate Flows");
  lines.push("");
  blueprint.powerAutomateFlows.forEach((flow) => {
    lines.push(`### ${flow.name}`);
    lines.push("");
    lines.push(`- Trigger: ${flow.trigger}`);
    lines.push(
      `- Connectors: ${
        flow.connectors.length > 0 ? flow.connectors.join(", ") : "None specified"
      }`,
    );
    lines.push(`- Error handling: ${flow.errorHandling}`);
    lines.push(`- Retry policy: ${flow.retryPolicy}`);
    lines.push(`- Owner recommendation: ${flow.ownerRecommendation}`);
    lines.push("");
    lines.push("Steps:");
    flow.steps.forEach((step, index) => {
      lines.push(`${index + 1}. ${step}`);
    });
    lines.push("");
  });

  lines.push("## Security Roles");
  lines.push("");
  blueprint.securityRoles.forEach((role) => {
    lines.push(`### ${role.name}`);
    lines.push("");
    lines.push(`Persona: ${role.persona}`);
    lines.push("");
    lines.push("Table privileges:");
    lines.push(addList(role.tablePrivileges));
    lines.push("");
    lines.push("Notes:");
    lines.push(addList(role.notes));
    lines.push("");
  });

  if (includeALM) {
    lines.push("## ALM Plan");
    lines.push("");
    lines.push("### Environments");
    lines.push(addList(blueprint.almPlan.environments));
    lines.push("");
    lines.push("### Solution Strategy");
    lines.push(addList(blueprint.almPlan.solutionStrategy));
    lines.push("");
    lines.push("### Connection References");
    lines.push(addList(blueprint.almPlan.connectionReferences));
    lines.push("");
    lines.push("### Environment Variables");
    lines.push(addList(blueprint.almPlan.environmentVariables));
    lines.push("");
    lines.push("### Deployment Steps");
    lines.push(addList(blueprint.almPlan.deploymentSteps));
    lines.push("");
    lines.push("### Rollback Plan");
    lines.push(addList(blueprint.almPlan.rollbackPlan));
    lines.push("");
  }

  if (includeRisks) {
    lines.push("## Risks");
    lines.push("");
    blueprint.risks.forEach((risk) => {
      lines.push(`### ${risk.area}`);
      lines.push("");
      lines.push(`- Severity: ${risk.severity}`);
      lines.push(`- Description: ${risk.description}`);
      lines.push(`- Mitigation: ${risk.mitigation}`);
      lines.push("");
    });
  }

  lines.push("## Implementation Checklist");
  lines.push("");
  blueprint.implementationChecklist.forEach((item) => {
    lines.push(`- [ ] ${item}`);
  });
  lines.push("");

  lines.push("## Follow-up Questions");
  lines.push("");
  blueprint.followUpQuestions.forEach((question, index) => {
    lines.push(`${index + 1}. ${question}`);
  });
  lines.push("");

  if (includeDiagram) {
    lines.push("## Mermaid Architecture Diagram");
    lines.push("");
    lines.push("```mermaid");
    lines.push(blueprint.architectureDiagramMermaid.trim());
    lines.push("```");
    lines.push("");
  }

  lines.push("---");
  lines.push("");
  lines.push(
    "Disclaimer: AI-generated architecture must be validated by a human solution architect and appropriate governance teams before production use.",
  );

  return `${lines.join("\n").trim()}\n`;
};

export const exportToJSON = (blueprint: SolutionArchitectureResult): string =>
  JSON.stringify(blueprint, null, 2);

export const downloadBlueprint = (
  content: string,
  filename: string,
  format: "markdown" | "json",
) => {
  const blob = new Blob([content], {
    type:
      format === "markdown"
        ? "text/markdown;charset=utf-8"
        : "application/json;charset=utf-8",
  });
  const url = URL.createObjectURL(blob);
  const element = document.createElement("a");

  element.href = url;
  element.download = filename;
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
  URL.revokeObjectURL(url);
};
