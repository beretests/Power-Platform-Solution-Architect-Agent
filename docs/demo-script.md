# Power Platform Solution Architect Agent - Demo Script

## Overview

This demo script showcases the Power Platform Solution Architect Agent converting plain-language business requirements into implementation-ready solution blueprints.

**Duration:** 8-10 minutes

---

## Demo Flow

### 1. Introduction (1 min)

"Today we're looking at the Power Platform Solution Architect Agent—a tool that helps business analysts and solution architects rapidly convert business requirements into detailed, production-ready Power Platform blueprints."

**Key Points:**

- Saves architects 2-3 hours of manual design work
- Ensures consistent best practices
- Flags risks early
- Generates exportable documentation

### 2. Requirement Input (1 min)

**Scenario:** A manufacturing company needs to track customer orders and automate notifications.

**Sample Requirement:**

```
We need to track customer orders and associated line items.
When an order is created, notify the fulfillment team via email.
When order status changes, update the customer through Power Pages.
Only sales managers should approve discounts over 20%.
We need audit trails for all price changes.
```

**Action:**

- Navigate to the app
- Paste requirement into the RequirementForm
- Click "Generate Blueprint"

### 3. Loading State (2 min)

"The AI is now analyzing the requirements and generating a comprehensive blueprint. This includes:

- Recommended app architecture
- Dataverse data model
- Power Automate flow designs
- Security role recommendations
- ALM strategy
- Risk assessment
- Production readiness score"

### 4. Blueprint Generation (3-4 min)

**Show each tab:**

#### Overview Tab

- "The agent recommends a **Model-driven app** because this is data-heavy with complex workflows"
- Show executive summary
- Highlight risk level badge

#### Dataverse Schema Tab

- "The data model includes three tables: Customer, Order, and LineItem"
- Show relationships and column suggestions
- Point out best practices (naming conventions, lookup fields)

#### Power Automate Flows Tab

- "Three key flows have been designed:"
  - Order Creation Flow (sends email to fulfillment team)
  - Status Update Flow (syncs to Power Pages customer portal)
  - Price Change Approval Flow (enforces 20% discount rule)

#### Security Model Tab

- "Three security roles have been defined:"
  - Sales Manager (can approve discounts, full order access)
  - Fulfillment Team (read/update orders, create shipments)
  - Finance Admin (audit trail access, reporting)

#### ALM Strategy Tab

- "The agent recommends this deployment approach:"
  - Development environment for active development
  - Test environment for UAT
  - Production environment with backup strategy
  - DevOps pipeline for solution deployment

#### Risk Panel

- Point out flagged risks:
  - Licensing costs for Model-driven app users
  - Dataverse storage limits with high volume orders
  - Email delivery failures requiring retry logic
  - Power Pages customization complexity

#### Readiness Score

- "This blueprint scores **65/100** on production readiness"
- Highlight improvement areas

#### Architecture Diagram

- "The Mermaid diagram shows the solution topology"
- Walk through: UI layer → Dataverse → Automation → External systems

### 5. Export & Review (2 min)

**Export Options:**

- Click "Export as Markdown" to get a detailed design document
- Click "Export as JSON" to integrate with development tools

**Use Cases:**

- Share with Solution Review Board
- Import into solution implementation checklist
- Version control in git
- Generate Visio diagrams from JSON

---

## Key Talking Points

### Why This Matters

- ✅ **Speed:** From hours to minutes
- ✅ **Consistency:** Follows Microsoft best practices
- ✅ **Risk Awareness:** Flags licensing, performance, and security concerns
- ✅ **Documentation:** Exportable blueprints for governance
- ✅ **Accessibility:** Non-architects can design solutions

### Key Features

- Plain-language requirement input
- Multi-tab result dashboard
- Real-time architecture diagram generation
- Production readiness scoring
- Comprehensive risk assessment
- Export in multiple formats

### Technology Stack

- **Next.js 15+** (App Router, TypeScript)
- **Tailwind CSS** (responsive design)
- **Mermaid** (diagram generation)
- **Azure OpenAI** (LLM backbone, added later)
- **Zod** (runtime validation)

---

## Potential Q&A

**Q: Can this replace a solution architect?**
A: No, it augments them. The agent generates the blueprint; architects validate, refine, and ensure organizational fit.

**Q: How accurate are the recommendations?**
A: Based on Microsoft best practices and common patterns. All recommendations should be reviewed by your governance team.

**Q: Can we integrate this with our ALM process?**
A: Yes! The JSON export is designed to integrate with CI/CD pipelines and solution deployment tools.

**Q: What happens if the AI gets it wrong?**
A: The UI flags assumptions and risks. All outputs should be validated before production deployment.

---

## Judging Criteria Alignment

| Criterion                    | Demonstrated                                             |
| ---------------------------- | -------------------------------------------------------- |
| **Innovation**               | AI-driven architecture generation for low-code platforms |
| **User Experience**          | Intuitive form → rich multi-tab dashboard                |
| **Power Platform Knowledge** | Uses accurate terminology, follows best practices        |
| **Code Quality**             | TypeScript, component-based, accessible                  |
| **Business Value**           | Saves 2-3 hours per design, improves consistency         |

---

## Troubleshooting

**If the app won't load:**

- Check that Next.js dev server is running: `npm run dev`
- Verify port 3000 is accessible

**If components don't render:**

- Clear browser cache
- Rebuild: `npm run build`

**For styling issues:**

- Ensure Tailwind is configured: `npm run dev`
