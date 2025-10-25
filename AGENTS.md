# Agent Guidelines for Innovators' Hub

## Build/Lint/Test Commands

- **Build**: `npm run build` - Builds the Next.js application for production
- **Lint**: `npm run lint` - Runs ESLint to check code quality and style
- **Database**: `npm run db:push` - Pushes database schema changes using Drizzle
- **Dev server**: `npm run dev` - Starts the development server

No test framework is currently configured. Run linting after code changes.

## Git Commit Conventions

Use conventional commit format: `type(scope): description`

### Commit Types
- **feat**: A new feature
- **fix**: A bug fix
- **docs**: Documentation only changes
- **style**: Changes that do not affect the meaning of the code (formatting, etc.)
- **refactor**: A code change that neither fixes a bug nor adds a feature
- **test**: Adding missing tests or correcting existing tests
- **chore**: Changes to the build process or auxiliary tools

### Examples
- `feat(auth): add user login functionality`
- `fix(api): resolve null pointer in user endpoint`
- `refactor(db): migrate from Prisma to Drizzle ORM`
- `docs(readme): update installation instructions`

## Branching Strategy

### Branch Types
- **main**: Production-ready code
- **release/sit**: Staging/integration branch - all changes merged here first
- **feature/**: Feature branches (e.g., `feature/user-auth`)
- **docs/**: Documentation branches (e.g., `docs/api-reference`)
- **fix/**: Bug fix branches (e.g., `fix/login-issue`)

### Workflow
1. Create feature branches from `main`
2. Develop and commit changes using conventional commits
3. Merge feature branches to `release/sit` for integration testing
4. After testing, merge `release/sit` to `main` for production

## Code Style Guidelines

### Imports
- Use single quotes for all imports
- Group imports: external libraries first, then relative imports
- Example:
```javascript
import { useRouter } from "next/router";
import classes from "../styles/header.module.css";
import { signIn, signOut, useSession } from "next-auth/react";
```

### Formatting
- Inconsistent semicolon usage across codebase - prefer with semicolons for consistency
- 4-space indentation in some files, but generally follow existing patterns
- Use trailing commas in object/array literals

### Types
- Use TypeScript for database schemas and new utility files
- Components are primarily .jsx (JavaScript with JSX)
- Define interfaces/types for complex data structures

### Naming Conventions
- **Components**: PascalCase (e.g., `Header`, `LoginForm`)
- **Functions/Variables**: camelCase (e.g., `handleSubmit`, `userData`)
- **Files**: PascalCase for components, camelCase for utilities
- **Database**: snake_case for columns, camelCase for table names in schema

### Error Handling
- Check API responses for success/error status
- Use basic error logging with `console.log` for debugging
- Handle async operations with proper error boundaries

### Components
- Functional components with React hooks
- Use arrow functions for component definitions
- Destructure props at function parameters
- Export default for components

### Database
- Use Drizzle ORM for all database operations
- Database schema defined in `src/lib/db/schema.ts`
- Database connection in `src/lib/db/index.ts`
- Use `npm run db:push` to push schema changes

### Security
- Never log sensitive data (API keys, user credentials)
- Validate user input on both client and server
- Use proper authentication checks in API routes

## Communication Guidelines

### Concision Over Grammar
Either while writing commit messages or suggesting a plan, always sacrifice grammar for the sake of concision.

### Clarify Unresolved Questions
If there are any unresolved questions in ANY query from the user, make sure to ask them.
