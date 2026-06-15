# Judging Checklist

Use this checklist to map **Power Platform Architect Agent** to Microsoft Agents League hackathon judging categories.

## Accuracy and Relevance

Features that support this category:

- Uses Power Platform-specific architecture prompts for both generation and review.
- Grounds generation and review with Foundry IQ retrieval from a curated Power Platform knowledge base.
- Uses local knowledge fallback when Foundry IQ is disabled or unavailable.
- Produces relevant Power Platform outputs:
  - recommended app type
  - Dataverse schema
  - Power Automate flows
  - security roles
  - ALM plan
  - licensing notes
  - risks
  - readiness score
  - Mermaid architecture diagram
  - implementation checklist
  - follow-up discovery questions
  - grounding mode and grounding sources
- Prefers Dataverse for relational, auditable, role-secured business data.
- Recommends model-driven apps for process-heavy data-centric scenarios.
- Recommends canvas apps for tailored task experiences.
- Recommends Power Pages only when external users need access.
- Uses accurate terminology such as Dataverse, managed solutions, connection references, environment variables, Power Automate, and ALM.
- Validates AI responses with Zod schemas before rendering results.
- Uses structured JSON schema output for predictable result shape.
- Shows source transparency through the Grounding tab and Markdown export.

Demo evidence:

- [ ] Generate an employee onboarding blueprint.
- [ ] Show Dataverse, Flows, Security, ALM, Risks, and Architecture tabs.
- [ ] Show the Grounding tab and explain Foundry IQ or local fallback sources.
- [ ] Show exported Markdown or JSON containing the same structured sections.

## Reasoning and Multi-Step Thinking

Features that support this category:

- Converts a single requirement into multiple coordinated architecture layers.
- Chains solution reasoning across:
  - business process
  - data model
  - automation
  - security
  - ALM
  - licensing uncertainty
  - risks
  - readiness scoring
- Review Board mode evaluates an existing design across multiple dimensions:
  - data model quality
  - Dataverse suitability
  - security model
  - environment strategy
  - ALM strategy
  - Power Automate reliability
  - connection ownership
  - scalability
  - maintainability
  - production readiness
- Priority fixes are ordered and action-oriented.
- Follow-up discovery questions identify missing information needed before implementation.
- Readiness score includes category scores for accuracy, security, ALM, scalability, and usability.
- If retrieved grounding does not contain enough information, the prompts require assumptions or follow-up questions instead of invented recommendations.

Demo evidence:

- [ ] Paste the weak onboarding design into Solution Review Board mode.
- [ ] Show high-severity findings and top priority fixes.
- [ ] Explain how the review moves from design gap to mitigation and expected impact.

## Creativity and Originality

Features that support this category:

- Combines architecture generation and solution review in one workflow.
- Uses AI to produce a complete Power Platform architecture packet from natural language.
- Adds a Solution Review Board persona to critique weak designs, not just generate new ones.
- Converts AI output into an interactive multi-tab dashboard rather than static text.
- Generates Mermaid architecture diagrams from the same structured result.
- Provides export-ready Markdown, JSON, and Mermaid source for team handoff.
- Adds grounding evidence so teams can see whether guidance came from Foundry IQ, local knowledge, mock data, or no grounding.
- Adds production-readiness scoring to make architectural maturity visible.
- Uses mock fallback mode so the demo remains usable even without Azure OpenAI configuration.

Demo evidence:

- [ ] Switch between Generate Architecture and Solution Review Board modes.
- [ ] Show Mermaid diagram rendering and Copy Mermaid.
- [ ] Show Copy Markdown / Download JSON export flow.

## User Experience and Presentation

Features that support this category:

- Polished enterprise-ready landing page for a hackathon demo.
- Clear two-mode selector:
  - Generate Architecture
  - Solution Review Board
- Mode-specific textarea labels, placeholders, examples, and submit buttons.
- Professional dashboard with clear tab hierarchy.
- Review tab appears only when review findings or priority fixes exist.
- Grounding tab explains the source of guidance and shows source cards.
- Readiness summary shows a small grounding badge.
- Security tab renders privileges in a readable allowed/restricted matrix.
- High severity risks and review findings are visually prominent.
- Loading state explains what the app is checking.
- Friendly error state avoids crashes and guides retry/demo fallback.
- Empty state explains how to get started.
- Demo Mode badge explains when mock fallback is active.
- Grounding badge explains when Foundry IQ or local fallback grounding is active.
- Responsible AI notice is visible below the dashboard.
- Mobile-responsive layout with horizontal tab scrolling.

Demo evidence:

- [ ] Show the first viewport on desktop.
- [ ] Resize or use mobile viewport to show responsive behavior.
- [ ] Trigger demo fallback and show the Demo Mode badge.
- [ ] Show a Foundry IQ or local fallback grounding badge.
- [ ] Show loading and error behavior if possible.

## Reliability and Safety

Features that support this category:

- Input validation blocks empty or too-short requirements.
- Server API routes never expose the Azure OpenAI API key.
- Foundry IQ and Azure AI Search credentials are only used server-side.
- API error messages sanitize possible API key values.
- Missing Azure OpenAI env vars fall back to known-good mock results.
- Foundry IQ retrieval failures fall back to local markdown knowledge with a warning source.
- Foundry IQ request payloads avoid unsupported retrieve parameters and are covered by tests.
- Mock results are parsed through schemas before use.
- AI outputs are parsed as JSON and validated before rendering.
- Review and architecture results have separate schemas.
- The app uses type-safe child schemas for tables, flows, roles, ALM, risks, readiness score, findings, and priority fixes.
- Responsible AI prompt instructions prevent claims of guaranteed production readiness.
- Prompts instruct the model not to invent exact licensing prices.
- UI explicitly states that human validation is required before production use.
- Tests cover schemas, validation helpers, mock result validity, Markdown export, Foundry IQ request payloads, and grounding response parsing.
- Lint, typecheck, test, and production build commands are documented.

Demo evidence:

- [ ] Show `npm test` passing.
- [ ] Show `npm run typecheck` and `npm run lint` passing.
- [ ] Explain schema validation and mock fallback behavior.
- [ ] Explain Foundry IQ grounding and local fallback behavior.

## Community Value

Features that support this category:

- Helps makers and analysts produce better initial solution designs.
- Helps solution architects save time on first-pass documentation.
- Helps Center of Excellence teams standardize review criteria.
- Encourages least-privilege security and ALM discipline.
- Provides exportable artifacts that teams can share in pull requests, design reviews, or project documentation.
- Provides curated markdown knowledge files that can seed a Foundry IQ knowledge base.
- Includes follow-up discovery questions to improve collaboration between business and technical stakeholders.
- Includes transparent limitations and Responsible AI guidance.
- README and architecture docs make the project easier for others to understand, run, and extend.
- Future roadmap identifies practical paths for tenant-aware governance and Power Platform CLI integration.

Demo evidence:

- [ ] Show README setup instructions.
- [ ] Show architecture documentation.
- [ ] Explain how another team could adapt prompts, schemas, review categories, or knowledge base files.

## Submission Readiness Checklist

- [ ] README is complete.
- [ ] Architecture doc is complete.
- [ ] Judging checklist is complete.
- [ ] App runs locally with `npm run dev`.
- [ ] `npm run lint` passes.
- [ ] `npm run typecheck` passes.
- [ ] `npm test` passes.
- [ ] `npm run build` passes.
- [ ] Azure OpenAI environment variables are documented.
- [ ] Foundry IQ / Azure AI Search environment variables are documented.
- [ ] Demo fallback works when Azure OpenAI is not configured.
- [ ] Local grounding fallback works when Foundry IQ is not configured.
- [ ] Grounding tab and Markdown export show sources.
- [ ] Generate Architecture mode works.
- [ ] Solution Review Board mode works.
- [ ] Export panel works.
- [ ] Responsible AI notice is visible.
- [ ] Demo screenshots are added.
- [ ] Demo video link is added.
