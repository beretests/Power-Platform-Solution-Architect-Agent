# Security Guidance

## Purpose

Use least privilege for Power Platform security. Review security before production.

Retrieval terms: Dataverse security role, least privilege, business unit, owner team, access team, column security, DLP policy, service account, service principal.

## Security Roles

Define roles by persona:

- Request submitter.
- Team contributor.
- Manager or approver.
- Operations owner.
- Compliance reviewer.
- System administrator.

Avoid assigning permissions directly around individual people without a role model.

## Least Privilege

For each role, define:

- Create permissions.
- Read permissions.
- Update permissions.
- Delete permissions.
- Scope of access.
- Sensitive field access.

Default posture:

- Grant read only when needed.
- Grant update only for owned or assigned work.
- Restrict delete unless clearly justified.
- Use auditing instead of broad delete access.

## Dataverse Access Review

Review:

- Business units.
- Owner teams.
- Access teams.
- Table permissions.
- Column security.
- Row visibility.
- Audit requirements.

## Flow and Connector Ownership

Production flows should not rely only on a maker account.

Review:

- Flow owner.
- Connection owner.
- Service account or service principal use.
- Privileged connectors.
- DLP policy impact.
- Run-only user permissions.

## Security Anti-Patterns

- All users have edit access.
- No role model.
- Broad delete access.
- Sensitive data without field security review.
- Maker-owned production flows.
- Privileged connectors without governance review.
- External access without identity and licensing review.

## Recommended Mitigations

- Define persona-based Dataverse security roles.
- Restrict delete privileges unless business-approved.
- Use owner teams or business units when row visibility differs.
- Use column security for sensitive fields.
- Review DLP policies and privileged connectors.
- Use service account or service principal ownership for critical production flows where appropriate.

## Production Security Questions

- Who can create each record?
- Who can read sensitive data?
- Who can update status?
- Who can delete records?
- Which DLP policies apply?
- Who owns support access?
- What audit evidence is required?

## Examples

### Employee Onboarding

HR can create and update onboarding requests. Managers can read and approve their own team requests. IT can update assigned provisioning tasks. Employees should only read or submit their own records.

### Asset Tracking

Asset managers can create and update assets. Field technicians can update assigned maintenance records. Auditors can read asset history but should not delete records.
