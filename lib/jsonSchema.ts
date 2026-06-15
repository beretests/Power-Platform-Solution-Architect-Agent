import { zodToJsonSchema } from "zod-to-json-schema";
import {
  ReviewResultSchema,
  SolutionArchitectureResultSchema,
} from "./schemas";

type JsonSchema = {
  type?: string;
  enum?: readonly string[];
  properties?: Record<string, JsonSchema>;
  required?: readonly string[];
  items?: JsonSchema;
  additionalProperties?: boolean;
  minimum?: number;
  maximum?: number;
};

const stringSchema = { type: "string" } as const;
const stringArraySchema = {
  type: "array",
  items: stringSchema,
} as const;

const strictObject = <TProperties extends Record<string, JsonSchema>>(
  properties: TProperties,
) =>
  ({
    type: "object",
    properties,
    required: Object.keys(properties),
    additionalProperties: false,
  }) as const;

const scoreSchema = {
  type: "number",
  minimum: 0,
  maximum: 100,
} as const;

const columnJsonSchema = strictObject({
  name: stringSchema,
  type: stringSchema,
  required: { type: "boolean" },
  description: stringSchema,
});

const relationshipJsonSchema = strictObject({
  target: stringSchema,
  relationship: stringSchema,
});

const dataverseTableJsonSchema = strictObject({
  name: stringSchema,
  description: stringSchema,
  ownershipType: stringSchema,
  columns: {
    type: "array",
    items: columnJsonSchema,
  },
  relationships: {
    type: "array",
    items: relationshipJsonSchema,
  },
  keys: stringArraySchema,
  auditingRecommendation: stringSchema,
});

const flowJsonSchema = strictObject({
  name: stringSchema,
  trigger: stringSchema,
  steps: stringArraySchema,
  connectors: stringArraySchema,
  errorHandling: stringSchema,
  retryPolicy: stringSchema,
  ownerRecommendation: stringSchema,
});

const securityRoleJsonSchema = strictObject({
  name: stringSchema,
  persona: stringSchema,
  tablePrivileges: stringArraySchema,
  notes: stringArraySchema,
});

const almPlanJsonSchema = strictObject({
  environments: stringArraySchema,
  solutionStrategy: stringArraySchema,
  connectionReferences: stringArraySchema,
  environmentVariables: stringArraySchema,
  deploymentSteps: stringArraySchema,
  rollbackPlan: stringArraySchema,
});

const riskJsonSchema = strictObject({
  severity: {
    type: "string",
    enum: ["High", "Medium", "Low"],
  },
  area: stringSchema,
  description: stringSchema,
  mitigation: stringSchema,
});

const reviewFindingJsonSchema = strictObject({
  severity: {
    type: "string",
    enum: ["High", "Medium", "Low"],
  },
  category: stringSchema,
  finding: stringSchema,
  whyItMatters: stringSchema,
  recommendation: stringSchema,
});

const priorityFixJsonSchema = strictObject({
  priority: {
    type: "number",
    minimum: 1,
  },
  title: stringSchema,
  action: stringSchema,
  expectedImpact: stringSchema,
});

const readinessScoreJsonSchema = strictObject({
  total: scoreSchema,
  accuracy: scoreSchema,
  security: scoreSchema,
  alm: scoreSchema,
  scalability: scoreSchema,
  usability: scoreSchema,
  notes: stringArraySchema,
});

const recommendedAppTypeJsonSchema = strictObject({
  appType: stringSchema,
  rationale: stringSchema,
  alternatives: stringArraySchema,
});

const manualSolutionArchitectureJsonSchema = strictObject({
  id: stringSchema,
  createdAt: stringSchema,
  mode: {
    type: "string",
    enum: ["generate", "review"],
  },
  requirement: stringSchema,
  executiveSummary: stringSchema,
  detectedPattern: {
    type: "string",
    enum: [
      "case-management",
      "approval-workflow",
      "asset-management",
      "onboarding",
      "inspection",
      "training-management",
      "custom",
    ],
  },
  recommendedAppType: recommendedAppTypeJsonSchema,
  assumptions: stringArraySchema,
  dataverseTables: {
    type: "array",
    items: dataverseTableJsonSchema,
  },
  powerAutomateFlows: {
    type: "array",
    items: flowJsonSchema,
  },
  securityRoles: {
    type: "array",
    items: securityRoleJsonSchema,
  },
  almPlan: almPlanJsonSchema,
  licensingNotes: stringArraySchema,
  risks: {
    type: "array",
    items: riskJsonSchema,
  },
  readinessScore: readinessScoreJsonSchema,
  architectureDiagramMermaid: stringSchema,
  implementationChecklist: stringArraySchema,
  followUpQuestions: stringArraySchema,
});

const manualReviewResultJsonSchema = strictObject({
  ...manualSolutionArchitectureJsonSchema.properties,
  mode: {
    type: "string",
    enum: ["review"],
  },
  reviewFindings: {
    type: "array",
    items: reviewFindingJsonSchema,
  },
  priorityFixes: {
    type: "array",
    items: priorityFixJsonSchema,
  },
  originalDesignSummary: stringSchema,
});

const convertedSolutionArchitectureJsonSchema = zodToJsonSchema(
  SolutionArchitectureResultSchema as unknown as Parameters<
    typeof zodToJsonSchema
  >[0],
  {
    $refStrategy: "none",
    name: "SolutionArchitectureResult",
  },
);

const convertedReviewResultJsonSchema = zodToJsonSchema(
  ReviewResultSchema as unknown as Parameters<typeof zodToJsonSchema>[0],
  {
    $refStrategy: "none",
    name: "ReviewResult",
  },
);

const hasUsableConvertedSchema = (schema: unknown): schema is JsonSchema => {
  if (!schema || typeof schema !== "object") {
    return false;
  }

  const candidate = schema as JsonSchema;

  return candidate.type === "object" && Boolean(candidate.properties);
};

export const solutionArchitectureJsonSchema = hasUsableConvertedSchema(
  convertedSolutionArchitectureJsonSchema,
)
  ? convertedSolutionArchitectureJsonSchema
  : manualSolutionArchitectureJsonSchema;

export const reviewResultJsonSchema = hasUsableConvertedSchema(
  convertedReviewResultJsonSchema,
)
  ? convertedReviewResultJsonSchema
  : manualReviewResultJsonSchema;
