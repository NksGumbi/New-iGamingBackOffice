# iGaming Integration Back Office Platform

A comprehensive Angular 17+ back office platform for managing game and payment provider integrations in the iGaming industry.

## Tech Stack

| Technology | Version | Purpose |
|---|---|---|
| Angular | 17+ | Frontend framework |
| Angular Material | 17+ | UI component library |
| Angular CDK | 17+ | Layout utilities |
| SCSS | - | Styling |
| RxJS | ~7.8 | Reactive state management |
| TypeScript | ~5.2 | Type safety |

## Features

| Module | Description |
|---|---|
| 📊 **Dashboard** | KPI cards, activity feed, quick actions |
| 🏢 **Operators** | Operator groups & operators CRUD with hierarchy |
| 🎮 **Games** | Game catalog, assignments, RTP/limits config |
| 🔌 **Providers** | Game & payment provider groups management |
| 💳 **Payments** | Payment providers, methods, transaction logs |
| 👥 **Users & Roles** | User management with RBAC permissions matrix |
| 🔗 **Integrations** | API key management, webhook configuration |
| 📋 **Audit Logs** | Complete audit trail with filters |
| ⚙️ **Settings** | Platform settings, branding/theming |

## Getting Started

### Prerequisites

- Node.js v18+
- npm v9+

### Installation & Development

```bash
# Install dependencies
npm install

# Start development server
npm start
# OR
ng serve

# Open browser at http://localhost:4200
```

### Demo Credentials

| Role | Email | Password |
|---|---|---|
| Super Admin | admin@igaming.com | admin123 |
| Operator Manager | operator@igaming.com | op123 |

## Architecture Highlights

- **Standalone Components**: All components use Angular 17+ standalone API (no NgModules)
- **New Control Flow**: Uses `@if`, `@for`, `@switch` syntax throughout
- **Lazy Loading**: Every feature route is lazy-loaded for optimal performance
- **Mock Services**: All data is served from in-memory mock services using RxJS `of()`
- **Reactive Forms**: All forms use Angular Reactive Forms with validation