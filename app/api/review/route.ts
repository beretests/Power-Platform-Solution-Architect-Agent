import { NextResponse } from "next/server";
import { generateReview, isAzureOpenAIConfigured } from "@/lib/azureOpenAI";

interface ReviewRequestBody {
  designText?: unknown;
}

const minimumDesignTextLength = 30;

const readRequestBody = async (
  request: Request,
): Promise<ReviewRequestBody | null> => {
  try {
    const body: unknown = await request.json();

    if (!body || typeof body !== "object") {
      return null;
    }

    return body as ReviewRequestBody;
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

  if (!body || typeof body.designText !== "string") {
    return NextResponse.json(
      { error: "Request body must include a designText string." },
      { status: 400 },
    );
  }

  const designText = body.designText.trim();

  if (designText.length < minimumDesignTextLength) {
    return NextResponse.json(
      {
        error:
          "Design text must be at least 30 characters so there is enough detail to review.",
      },
      { status: 400 },
    );
  }

  const mockMode = !isAzureOpenAIConfigured();

  try {
    const result = await generateReview(designText);

    return NextResponse.json(mockMode ? { ...result, mockMode: true } : result);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Architecture review failed.";

    return NextResponse.json(
      { error: sanitizeGenerationError(message) },
      { status: 500 },
    );
  }
}
