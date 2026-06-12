# System Architecture

## Overview

The Power Platform Solution Architect Agent is a web application that converts plain-language business requirements into detailed, exportable Power Platform solution blueprints.

```
┌─────────────────────────────────────────────────────────────┐
│                      Client Layer                           │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Next.js 15 App Router                              │  │
│  │  - RequirementForm: Text input component            │  │
│  │  - ResultDashboard: Multi-tab result viewer         │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│                    Processing Layer                         │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Zod Schema Validation                              │  │
│  │  - Blueprint schema                                 │  │
│  │  - Risk assessment schema                           │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│                      AI Layer (Phase 2)                     │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Azure OpenAI API Integration                       │  │
│  │  - Prompt engineering                              │  │
│  │  - JSON output parsing                             │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│                     Output Layer                            │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Export Formats                                     │  │
│  │  - Markdown (design document)                       │  │
│  │  - JSON (programmatic integration)                  │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

## Component Structure

### Page Component (`app/page.tsx`)

- Main orchestrator
- State management for form and results
- Handles transitions between input and display phases

### RequirementForm

- Textarea for business requirements input
- Form validation
- Submit handler

### ResultDashboard

- Tab-based navigation
- Lazy rendering of content
- Loading state management

### Content Components (Tabs)

- **OverviewTab**: Executive summary, app type recommendation, risk level
- **DataverseSchemaView**: Table definitions, relationships, column recommendations
- **FlowDesignView**: Power Automate flow specifications
- **SecurityModelView**: Role-based access control definitions
- **ALMChecklistView**: Environment strategy and deployment checklist
- **RiskPanel**: Risk assessment with mitigation strategies
- **MermaidDiagram**: Architecture visualization
- **ExportPanel**: Export options
- **ReadinessScore**: Production readiness assessment

### Utility Modules

#### `lib/mockResults.ts`

- TypeScript interfaces for Blueprint structure
- Mock data for MVP demonstration
- Used until Azure OpenAI integration is complete

#### `lib/exportMarkdown.ts`

- Markdown generation from Blueprint
- JSON serialization
- Browser download helper

## Data Flow

### Phase 1: Requirement Input

```
User enters requirement text
         ↓
Form validation (required fields)
         ↓
Trigger blueprint generation
```

### Phase 2: AI Processing (Future)

```
Send requirement to Azure OpenAI
         ↓
Parse AI response
         ↓
Validate against Zod schema
         ↓
Return Blueprint object
```

### Phase 3: Display Results

```
Blueprint object received
         ↓
Populate component state
         ↓
Render multi-tab dashboard
```

### Phase 4: Export

```
User selects format (Markdown/JSON)
         ↓
Generate document
         ↓
Trigger browser download
```

## Styling Architecture

- **Framework**: Tailwind CSS
- **Color Scheme**:
  - Primary: Blue (`blue-600`)
  - Success: Green (`green-600`)
  - Warning: Yellow (`yellow-600`)
  - Danger: Red (`red-600`)
  - Neutral: Gray scale
- **Responsive**: Mobile-first, breakpoints at `sm`, `md`, `lg`
- **Accessibility**: WCAG 2.1 AA compliance via semantic HTML + ARIA

## Future Enhancements

### Phase 2: AI Integration

- Replace `mockResults.ts` with Azure OpenAI API calls
- Add prompt engineering for consistent outputs
- Implement streaming for long-running operations

### Phase 3: Advanced Features

- Solution Review Board mode (comparing multiple designs)
- Design history and versioning
- Collaborative review features
- Integration with Power Platform CLI

### Phase 4: Enterprise Features

- User authentication
- Organization-level governance policies
- Multi-tenant support
- Audit logging

## Deployment

### Development

```bash
npm install
npm run dev
```

### Production

```bash
npm run build
npm start
```

### Environment Variables (Future)

- `AZURE_OPENAI_API_KEY`
- `AZURE_OPENAI_ENDPOINT`
- `AZURE_OPENAI_DEPLOYMENT_NAME`

## Testing Strategy

- Unit tests: Component rendering and props
- Integration tests: Form submission → display flow
- E2E tests: Complete user journey (future)
- Accessibility tests: WCAG compliance
