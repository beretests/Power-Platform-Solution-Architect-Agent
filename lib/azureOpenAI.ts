import { getMockArchitectureResult } from "./mockResults";
import { architectSystemPrompt } from "./prompts";
import { solutionArchitectureJsonSchema } from "./jsonSchema";
import {
  SolutionArchitectureResult,
  SolutionArchitectureResultSchema,
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

export const generateArchitecture = async (
  requirement: string,
): Promise<SolutionArchitectureResult> => {
  const env = getEnv();

  if (!env) {
    return getMockArchitectureResult();
  }

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
          content: architectSystemPrompt,
        },
        {
          role: "user",
          content: requirement,
        },
      ],
      response_format: {
        type: "json_schema",
        json_schema: {
          name: "SolutionArchitectureResult",
          strict: true,
          schema: solutionArchitectureJsonSchema,
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

  const parsedContent = parseJsonObject(content);

  return validateArchitectureResult(parsedContent);
};
