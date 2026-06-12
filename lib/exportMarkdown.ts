/**
 * Export utilities for blueprint generation.
 */

import { Blueprint } from "./mockResults";

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

const formatAppType = (value: string) =>
  value
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");

const escapeTableCell = (value: string | number | boolean | undefined) =>
  String(value ?? "")
    .replace(/\|/g, "\\|")
    .replace(/\n/g, "<br />");

const addList = (items: string[]) =>
  items.length > 0
    ? items.map((item) => `- ${item}`).join("\n")
    : "- None specified";

export const exportToMarkdown = (
  blueprint: Blueprint,
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
  lines.push(`**${formatAppType(blueprint.recommendedAppType)}**`);
  lines.push("");
  lines.push(`Detected pattern: ${blueprint.detectedPattern}`);
  lines.push("");

  lines.push("## Assumptions");
  lines.push("");
  lines.push(addList(blueprint.assumptions));
  lines.push("");

  lines.push("## Dataverse Tables");
  lines.push("");
  blueprint.dataverseTables.forEach((table) => {
    lines.push(`### ${table.displayName}`);
    lines.push("");
    lines.push(table.description);
    lines.push("");

    if (table.ownershipType || table.primaryKey || table.auditingRecommendation) {
      lines.push(`- Ownership: ${table.ownershipType ?? "Not specified"}`);
      lines.push(
        `- Primary key: ${
          table.primaryKey && table.primaryKey.length > 0
            ? table.primaryKey.join(", ")
            : "Not specified"
        }`,
      );
      lines.push(
        `- Auditing: ${table.auditingRecommendation ?? "Not specified"}`,
      );
      lines.push("");
    }

    lines.push("| Column | Type | Required | Description |");
    lines.push("| --- | --- | --- | --- |");
    table.columns.forEach((column) => {
      lines.push(
        `| ${escapeTableCell(column.displayName)} | ${escapeTableCell(
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
        lines.push(
          `- ${relationship.target}: ${relationship.relationship}`,
        );
      });
      lines.push("");
    }
  });

  lines.push("## Power Automate Flows");
  lines.push("");
  blueprint.powerAutomateFlows.forEach((flow) => {
    lines.push(`### ${flow.displayName}`);
    lines.push("");
    lines.push(`- Trigger: ${flow.trigger}`);
    lines.push(`- Trigger description: ${flow.triggerDescription}`);
    lines.push(`- Error handling: ${flow.errorHandling}`);
    lines.push("");
    lines.push("Steps:");
    flow.actions.forEach((action, index) => {
      const condition = action.condition ? ` Condition: ${action.condition}` : "";
      lines.push(
        `${index + 1}. **${action.name}** - ${action.description}${condition}`,
      );
    });
    lines.push("");
  });

  lines.push("## Security Roles");
  lines.push("");
  blueprint.securityRoles.forEach((role) => {
    lines.push(`### ${role.displayName}`);
    lines.push("");
    lines.push(role.description);
    lines.push("");
    lines.push("Responsibilities:");
    lines.push(addList(role.responsibilities));
    lines.push("");
    lines.push("| Table | Create | Read | Update | Delete |");
    lines.push("| --- | --- | --- | --- | --- |");
    role.tablePermissions.forEach((permission) => {
      lines.push(
        `| ${escapeTableCell(permission.table)} | ${
          permission.create ? "Yes" : "No"
        } | ${permission.read ? "Yes" : "No"} | ${
          permission.update ? "Yes" : "No"
        } | ${permission.delete ? "Yes" : "No"} |`,
      );
    });
    lines.push("");
  });

  if (includeALM) {
    lines.push("## ALM Plan");
    lines.push("");
    blueprint.almPlan.forEach((stage) => {
      lines.push(`### ${stage.name}`);
      lines.push("");
      lines.push(stage.description);
      lines.push("");
      lines.push(`- Purpose: ${stage.purpose}`);
      lines.push(`- User base: ${stage.userBase}`);
      lines.push(`- Deployment frequency: ${stage.deploymentFrequency}`);
      lines.push("");
    });
  }

  if (includeRisks) {
    lines.push("## Risks");
    lines.push("");
    blueprint.risks.forEach((risk) => {
      lines.push(`### ${risk.category}`);
      lines.push("");
      lines.push(`- Severity: ${risk.severity.toUpperCase()}`);
      lines.push(`- Description: ${risk.description}`);
      lines.push(`- Business impact: ${risk.businessImpact}`);
      lines.push(`- Mitigation: ${risk.mitigation}`);
      lines.push("");
    });
  }

  lines.push("## Implementation Checklist");
  lines.push("");
  let currentPhase = "";
  blueprint.implementationChecklist.forEach((item) => {
    if (item.phase !== currentPhase) {
      currentPhase = item.phase;
      lines.push(`### ${item.phase}`);
      lines.push("");
    }

    const dependencies =
      item.dependencies.length > 0 ? item.dependencies.join(", ") : "None";
    lines.push(
      `- [ ] **${item.task}** - Owner: ${item.owner}; Estimate: ${item.estimatedHours}h; Dependencies: ${dependencies}`,
    );
  });
  lines.push("");

  lines.push("## Follow-up Questions");
  lines.push("");
  blueprint.followUpQuestions.forEach((item, index) => {
    lines.push(`${index + 1}. **${item.question}**`);
    lines.push(`   - Rationale: ${item.rationale}`);
    if (item.suggestedAnswer) {
      lines.push(`   - Suggested answer: ${item.suggestedAnswer}`);
    }
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

export const exportToJSON = (blueprint: Blueprint): string =>
  JSON.stringify(blueprint, null, 2);

export const downloadBlueprint = (
  content: string,
  filename: string,
  format: "markdown" | "json",
) => {
  const blob = new Blob([content], {
    type: format === "markdown" ? "text/markdown;charset=utf-8" : "application/json;charset=utf-8",
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
