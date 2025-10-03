# 🚀 Getting Started

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Git

## Installation Steps

### 1. Clone the repository

```bash
git clone <repository-url>
cd squirrels-ny
```

### 2. Install dependencies

```bash
npm run install:all
```

This command will install dependencies for:
- Root project
- Client (frontend)
- Server (backend)

### 3. Set up environment variables

Create a `.env` file in the `server` directory:

```bash
PORT=3000
NODE_ENV=development
```

### 4. Start development servers

```bash
npm run dev
```

This will start:
- Backend API on `http://localhost:3000`
- Frontend dev server on `http://localhost:5173`

## Development Workflow

### Making Changes

1. Frontend code is in `client/src/`
2. Backend code is in `server/src/`
3. Both have hot reload enabled

### Project Structure

- **Components**: Place in `client/src/components/`
- **API Routes**: Place in `server/src/routes/`
- **Types**: Keep in sync between `client/src/types/` and `server/src/types/`

### Building for Production

```bash
npm run build
npm start
```

## Next Steps

Ready to implement features! The structure is in place and follows clean code principles.

