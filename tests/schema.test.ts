import { describe, expect, it } from "vitest";
import { getMockArchitectureResult } from "@/lib/mockResults";
import { SolutionArchitectureResultSchema } from "@/lib/schemas";

const cloneMockResult = () => structuredClone(getMockArchitectureResult());

describe("SolutionArchitectureResultSchema", () => {
  it("accepts the mock architecture result", () => {
    const result = SolutionArchitectureResultSchema.safeParse(
      getMockArchitectureResult(),
    );

    expect(result.success).toBe(true);
  });

  it("rejects an invalid detectedPattern", () => {
    const invalidResult: Omit<ReturnType<typeof cloneMockResult>, "detectedPattern"> & {
      detectedPattern: string;
    } = cloneMockResult();
    invalidResult.detectedPattern = "invalid-pattern";

    const result = SolutionArchitectureResultSchema.safeParse(invalidResult);

    expect(result.success).toBe(false);
  });

  it("rejects a missing executiveSummary", () => {
    const invalidResult = cloneMockResult();
    const dataWithoutExecutiveSummary: Partial<typeof invalidResult> = {
      ...invalidResult,
    };
    delete dataWithoutExecutiveSummary.executiveSummary;

    const result = SolutionArchitectureResultSchema.safeParse(
      dataWithoutExecutiveSummary,
    );

    expect(result.success).toBe(false);
  });

  it("rejects an invalid risk severity", () => {
    const invalidResult: Omit<ReturnType<typeof cloneMockResult>, "risks"> & {
      risks: Array<
        Omit<ReturnType<typeof cloneMockResult>["risks"][number], "severity"> & {
          severity: string;
        }
      >;
    } = cloneMockResult();
    invalidResult.risks[0] = {
      ...invalidResult.risks[0],
      severity: "Critical",
    };

    const result = SolutionArchitectureResultSchema.safeParse(invalidResult);

    expect(result.success).toBe(false);
  });

  it("requires readiness scores to be between 0 and 100", () => {
    const invalidResult = cloneMockResult();
    invalidResult.readinessScore.total = 101;

    const highResult = SolutionArchitectureResultSchema.safeParse(invalidResult);

    expect(highResult.success).toBe(false);

    invalidResult.readinessScore.total = -1;
    const lowResult = SolutionArchitectureResultSchema.safeParse(invalidResult);

    expect(lowResult.success).toBe(false);
  });
});
