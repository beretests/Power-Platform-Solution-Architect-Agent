import { describe, expect, it } from "vitest";
import { solutionArchitectureJsonSchema } from "@/lib/jsonSchema";

describe("solutionArchitectureJsonSchema", () => {
  it("exports a strict object schema suitable for structured outputs", () => {
    expect(solutionArchitectureJsonSchema.type).toBe("object");
    expect(solutionArchitectureJsonSchema.properties).toBeDefined();
    expect(solutionArchitectureJsonSchema.required).toEqual(
      Object.keys(solutionArchitectureJsonSchema.properties ?? {}),
    );
    expect(solutionArchitectureJsonSchema.additionalProperties).toBe(false);
  });

  it("requires nested object properties and disables additional properties", () => {
    const recommendedAppType =
      solutionArchitectureJsonSchema.properties?.recommendedAppType;
    const readinessScore =
      solutionArchitectureJsonSchema.properties?.readinessScore;

    expect(recommendedAppType?.type).toBe("object");
    expect(recommendedAppType?.additionalProperties).toBe(false);
    expect(readinessScore?.type).toBe("object");
    expect(readinessScore?.additionalProperties).toBe(false);
  });
});
