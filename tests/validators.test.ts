import { describe, expect, it } from "vitest";
import { getMockArchitectureResult } from "@/lib/mockResults";
import {
  safeParseArchitectureResult,
  validateRequirementInput,
} from "@/lib/validators";

describe("validateRequirementInput", () => {
  it("rejects empty input", () => {
    const result = validateRequirementInput("   ");

    expect(result.valid).toBe(false);
    expect(result.error).toContain("Describe the business requirement");
  });

  it("rejects input that is too short", () => {
    const result = validateRequirementInput("Build app");

    expect(result.valid).toBe(false);
    expect(result.error).toContain("Add a little more detail");
  });

  it("rejects input that is too long", () => {
    const result = validateRequirementInput("a".repeat(10001));

    expect(result.valid).toBe(false);
    expect(result.error).toContain("too long");
  });

  it("accepts a practical requirement", () => {
    const result = validateRequirementInput(
      "Build a Power Platform solution for employee onboarding with approvals, task assignment, and audit tracking.",
    );

    expect(result).toEqual({ valid: true });
  });
});

describe("safeParseArchitectureResult", () => {
  it("returns parsed data for a valid architecture result", () => {
    const mockResult = getMockArchitectureResult();
    const result = safeParseArchitectureResult(mockResult);

    expect(result.success).toBe(true);

    if (result.success) {
      expect(result.data.id).toBe(mockResult.id);
    }
  });

  it("returns a friendly error for invalid architecture data", () => {
    const invalidResult = {
      ...getMockArchitectureResult(),
      executiveSummary: undefined,
    };

    const result = safeParseArchitectureResult(invalidResult);

    expect(result.success).toBe(false);

    if (!result.success) {
      expect(result.error).toContain("architecture result");
      expect(result.error).toContain("executiveSummary");
    }
  });
});
