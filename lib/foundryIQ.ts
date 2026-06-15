import "server-only";

import { readFile } from "node:fs/promises";
import path from "node:path";
import { DefaultAzureCredential } from "@azure/identity";

type FoundryIQMode = "architect" | "review";

type FoundryIQAuthMode = "api-key" | "managed-identity";

export interface FoundryIQSource {
  title: string;
  sourceType: "foundry-iq" | "local-fallback" | "warning";
  path?: string;
  score?: number;
  warning?: string;
}

export interface FoundryIQContext {
  groundingMode:
    | "foundry-iq"
    | "local-fallback-disabled"
    | "local-fallback-error";
  groundingText: string;
  sources: FoundryIQSource[];
  rawActivity: unknown;
}

interface FoundryIQEnv {
  enabled: boolean;
  searchEndpoint?: string;
  knowledgeBase?: string;
  apiVersion?: string;
  authMode?: FoundryIQAuthMode;
  apiKey?: string;
}

interface LocalKnowledgeDocument {
  title: string;
  filename: string;
  content: string;
  score: number;
}

interface FoundryIQRetrievedDocument {
  id?: unknown;
  title?: unknown;
  name?: unknown;
  fileName?: unknown;
  filepath?: unknown;
  reference?: unknown;
  url?: unknown;
  content?: unknown;
  contents?: unknown;
  text?: unknown;
  value?: unknown;
  chunk?: unknown;
  pageContent?: unknown;
  markdown?: unknown;
  body?: unknown;
  summary?: unknown;
  score?: unknown;
  "@search.score"?: unknown;
  source?: unknown;
  metadata?: unknown;
}

const maxOutputDocuments = 5;
const maxOutputSize = 6000;

const localKnowledgeFiles = [
  "power-platform-patterns.md",
  "dataverse-design-rules.md",
  "alm-best-practices.md",
  "security-guidance.md",
  "power-automate-reliability.md",
  "solution-review-board-checklist.md",
] as const;

const architectPreferredFiles = [
  "power-platform-patterns.md",
  "dataverse-design-rules.md",
  "power-automate-reliability.md",
  "security-guidance.md",
  "alm-best-practices.md",
  "solution-review-board-checklist.md",
] as const;

const reviewPreferredFiles = [
  "solution-review-board-checklist.md",
  "security-guidance.md",
  "alm-best-practices.md",
  "dataverse-design-rules.md",
  "power-automate-reliability.md",
  "power-platform-patterns.md",
] as const;

const getEnv = (): FoundryIQEnv => {
  const authMode = process.env.FOUNDRY_IQ_AUTH_MODE;

  return {
    enabled: process.env.FOUNDRY_IQ_ENABLED === "true",
    searchEndpoint: process.env.FOUNDRY_IQ_SEARCH_ENDPOINT,
    knowledgeBase: process.env.FOUNDRY_IQ_KNOWLEDGE_BASE,
    apiVersion: process.env.FOUNDRY_IQ_API_VERSION,
    authMode:
      authMode === "managed-identity" || authMode === "api-key"
        ? authMode
        : undefined,
    apiKey: process.env.AZURE_SEARCH_API_KEY,
  };
};

const normalizeEndpoint = (endpoint: string) => endpoint.replace(/\/+$/, "");

const getKnowledgePath = (filename: string) =>
  path.join(process.cwd(), "knowledge", filename);

const getTitleFromMarkdown = (content: string, fallback: string) => {
  const firstHeading = content.match(/^#\s+(.+)$/m);

  return firstHeading?.[1]?.trim() ?? fallback;
};

const tokenize = (value: string) =>
  value
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter((token) => token.length > 2);

const scoreDocument = (
  content: string,
  filename: string,
  query: string,
  mode: FoundryIQMode,
) => {
  const queryTokens = new Set(tokenize(query));
  const contentTokens = tokenize(`${filename} ${content}`);
  const contentTokenSet = new Set(contentTokens);
  const preferredFiles =
    mode === "review" ? reviewPreferredFiles : architectPreferredFiles;
  const preferenceScore =
    preferredFiles.length - preferredFiles.indexOf(filename as never);
  const queryScore = [...queryTokens].reduce(
    (score, token) => score + (contentTokenSet.has(token) ? 3 : 0),
    0,
  );

  return queryScore + Math.max(preferenceScore, 0);
};

const readLocalKnowledgeDocuments = async (
  query: string,
  mode: FoundryIQMode,
): Promise<LocalKnowledgeDocument[]> => {
  const documents = await Promise.all(
    localKnowledgeFiles.map(async (filename) => {
      const content = await readFile(getKnowledgePath(filename), "utf8");

      return {
        title: getTitleFromMarkdown(content, filename),
        filename,
        content,
        score: scoreDocument(content, filename, query, mode),
      };
    }),
  );

  return documents.sort((a, b) => b.score - a.score);
};

const appendWithinLimit = (parts: string[], nextPart: string) => {
  const currentLength = parts.join("\n\n").length;
  const remaining = maxOutputSize - currentLength;

  if (remaining <= 0) {
    return;
  }

  if (nextPart.length <= remaining) {
    parts.push(nextPart);
    return;
  }

  parts.push(`${nextPart.slice(0, Math.max(0, remaining - 20)).trim()}\n...`);
};

const getLocalFallbackContext = async ({
  query,
  mode,
  warning,
}: {
  query: string;
  mode: FoundryIQMode;
  warning?: string;
}): Promise<FoundryIQContext> => {
  const documents = await readLocalKnowledgeDocuments(query, mode);
  const selectedDocuments = documents.slice(0, maxOutputDocuments);
  const textParts: string[] = [];

  selectedDocuments.forEach((document) => {
    appendWithinLimit(
      textParts,
      `# Source: ${document.title}\n\n${document.content.trim()}`,
    );
  });

  const warningSource: FoundryIQSource | null = warning
    ? {
        title: "Foundry IQ retrieval warning",
        sourceType: "warning",
        warning,
      }
    : null;

  return {
    groundingMode: warning ? "local-fallback-error" : "local-fallback-disabled",
    groundingText: textParts.join("\n\n"),
    sources: [
      ...(warningSource ? [warningSource] : []),
      ...selectedDocuments.map((document) => ({
        title: document.title,
        sourceType: "local-fallback" as const,
        path: `knowledge/${document.filename}`,
        score: document.score,
      })),
    ],
    rawActivity: warning
      ? { warning, fallback: "local knowledge folder" }
      : { fallback: "local knowledge folder" },
  };
};

const getManagedIdentityToken = async () => {
  const credential = new DefaultAzureCredential();
  const token = await credential.getToken("https://search.azure.com/.default");

  if (!token?.token) {
    throw new Error("Managed identity authentication did not return a token.");
  }

  return token.token;
};

const buildHeaders = async (env: FoundryIQEnv): Promise<HeadersInit> => {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (env.authMode === "api-key") {
    if (!env.apiKey) {
      throw new Error(
        "Foundry IQ API key authentication is selected, but AZURE_SEARCH_API_KEY is missing.",
      );
    }

    headers["api-key"] = env.apiKey;
    return headers;
  }

  if (env.authMode === "managed-identity") {
    headers.Authorization = `Bearer ${await getManagedIdentityToken()}`;
    return headers;
  }

  throw new Error(
    "FOUNDRY_IQ_AUTH_MODE must be either 'api-key' or 'managed-identity'.",
  );
};

const getRequiredFoundryIQConfig = (env: FoundryIQEnv) => {
  if (!env.searchEndpoint) {
    throw new Error("FOUNDRY_IQ_SEARCH_ENDPOINT is missing.");
  }

  if (!env.knowledgeBase) {
    throw new Error("FOUNDRY_IQ_KNOWLEDGE_BASE is missing.");
  }

  if (!env.apiVersion) {
    throw new Error("FOUNDRY_IQ_API_VERSION is missing.");
  }

  return {
    searchEndpoint: normalizeEndpoint(env.searchEndpoint),
    knowledgeBase: encodeURIComponent(env.knowledgeBase),
    rawApiVersion: env.apiVersion,
    apiVersion: encodeURIComponent(env.apiVersion),
  };
};

const getModeInstruction = (mode: FoundryIQMode) =>
  mode === "review"
    ? "Retrieve Power Platform Solution Review Board guidance for reviewing an existing design."
    : "Retrieve Power Platform solution architecture guidance for generating a new architecture.";

const buildContentParts = (content: string) => [
  {
    type: "text",
    text: content,
  },
];

export const buildRetrieveRequestBody = ({
  query,
  mode,
  apiVersion,
}: {
  query: string;
  mode: FoundryIQMode;
  apiVersion: string;
}) => {
  const content = `${getModeInstruction(mode)}\n\n${query}`;

  if (apiVersion === "2026-05-01-preview") {
    return {
      messages: [
        {
          role: "user",
          content: buildContentParts(content),
        },
      ],
      includeActivity: true,
      maxOutputDocuments,
      maxOutputSize,
    };
  }

  if (apiVersion === "2026-04-01") {
    return {
      intents: [
        {
          content: buildContentParts(content),
        },
      ],
    };
  }

  return {
    messages: [
      {
        role: "user",
        content: buildContentParts(content),
      },
    ],
    includeActivity: true,
    maxOutputDocuments,
    maxOutputSize,
  };
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
  Boolean(value) && typeof value === "object" && !Array.isArray(value);

const sourceCollectionKeys = new Set([
  "value",
  "documents",
  "results",
  "sources",
  "references",
  "citations",
  "chunks",
  "retrievedDocuments",
  "outputDocuments",
  "groundingSources",
]);

const textFieldKeys = [
  "text",
  "content",
  "contents",
  "chunk",
  "pageContent",
  "markdown",
  "body",
  "summary",
  "source",
] as const;

const contentToText = (value: unknown): string => {
  if (typeof value === "string") {
    return value.trim();
  }

  if (Array.isArray(value)) {
    return value
      .map(contentToText)
      .filter(Boolean)
      .join("\n\n")
      .trim();
  }

  if (!isRecord(value)) {
    return "";
  }

  for (const key of textFieldKeys) {
    const text = contentToText(value[key]);

    if (text) {
      return text;
    }
  }

  return "";
};

const getDocumentText = (document: FoundryIQRetrievedDocument) => {
  for (const key of textFieldKeys) {
    const text = contentToText(document[key]);

    if (text) {
      return text;
    }
  }

  return "";
};

const hasPotentialDocumentText = (value: unknown) =>
  isRecord(value) && getDocumentText(value).length > 0;

const extractRetrievedDocuments = (
  data: unknown,
): FoundryIQRetrievedDocument[] => {
  const documents: FoundryIQRetrievedDocument[] = [];
  const seen = new Set<unknown>();

  const visit = (value: unknown, insideCollection: boolean) => {
    if (!value || seen.has(value)) {
      return;
    }

    if (typeof value === "object") {
      seen.add(value);
    }

    if (Array.isArray(value)) {
      value.forEach((item) => visit(item, true));
      return;
    }

    if (!isRecord(value)) {
      return;
    }

    if (insideCollection && hasPotentialDocumentText(value)) {
      documents.push(value);
    }

    Object.entries(value).forEach(([key, child]) => {
      visit(child, sourceCollectionKeys.has(key));
    });
  };

  visit(data, false);

  if (documents.length > 0) {
    return documents;
  }

  if (hasPotentialDocumentText(data)) {
    return [data as FoundryIQRetrievedDocument];
  }

  return [];
};

const getDocumentTitle = (
  document: FoundryIQRetrievedDocument,
  index: number,
) => {
  const metadata = isRecord(document.metadata) ? document.metadata : {};
  const titleCandidate =
    document.title ??
    document.name ??
    document.fileName ??
    metadata.title ??
    metadata.name ??
    metadata.fileName ??
    document.id;

  return typeof titleCandidate === "string" && titleCandidate.trim()
    ? titleCandidate.trim()
    : `Foundry IQ source ${index + 1}`;
};

const getDocumentScore = (document: FoundryIQRetrievedDocument) => {
  const scoreCandidate = document.score ?? document["@search.score"];

  return typeof scoreCandidate === "number" ? scoreCandidate : undefined;
};

const getDocumentPath = (document: FoundryIQRetrievedDocument) => {
  const metadata = isRecord(document.metadata) ? document.metadata : {};
  const referenceCandidate =
    document.reference ??
    document.url ??
    document.filepath ??
    document.fileName ??
    metadata.reference ??
    metadata.url ??
    metadata.filepath ??
    metadata.fileName;

  return typeof referenceCandidate === "string" && referenceCandidate.trim()
    ? referenceCandidate.trim()
    : undefined;
};

const extractActivity = (data: unknown) => {
  if (!data || typeof data !== "object") {
    return null;
  }

  const candidate = data as {
    activity?: unknown;
    activities?: unknown;
    rawActivity?: unknown;
  };

  return candidate.activity ?? candidate.activities ?? candidate.rawActivity ?? null;
};

export const buildFoundryIQContext = (data: unknown): FoundryIQContext => {
  const documents = extractRetrievedDocuments(data).slice(0, maxOutputDocuments);
  const textParts: string[] = [];

  documents.forEach((document, index) => {
    const text = getDocumentText(document);

    if (!text) {
      return;
    }

    appendWithinLimit(
      textParts,
      `# Source: ${getDocumentTitle(document, index)}\n\n${text}`,
    );
  });

  if (textParts.length === 0) {
    throw new Error("Foundry IQ retrieval returned no usable document text.");
  }

  return {
    groundingMode: "foundry-iq",
    groundingText: textParts.join("\n\n"),
    sources: documents.map((document, index) => ({
      title: getDocumentTitle(document, index),
      sourceType: "foundry-iq" as const,
      path: getDocumentPath(document),
      score: getDocumentScore(document),
    })),
    rawActivity: extractActivity(data),
  };
};

const retrieveFromFoundryIQ = async (
  query: string,
  mode: FoundryIQMode,
): Promise<FoundryIQContext> => {
  const env = getEnv();
  const config = getRequiredFoundryIQConfig(env);
  const headers = await buildHeaders(env);
  const url = `${config.searchEndpoint}/knowledgebases/${config.knowledgeBase}/retrieve?api-version=${config.apiVersion}`;
  const requestBody = buildRetrieveRequestBody({
    query,
    mode,
    apiVersion: config.rawApiVersion,
  });
  const response = await fetch(url, {
    method: "POST",
    headers,
    body: JSON.stringify(requestBody),
  });

  if (!response.ok) {
    const responseBody = await response.text();
    const detail = responseBody ? ` ${responseBody}` : "";

    console.error("Foundry IQ retrieval failed", {
      status: response.status,
      statusText: response.statusText,
      responseBody,
    });

    throw new Error(
      `Foundry IQ retrieval failed with ${response.status} ${response.statusText}.${detail}`,
    );
  }

  const responseJson: unknown = await response.json();

  try {
    return buildFoundryIQContext(responseJson);
  } catch (error) {
    console.error("Foundry IQ response parsing failed", {
      status: response.status,
      statusText: response.statusText,
      responseBody: JSON.stringify(responseJson),
    });

    throw error;
  }
};

export const retrieveFoundryIQContext = async (
  query: string,
  mode: FoundryIQMode,
): Promise<FoundryIQContext> => {
  const env = getEnv();

  if (!env.enabled) {
    return getLocalFallbackContext({ query, mode });
  }

  try {
    return await retrieveFromFoundryIQ(query, mode);
  } catch (error) {
    const warning =
      error instanceof Error
        ? error.message
        : "Foundry IQ retrieval failed for an unknown reason.";

    return getLocalFallbackContext({ query, mode, warning });
  }
};
