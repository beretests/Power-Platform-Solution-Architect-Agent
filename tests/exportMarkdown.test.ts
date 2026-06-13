import { describe, expect, it } from "vitest";
import { exportToMarkdown } from "@/lib/exportMarkdown";
import { getMockArchitectureResult } from "@/lib/mockResults";

describe("exportToMarkdown", () => {
  const blueprint = getMockArchitectureResult();
  const markdown = exportToMarkdown(blueprint);

  it("includes the executive summary", () => {
    expect(markdown).toContain("## Executive Summary");
    expect(markdown).toContain(blueprint.executiveSummary.trim());
  });

  it("includes Dataverse tables", () => {
    expect(markdown).toContain("## Dataverse Tables");
    expect(markdown).toContain(`### ${blueprint.dataverseTables[0].name}`);
    expect(markdown).toContain("| Column | Type | Required | Description |");
  });

  it("includes Power Automate flows", () => {
    expect(markdown).toContain("## Power Automate Flows");
    expect(markdown).toContain(`### ${blueprint.powerAutomateFlows[0].name}`);
    expect(markdown).toContain("- Trigger:");
  });

  it("includes the ALM plan", () => {
    expect(markdown).toContain("## ALM Plan");
    expect(markdown).toContain("### Environments");
    expect(markdown).toContain("### Solution Strategy");
  });
});
