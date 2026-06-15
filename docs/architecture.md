# Architecture

This document describes the architecture for the Power Platform Architect Agent hackathon project.

The app supports two workflows:

- **Generate Architecture**: turn a business requirement into a Power Platform solution blueprint.
- **Solution Review Board**: review an existing Power Platform design and return findings, priority fixes, and readiness scoring.

## High-Level Architecture

```mermaid
flowchart TD
    User[User] --> Browser[Next.js Client UI]
    Browser --> Page[app/page.tsx]
    Page --> Form[RequirementForm]
    Page --> Dashboard[ResultDashboard]

    Form --> ArchitectRoute[/api/architect/]
    Form --> ReviewRoute[/api/review/]

    ArchitectRoute --> AzureWrapper[lib/azureOpenAI.ts]
    ReviewRoute --> AzureWrapper

    AzureWrapper --> EnvCheck{Azure OpenAI configured?}
    EnvCheck -->|Yes| AzureOpenAI[Azure OpenAI / Microsoft Foundry model deployment]
    EnvCheck -->|No| MockResults[lib/mockResults.ts]

    AzureOpenAI --> JsonSchema[Structured JSON schema response]
    JsonSchema --> ZodSchemas[lib/schemas.ts]
    MockResults --> ZodSchemas

    ZodSchemas --> Dashboard
    Dashboard --> ExportPanel[Markdown, JSON, Mermaid export]
```

## Main Runtime Components

| Area | Files | Responsibility |
| --- | --- | --- |
| UI shell | `app/page.tsx` | Mode selection, API calls, loading/error/demo states, result rendering |
| Input | `components/RequirementForm.tsx` | Textarea, mode switch, example prompts, submit actions |
| Dashboard | `components/ResultDashboard.tsx` | Multi-tab report surface |
| Review UI | `ReviewFindingsView.tsx`, `PriorityFixesView.tsx` | Review Board findings and top fixes |
| AI service | `lib/azureOpenAI.ts` | Azure OpenAI calls, parsing, validation, mock fallback |
| Prompts | `lib/prompts.ts` | Generate and review system prompts |
| Schemas | `lib/schemas.ts`, `lib/jsonSchema.ts` | Zod validation and structured-output JSON schemas |
| Validation | `lib/validators.ts` | Input validation and safe result parsing |
| Mock data | `lib/mockResults.ts` | Demo fallback results |
| Export | `lib/exportMarkdown.ts`, `components/ExportPanel.tsx` | Markdown, JSON, and Mermaid output |

## User Flow

```mermaid
sequenceDiagram
    actor User
    participant UI as Next.js UI
    participant API as API Route
    participant AI as Azure OpenAI Wrapper
    participant Dashboard as Result Dashboard

    User->>UI: Select Generate or Review mode
    User->>UI: Enter requirement or paste design
    User->>UI: Submit
    UI->>UI: Validate minimum input length
    UI->>API: POST /api/architect or /api/review
    API->>AI: generateArchitecture() or generateReview()
    AI-->>API: Validated architecture or review result
    API-->>UI: JSON result
    UI->>UI: Safe parse response
    UI->>Dashboard: Render report tabs
    User->>Dashboard: Review tabs and export output
```

## AI Generation Flow

Generate Architecture mode sends a business requirement to `/api/architect`.

```mermaid
flowchart TD
    Requirement[Business requirement text] --> InputValidation[validateRequirementInput]
    InputValidation --> Route[/api/architect/]
    Route --> Generate[generateArchitecture]
    Generate --> Prompt[architectSystemPrompt]
    Generate --> Schema[solutionArchitectureJsonSchema]
    Prompt --> Request[Azure OpenAI chat completions request]
    Schema --> Request
    Request --> Model[Azure OpenAI model deployment]
    Model --> RawJson[choices[0].message.content]
    RawJson --> Parse[JSON.parse]
    Parse --> Validate[SolutionArchitectureResultSchema.safeParse]
    Validate --> Result[SolutionArchitectureResult]
```

The generated result includes:

- executive summary
- recommended app type
- Dataverse tables
- Power Automate flows
- security roles
- ALM plan
- licensing notes
- risks
- readiness score
- Mermaid architecture diagram
- implementation checklist
- follow-up discovery questions

## Schema Validation Flow

The app uses schema validation in two places:

1. **AI structured output schema** sent to Azure OpenAI.
2. **Runtime Zod validation** after JSON is returned.

```mermaid
flowchart LR
    Zod[Zod schemas in lib/schemas.ts] --> JsonSchema[JSON schemas in lib/jsonSchema.ts]
    JsonSchema --> Azure[Azure OpenAI response_format json_schema]
    Azure --> Raw[Raw JSON string]
    Raw --> Parsed[Parsed unknown data]
    Parsed --> SafeParse[Zod safeParse]
    SafeParse -->|Success| Typed[Typed result used by UI]
    SafeParse -->|Failure| Error[User-friendly validation error]
```

Key schemas:

- `SolutionArchitectureResultSchema`
- `ReviewResultSchema`
- `DataverseTableSchema`
- `FlowSchema`
- `SecurityRoleSchema`
- `ALMPlanSchema`
- `RiskSchema`
- `ReadinessScoreSchema`
- `ReviewFindingSchema`
- `PriorityFixSchema`

## Review Board Flow

Solution Review Board mode sends an existing design to `/api/review`.

```mermaid
flowchart TD
    Design[Existing design text] --> LengthCheck[Minimum 30 character validation]
    LengthCheck --> ReviewRoute[/api/review/]
    ReviewRoute --> GenerateReview[generateReview]
    GenerateReview --> ReviewPrompt[reviewSystemPrompt]
    GenerateReview --> ReviewSchema[reviewResultJsonSchema]
    ReviewPrompt --> ReviewRequest[Azure OpenAI chat completions request]
    ReviewSchema --> ReviewRequest
    ReviewRequest --> Model[Azure OpenAI model deployment]
    Model --> ReviewJson[ReviewResult JSON]
    ReviewJson --> ReviewZod[ReviewResultSchema.safeParse]
    ReviewZod --> Dashboard[Review tab in ResultDashboard]
    Dashboard --> Findings[ReviewFindingsView]
    Dashboard --> Fixes[PriorityFixesView]
```

Review mode evaluates:

- data model quality
- Dataverse suitability
- security model
- ALM strategy
- environment strategy
- Power Automate reliability
- connection ownership
- licensing uncertainty
- scalability
- maintainability
- production readiness

## Fallback Mock Mode

The app is designed to demo even when Azure OpenAI is not configured.

```mermaid
flowchart TD
    Request[Generate or Review request] --> Env{Required env vars present?}
    Env -->|Yes| Azure[Call Azure OpenAI]
    Env -->|No| Mock[Return mock result]
    Mock --> MockMode[mockMode: true]
    MockMode --> UI[Show Demo Mode badge]
    Azure --> RealResult[Real AI output]
    RealResult --> UI
```

Required environment variables:

```bash
AZURE_OPENAI_BASE_URL
AZURE_OPENAI_API_KEY
AZURE_OPENAI_DEPLOYMENT
```

If any variable is missing:

- `generateArchitecture()` returns `getMockArchitectureResult()`.
- `generateReview()` returns `getMockReviewResult()`.
- API routes add `mockMode: true`.
- The UI shows: `Demo fallback active — Azure OpenAI environment variables are not configured.`

Manual "Use demo result" buttons also use mock data, but they do not show the Azure fallback badge because no API fallback occurred.

## Security Considerations

```mermaid
flowchart TD
    Browser[Browser] --> API[Next.js API route]
    API --> Env[Server-side environment variables]
    Env --> AzureKey[Azure OpenAI API key]
    API --> Sanitizer[Error sanitizer]
    Sanitizer --> BrowserError[Redacted browser error]
```

Security practices in the app:

- Azure OpenAI API key is only read server-side.
- The API key is never sent to the browser.
- API failure messages are sanitized before returning to the client.
- User input is validated before calling the generation layer.
- AI output is validated before rendering.
- Results are displayed as structured React content rather than injected HTML.
- Mermaid rendering includes fallback error handling.
- `.env.local` should not be committed.

Security guidance produced by the app is advisory. Actual Power Platform security must be validated against the tenant's:

- Dataverse roles
- business units and teams
- row and column security
- DLP policies
- connector policies
- environment maker permissions
- privileged connector usage

## Responsible AI Considerations

The app is explicitly positioned as an architecture accelerator, not an approval engine.

Responsible AI controls:

- System prompts instruct the model not to guarantee production readiness.
- Prompts require assumptions, risks, and human validation notes.
- Licensing prompts prohibit exact invented prices.
- Readiness scores are framed as review signals, not certification.
- The UI includes a Responsible AI notice below the dashboard.
- Mock mode is labeled when Azure OpenAI is not configured.
- Zod validation prevents malformed model output from being treated as valid.

Human review is required for:

- security model
- licensing
- data retention and compliance
- ALM and rollback strategy
- integration reliability
- production support ownership
- tenant-specific governance policies

## Known Limitations

- The app does not deploy Power Platform components.
- The app does not connect to Dataverse metadata APIs.
- The app does not inspect a tenant's real DLP policies, environments, or connector inventory.
- The app does not validate licensing entitlements.
- The app does not authenticate users or persist design history.
- The app does not guarantee model output accuracy.
- Mermaid diagrams may need manual cleanup for complex systems.
- Review quality depends on the completeness of the design text provided by the user.
- PDF export is intentionally out of scope for the current demo.
- The mock fallback is static and intended for demo continuity only.

## Deployment View

```mermaid
flowchart LR
    Dev[Local developer machine] --> Next[Next.js app]
    Next --> ApiRoutes[Server API routes]
    ApiRoutes --> AzureOpenAI[Azure OpenAI deployment]
    Next --> Browser[User browser]
    Browser --> Downloads[Markdown, JSON, Mermaid downloads]
```

For local development:

```bash
npm install
cp .env.example .env.local
npm run dev
```

For validation:

```bash
npm run lint
npm run typecheck
npm test
npm run build
```
