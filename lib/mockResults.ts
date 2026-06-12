/**
 * Mock data for demonstration and testing
 * This will be replaced with actual AI-generated results from Azure OpenAI
 */

export interface DataverseColumn {
  name: string;
  displayName: string;
  type: string;
  required: boolean;
  description: string;
}

export interface DataverseRelationship {
  target: string;
  relationship: string;
}

export interface DataverseTable {
  name: string;
  displayName: string;
  description: string;
  columns: DataverseColumn[];
  relationships: DataverseRelationship[];
}

export interface FlowAction {
  name: string;
  description: string;
  condition?: string;
}

export interface PowerAutomateFlow {
  name: string;
  displayName: string;
  trigger: string;
  triggerDescription: string;
  actions: FlowAction[];
  errorHandling: string;
}

export interface TablePermission {
  table: string;
  create: boolean;
  read: boolean;
  update: boolean;
  delete: boolean;
}

export interface SecurityRole {
  name: string;
  displayName: string;
  description: string;
  responsibilities: string[];
  tablePermissions: TablePermission[];
}

export interface ALMStage {
  name: string;
  description: string;
  purpose: string;
  userBase: string;
  deploymentFrequency: string;
}

export interface Risk {
  id: string;
  category: string;
  description: string;
  severity: "low" | "medium" | "high";
  businessImpact: string;
  mitigation: string;
}

export interface ChecklistItem {
  phase: string;
  task: string;
  owner: string;
  estimatedHours: number;
  dependencies: string[];
}

export interface FollowUpQuestion {
  question: string;
  rationale: string;
  suggestedAnswer?: string;
}

export interface Blueprint {
  id: string;
  createdAt: string;
  mode: "architect" | "reviewer";
  requirement: string;
  executiveSummary: string;
  detectedPattern: string;
  recommendedAppType: "model-driven" | "canvas" | "hybrid" | "pages";
  assumptions: string[];
  dataverseTables: DataverseTable[];
  powerAutomateFlows: PowerAutomateFlow[];
  securityRoles: SecurityRole[];
  almPlan: ALMStage[];
  licensingNotes: string;
  risks: Risk[];
  readinessScore: number;
  architectureDiagramMermaid: string;
  implementationChecklist: ChecklistItem[];
  followUpQuestions: FollowUpQuestion[];
}

export const mockEmployeeOnboardingBlueprint: Blueprint = {
  id: "bp-emp-onboard-001",
  createdAt: "2026-06-12T14:30:00Z",
  mode: "architect",
  requirement: `We need to streamline our employee onboarding process. 
    Currently, managers submit onboarding requests through email, HR reviews and approves manually, 
    IT provisions equipment (laptop, email, tools) in separate systems, and Facilities handles desk setup. 
    We need to track all onboarding tasks, send reminders for overdue items, maintain audit history, 
    and ensure role-based access control so only appropriate teams can see sensitive information. 
    Our company grows rapidly with 50+ new hires per month across multiple departments.`,

  executiveSummary: `This solution implements a centralized Employee Onboarding Hub using a Model-driven app 
    that orchestrates multi-department workflows. Managers initiate onboarding requests, HR approves them, and automated 
    Power Automate flows dispatch tasks to IT, Facilities, and other departments. Real-time dashboards track completion 
    status, automated reminders prevent delays, and a complete audit trail ensures compliance. Role-based access ensures 
    HR data is protected and each department only sees relevant tasks. This reduces onboarding time from 3 weeks to 5 business days.`,

  detectedPattern:
    "Multi-stakeholder workflow with approval gates, task distribution, compliance tracking, and audit requirements",

  recommendedAppType: "model-driven",

  assumptions: [
    "Microsoft 365 and Power Platform licenses are available (Standard or Premium user licenses for power users)",
    "Email integration available through Microsoft Exchange or Office 365",
    "IT has ability to provision equipment through automated scripts or manual processing",
    "Facilities team can access and manage desk assignment data",
    "Organization has defined security and compliance requirements for employee data",
    "Employee data will remain in Dataverse; no integration needed with separate HR systems initially",
    "Adoption target is 100% of managers and HR staff within 6 months",
  ],

  dataverseTables: [
    {
      name: "msdyn_employee",
      displayName: "Employee Profile",
      description: "Core employee information and onboarding master record",
      columns: [
        {
          name: "msdyn_name",
          displayName: "Full Name",
          type: "Text",
          required: true,
          description: "Employee full legal name",
        },
        {
          name: "msdyn_email",
          displayName: "Corporate Email",
          type: "Text",
          required: true,
          description: "Office 365 email address (auto-generated)",
        },
        {
          name: "msdyn_department",
          displayName: "Department",
          type: "Option Set",
          required: true,
          description:
            "Engineering, Sales, HR, Facilities, Finance, Operations",
        },
        {
          name: "msdyn_manager",
          displayName: "Manager (Lookup)",
          type: "Lookup",
          required: true,
          description: "Direct manager reference",
        },
        {
          name: "msdyn_startdate",
          displayName: "Start Date",
          type: "Date",
          required: true,
          description: "First day of employment",
        },
        {
          name: "msdyn_location",
          displayName: "Office Location",
          type: "Option Set",
          required: true,
          description: "Headquarters, Regional, Remote",
        },
        {
          name: "msdyn_status",
          displayName: "Onboarding Status",
          type: "Option Set",
          required: false,
          description: "Draft, Submitted, Approved, In Progress, Complete",
        },
      ],
      relationships: [
        {
          target: "OnboardingTask",
          relationship: "One Employee has many OnboardingTasks",
        },
        {
          target: "EquipmentRequest",
          relationship: "One Employee has many EquipmentRequests",
        },
      ],
    },
    {
      name: "msdyn_onboardingtask",
      displayName: "Onboarding Task",
      description: "Individual onboarding tasks assigned to departments",
      columns: [
        {
          name: "msdyn_title",
          displayName: "Task Title",
          type: "Text",
          required: true,
          description: "e.g., Provision Email, Setup Desk, Background Check",
        },
        {
          name: "msdyn_employee",
          displayName: "Employee (Lookup)",
          type: "Lookup",
          required: true,
          description: "Reference to employee being onboarded",
        },
        {
          name: "msdyn_department",
          displayName: "Responsible Department",
          type: "Option Set",
          required: true,
          description: "IT, HR, Facilities, Finance",
        },
        {
          name: "msdyn_status",
          displayName: "Task Status",
          type: "Option Set",
          required: false,
          description: "Not Started, In Progress, Completed, Blocked",
        },
        {
          name: "msdyn_duedate",
          displayName: "Due Date",
          type: "Date",
          required: true,
          description: "Task completion target date",
        },
        {
          name: "msdyn_completeddate",
          displayName: "Completed Date",
          type: "Date",
          required: false,
          description: "Actual completion date",
        },
        {
          name: "msdyn_assignedto",
          displayName: "Assigned To (Lookup)",
          type: "Lookup",
          required: true,
          description: "Team member responsible for task",
        },
        {
          name: "msdyn_notes",
          displayName: "Notes",
          type: "Text Area",
          required: false,
          description: "Task-specific notes and blockers",
        },
        {
          name: "msdyn_isoverdue",
          displayName: "Is Overdue",
          type: "Calculated",
          required: false,
          description: "True if today > due date and status != completed",
        },
      ],
      relationships: [
        {
          target: "AuditLog",
          relationship: "One OnboardingTask has many AuditLogs",
        },
      ],
    },
    {
      name: "msdyn_equipmentrequest",
      displayName: "Equipment Request",
      description:
        "IT equipment provisioning requests (laptop, phone, software licenses)",
      columns: [
        {
          name: "msdyn_employee",
          displayName: "Employee (Lookup)",
          type: "Lookup",
          required: true,
          description: "Employee receiving equipment",
        },
        {
          name: "msdyn_equipmenttype",
          displayName: "Equipment Type",
          type: "Option Set",
          required: true,
          description: "Laptop, Desktop, Monitor, Phone, Software License",
        },
        {
          name: "msdyn_model",
          displayName: "Model/Version",
          type: "Text",
          required: true,
          description: "Specific device model or software version",
        },
        {
          name: "msdyn_serialnumber",
          displayName: "Serial Number",
          type: "Text",
          required: false,
          description: "Hardware serial for asset tracking",
        },
        {
          name: "msdyn_requeststatus",
          displayName: "Status",
          type: "Option Set",
          required: false,
          description: "Pending, Ordered, In Transit, Delivered, Installed",
        },
        {
          name: "msdyn_estimateddelivery",
          displayName: "Estimated Delivery",
          type: "Date",
          required: false,
          description: "Expected arrival date",
        },
        {
          name: "msdyn_actualdelivery",
          displayName: "Actual Delivery",
          type: "Date",
          required: false,
          description: "Date received and installed",
        },
      ],
      relationships: [
        {
          target: "Employee",
          relationship: "Many EquipmentRequests belong to one Employee",
        },
      ],
    },
    {
      name: "msdyn_deskassignment",
      displayName: "Desk Assignment",
      description: "Physical office desk and workspace assignments",
      columns: [
        {
          name: "msdyn_employee",
          displayName: "Employee (Lookup)",
          type: "Lookup",
          required: true,
          description: "Assigned employee",
        },
        {
          name: "msdyn_deskid",
          displayName: "Desk ID",
          type: "Text",
          required: true,
          description: "Physical desk identifier (e.g., 3-B-14)",
        },
        {
          name: "msdyn_floor",
          displayName: "Floor",
          type: "Text",
          required: false,
          description: "Building floor number",
        },
        {
          name: "msdyn_team",
          displayName: "Team Area",
          type: "Text",
          required: false,
          description: "Team or department area name",
        },
        {
          name: "msdyn_equipment",
          displayName: "Desk Equipment",
          type: "Text Area",
          required: false,
          description: "Monitor, keyboard, chair, lockers, etc.",
        },
        {
          name: "msdyn_keycardissued",
          displayName: "Keycard Issued",
          type: "Boolean",
          required: false,
          description: "Building access card provisioned",
        },
      ],
      relationships: [
        {
          target: "Employee",
          relationship: "One DeskAssignment per Employee",
        },
      ],
    },
    {
      name: "msdyn_auditlog",
      displayName: "Audit Log",
      description: "Immutable audit trail of all onboarding activities",
      columns: [
        {
          name: "msdyn_employee",
          displayName: "Employee (Lookup)",
          type: "Lookup",
          required: true,
          description: "Employee record being audited",
        },
        {
          name: "msdyn_action",
          displayName: "Action",
          type: "Text",
          required: true,
          description:
            "Record created, Approved, Task completed, Status changed",
        },
        {
          name: "msdyn_changedby",
          displayName: "Changed By (Lookup)",
          type: "Lookup",
          required: true,
          description: "User who made the change",
        },
        {
          name: "msdyn_timestamp",
          displayName: "Timestamp",
          type: "Date Time",
          required: true,
          description: "UTC timestamp of change",
        },
        {
          name: "msdyn_oldvalue",
          displayName: "Old Value",
          type: "Text",
          required: false,
          description: "Previous value before change",
        },
        {
          name: "msdyn_newvalue",
          displayName: "New Value",
          type: "Text",
          required: false,
          description: "New value after change",
        },
        {
          name: "msdyn_ipaddress",
          displayName: "IP Address",
          type: "Text",
          required: false,
          description: "User IP address for compliance",
        },
      ],
      relationships: [],
    },
  ],

  powerAutomateFlows: [
    {
      name: "trigger-onboarding-request",
      displayName: "Onboarding Request Submitted",
      trigger:
        "When an Employee record is created or modified (status = Submitted)",
      triggerDescription: "Manager submits onboarding request for new hire",
      actions: [
        {
          name: "Validate Required Fields",
          description:
            "Check that name, department, start date, manager are populated",
          condition: "If any required field is empty",
        },
        {
          name: "Send HR Notification",
          description: "Email HR team with request details for approval review",
        },
        {
          name: "Create Onboarding Task Records",
          description:
            "Auto-create tasks for: IT (email/laptop), HR (paperwork), Facilities (desk)",
        },
        {
          name: "Log to Audit",
          description: "Create audit log entry recording request submission",
        },
      ],
      errorHandling:
        "On failure, send admin notification and mark request as Draft to allow retry",
    },
    {
      name: "approve-onboarding",
      displayName: "HR Approval & Task Assignment",
      trigger: "When an Employee record status changes to Approved",
      triggerDescription: "HR manager approves the onboarding request",
      actions: [
        {
          name: "Assign IT Tasks",
          description:
            "Route Email, Laptop, and Software License tasks to IT team lead",
        },
        {
          name: "Assign Facilities Tasks",
          description:
            "Route Desk Assignment and Keycard tasks to Facilities coordinator",
        },
        {
          name: "Schedule Start Date Reminder",
          description:
            "Create reminder flow to trigger 1 week before start date",
        },
        {
          name: "Notify Manager",
          description:
            "Send email to manager confirming approval and expected completion date",
        },
        {
          name: "Log Approval",
          description: "Create audit log with HR approver name and timestamp",
        },
      ],
      errorHandling:
        "Retry task assignments 3 times; escalate unassigned tasks to department manager",
    },
    {
      name: "task-completion-handler",
      displayName: "Task Completed Handler",
      trigger: "When an Onboarding Task record is marked Completed",
      triggerDescription: "Department completes assigned onboarding task",
      actions: [
        {
          name: "Log Completion",
          description:
            "Record completion date and responsible person in audit log",
        },
        {
          name: "Check All Tasks Done",
          description:
            "Query all tasks for this employee; if 100% complete, update Employee status to Complete",
        },
        {
          name: "Send Completion Milestone Notification",
          description:
            "If milestone reached (50%, 75%, 100%), notify manager and employee",
        },
        {
          name: "Update Dashboard",
          description: "Refresh real-time onboarding dashboard view",
        },
      ],
      errorHandling: "Log completion even if email notification fails",
    },
    {
      name: "overdue-task-reminder",
      displayName: "Overdue Task Reminder (Scheduled Daily)",
      trigger: "Scheduled daily at 8:00 AM UTC",
      triggerDescription: "Daily check for overdue onboarding tasks",
      actions: [
        {
          name: "Query Overdue Tasks",
          description:
            "Find all tasks where due date < today and status != Completed",
        },
        {
          name: "Group by Department",
          description: "Organize results by responsible department",
        },
        {
          name: "Send Department Reminder",
          description:
            "Send adaptive card email with task list and 1-click action to update status",
        },
        {
          name: "Escalate Critical Delays",
          description:
            "If any task is >5 days overdue, escalate to department manager",
          condition: "If overdue days > 5",
        },
      ],
      errorHandling:
        "Continue processing remaining tasks if one department fails",
    },
    {
      name: "start-date-reminder",
      displayName: "Pre-Start Checklist (1 Week Before)",
      trigger: "Scheduled flow triggered 1 week before employee start date",
      triggerDescription:
        "Ensures all prep is complete before employee arrives",
      actions: [
        {
          name: "Verify IT Equipment Status",
          description:
            "Check if laptop and email are provisioned; flag if not delivered",
        },
        {
          name: "Verify Desk Assignment",
          description:
            "Confirm desk is assigned and facilities have completed setup",
        },
        {
          name: "Send Manager Checklist",
          description:
            "Email manager with final prep items (desk visit, team intro, etc.)",
        },
        {
          name: "Create Welcome Package Task",
          description:
            "Flag HR to prepare welcome materials and first-day itinerary",
        },
      ],
      errorHandling:
        "If critical item missing, escalate to Operations Manager with 48-hour resolution deadline",
    },
  ],

  securityRoles: [
    {
      name: "hr-onboarding-admin",
      displayName: "HR Onboarding Administrator",
      description:
        "Full control over onboarding process; can approve and review",
      responsibilities: [
        "Create and edit Employee records",
        "Approve onboarding requests",
        "Reassign tasks between departments",
        "View complete audit logs for compliance",
        "Generate onboarding reports",
        "Manage onboarding task templates",
      ],
      tablePermissions: [
        {
          table: "Employee Profile",
          create: true,
          read: true,
          update: true,
          delete: false,
        },
        {
          table: "Onboarding Task",
          create: true,
          read: true,
          update: true,
          delete: false,
        },
        {
          table: "Equipment Request",
          create: true,
          read: true,
          update: true,
          delete: false,
        },
        {
          table: "Desk Assignment",
          create: true,
          read: true,
          update: true,
          delete: false,
        },
        {
          table: "Audit Log",
          create: false,
          read: true,
          update: false,
          delete: false,
        },
      ],
    },
    {
      name: "manager-onboarding",
      displayName: "Department Manager",
      description:
        "Can submit onboarding requests and view assigned employee details",
      responsibilities: [
        "Submit new employee onboarding requests",
        "View onboarding status for their direct reports",
        "Assign employees to teams within their department",
        "Receive task completion notifications",
      ],
      tablePermissions: [
        {
          table: "Employee Profile",
          create: true,
          read: true,
          update: false,
          delete: false,
        },
        {
          table: "Onboarding Task",
          create: false,
          read: true,
          update: false,
          delete: false,
        },
        {
          table: "Equipment Request",
          create: false,
          read: true,
          update: false,
          delete: false,
        },
        {
          table: "Desk Assignment",
          create: false,
          read: true,
          update: false,
          delete: false,
        },
        {
          table: "Audit Log",
          create: false,
          read: false,
          update: false,
          delete: false,
        },
      ],
    },
    {
      name: "it-onboarding-tech",
      displayName: "IT Onboarding Technician",
      description: "Manages equipment provisioning and email/system access",
      responsibilities: [
        "Update Equipment Request status",
        "Complete IT-related onboarding tasks",
        "Assign licenses and access rights",
        "Document equipment serial numbers",
      ],
      tablePermissions: [
        {
          table: "Employee Profile",
          create: false,
          read: true,
          update: false,
          delete: false,
        },
        {
          table: "Onboarding Task",
          create: false,
          read: true,
          update: true,
          delete: false,
        },
        {
          table: "Equipment Request",
          create: true,
          read: true,
          update: true,
          delete: false,
        },
        {
          table: "Desk Assignment",
          create: false,
          read: true,
          update: false,
          delete: false,
        },
        {
          table: "Audit Log",
          create: false,
          read: false,
          update: false,
          delete: false,
        },
      ],
    },
    {
      name: "facilities-coordinator",
      displayName: "Facilities Coordinator",
      description:
        "Manages desk assignments, workspace setup, and access cards",
      responsibilities: [
        "Assign desks and workspace",
        "Order and track desk equipment",
        "Issue and track access keycards",
        "Update facilities-related onboarding tasks",
      ],
      tablePermissions: [
        {
          table: "Employee Profile",
          create: false,
          read: true,
          update: false,
          delete: false,
        },
        {
          table: "Onboarding Task",
          create: false,
          read: true,
          update: true,
          delete: false,
        },
        {
          table: "Equipment Request",
          create: false,
          read: true,
          update: false,
          delete: false,
        },
        {
          table: "Desk Assignment",
          create: true,
          read: true,
          update: true,
          delete: false,
        },
        {
          table: "Audit Log",
          create: false,
          read: false,
          update: false,
          delete: false,
        },
      ],
    },
  ],

  almPlan: [
    {
      name: "Development",
      description:
        "Shared dev environment where solution builders configure flows and forms",
      purpose:
        "Active development and testing of onboarding processes and automation rules",
      userBase: "10 HR and IT solution builders",
      deploymentFrequency: "3-5 times per week during initial setup phase",
    },
    {
      name: "Test / UAT",
      description:
        "Isolated staging environment for testing end-to-end workflows before production",
      purpose:
        "User acceptance testing with real data patterns; validate all flows work as designed",
      userBase: "20 UAT testers (HR, IT, Facilities managers)",
      deploymentFrequency:
        "Weekly; mirrors dev changes after 48-hour testing period",
    },
    {
      name: "Production",
      description:
        "Live environment processing all real employee onboarding requests",
      purpose:
        "Process 50+ onboarding requests monthly; maintain compliance and audit trails",
      userBase: "All managers, HR staff, IT, Facilities (200+ users)",
      deploymentFrequency:
        "Bi-weekly through automated CI/CD pipeline with change approval gate",
    },
  ],

  licensingNotes: `This solution requires the following Power Platform licensing:
    
    1. Model-driven App Users: Each manager, HR, IT, and Facilities staff member accessing the app requires either:
       - Power Apps Premium User license ($20/user/month) - Recommended for power users managing workflows
       - Power Apps per-user plan alternative if company has existing M365 licenses
    
    2. Power Automate Cloud Flows:
       - All flows can run on free plan tier (2,000 actions/month per user) OR
       - Power Automate Premium ($15/month) for higher action limits and priority execution
       - Recommended: Premium plan for guaranteed reliability of critical approval flows
    
    3. Dataverse Storage:
       - Base license includes 2 GB database storage
       - Expected usage: ~500 MB for first year (50 new hires/month × 12 months = 600 employee records + tasks)
       - Should remain well within base allocation; no additional storage purchases needed in year 1
    
    4. Power Automate Unattended RPA (Optional):
       - IF automating laptop provisioning in IT systems: $2,000/month license for unattended bot
       - Currently not required; manual IT task completion is acceptable baseline
    
    Estimated Annual Cost:
      - 10 power users × $20/month × 12 months = $2,400
      - 50 managers × $5/month (included license) = minimal
      - Power Automate Premium: $15/month = $180/year
      - TOTAL: ~$2,580/year (scales linearly with user adoption)
      
    ROI: Onboarding time savings (3 weeks → 5 days per hire) = $3,200 savings per hire ÷ 50 hires/month = clear ROI within first month.`,

  risks: [
    {
      id: "risk-001",
      category: "User Adoption",
      description:
        "Managers may continue using email for onboarding requests instead of new app; IT staff resist changes to established workflows",
      severity: "high",
      businessImpact:
        "App becomes shadow IT tool; benefits not realized; continued manual errors",
      mitigation:
        "Require mandatory training for all managers before production launch; designate adoption champions in each department; measure daily active user rate and send escalations if usage drops",
    },
    {
      id: "risk-002",
      category: "Integration Gaps",
      description:
        "Email provisioning and laptop inventory systems are legacy and not connected to Power Platform; manual IT processes remain",
      severity: "medium",
      businessImpact:
        "App tracks onboarding tasks but IT still works in separate system; duplication of effort",
      mitigation:
        "Phase 1: Manual IT processes (acceptable). Phase 2 (3-6 months): Build Power Automate integration with IT systems via API or RPA. Document IT process requirements now.",
    },
    {
      id: "risk-003",
      category: "Data Compliance",
      description:
        "Employee data in Dataverse includes personal information (name, department, start date); compliance with GDPR/CCPA for data retention and deletion",
      severity: "high",
      businessImpact:
        "Legal liability if employee data is not properly deleted on termination; audit failures",
      mitigation:
        "Implement employee record archival flow on termination date; retain audit logs for 3 years; add data residency selection during setup; ensure backups exclude deleted records",
    },
    {
      id: "risk-004",
      category: "Audit Trail Integrity",
      description:
        "If audit log records are deleted or modified, compliance evidence is compromised; users with admin role could tamper with history",
      severity: "high",
      businessImpact:
        "Failed compliance audits; inability to prove who approved employee access",
      mitigation:
        "Mark audit log as read-only after creation; use business rules to prevent deletion; implement Azure Compliance Center rules to archive audit logs monthly to immutable blob storage",
    },
    {
      id: "risk-005",
      category: "Performance at Scale",
      description:
        "With 50+ onboarding requests monthly, daily reminder flows could experience delays; Dataverse may become slow if not optimized",
      severity: "medium",
      businessImpact:
        "Delayed notifications; users see stale data; flow execution timeouts",
      mitigation:
        "Implement database views for reporting; create archival job to move completed onboardings older than 90 days; monitor Dataverse usage via Azure Monitor; scale to Premium environment if CPU > 70%",
    },
    {
      id: "risk-006",
      category: "Role-Based Access Enforcement",
      description:
        "Misconfiguration of security roles could allow IT staff to see salary data or Facilities staff to approve HR decisions",
      severity: "medium",
      businessImpact:
        "Sensitive data exposure; unauthorized actions; data breach risk",
      mitigation:
        "Implement role validation checklist before production launch; perform security review with IT team; restrict table access at column level (e.g., hide salary field from non-HR roles); test each role's permissions in UAT",
    },
    {
      id: "risk-007",
      category: "Email Delivery Failures",
      description:
        "Power Automate email notifications fail if Exchange mailbox is full or sender domain is blocked; users miss critical task assignments",
      severity: "medium",
      businessImpact:
        "Tasks assigned but never actioned; critical delays go unnoticed",
      mitigation:
        "Add retry logic with 3 exponential backups (1 min, 5 min, 15 min); log failed notifications in error table; implement dashboard alert for >10 failures/day; add in-app notification as email fallback",
    },
  ],

  readinessScore: 78,

  architectureDiagramMermaid: `graph TB
    subgraph UI["📱 User Interface"]
        Canvas["Canvas App<br/>(Mobile Access)"]
        ModelDriven["🖥️ Model-driven App<br/>(Desktop - Primary)"]
    end

    subgraph Input["📋 Submission Layer"]
        ManagerForm["Manager<br/>Onboarding<br/>Request"]
        HRApproval["HR<br/>Approval<br/>Review"]
    end

    subgraph Data["📦 Data Layer"]
        Dataverse["Dataverse Tables:<br/>Employee | Tasks<br/>Equipment | Desk<br/>Audit Logs"]
    end

    subgraph Automation["⚙️ Automation Flows"]
        Flow1["Onboarding<br/>Trigger"]
        Flow2["HR Approval<br/>Distributor"]
        Flow3["Task Completion<br/>Monitor"]
        Flow4["Daily Reminder<br/>Loop"]
        Flow5["Pre-Start<br/>Checklist"]
    end

    subgraph Distribution["🎯 Task Distribution"]
        IT["🔧 IT Team<br/>Email, Laptop,<br/>Software"]
        Facilities["🏢 Facilities<br/>Desk Assignment,<br/>Keycard"]
        HR["📄 HR<br/>Paperwork,<br/>Payroll Setup"]
    end

    subgraph Notifications["📧 Notifications"]
        Email["Office 365<br/>Email"]
        Teams["Microsoft Teams<br/>Adaptive Cards"]
        Dashboard["Real-time<br/>Dashboard"]
    end

    subgraph Security["🔐 Access Control"]
        Roles["Role-Based<br/>Security"]
        Audit["Immutable<br/>Audit Trail"]
    end

    Input --> ModelDriven
    Input --> Canvas
    ManagerForm --> Flow1
    HRApproval --> Flow2
    Flow1 --> Dataverse
    Flow2 --> Distribution
    Flow3 --> Dataverse
    Flow4 --> Dataverse
    Flow5 --> Notifications
    Distribution --> Flow3
    Distribution --> Flow4
    Dataverse --> Dashboard
    Dataverse --> Audit
    Dataverse --> Roles
    Notifications --> Email
    Notifications --> Teams
    Notifications --> IT
    Notifications --> Facilities
    Notifications --> HR

    style UI fill:#e3f2fd
    style Input fill:#fff9c4
    style Data fill:#f3e5f5
    style Automation fill:#e8f5e9
    style Distribution fill:#ffe0b2
    style Notifications fill:#ffccbc
    style Security fill:#ffebee`,

  implementationChecklist: [
    {
      phase: "1. Planning & Design (Week 1)",
      task: "Kickoff meeting with HR, IT, Facilities, Management",
      owner: "Project Manager",
      estimatedHours: 2,
      dependencies: [],
    },
    {
      phase: "1. Planning & Design (Week 1)",
      task: "Document current onboarding workflow and pain points",
      owner: "HR Manager",
      estimatedHours: 4,
      dependencies: [],
    },
    {
      phase: "1. Planning & Design (Week 1)",
      task: "Finalize security role definitions and data access requirements",
      owner: "IT Security",
      estimatedHours: 3,
      dependencies: [],
    },
    {
      phase: "1. Planning & Design (Week 1)",
      task: "Review compliance and audit requirements",
      owner: "Compliance Officer",
      estimatedHours: 2,
      dependencies: [],
    },
    {
      phase: "2. Development (Weeks 2-3)",
      task: "Create Dataverse tables and columns",
      owner: "Power Platform Developer",
      estimatedHours: 8,
      dependencies: ["Kickoff meeting", "Current workflow documentation"],
    },
    {
      phase: "2. Development (Weeks 2-3)",
      task: "Build main Model-driven app form and views",
      owner: "Power Platform Developer",
      estimatedHours: 12,
      dependencies: ["Dataverse tables created"],
    },
    {
      phase: "2. Development (Weeks 2-3)",
      task: "Create Power Automate flows (5 core flows listed above)",
      owner: "Power Automate Developer",
      estimatedHours: 20,
      dependencies: ["Dataverse tables created", "HR workflow finalized"],
    },
    {
      phase: "2. Development (Weeks 2-3)",
      task: "Configure security roles and table permissions",
      owner: "Power Platform Developer",
      estimatedHours: 6,
      dependencies: [
        "Security requirements finalized",
        "Dataverse tables created",
      ],
    },
    {
      phase: "2. Development (Weeks 2-3)",
      task: "Build audit logging table and flows",
      owner: "Power Automate Developer",
      estimatedHours: 8,
      dependencies: ["Compliance requirements finalized"],
    },
    {
      phase: "3. Testing & UAT (Week 4)",
      task: "Deploy to Test environment; setup test data",
      owner: "Power Platform Developer",
      estimatedHours: 4,
      dependencies: ["All flows created and tested in Dev"],
    },
    {
      phase: "3. Testing & UAT (Week 4)",
      task: "Execute test cases: happy path, error scenarios, edge cases",
      owner: "QA Tester",
      estimatedHours: 16,
      dependencies: ["Test environment deployed"],
    },
    {
      phase: "3. Testing & UAT (Week 4)",
      task: "Conduct UAT with HR, IT, Facilities teams",
      owner: "HR Manager, IT Lead, Facilities Lead",
      estimatedHours: 12,
      dependencies: ["Test environment deployed"],
    },
    {
      phase: "3. Testing & UAT (Week 4)",
      task: "Performance testing: test with 100+ concurrent records",
      owner: "Power Platform Developer",
      estimatedHours: 4,
      dependencies: ["Test environment deployed"],
    },
    {
      phase: "4. Pre-Production (Week 5)",
      task: "Fix bugs and UAT feedback items",
      owner: "Power Platform Developer",
      estimatedHours: 8,
      dependencies: ["UAT feedback collected"],
    },
    {
      phase: "4. Pre-Production (Week 5)",
      task: "Create admin guide and user documentation",
      owner: "Technical Writer",
      estimatedHours: 8,
      dependencies: ["Solution complete"],
    },
    {
      phase: "4. Pre-Production (Week 5)",
      task: "Plan user training sessions",
      owner: "HR Manager",
      estimatedHours: 4,
      dependencies: ["User documentation created"],
    },
    {
      phase: "4. Pre-Production (Week 5)",
      task: "Setup Production environment and backup strategy",
      owner: "IT Operations",
      estimatedHours: 6,
      dependencies: [],
    },
    {
      phase: "5. Production Launch (Week 6)",
      task: "Final production readiness review",
      owner: "Project Manager",
      estimatedHours: 2,
      dependencies: [
        "All fixes complete",
        "Documentation complete",
        "Prod environment ready",
      ],
    },
    {
      phase: "5. Production Launch (Week 6)",
      task: "Deploy to Production; verify all flows and data",
      owner: "Power Platform Developer",
      estimatedHours: 4,
      dependencies: ["Prod environment ready"],
    },
    {
      phase: "5. Production Launch (Week 6)",
      task: "Conduct user training (2x sessions for coverage)",
      owner: "HR Manager",
      estimatedHours: 4,
      dependencies: ["Training content prepared"],
    },
    {
      phase: "5. Production Launch (Week 6)",
      task: "Go-live support (live monitoring of first week)",
      owner: "Power Platform Team",
      estimatedHours: 16,
      dependencies: ["Production deployed"],
    },
    {
      phase: "6. Post-Launch (Weeks 7-8)",
      task: "Monitor KPIs: onboarding time, task completion rate, user adoption",
      owner: "Project Manager",
      estimatedHours: 4,
      dependencies: ["Go-live support complete"],
    },
    {
      phase: "6. Post-Launch (Weeks 7-8)",
      task: "Gather feedback and document improvement items",
      owner: "HR Manager",
      estimatedHours: 4,
      dependencies: ["1 week production usage"],
    },
    {
      phase: "6. Post-Launch (Weeks 7-8)",
      task: "Plan Phase 2 enhancements (IT system integration, reporting dashboards)",
      owner: "Project Manager",
      estimatedHours: 4,
      dependencies: ["Post-launch feedback collected"],
    },
  ],

  followUpQuestions: [
    {
      question:
        "Do you have existing employee data in another system (HR, ADP, Workday) that we should migrate into Dataverse?",
      rationale:
        "Understanding data sources helps us plan data migration and avoid duplicate entry. Initial load of existing employees can accelerate onboarding process.",
      suggestedAnswer:
        "If yes, specify system and number of records. If no, we start fresh with new hires only.",
    },
    {
      question:
        "What is your current average onboarding timeline from request submission to 'ready to work'?",
      rationale:
        "Establishing baseline lets us measure impact. Most organizations see 15-30% time reduction immediately.",
      suggestedAnswer:
        "E.g., '3 weeks currently; HR wants to reduce to 5 business days'",
    },
    {
      question:
        "Does your IT department have API access to laptop provisioning systems (Dell, Lenovo, etc.)?",
      rationale:
        "This determines if we can automate equipment status updates or rely on manual task completion in Phase 1.",
      suggestedAnswer:
        "If yes, collect API documentation. If no, plan Phase 2 RPA or stay with manual updates.",
    },
    {
      question:
        "Are there regulatory compliance requirements (HIPAA, PCI, SOX) that constrain where employee data can be stored?",
      rationale:
        "Impacts Dataverse region selection and encryption requirements. Some companies require on-premises storage.",
      suggestedAnswer:
        "If yes, share compliance documentation so we select appropriate Dataverse region and encryption settings.",
    },
    {
      question:
        "How many new employees per month and in how many locations/departments?",
      rationale:
        "Helps us plan system capacity, flow execution limits, and user licensing scale.",
      suggestedAnswer:
        "E.g., '50 new hires/month across 3 locations and 8 departments'",
    },
    {
      question:
        "Who currently approves hiring decisions, and how long does that approval typically take?",
      rationale:
        "Affects flow design. If approvals are slow, onboarding is blocked; we may need escalation logic.",
      suggestedAnswer:
        "E.g., 'Department Manager → HR Manager → Finance (avg 3 days total)'",
    },
    {
      question:
        "Do remote and in-office employees have different onboarding task lists?",
      rationale:
        "Impacts task distribution logic. Remote employees skip desk assignment but may need home office equipment.",
      suggestedAnswer:
        "Yes with differences listed, or No (same process for all)",
    },
    {
      question:
        "What's your organization's policy on data retention for terminated employees?",
      rationale:
        "Drives archive/deletion flows. GDPR requires deletion within 30 days; others retain for 3 years for audit.",
      suggestedAnswer:
        "E.g., 'Delete PII after 30 days; retain audit logs for 3 years'",
    },
    {
      question:
        "Are there any integrations with external systems we should know about (payroll, benefits, background check providers)?",
      rationale:
        "Identifies future integration points for Phase 2. May need additional Power Automate connectors.",
      suggestedAnswer:
        "List systems: ADP, Workday, background check provider, benefits portal, etc.",
    },
    {
      question:
        "What's your expected timeline to move from this initial MVP to a Phase 2 with IT system integrations?",
      rationale:
        "Helps us design with Phase 2 in mind. Avoids rework if integration is planned for Q3.",
      suggestedAnswer:
        "E.g., '6 months for MVP only, then Phase 2 planning in Q3'",
    },
  ],
};

// Export the mock blueprint as the primary mock data
export const mockBlueprint = mockEmployeeOnboardingBlueprint;
