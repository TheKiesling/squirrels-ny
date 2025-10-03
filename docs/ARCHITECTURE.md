# 🏗️ Architecture

## Project Structure

```
squirrels-ny/
├── client/                 # Frontend application
│   ├── src/
│   │   ├── components/    # Reusable React components
│   │   ├── hooks/         # Custom React hooks
│   │   ├── services/      # API communication layer
│   │   ├── styles/        # Global styles and CSS modules
│   │   ├── types/         # TypeScript type definitions
│   │   ├── utils/         # Helper functions
│   │   ├── App.tsx        # Root component
│   │   └── main.tsx       # Application entry point
│   ├── index.html
│   ├── package.json
│   └── vite.config.ts
│
├── server/                # Backend API
│   ├── src/
│   │   ├── controllers/   # Request handlers
│   │   ├── routes/        # API route definitions
│   │   ├── services/      # Business logic layer
│   │   ├── data/          # Data storage and access
│   │   ├── types/         # TypeScript type definitions
│   │   ├── utils/         # Helper functions
│   │   └── index.ts       # Server entry point
│   ├── package.json
│   └── tsconfig.json
│
└── docs/                  # Project documentation
    └── ARCHITECTURE.md
```

## Clean Architecture Principles

### Separation of Concerns

Each module has a single, well-defined responsibility:

- **Components**: UI presentation only
- **Hooks**: Reusable stateful logic
- **Services**: API communication
- **Controllers**: Request/response handling
- **Services (backend)**: Business logic
- **Data**: Data access layer

### Dependency Flow

```
UI Components → Hooks → Services → API
                  ↓
              Business Logic
```

### Key Principles Applied

1. **Single Responsibility**: Each function/class does one thing
2. **DRY**: No code duplication
3. **Small Functions**: Functions are focused and concise
4. **Meaningful Names**: Clear, descriptive naming
5. **Type Safety**: Full TypeScript coverage
6. **Error Handling**: Proper error boundaries

## Tech Stack Rationale

### Frontend
- **React**: Component-based UI
- **Vite**: Fast dev server and build tool
- **TypeScript**: Type safety and better DX
- **Leaflet**: Interactive maps
- **CSS Modules**: Scoped styling

### Backend
- **Express**: Minimal, flexible Node.js framework
- **TypeScript**: Consistency with frontend
- **JSON Storage**: Simple, file-based data persistence

## Data Flow

1. User interacts with UI
2. Component triggers hook
3. Hook calls service
4. Service makes API request
5. Backend controller receives request
6. Controller calls service
7. Service accesses data
8. Response flows back through layers

