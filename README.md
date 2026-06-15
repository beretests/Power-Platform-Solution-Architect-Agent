# Power Platform Architect Agent

**One-sentence pitch:** An AI-assisted web app that turns Power Platform requirements or existing designs into structured architecture blueprints, review findings, readiness scores, and exportable implementation guidance.

## Problem Statement

Power Platform makers, business analysts, and solution architects often start with incomplete requirements and must manually translate them into data models, app recommendations, Power Automate flows, security roles, ALM plans, risks, and implementation checklists. That process is time-consuming, inconsistent, and easy to under-scope, especially around security, environment strategy, flow ownership, licensing, and production readiness.

Power Platform Architect Agent accelerates that early architecture work while making the remaining human validation work explicit.

## Target Users

- Power Platform solution architects preparing initial solution designs
- Makers and business analysts who need structured architecture guidance
- Center of Excellence teams reviewing design quality and governance gaps
- Delivery teams preparing implementation handoff documents
- Hackathon judges or stakeholders evaluating solution feasibility

## Key Features

- **Generate Architecture mode**: Converts a business requirement into a Power Platform solution blueprint.
- **Solution Review Board mode**: Reviews an existing design and returns findings, top priority fixes, and readiness scoring.
- **Structured output**: Uses Zod schemas and Azure OpenAI structured JSON output for predictable rendering.
- **Dataverse schema guidance**: Tables, columns, relationships, keys, and auditing recommendations.
- **Power Automate design**: Triggers, numbered steps, connectors, error handling, retry policy, and ownership guidance.
- **Security model matrix**: Persona-based roles with allowed and restricted table privileges.
- **ALM checklist**: Environments, managed solution strategy, connection references, environment variables, deployment steps, and rollback plan.
- **Risk and readiness views**: Severity-grouped risks, mitigations, and category scores.
- **Mermaid architecture diagram**: Rendered in-app with source copy support.
- **Export panel**: Copy or download Markdown, JSON, and Mermaid source.
- **Demo fallback**: Uses mock results when Azure OpenAI environment variables are not configured, with a visible Demo Mode notice.
- **Responsible AI notice**: Reminds users to validate AI-generated architecture before production use.

## Demo Screenshots

> Placeholder: Add final screenshots before submission.

- `docs/screenshots/01-generate-architecture.png`
- `docs/screenshots/02-review-board.png`
- `docs/screenshots/03-dashboard-tabs.png`
- `docs/screenshots/04-export-panel.png`

## Demo Video

> Placeholder: Add the final demo video link before submission.

- Demo video: `https://<your-demo-video-link>`

## Architecture Diagram

```mermaid
flowchart TD
    User[Maker, Analyst, or Architect] --> UI[Next.js App UI]
    UI --> Mode{Selected mode}
    Mode --> Generate[/POST /api/architect/]
    Mode --> Review[/POST /api/review/]

    Generate --> Validator[Input Validation]
    Review --> Validator
    Validator --> Service[Azure OpenAI Service Wrapper]

    Service --> EnvCheck{Azure OpenAI env configured?}
    EnvCheck -->|Yes| Azure[Azure OpenAI / Microsoft Foundry Deployment]
    EnvCheck -->|No| Mock[Mock Demo Result]

    Azure --> Structured[JSON Schema Structured Output]
    Structured --> Zod[Zod Schema Validation]
    Mock --> Zod

    Zod --> Dashboard[Result Dashboard]
    Dashboard --> Tabs[Overview, Dataverse, Flows, Security, ALM, Risks, Review, Export]
    Dashboard --> Export[Markdown, JSON, Mermaid Export]
```

## Tech Stack

- **Framework**: Next.js 16 App Router
- **Runtime UI**: React 19
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **Validation**: Zod
- **Structured output schema**: `zod-to-json-schema`
- **AI integration**: Azure OpenAI-compatible chat completions endpoint
- **Diagrams**: Mermaid
- **Icons**: Lucide React
- **Testing**: Vitest
- **Linting**: ESLint with Next.js config

## How GitHub Copilot Was Used

GitHub Copilot/Codex was used as an engineering pair throughout development to:

- scaffold the Next.js application
- generate TypeScript and Zod schemas
- create accessible React components
- build the mock dashboard
- implement Azure OpenAI API routes
- generate validation helpers
- create tests
- improve documentation
- debug TypeScript and build issues

All generated code was reviewed, validated, and adjusted to fit the project structure and Power Platform domain requirements.

## How Azure OpenAI / Microsoft Foundry Is Used

The app uses Azure OpenAI through `lib/azureOpenAI.ts`:

- `generateArchitecture(requirement)` sends business requirements to Azure OpenAI.
- `generateReview(designText)` sends existing design text to the Solution Review Board prompt.
- Both flows use system prompts from `lib/prompts.ts`.
- Both flows request JSON schema structured output.
- Responses are parsed as JSON and validated with Zod schemas before rendering.
- If Azure OpenAI environment variables are missing, the app falls back to mock demo data.

The expected Azure OpenAI endpoint is:

```txt
${AZURE_OPENAI_BASE_URL}/chat/completions
```

The request includes:

- `api-key` header
- configured deployment name as `model`
- system and user messages
- `response_format.type = "json_schema"`
- strict schema matching for architecture or review output

## Setup Instructions

1. Install dependencies:

```bash
npm install
```

2. Copy the environment template:

```bash
cp .env.example .env.local
```

3. Configure Azure OpenAI values in `.env.local` if available.

4. Start the development server:

```bash
npm run dev
```

5. Open the app:

```txt
http://localhost:3000
```

If Azure OpenAI is not configured, the app still runs with mock demo data.

## Environment Variables

Create `.env.local` with:

```bash
AZURE_OPENAI_BASE_URL=https://<your-resource-name>.openai.azure.com/openai/v1
AZURE_OPENAI_API_KEY=<your-api-key>
AZURE_OPENAI_DEPLOYMENT=<your-model-deployment-name>
```

Notes:

- Do not commit `.env.local`.
- The API key is used only in server-side route handlers.
- API errors are sanitized so the Azure API key is not returned to the browser.
- When any required variable is missing, the app returns a mock result and marks the response with `mockMode: true`.

## Local Development Commands

```bash
npm run dev
```

Run the production build:

```bash
npm run build
```

Start a built production app:

```bash
npm start
```

Run lint:

```bash
npm run lint
```

Run TypeScript checks:

```bash
npm run typecheck
```

## Testing Commands

Run the test suite:

```bash
npm test
```

Run tests in watch mode:

```bash
npm run test:watch
```

Current test coverage focuses on:

- Zod schema validation
- Mock result validation
- Markdown export content
- Requirement input validation
- Safe architecture result parsing

## Responsible AI and Safety Notes

- AI-generated architecture is a starting point, not a production approval.
- Security roles, table privileges, DLP policies, and environment access must be reviewed by qualified owners.
- Licensing notes should be validated against the organization's current Microsoft licensing agreement.
- Dataverse schema recommendations should be reviewed for data retention, privacy, compliance, and audit requirements.
- ALM recommendations should be aligned with the organization's release management standards.
- The app does not guarantee production readiness.
- The app avoids exact licensing prices and instead flags licensing uncertainty.
- Mock/demo output is clearly labeled when Azure OpenAI is not configured.

## Known Limitations

- The app does not deploy Power Platform components.
- The app does not connect directly to Dataverse, Power Platform Admin Center, or Power Platform CLI.
- The app does not verify tenant-specific licensing, DLP policies, connector availability, or environment configuration.
- Generated Mermaid diagrams may need manual refinement for complex solutions.
- Structured AI output depends on model quality and prompt adherence.
- Review mode evaluates text provided by the user; missing design details may produce assumptions rather than definitive findings.
- Authentication and persistent design history are not implemented.
- PDF export is intentionally deferred.

## Future Roadmap

- Add authentication and user-specific design history.
- Add Power Platform CLI export/import support.
- Add tenant-aware governance checks for environments, DLP, connectors, and solution layers.
- Add integration with Dataverse metadata APIs for existing environment review.
- Add comparison mode for multiple architecture options.
- Add richer report export formats, including PDF.
- Add accessibility and visual regression tests.
- Add organization-specific policy profiles for regulated industries.
- Add human approval workflow for architecture review signoff.

## Submission Checklist

- [ ] App runs locally with `npm run dev`
- [ ] `npm run lint` passes
- [ ] `npm run typecheck` passes
- [ ] `npm test` passes
- [ ] `npm run build` passes
- [ ] `.env.local` is not committed
- [ ] Demo Mode badge appears when Azure OpenAI env vars are missing
- [ ] Generate Architecture mode works
- [ ] Solution Review Board mode works
- [ ] Export buttons work for Markdown, JSON, and Mermaid source
- [ ] Mermaid diagram renders or shows fallback error
- [ ] Responsible AI notice is visible below the dashboard
- [ ] Demo screenshots are added
- [ ] Demo video link is added
- [ ] Judging checklist has been reviewed

## Project Structure

```txt
app/
  api/
    architect/route.ts   # Generate architecture API
    review/route.ts      # Solution review API
  page.tsx               # Main interactive experience
components/
  RequirementForm.tsx
  ResultDashboard.tsx
  ReviewFindingsView.tsx
  PriorityFixesView.tsx
  ...
lib/
  azureOpenAI.ts         # Azure OpenAI service wrapper
  schemas.ts             # Zod schemas and TypeScript types
  jsonSchema.ts          # JSON schemas for structured output
  prompts.ts             # System prompts
  validators.ts          # Input and result validation helpers
  exportMarkdown.ts      # Markdown/JSON export helpers
  mockResults.ts         # Demo fallback data
tests/
  *.test.ts
docs/
  architecture.md
  judging-checklist.md
```
