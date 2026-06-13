import { NextResponse } from "next/server";
import {
  generateArchitecture,
  isAzureOpenAIConfigured,
} from "@/lib/azureOpenAI";
import { validateRequirementInput } from "@/lib/validators";

interface ArchitectRequestBody {
  requirement?: unknown;
}

const readRequestBody = async (
  request: Request,
): Promise<ArchitectRequestBody | null> => {
  try {
    const body: unknown = await request.json();

    if (!body || typeof body !== "object") {
      return null;
    }

    return body as ArchitectRequestBody;
  } catch {
    return null;
  }
};

const sanitizeGenerationError = (message: string) => {
  const apiKey = process.env.AZURE_OPENAI_API_KEY;

  if (!apiKey) {
    return message;
  }

  return message.replaceAll(apiKey, "[redacted]");
};

export async function POST(request: Request) {
  const body = await readRequestBody(request);

  if (!body || typeof body.requirement !== "string") {
    return NextResponse.json(
      { error: "Request body must include a requirement string." },
      { status: 400 },
    );
  }

  const validation = validateRequirementInput(body.requirement);

  if (!validation.valid) {
    return NextResponse.json(
      { error: validation.error ?? "The requirement is invalid." },
      { status: 400 },
    );
  }

  const mockMode = !isAzureOpenAIConfigured();

  try {
    const result = await generateArchitecture(body.requirement);

    return NextResponse.json(mockMode ? { ...result, mockMode: true } : result);
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Architecture generation failed.";

    return NextResponse.json(
      { error: sanitizeGenerationError(message) },
      { status: 500 },
    );
  }
}
