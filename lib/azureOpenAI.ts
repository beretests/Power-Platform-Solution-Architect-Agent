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
  ReviewResultSchema,
  SolutionArchitectureResultSchema,
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

  const parsedContent = await requestStructuredOutput({
    env,
    systemPrompt: architectSystemPrompt,
    userContent: requirement,
    schemaName: "SolutionArchitectureResult",
    schema: solutionArchitectureJsonSchema,
  });

  return validateArchitectureResult(parsedContent);
};

export const generateReview = async (
  designText: string,
): Promise<ReviewResult> => {
  const env = getEnv();

  if (!env) {
    return getMockReviewResult();
  }

  const parsedContent = await requestStructuredOutput({
    env,
    systemPrompt: reviewSystemPrompt,
    userContent: designText,
    schemaName: "ReviewResult",
    schema: reviewResultJsonSchema,
  });

  return validateReviewResult(parsedContent);
};
