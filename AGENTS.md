# AGENTS.md - Coding Guidelines for AI Agents

This document provides coding guidelines for AI agents (Cursor, Copilot, etc.) working on the `blog-admin` project. Following these guidelines ensures consistency and quality across all code contributions.

---

## Project Overview

**Tech Stack:**

- React 19 + TypeScript 5.3
- Vite 5.x as build tool
- TanStack Query v5 for data fetching
- Ant Design patterns (custom implementations)
- date-fns for date manipulation
- Radix UI for primitives (@radix-ui/\*)
- Tailwind CSS v4.1.18 + shadcn/ui components

**Build System:**

- Build tool: Vite
- TypeScript compiler: tsc
- Linting: ESLint
- Testing: Vitest

---

## 1. Testing Setup

### Framework

- **Testing Framework:** Vitest
- **Location:** No dedicated test directory yet (tests are minimal)

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run tests with UI
npm test -- --ui
```

### Running a Single Test File

```bash
# Run specific test file
npm test src/App.test.tsx

# Run specific test file with coverage
npm test src/App.test.tsx -- --coverage
```

### Test Configuration

Create `vitest.config.ts` (if needed) at project root:

```typescript
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/setupTests.ts'],
  },
});
```

### Test File Patterns

- Test files should be co-located with source files: `src/App.test.tsx`
- Use `@testing-library/react` for component testing
- Mock API calls in `src/services/` for unit tests
- Test files use `*.test.tsx` or `*.test.ts` extension

---

## 2. Linting Setup

### Linter Configuration

- **Tool:** ESLint 8.57.0
- **Config:** `.eslintrc` at project root
- **Extends:**
  - `eslint:recommended`
  - `plugin:react/recommended`
  - `plugin:react-hooks/recommended`
  - `plugin:@typescript-eslint/recommended`

### Running ESLint

```bash
# Run eslint on all files
npx eslint src

# Run eslint on specific file
npx eslint src/components/form/DateRangePicker.tsx

# Run eslint with auto-fix
npx eslint src --fix

# Check for specific rules
npx eslint src --rule 'react-hooks/rules-of-hooks'
```

### ESLint Rules Configuration

Key rules currently active:

- `react-hooks/rules-of-hooks`: `error` (enforces correct hook usage)
- `react-hooks/exhaustive-deps`: `off` (disabled for flexibility)
- `@typescript-eslint/no-unused-vars`: `warn` (unused variables)
- `react/react-in-jsx-scope`: `off` (React 19 doesn't need React in scope)
- `react/prop-types`: `off` (using TypeScript instead)

---

## 3. Code Style Guidelines

### 3.1 Import Organization

**Order:** Standard imports first, then third-party imports, then local imports

```typescript
// 1. React core imports
import { useState, useEffect, useRef } from 'react';

// 2. Third-party library imports
import { format, isValid } from 'date-fns';
import { DateRange } from 'react-day-picker';

// 3. UI component imports (shadcn/ui, Radix primitives)
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

// 4. Services and hooks
import { useAuth } from '@/hooks';
import { getArticles } from '@/services/BlogServices';

// 5. Types
import type { Article } from '@/types/article';
```

### 3.2 Component Patterns

**Functional Components:** Use functional components with hooks (no class components)

```typescript
export function MyComponent({ prop1, prop2 }: MyComponentProps) {
  const [state, setState] = useState(initialState);

  return <div>{/* JSX */}</div>;
}
```

**ForwardRef:** Use `React.forwardRef` for components that need ref forwarding (common for UI components)

```typescript
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return <button ref={ref} className={...}>{children}</button>
  }
)
Button.displayName = 'Button'
```

**Custom Hooks:** Extract reusable logic into custom hooks in `src/hooks/`

```typescript
// Use existing hooks
import { useAuth } from '@/hooks';
import { useCategories } from '@/hooks';
```

### 3.3 State Management

**TanStack Query:** Use for all server state (API calls, data fetching)

```typescript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

// Query keys centralized in src/lib/query-keys.ts
const { data, isLoading, error } = useQuery({
  queryKey: queryKeys.articles.all(),
  queryFn: getArticles,
});
```

**Local State:** Use React hooks for UI state only (modals, inputs, selections)

```typescript
// Good: UI state
const [isOpen, setIsOpen] = useState(false);
const [selectedId, setSelectedId] = useState<string | null>(null);

// Avoid: Data that should be in React Query
// Don't do this:
const [articles, setArticles] = useState([]);
```

### 3.4 TypeScript Guidelines

**Type Safety:**

- Always use TypeScript types (no `any` unless absolutely necessary)
- Use `unknown` instead of `any` where type is uncertain
- Leverage type inference where possible

```typescript
// ❌ Bad
const data: any = response.data;

// ✅ Good
type ApiResponse<T> = {
  success: boolean;
  data: T;
};
const data: ApiResponse<Article[]> = response.data;
```

**Interface vs Type:**

- Use `interface` for object shapes that need properties documented
- Use `type` for unions, function signatures, and simpler types

**Strict Mode:**

- Project uses `strict: true` in `tsconfig.json`
- No implicit `any`
- No implicit `this` in functions

### 3.5 Naming Conventions

**Files:**

- Components: `PascalCase.tsx` (e.g., `DateRangePicker.tsx`)
- Hooks: `usePascalCase.ts` (e.g., `useAuth.ts`)
- Services: `PascalCase.ts` (e.g., `BlogServices.ts`)
- Types: `kebab-case.ts` (e.g., `article.ts`)
- Utilities: `kebab-case.ts` (e.g., `utils.ts`)

**Variables and Functions:**

- Components: `camelCase` (e.g., `handleClick`, `isOpen`)
- Hooks: `usePascalCase` (e.g., `useAuth`, `useArticleList`)
- Constants: `UPPER_SNAKE_CASE` (e.g., `API_BASE_URL`)

**Event Handlers:**

- Prefix with `handle` (e.g., `handleClick`, `handleSubmit`, `handleChange`)
- Use descriptive names (e.g., `handleDateSelect` not `handleDate`)

### 3.6 Styling Guidelines

**Tailwind CSS:**

- Use utility classes from `tailwindcss` package
- Use `cn()` utility for conditional class merging (from `@/lib/utils`)
- Prefer utility classes over custom CSS

```typescript
import { cn } from '@/lib/utils'

// ✅ Good
<div className={cn("base-class", isActive && "active-class", className)} />

// ❌ Bad
<div className={`base-class ${isActive ? "active-class" : ""} ${className}`} />
```

**Component Variants:**

- Use `class-variance-authority` (cva) for component variants
- See `@/components/ui/button.tsx` for pattern reference

```typescript
const buttonVariants = cva('inline-flex items-center justify-center gap-2', {
  variants: {
    variant: {
      default: 'bg-primary text-primary-foreground',
      outline: 'border border-input',
    },
    size: {
      default: 'h-10 px-4',
      sm: 'h-9 px-3',
    },
  },
});
```

### 3.7 Error Handling

**Async Operations:**

- Always use try-catch for async operations
- Provide meaningful error messages
- Use toast notifications for user-facing errors (see `@/lib/toast.ts`)

```typescript
import { toast } from '@/lib/toast';

// ✅ Good
try {
  await someAsyncOperation();
} catch (error) {
  console.error('Operation failed:', error);
  toast.error('Failed to load data');
}
```

**API Error Boundaries:**

- Use `QueryErrorResetBoundary` for TanStack Query errors
- See `src/components/QueryErrorBoundary.tsx` for implementation

**Input Validation:**

- Validate user inputs before submission
- Show inline error messages
- Disable submit buttons when form is invalid

```typescript
const isValid = value.length > 0
const errorMessage = isValid ? '' : 'This field is required'

<Button disabled={!isValid}>{label}</Button>
{errorMessage && <p className="text-red-500">{errorMessage}</p>}
```

---

## 4. Build Commands

### Available Scripts

```bash
# Development
npm run dev          # Start Vite dev server on http://localhost:3000
npm start           # Alias for npm run dev

# Production Build
npm run build        # TypeScript check + Vite build
                    # Output: build/ directory
                    # Includes sourcemaps

# Preview Build
npm run preview     # Preview production build locally

# Testing
npm test            # Run Vitest test suite
```

### Build Configuration

**Vite Config:** `vite.config.ts`

- React plugin with React Compiler (`babel-plugin-react-compiler`)
- Path alias: `@/` → `./src/`
- Dev server port: 3000

**TypeScript Config:** `tsconfig.json`

- Target: ES2020
- Strict mode enabled
- Path aliases: `@/*` → `src/*`
- Skip lib check for browser compatibility

---

## 5. File and Directory Structure

### Recommended Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # shadcn/ui primitives (Button, Input, etc.)
│   └── form/           # Complex form components (DateRangePicker, CascaderSelect, etc.)
├── pages/              # Page-level components (ArticleListManage, Login, etc.)
├── hooks/              # Custom React hooks (useAuth, useArticleList, etc.)
├── services/            # API service layer (BlogServices, AdminServices)
├── lib/                # Utilities and configurations (utils, toast, query-keys, etc.)
├── types/              # TypeScript type definitions (article, category, common, etc.)
└── index.tsx           # Application entry point
```

### When Creating New Components

1. **UI Primitives:** Place in `src/components/ui/` if it's a general-purpose component
2. **Complex Components:** Place in `src/components/form/` or appropriate subdirectory
3. **Pages:** Place in `src/pages/` for page-level components
4. **Hooks:** Place in `src/hooks/` for custom hooks
5. **Types:** Place in `src/types/` with descriptive filenames

---

## 6. Common Patterns

### 6.1 Service Layer Pattern

Services in `src/services/` handle API calls:

```typescript
// BlogServices.ts - Public API
export const getArticles = async (params?: ArticleFilters) => { ... }
export const getArticleById = async (id: string) => { ... }

// AdminServices.ts - Admin API
export const login = async (credentials: LoginCredentials) => { ... }
export const createArticle = async (article: CreateArticleDto) => { ... }
```

**Request Wrapper:** All API calls use `request.ts` utilities:

```typescript
import { get, post, put, del } from '@/utils/request';

// HTTP methods with error handling and loading states
const response = await get<Article[]>(`/articles`, { params });
```

### 6.2 Modal/Dialog Pattern

Use Radix UI Dialog for modals:

```typescript
import { AlertDialog, AlertDialogContent, AlertDialogTrigger, etc. } from '@/components/ui/alert-dialog'

// Pattern: controlled open state
const [isOpen, setIsOpen] = useState(false)

<AlertDialog open={isOpen} onOpenChange={setIsOpen}>
  <AlertDialogTrigger asChild>
    <Button>Open Dialog</Button>
  </AlertDialogTrigger>
  <AlertDialogContent>
    {/* Dialog content */}
  </AlertDialogContent>
</AlertDialog>
```

### 6.3 Form Pattern

**Validation:** Use react-hook-form for complex forms (already in dependencies)
**Form State:** Manage form state in component or hook
**Submission:** Handle success/error states with appropriate feedback

### 6.4 Data Fetching Pattern

**TanStack Query usage:**

```typescript
import { useQuery, useMutation } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query-keys';

// Query
const { data, isLoading, error } = useQuery({
  queryKey: queryKeys.articles.list(),
  queryFn: getArticles,
  staleTime: 5 * 60 * 1000, // 5 minutes
});

// Mutation
const mutation = useMutation({
  mutationFn: createArticle,
  onSuccess: () => {
    toast.success('Article created successfully');
    queryClient.invalidateQueries({ queryKey: queryKeys.articles.all() });
  },
  onError: (error) => {
    toast.error('Failed to create article');
  },
});
```

### 6.5 Date Handling Pattern

**Library:** Use `date-fns` for all date operations

```typescript
import { format, isValid, parse, addDays, addMonths, startOfDay, endOfDay } from 'date-fns';
```

**Date Formats:** Follow common ISO formats or use library-provided formats

```typescript
// ✅ Good
format(date, 'yyyy-MM-dd');
parse(dateString, 'yyyy-MM-dd', new Date());

// ❌ Bad
date.toISOString(); // Always use consistent format
```

---

## 7. Common Pitfalls to Avoid

### DO NOT:

- ❌ Suppress TypeScript errors with `@ts-ignore`, `@ts-expect-error`, `as any` (use proper types)
- ❌ Use `any` type when a specific type can be defined
- ❌ Mix concerns in single functions (keep functions pure)
- ❌ Make large components (>500 lines) - split into smaller components
- ❌ Hardcode values that should be configuration (API URLs, constants)
- ❌ Delete or skip tests instead of fixing failing tests
- ❌ Commit changes without proper testing (at minimum build + eslint check)

### DO:

- ✅ Use existing hooks and services instead of duplicating logic
- ✅ Follow existing component patterns and styling
- ✅ Write tests for new functionality
- ✅ Handle all error cases gracefully
- ✅ Provide loading states for async operations
- ✅ Use TypeScript interfaces for prop types
- ✅ Extract magic numbers/strings into named constants
- ✅ Keep component functions focused on a single responsibility

---

## 8. Git Workflow

### Commit Message Style

Use conventional commit messages:

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types:**

- `feat`: New feature
- `fix`: Bug fix
- `refactor`: Code refactoring
- `style`: Styling changes
- `test`: Test changes
- `docs`: Documentation
- `chore`: Maintenance tasks

**Examples:**

```
feat(date-picker): add cellRender prop support for custom cell rendering
fix(auth): resolve undefined user error on login screen
refactor(forms): extract validation logic into useValidation hook
style(button): fix hover state on small variant
test(api): add unit tests for getArticles service
docs(readme): update setup instructions
```

### Before Committing

1. Run TypeScript check: `npm run build` (includes `tsc`)
2. Run ESLint: `npx eslint src`
3. Run tests: `npm test`
4. Verify no errors or warnings remain

---

## 9. React Specific Guidelines

### React 19 Specifics

**No Need for React Import:**

- In React 19, you don't need to import React to use JSX
- Do NOT add `import React from 'react'` unless using React APIs directly

```typescript
// ❌ React 18 and below
import React from 'react';

// ✅ React 19
// No import needed - use JSX directly
```

**use() Hook:**

- Use `React.use()` for external refs and component instances

```typescript
const inputRef = React.useRef<HTMLInputElement>(null);
```

---

## 10. Dependencies and Package Management

### Adding Dependencies

Only add dependencies when absolutely necessary. Check if:

1. Can functionality be built with existing dependencies?
2. Is this a commonly-used, well-maintained library?
3. Will this significantly increase bundle size?

```bash
# Always install with exact version
npm install package-name@^1.0.0 --save-exact

# For dev dependencies
npm install --save-dev package-name
```

### Peer Dependencies

The project uses:

- React 19.x
- React DOM 19.x
- TypeScript 5.3.x

Ensure compatible versions when adding new packages.

---

## 11. Accessibility Guidelines

### ARIA Attributes

- Always include meaningful `aria-label` for interactive elements
- Use `aria-describedby` for form fields with error messages
- Use `role` attributes where appropriate

```typescript
<button aria-label="Close dialog">Close</button>
<input aria-label="Start date" aria-describedby="start-date-error" />
```

### Keyboard Navigation

- Ensure forms can be submitted with Enter key
- Support Escape key for modals and dropdowns
- Manage focus properly when dialogs open/close

---

## 12. Performance Guidelines

### React Performance

- **Memoization:** Use `React.memo()` for expensive component renders
- **Callback Stability:** Wrap callbacks in `useCallback()` when dependencies are stable
- **Value Computation:** Use `useMemo()` for expensive calculations

```typescript
import { useMemo, useCallback } from 'react';

const memoizedValue = useMemo(() => {
  return computeExpensiveValue(a, b, c);
}, [a, b, c]);

const memoizedCallback = useCallback(() => {
  // callback logic
}, [dependency1, dependency2]);
```

### Code Splitting

- Use dynamic imports with `React.lazy()` for large page components
- Use `Suspense` for loading states
- Already implemented in `src/App.tsx`

---

## 13. Summary Checklist

Before submitting code changes, verify:

- [ ] TypeScript compiles without errors (`npm run build`)
- [ ] ESLint shows no errors or warnings (`npx eslint src`)
- [ ] Tests pass (`npm test`)
- [ ] Component follows project patterns
- [ ] Proper error handling is in place
- [ ] Accessibility is considered
- [ ] Code is properly formatted (if Prettier is configured)
- [ ] No console.log statements remain in production code
- [ ] Only necessary dependencies are added/updated

---

## Last Updated

**Date:** 2026-01-23

**For questions or clarifications, please create an issue or contact the repository maintainers.**
