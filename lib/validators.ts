import {
  SolutionArchitectureResult,
  SolutionArchitectureResultSchema,
} from "./schemas";

export const validateRequirementInput = (
  input: string,
): { valid: boolean; error?: string } => {
  const trimmedInput = input.trim();

  if (!trimmedInput) {
    return {
      valid: false,
      error: "Describe the business requirement before generating a blueprint.",
    };
  }

  if (trimmedInput.length < 25) {
    return {
      valid: false,
      error:
        "Add a little more detail so the architecture can include useful tables, flows, roles, and risks.",
    };
  }

  if (trimmedInput.length > 10000) {
    return {
      valid: false,
      error:
        "The requirement is too long. Keep it under 10,000 characters for this prototype.",
    };
  }

  return { valid: true };
};

export const safeParseArchitectureResult = (
  data: unknown,
):
  | { success: true; data: SolutionArchitectureResult }
  | { success: false; error: string } => {
  const result = SolutionArchitectureResultSchema.safeParse(data);

  if (result.success) {
    return { success: true, data: result.data };
  }

  const firstIssue = result.error.issues[0];

  if (!firstIssue) {
    return {
      success: false,
      error: "The architecture result could not be validated.",
    };
  }

  const path = firstIssue.path.join(".");
  const location = path ? ` in '${path}'` : "";

  return {
    success: false,
    error: `The architecture result is missing or has invalid data${location}. ${firstIssue.message}`,
  };
};
