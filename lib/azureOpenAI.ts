import {
  getMockArchitectureResult,
  getMockReviewResult,
} from "./mockResults";
import {
  reviewResultJsonSchema,
  solutionArchitectureJsonSchema,
} from "./jsonSchema";
import { architectSystemPrompt, reviewSystemPrompt } from "./prompts";
import {
  retrieveFoundryIQContext,
  type FoundryIQContext,
  type FoundryIQSource,
} from "./foundryIQ";
import {
  ReviewResultSchema,
  SolutionArchitectureResultSchema,
  type GroundingMode,
  type GroundingSource,
  type ReviewResult,
  type SolutionArchitectureResult,
} from "./schemas";

interface AzureOpenAIMessage {
  content?: string | null;
}

interface AzureOpenAIChoice {
  message?: AzureOpenAIMessage;
}

interface AzureOpenAIResponse {
  choices?: AzureOpenAIChoice[];
}

const getEnv = () => {
  const baseUrl = process.env.AZURE_OPENAI_BASE_URL;
  const apiKey = process.env.AZURE_OPENAI_API_KEY;
  const deployment = process.env.AZURE_OPENAI_DEPLOYMENT;

  if (!baseUrl || !apiKey || !deployment) {
    return null;
  }

  return { baseUrl, apiKey, deployment };
};

export const isAzureOpenAIConfigured = () => getEnv() !== null;

const isAzureOpenAIResponse = (value: unknown): value is AzureOpenAIResponse => {
  if (!value || typeof value !== "object") {
    return false;
  }

  const candidate = value as AzureOpenAIResponse;

  return candidate.choices === undefined || Array.isArray(candidate.choices);
};

const parseJsonObject = (content: string): unknown => {
  try {
    return JSON.parse(content);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown JSON error";
    throw new Error(`Azure OpenAI returned invalid JSON: ${message}`);
  }
};

const mapGroundingMode = (
  groundingMode: FoundryIQContext["groundingMode"],
): GroundingMode => {
  if (groundingMode === "foundry-iq") {
    return "foundry-iq";
  }

  return "local-fallback";
};

const mapGroundingSourceType = (
  sourceType: FoundryIQSource["sourceType"],
): GroundingSource["sourceType"] => {
  switch (sourceType) {
    case "foundry-iq":
      return "Foundry IQ";
    case "local-fallback":
      return "Local Knowledge";
    case "warning":
      return "Local Knowledge";
  }
};

const mapGroundingSources = (
  sources: FoundryIQSource[],
  usedFor: string,
): GroundingSource[] =>
  sources.map((source) => ({
    sourceType: mapGroundingSourceType(source.sourceType),
    title: source.title,
    reference: source.path ?? source.title,
    excerpt: source.warning,
    usedFor,
  }));

const applyGroundingToArchitectureResult = (
  result: SolutionArchitectureResult,
  grounding: FoundryIQContext,
): SolutionArchitectureResult => ({
  ...result,
  groundingMode: mapGroundingMode(grounding.groundingMode),
  groundingSources: mapGroundingSources(
    grounding.sources,
    "Grounded architecture generation and Power Platform design recommendations.",
  ),
});

const applyGroundingToReviewResult = (
  result: ReviewResult,
  grounding: FoundryIQContext,
): ReviewResult => ({
  ...result,
  groundingMode: mapGroundingMode(grounding.groundingMode),
  groundingSources: mapGroundingSources(
    grounding.sources,
    "Grounded Solution Review Board findings, mitigations, and readiness assessment.",
  ),
});

const buildGroundedUserContent = ({
  input,
  grounding,
  mode,
}: {
  input: string;
  grounding: FoundryIQContext;
  mode: "architect" | "review";
}) => {
  const inputLabel =
    mode === "architect" ? "Business requirement" : "Existing design";

  return `${inputLabel}:
${input}

Retrieved Foundry IQ grounding context:
Grounding mode: ${mapGroundingMode(grounding.groundingMode)}

Use the retrieved Foundry IQ context below as the primary source of Microsoft Power Platform architecture guidance. Prefer this context over general model knowledge when deciding Dataverse design, app type, Power Automate reliability, security roles, ALM, managed solutions, connection references, environment variables, production readiness, and anti-patterns.

Grounding rules:
- If the grounding context supports a recommendation, apply it.
- If the grounding context does not contain enough information, mark the item as an assumption or follow-up question.
- Do not invent exact licensing prices.
- Do not invent source references.
- Do not claim production readiness without human validation.

${grounding.groundingText}

Return only JSON that matches the requested schema.`;
};

const validateArchitectureResult = (
  data: unknown,
): SolutionArchitectureResult => {
  const result = SolutionArchitectureResultSchema.safeParse(data);

  if (!result.success) {
    const details = result.error.issues
      .map((issue) => `${issue.path.join(".") || "root"}: ${issue.message}`)
      .join("; ");

    throw new Error(
      `Azure OpenAI response failed schema validation: ${details}`,
    );
  }

  return result.data;
};

const validateReviewResult = (data: unknown): ReviewResult => {
  const result = ReviewResultSchema.safeParse(data);

  if (!result.success) {
    const details = result.error.issues
      .map((issue) => `${issue.path.join(".") || "root"}: ${issue.message}`)
      .join("; ");

    throw new Error(
      `Azure OpenAI review response failed schema validation: ${details}`,
    );
  }

  return result.data;
};

const requestStructuredOutput = async ({
  env,
  systemPrompt,
  userContent,
  schemaName,
  schema,
}: {
  env: NonNullable<ReturnType<typeof getEnv>>;
  systemPrompt: string;
  userContent: string;
  schemaName: string;
  schema: unknown;
}): Promise<unknown> => {
  const response = await fetch(`${env.baseUrl}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "api-key": env.apiKey,
    },
    body: JSON.stringify({
      model: env.deployment,
      messages: [
        {
          role: "system",
          content: systemPrompt,
        },
        {
          role: "user",
          content: userContent,
        },
      ],
      response_format: {
        type: "json_schema",
        json_schema: {
          name: schemaName,
          strict: true,
          schema,
        },
      },
    }),
  });

  if (!response.ok) {
    const responseBody = await response.text();
    const detail = responseBody ? ` ${responseBody}` : "";

    throw new Error(
      `Azure OpenAI API request failed with ${response.status} ${response.statusText}.${detail}`,
    );
  }

  const responseJson: unknown = await response.json();

  if (!isAzureOpenAIResponse(responseJson)) {
    throw new Error("Azure OpenAI returned an unexpected response shape.");
  }

  const content = responseJson.choices?.[0]?.message?.content;

  if (!content || !content.trim()) {
    throw new Error("Azure OpenAI returned an empty response.");
  }

  return parseJsonObject(content);
};

export const generateArchitecture = async (
  requirement: string,
): Promise<SolutionArchitectureResult> => {
  const env = getEnv();

  if (!env) {
    return getMockArchitectureResult();
  }

  const grounding = await retrieveFoundryIQContext(requirement, "architect");
  const parsedContent = await requestStructuredOutput({
    env,
    systemPrompt: architectSystemPrompt,
    userContent: buildGroundedUserContent({
      input: requirement,
      grounding,
      mode: "architect",
    }),
    schemaName: "SolutionArchitectureResult",
    schema: solutionArchitectureJsonSchema,
  });

  return applyGroundingToArchitectureResult(
    validateArchitectureResult(parsedContent),
    grounding,
  );
};

export const generateReview = async (
  designText: string,
): Promise<ReviewResult> => {
  const env = getEnv();

  if (!env) {
    return getMockReviewResult();
  }

  const grounding = await retrieveFoundryIQContext(designText, "review");
  const parsedContent = await requestStructuredOutput({
    env,
    systemPrompt: reviewSystemPrompt,
    userContent: buildGroundedUserContent({
      input: designText,
      grounding,
      mode: "review",
    }),
    schemaName: "ReviewResult",
    schema: reviewResultJsonSchema,
  });

  return applyGroundingToReviewResult(validateReviewResult(parsedContent), grounding);
};
