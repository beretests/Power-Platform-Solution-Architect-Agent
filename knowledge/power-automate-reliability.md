# Power Automate Reliability

## Purpose

Production flows need durable ownership, clear triggers, error handling, retry policy, and monitoring.

Retrieval terms: Power Automate, cloud flow, trigger, retry policy, error handling, connection reference, service account, service principal, monitoring.

## Trigger Design

Use clear triggers:

- Dataverse row created.
- Dataverse row modified.
- Scheduled recurrence.
- Manual support operation.
- Approval or queue event.

Avoid broad triggers that run on unrelated updates.

## Flow Steps

Document each flow with:

- Name.
- Trigger.
- Numbered steps.
- Connectors.
- Error handling.
- Retry policy.
- Owner recommendation.
- Monitoring approach.

## Retry and Error Handling

Use scopes for:

- Main processing.
- Error handling.
- Cleanup.
- Notification.

On failure:

- Log the record and error.
- Notify a support owner.
- Preserve troubleshooting context.
- Avoid silent failure.

Use bounded retries for transient connector failures. Do not retry indefinitely.

## Durable Ownership

Production flows should use durable ownership:

- Approved service account.
- Service principal where supported.
- Shared mailbox for operational email.
- Documented support owner.
- Connection references in solutions.

Avoid maker-only ownership for critical production flows.

## Idempotency

Prevent duplicate side effects:

- Check status before action.
- Look up existing records before create.
- Use alternate keys.
- Store correlation IDs.
- Guard against repeated runs.

## Connector Review

Review each connector for:

- Premium licensing.
- DLP compatibility.
- Privileged access.
- External data movement.
- Throttling and service limits.
- Authentication ownership.

## Reliability Anti-Patterns

- No error handling.
- No retry policy.
- No monitoring.
- Maker-owned production connections.
- Hardcoded environment values.
- No connection references.
- Duplicate records on retry.
- Business process depends on personal mailbox access.

## Recommended Mitigations

- Trigger flows from specific Dataverse events or scheduled jobs.
- Add scopes for main work, error handling, and notification.
- Use bounded retries for transient connector failures.
- Log failures to Dataverse or an operational support table.
- Use connection references for every connector.
- Use durable flow ownership through an approved service account or service principal where appropriate.
- Store configurable values in environment variables.

## Examples

### Employee Onboarding

Trigger when an onboarding request status changes to Approved. Create department tasks, notify IT, log failures, and escalate if task creation fails.

### Asset Tracking

Trigger when an asset assignment changes. Update custody history, notify the new owner, and prevent duplicate assignment records on retry.
