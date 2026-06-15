# Power Platform Patterns

## Purpose

Use this guidance to choose the right Power Platform experience for a business requirement.

Retrieval terms: Power Platform, Dataverse, model-driven app, canvas app, Power Pages, Copilot Studio, Power Automate, ALM.

## Model-Driven App

Choose a model-driven app when:

- The solution is data-centric and process-heavy.
- Dataverse is the system of record.
- Users need views, forms, dashboards, queues, or business process flow style work.
- Security roles, auditing, ownership, and relationships matter.
- The pattern is case management, onboarding, asset management, inspection, training, or approval tracking.

## Canvas App

Choose a canvas app when:

- The user experience must be highly tailored.
- The app is task-based, mobile-first, or frontline-worker focused.
- Users need guided screens over a small set of actions.
- The app still writes to Dataverse when data is relational, sensitive, or auditable.

Avoid using canvas apps to bypass proper Dataverse security or ALM.

## Power Pages

Choose Power Pages when:

- External users need access.
- Anonymous or authenticated portal access is required.
- Dataverse data must be exposed through governed web pages.

Do not choose Power Pages for internal-only users unless there is a clear portal requirement.

## Copilot Studio

Choose Copilot Studio when:

- Users need conversational guidance or self-service.
- The solution answers questions, routes requests, or collects structured inputs through chat.
- The copilot can safely use approved knowledge sources and actions.

Do not use Copilot Studio as a substitute for a transactional app when users need rich record management.

## Common Anti-Patterns

- Production app in the default environment.
- SharePoint list used for complex relational data.
- All users have edit access.
- Maker-owned production flows.
- No managed solution strategy.
- No test environment.
- No rollback plan.
- No human validation before production.

## Recommended Mitigations

- Use Dataverse for governed relational business data.
- Use model-driven apps for process-heavy internal operations.
- Use canvas apps only when a tailored task interface is required.
- Use Power Pages only for external access scenarios.
- Use Copilot Studio only for conversational assistance with governed data and actions.
- Require human solution architect review before production.

## Examples

### Employee Onboarding

Use a model-driven app over Dataverse for HR, IT, manager, and Facilities tasks. Add a canvas app only if frontline users need a simplified mobile task screen.

### Asset Tracking

Use Dataverse for assets, assignments, locations, maintenance, and audit history. Use a model-driven app for operations teams and a canvas app for barcode scanning or field updates.
