# Project context

This project is a Microsoft Agents League Creative Apps hackathon submission.

The app is called Power Platform Solution Architect Agent.

It converts plain-language business requirements into implementation-ready Microsoft Power Platform solution blueprints.

The target users are:
- Business analysts
- Power Platform makers
- Solution architects
- Governance reviewers
- IT teams reviewing Power Platform designs

# Core app features

The app must generate:
- Executive summary
- Recommended Power Platform app type
- Dataverse table design
- Power Automate flow design
- Security role model
- Environment and ALM strategy
- Licensing and operational risk notes
- Architecture diagram using Mermaid
- Implementation checklist
- Follow-up questions
- Exportable Markdown and JSON blueprint

The app must also include a Solution Review Board mode that reviews weak or incomplete designs and scores them for production readiness.

# Technology standards

Use:
- Next.js App Router
- TypeScript
- Tailwind CSS
- Zod for runtime validation
- Accessible React components
- Clear loading states
- Clear error states
- Mermaid for diagrams
- Azure OpenAI-compatible API integration later

# Power Platform terminology

Use accurate Microsoft terminology:
- Dataverse
- Model-driven app
- Canvas app
- Power Pages
- Copilot Studio
- Power Automate
- Environments
- Solutions
- Managed solutions
- Unmanaged solutions
- Connection references
- Environment variables
- Security roles
- Business units
- Power Platform pipelines
- ALM
- Solution layers
- Service principals
- Audit history

# UX standards

The app should look polished, enterprise-ready, and demo-friendly.

Use:
- Cards
- Tabs
- Badges
- Progress/readiness score
- Clean spacing
- Responsive layout
- Accessible color contrast
- Professional Microsoft-style language

# Safety and reliability

Do not present generated architecture as guaranteed production-ready.
Always include assumptions, risks, and validation notes.
Flag licensing uncertainty.
Flag security risks.
Flag ALM risks.
Prefer conservative recommendations.
Do not hardcode secrets.
Validate AI output before rendering.