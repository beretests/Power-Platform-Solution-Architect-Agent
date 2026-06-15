import { describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

const { buildFoundryIQContext, buildRetrieveRequestBody } = await import(
  "@/lib/foundryIQ"
);

describe("buildRetrieveRequestBody", () => {
  it("uses messages for 2026-05-01-preview without top-level query", () => {
    const body = buildRetrieveRequestBody({
      query: "Design an asset tracking app",
      mode: "architect",
      apiVersion: "2026-05-01-preview",
    });

    expect(body).not.toHaveProperty("query");
    expect(body).not.toHaveProperty("outputMode");
    expect(body).toHaveProperty("messages");
    expect(body).toMatchObject({
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: expect.stringContaining("Design an asset tracking app"),
            },
          ],
        },
      ],
      includeActivity: true,
      maxOutputDocuments: 5,
      maxOutputSize: 6000,
    });
  });

  it("uses intents for 2026-04-01 without preview-only parameters", () => {
    const body = buildRetrieveRequestBody({
      query: "Review a SharePoint-backed onboarding app",
      mode: "review",
      apiVersion: "2026-04-01",
    });

    expect(body).not.toHaveProperty("query");
    expect(body).not.toHaveProperty("messages");
    expect(body).not.toHaveProperty("outputMode");
    expect(body).not.toHaveProperty("includeActivity");
    expect(body).not.toHaveProperty("maxOutputDocuments");
    expect(body).not.toHaveProperty("maxOutputSize");
    expect(body).toMatchObject({
      intents: [
        {
          content: [
            {
              type: "text",
              text: expect.stringContaining(
                "Review a SharePoint-backed onboarding app",
              ),
            },
          ],
        },
      ],
    });
  });
});

describe("buildFoundryIQContext", () => {
  it("extracts text from structured content arrays", () => {
    const context = buildFoundryIQContext({
      value: [
        {
          title: "Dataverse design rules",
          content: [
            {
              type: "text",
              text: "Use Dataverse for relational business data.",
            },
          ],
          metadata: {
            filepath: "knowledge/dataverse-design-rules.md",
          },
        },
      ],
      activity: [{ step: "retrieve" }],
    });

    expect(context.groundingMode).toBe("foundry-iq");
    expect(context.groundingText).toContain(
      "Use Dataverse for relational business data.",
    );
    expect(context.sources[0]).toMatchObject({
      title: "Dataverse design rules",
      path: "knowledge/dataverse-design-rules.md",
      sourceType: "foundry-iq",
    });
  });

  it("extracts text from nested references collections", () => {
    const context = buildFoundryIQContext({
      output: {
        references: [
          {
            name: "Power Automate reliability",
            text: "Use retry policies and durable ownership for production flows.",
          },
        ],
      },
    });

    expect(context.groundingText).toContain(
      "Use retry policies and durable ownership for production flows.",
    );
    expect(context.sources[0]?.title).toBe("Power Automate reliability");
  });
});
