# Dataverse Design Rules

## Purpose

Use Dataverse for relational, auditable, secure, and process-heavy business data.

Retrieval terms: Dataverse, table, column, lookup, relationship, ownership, auditing, alternate key, security role.

## Table Design

Each table should have:

- A clear business purpose.
- Singular business name.
- Correct ownership type.
- Required columns for core business rules.
- Choice columns for controlled statuses.
- Lookup columns for related records.
- Alternate keys when uniqueness or integration identity matters.
- Auditing recommendation.

## Relationships

Use relationships when records belong together:

- One request has many tasks.
- One case has many activities.
- One inspection has many findings.
- One asset has many maintenance records.

Use lookups instead of duplicating related data as text.

## Ownership Model

Use **user or team ownership** when:

- Records are assigned to people or teams.
- Access differs by owner, department, or business unit.
- Least privilege varies by persona.

Use **organization ownership** only when row-level ownership does not matter.

## Auditing

Enable auditing when the solution tracks:

- Approvals.
- Status changes.
- Ownership changes.
- Sensitive data updates.
- Compliance evidence.

Define audit retention and review expectations before production.

## SharePoint List Warning

SharePoint lists are weak for:

- Complex relationships.
- Row-level security.
- Auditable approvals.
- Sensitive operational data.
- Multi-table reporting.
- Production ALM.

Prefer Dataverse for governed business applications.

## Data Model Anti-Patterns

- One giant table for unrelated concepts.
- Text fields that should be lookups.
- No status model.
- No owner or responsible team.
- No audit strategy.
- No keys for imported data.
- Sensitive data without security review.

## Recommended Mitigations

- Split separate business concepts into separate Dataverse tables.
- Replace duplicated text with lookup relationships.
- Add status choice columns for process state.
- Choose user or team ownership when access differs by record.
- Enable auditing for approvals, ownership changes, and sensitive status changes.
- Define alternate keys for imported or integrated records.

## Examples

### Employee Onboarding

Use tables such as Onboarding Request, Onboarding Task, Employee Profile, Equipment Request, and Approval. Relate one onboarding request to many tasks.

### Asset Tracking

Use tables such as Asset, Asset Assignment, Location, Maintenance Record, and Asset Category. Relate one asset to many maintenance records and assignments.
