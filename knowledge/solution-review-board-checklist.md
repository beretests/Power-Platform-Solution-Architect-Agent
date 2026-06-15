# Solution Review Board Checklist

## Purpose

Use this checklist to review a Power Platform design before production.

Retrieval terms: Solution Review Board, production readiness, Dataverse, model-driven app, canvas app, Power Pages, Copilot Studio, Power Automate, ALM, managed solution, security role.

## Required Review Output

A review should produce:

- Findings by severity.
- Top 5 priority fixes.
- Readiness score.
- Risks and mitigations.
- Follow-up questions.
- Human validation notes.

## Data Model Review

Check:

- Dataverse suitability.
- Table purpose.
- Relationships.
- Ownership model.
- Status model.
- Keys.
- Auditing.
- Sensitive data.

Red flags:

- Complex process data in SharePoint or Excel.
- No relationships.
- No audit strategy.
- No owner or responsible team.

## App Pattern Review

Check:

- Model-driven app for data-centric process apps.
- Canvas app for tailored task experiences.
- Power Pages for external access.
- Copilot Studio for conversational assistance.

Red flags:

- Canvas app chosen only from familiarity.
- Power Pages used for internal-only scenarios.
- Copilot used where transactional record management is required.

## Security Review

Check:

- Personas.
- Security roles.
- Least privilege.
- Table privilege matrix.
- Delete restrictions.
- Sensitive fields.
- DLP policies.
- Flow and connection ownership.

Red flags:

- Everyone can edit everything.
- No security roles.
- Maker-owned critical flows.
- Privileged connectors without review.

## ALM Review

Check:

- Development, test/UAT, and production environments.
- Managed solutions for production.
- Connection references.
- Environment variables.
- Deployment steps.
- Rollback plan.
- Default environment avoidance.

Red flags:

- Default environment production app.
- No test environment.
- Manual production recreation.
- No rollback plan.

## Power Automate Review

Check:

- Trigger specificity.
- Numbered steps.
- Connectors.
- Error handling.
- Retry policy.
- Monitoring.
- Durable owner.
- Connection references.

Red flags:

- No error handling.
- No retries.
- No failure notification.
- Maker-only ownership.

## Production Readiness Score

Suggested interpretation:

- **0-59**: Not production ready.
- **60-74**: Needs significant review.
- **75-84**: Promising with gaps.
- **85-100**: Demo ready or near implementation planning.

Never claim production readiness is guaranteed.

## Common Anti-Patterns

- Default environment production app.
- SharePoint list for relational auditable data.
- All users have edit access.
- Maker-owned production flows.
- No managed solution strategy.
- No connection references.
- No environment variables.
- No test/UAT.
- No rollback plan.
- No audit strategy.
- No licensing review.

## Recommended Mitigations

- Move production workloads out of the default environment.
- Replace weak relational SharePoint or Excel designs with Dataverse.
- Add least-privilege Dataverse security roles.
- Use managed solutions for production deployment.
- Add connection references and environment variables.
- Define Power Automate retry, error handling, monitoring, and durable ownership.
- Document rollback and support ownership.
- Require human validation for security, licensing, ALM, and compliance.

## Examples

### Employee Onboarding Review

Flag high risk if onboarding uses the default environment, SharePoint lists, all-user edit access, maker-owned flows, no UAT, no managed solution, or no audit strategy.

### Asset Tracking Review

Flag risk if asset records lack ownership, maintenance history, assignment audit, role-based access, managed solution deployment, or durable connector ownership.
