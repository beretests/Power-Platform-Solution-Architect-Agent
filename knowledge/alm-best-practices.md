# ALM Best Practices

## Purpose

Use governed environments, solutions, and configuration management for production Power Platform apps.

Retrieval terms: Power Platform ALM, environment, solution, managed solution, unmanaged solution, connection reference, environment variable, deployment, rollback.

## Environment Strategy

Use separate environments:

- **Development**: makers build and configure.
- **Test/UAT**: business users validate.
- **Production**: live business operations.

Avoid production workloads in the default environment.

## Default Environment Risks

The default environment is risky because:

- Access is often broad.
- Maker experimentation can mix with production assets.
- Governance boundaries are unclear.
- DLP policies may not match the solution risk.
- Deployment and rollback are harder to manage.

## Unmanaged vs Managed Solutions

Use **unmanaged solutions** in development.

Use **managed solutions** in test and production when possible.

Managed solutions help:

- Reduce direct production changes.
- Control solution layers.
- Support repeatable deployment.
- Improve upgrade and rollback discipline.

Do not manually recreate apps or flows in production.

## Connection References

Use connection references for connectors used by apps and flows.

Connection references support:

- Environment-specific connections.
- Deployment across environments.
- Production ownership review.
- Reduced maker-owned dependency risk.

## Environment Variables

Use environment variables for:

- URLs.
- Mailboxes.
- Queue names.
- Team identifiers.
- Thresholds.
- Feature flags.
- Integration endpoints.

Do not hardcode environment-specific values.

## Deployment and Rollback

Production deployment should include:

- Managed solution import.
- Environment variable values.
- Connection reference configuration.
- Flow enablement plan.
- Smoke tests.
- Support owner.
- Rollback plan.

Rollback planning should identify previous solution version, flow disable steps, data limitations, and forward-fix criteria.

## ALM Anti-Patterns

- No test/UAT environment.
- Default environment production app.
- Manual production recreation.
- Direct production edits.
- No managed solution strategy.
- No connection references.
- No environment variables.
- No rollback plan.

## Recommended Mitigations

- Create dedicated development, test/UAT, and production environments.
- Package apps, Dataverse tables, flows, security roles, connection references, and environment variables in a solution.
- Use unmanaged solutions in development and managed solutions in production.
- Configure environment-specific values through environment variables.
- Configure connector ownership through connection references.
- Document deployment steps and rollback plan before release.

## Examples

### Employee Onboarding

Store HR mailbox, IT queue, escalation threshold, and environment URLs as environment variables. Deploy the app, Dataverse tables, flows, and roles as a managed solution to production.

### Asset Tracking

Use separate environments for building, UAT scanning tests, and production inventory. Use connection references for Dataverse, barcode, email, and notification connectors.
