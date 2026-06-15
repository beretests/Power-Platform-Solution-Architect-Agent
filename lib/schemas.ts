import { z } from "zod";

export const ColumnSchema = z.object({
  name: z.string().min(1),
  displayName: z.string().min(1).optional(),
  type: z.string().min(1),
  required: z.boolean().default(false),
  description: z.string().min(1),
});

export const RelationshipSchema = z.object({
  target: z.string().min(1),
  relationship: z.string().min(1),
});

export const DataverseTableSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  ownershipType: z.string().min(1),
  columns: z.array(ColumnSchema).default([]),
  relationships: z.array(RelationshipSchema).default([]),
  keys: z.array(z.string().min(1)).default([]),
  auditingRecommendation: z.string().min(1),
});

export const FlowSchema = z.object({
  name: z.string().min(1),
  trigger: z.string().min(1),
  steps: z.array(z.string().min(1)).default([]),
  connectors: z.array(z.string().min(1)).default([]),
  errorHandling: z.string().min(1),
  retryPolicy: z.string().min(1),
  ownerRecommendation: z.string().min(1),
});

export const SecurityRoleSchema = z.object({
  name: z.string().min(1),
  persona: z.string().min(1),
  tablePrivileges: z.array(z.string().min(1)).default([]),
  notes: z.array(z.string().min(1)).default([]),
});

export const ALMPlanSchema = z.object({
  environments: z.array(z.string().min(1)).default([]),
  solutionStrategy: z.array(z.string().min(1)).default([]),
  connectionReferences: z.array(z.string().min(1)).default([]),
  environmentVariables: z.array(z.string().min(1)).default([]),
  deploymentSteps: z.array(z.string().min(1)).default([]),
  rollbackPlan: z.array(z.string().min(1)).default([]),
});

export const RiskSchema = z.object({
  severity: z.enum(["High", "Medium", "Low"]),
  area: z.string().min(1),
  description: z.string().min(1),
  mitigation: z.string().min(1),
});

export const ReviewFindingSchema = z.object({
  severity: z.enum(["High", "Medium", "Low"]),
  category: z.string().min(1),
  finding: z.string().min(1),
  whyItMatters: z.string().min(1),
  recommendation: z.string().min(1),
});

export const PriorityFixSchema = z.object({
  priority: z.number().int().min(1),
  title: z.string().min(1),
  action: z.string().min(1),
  expectedImpact: z.string().min(1),
});

export const ReadinessScoreSchema = z.object({
  total: z.number().int().min(0).max(100),
  accuracy: z.number().int().min(0).max(100),
  security: z.number().int().min(0).max(100),
  alm: z.number().int().min(0).max(100),
  scalability: z.number().int().min(0).max(100),
  usability: z.number().int().min(0).max(100),
  notes: z.array(z.string().min(1)).default([]),
});

export const RecommendedAppTypeSchema = z.object({
  appType: z.string().min(1),
  rationale: z.string().min(1),
  alternatives: z.array(z.string().min(1)).default([]),
});

export const DetectedPatternSchema = z.enum([
  "case-management",
  "approval-workflow",
  "asset-management",
  "onboarding",
  "inspection",
  "training-management",
  "custom",
]);

export const SolutionArchitectureResultSchema = z.object({
  id: z.string().min(1),
  createdAt: z.string().min(1),
  mode: z.enum(["generate", "review"]),
  requirement: z.string().min(1),
  executiveSummary: z.string().min(1),
  detectedPattern: DetectedPatternSchema,
  recommendedAppType: RecommendedAppTypeSchema,
  assumptions: z.array(z.string().min(1)).default([]),
  dataverseTables: z.array(DataverseTableSchema).default([]),
  powerAutomateFlows: z.array(FlowSchema).default([]),
  securityRoles: z.array(SecurityRoleSchema).default([]),
  almPlan: ALMPlanSchema,
  licensingNotes: z.array(z.string().min(1)).default([]),
  risks: z.array(RiskSchema).default([]),
  readinessScore: ReadinessScoreSchema,
  architectureDiagramMermaid: z.string().min(1),
  implementationChecklist: z.array(z.string().min(1)).default([]),
  followUpQuestions: z.array(z.string().min(1)).default([]),
});

export const ReviewResultSchema = SolutionArchitectureResultSchema.extend({
  reviewFindings: z.array(ReviewFindingSchema).default([]),
  priorityFixes: z.array(PriorityFixSchema).default([]),
  originalDesignSummary: z.string().min(1),
});

export type Column = z.infer<typeof ColumnSchema>;
export type Relationship = z.infer<typeof RelationshipSchema>;
export type DataverseTable = z.infer<typeof DataverseTableSchema>;
export type Flow = z.infer<typeof FlowSchema>;
export type SecurityRole = z.infer<typeof SecurityRoleSchema>;
export type ALMPlan = z.infer<typeof ALMPlanSchema>;
export type Risk = z.infer<typeof RiskSchema>;
export type ReviewFinding = z.infer<typeof ReviewFindingSchema>;
export type PriorityFix = z.infer<typeof PriorityFixSchema>;
export type ReadinessScore = z.infer<typeof ReadinessScoreSchema>;
export type RecommendedAppType = z.infer<typeof RecommendedAppTypeSchema>;
export type DetectedPattern = z.infer<typeof DetectedPatternSchema>;
export type SolutionArchitectureResult = z.infer<
  typeof SolutionArchitectureResultSchema
>;
export type ReviewResult = z.infer<typeof ReviewResultSchema>;
