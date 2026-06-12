/**
 * Export utilities for blueprint generation
 * Converts blueprint data to Markdown format
 */

import { Blueprint } from "./mockResults";

export interface ExportOptions {
  includeRisks?: boolean;
  includeALM?: boolean;
  includeDiagram?: boolean;
}

export const exportToMarkdown = (
  blueprint: Blueprint,
  options: ExportOptions = {},
): string => {
  const {
    includeRisks = true,
    includeALM = true,
    includeDiagram = true,
  } = options;

  let markdown = "";

  // Header
  markdown += `# Power Platform Solution Blueprint\n\n`;
  markdown += `Generated: ${new Date(blueprint.createdAt).toLocaleDateString()}\n\n`;

  // Executive Summary
  markdown += `## Executive Summary\n\n`;
  markdown += `${blueprint.executiveSummary}\n\n`;

  // Recommended App Type
  markdown += `## Recommended App Type\n\n`;
  markdown += `**${blueprint.recommendedAppType.replace("-", " ").toUpperCase()}**\n\n`;

  // Detected Pattern
  markdown += `## Detected Pattern\n\n`;
  markdown += `${blueprint.detectedPattern}\n\n`;

  // Dataverse Schema
  markdown += `## Dataverse Table Design\n\n`;
  blueprint.dataverseTables.forEach((table) => {
    markdown += `### ${table.displayName}\n\n`;
    markdown += `${table.description}\n\n`;
    markdown += `| Column | Type | Required | Description |\n`;
    markdown += `|--------|------|----------|-------------|\n`;
    table.columns.forEach((col) => {
      markdown += `| ${col.displayName} | ${col.type} | ${col.required ? "Yes" : "No"} | ${col.description} |\n`;
    });
    markdown += `\n`;
  });

  // Power Automate Flows
  markdown += `## Power Automate Flow Design\n\n`;
  blueprint.powerAutomateFlows.forEach((flow) => {
    markdown += `### ${flow.displayName}\n\n`;
    markdown += `**Trigger:** ${flow.trigger}\n\n`;
    markdown += `${flow.triggerDescription}\n\n`;
    markdown += `**Actions:**\n`;
    flow.actions.forEach((action) => {
      markdown += `- ${action.name}: ${action.description}\n`;
    });
    markdown += `\n**Error Handling:** ${flow.errorHandling}\n\n`;
  });

  // Security Model
  markdown += `## Security Role Model\n\n`;
  blueprint.securityRoles.forEach((role) => {
    markdown += `### ${role.displayName}\n\n`;
    markdown += `${role.description}\n\n`;
    markdown += `**Responsibilities:**\n`;
    role.responsibilities.forEach((resp) => {
      markdown += `- ${resp}\n`;
    });
    markdown += `\n`;
  });

  // ALM Strategy
  if (includeALM) {
    markdown += `## Environment & ALM Strategy\n\n`;
    blueprint.almPlan.forEach((stage) => {
      markdown += `### ${stage.name}\n\n`;
      markdown += `${stage.description}\n\n`;
      markdown += `- **Purpose:** ${stage.purpose}\n`;
      markdown += `- **User Base:** ${stage.userBase}\n`;
      markdown += `- **Deployment Frequency:** ${stage.deploymentFrequency}\n\n`;
    });
  }

  // Risks
  if (includeRisks) {
    markdown += `## Risks & Considerations\n\n`;
    blueprint.risks.forEach((risk) => {
      markdown += `### ${risk.category} - ${risk.severity.toUpperCase()}\n\n`;
      markdown += `**Issue:** ${risk.description}\n\n`;
      markdown += `**Business Impact:** ${risk.businessImpact}\n\n`;
      markdown += `**Mitigation:** ${risk.mitigation}\n\n`;
    });
  }

  // Diagram
  if (includeDiagram) {
    markdown += `## Architecture Diagram\n\n`;
    markdown += "```mermaid\n";
    markdown += `${blueprint.architectureDiagramMermaid}\n`;
    markdown += "```\n\n";
  }

  // Readiness Score
  markdown += `## Production Readiness Score\n\n`;
  markdown += `**${blueprint.readinessScore}/100**\n\n`;
  markdown += `*Note: This blueprint has been reviewed for completeness and best practices. `;
  markdown += `Please conduct a formal Solution Review Board assessment before production deployment.*\n\n`;

  // Licensing
  markdown += `## Licensing & Costs\n\n`;
  markdown += "```\n";
  markdown += blueprint.licensingNotes;
  markdown += "\n```\n\n";

  // Implementation Checklist
  markdown += `## Implementation Checklist\n\n`;
  let currentPhase = "";
  blueprint.implementationChecklist.forEach((item) => {
    if (item.phase !== currentPhase) {
      currentPhase = item.phase;
      markdown += `### ${item.phase}\n\n`;
    }
    markdown += `- [ ] **${item.task}** (Owner: ${item.owner}, ${item.estimatedHours}h)\n`;
  });
  markdown += `\n`;

  // Follow-up Questions
  markdown += `## Follow-up Questions\n\n`;
  markdown += `These questions should be answered during detailed discovery to refine the design:\n\n`;
  blueprint.followUpQuestions.forEach((q) => {
    markdown += `**Q: ${q.question}**\n`;
    markdown += `*Rationale:* ${q.rationale}\n\n`;
  });

  // Footer
  markdown += `---\n\n`;
  markdown += `**Disclaimer:** This blueprint is a technical recommendation based on the provided requirements. `;
  markdown += `All designs should be validated by your organization's governance and security teams.\n`;

  return markdown;
};

export const exportToJSON = (blueprint: Blueprint): string => {
  return JSON.stringify(blueprint, null, 2);
};

export const downloadBlueprint = (
  content: string,
  filename: string,
  format: "markdown" | "json",
) => {
  const element = document.createElement("a");
  const file = new Blob([content], {
    type: format === "markdown" ? "text/markdown" : "application/json",
  });
  element.href = URL.createObjectURL(file);
  element.download = filename;
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
};
