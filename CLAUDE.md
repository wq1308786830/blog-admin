# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Blog Admin is a React 19 + TypeScript admin panel for managing blog articles and categories. It uses Vite as the build tool, Ant Design for UI components, and TanStack Query for data fetching.

## Development Commands

- `npm run dev` or `npm start` - Start development server on http://localhost:3000
- `npm run build` - Build for production (runs TypeScript compiler then Vite build)
- `npm test` - Run tests with Vitest
- `npm run preview` - Preview production build locally

## Architecture

### Build Configuration
- **Build tool**: Vite (replaced CRA)
- **Path alias**: `@/*` maps to `src/*` (configured in both vite.config.ts and tsconfig.json)
- **React Compiler**: Enabled via babel-plugin-react-compiler
- **Build output**: `build/` directory with sourcemaps enabled

### API Layer
All API calls go through a centralized HTTP layer in `src/utils/request.ts`:
- **GET/POST/PUT/DELETE** helper functions wrap axios
- Base URL configured in `src/helpers/config.ts` (points to vercel.app proxy)
- Request/response interceptors handle global errors
- Loading states managed through utility functions

**Service modules** (`src/services/`):
- `BlogServices.ts` - Public blog APIs (categories, articles, recommendations)
- `AdminServices.ts` - Admin APIs (login, article management, category management)

**Important**: All API responses follow the `ApiResponse<T>` type structure with a `success` flag and `data` field.

### Routing & Authentication
- **Router**: React Router v6 with `createBrowserRouter`
- **Auth check**: Simple localStorage-based (`user` key) in `App.tsx:24-30`
- **Protected routes**: Main layout at `/` with nested children (articleListManage, articleEdit, categoryManage)
- **Login page**: `/login`
- Route structure uses lazy loading with Suspense

### State Management
- **TanStack Query** (React Query) for server state
- Custom hooks in `src/hooks/`:
  - `useAuth.ts` - Login/logout mutations
  - `useArticleList.ts` - Article list queries
  - `useCategories.ts` - Category queries

### UI Components
- **Ant Design** v5 with custom theme (`colorPrimary: #00b96b`)
- **Layout**: Admin dashboard with collapsible sidebar (Main/index.tsx)
- **Rich text editors**: Draft.js + react-draft-wysiwyg for HTML, Monaco Editor for Markdown

### Data Types
TypeScript types defined in `src/types/`:
- `article.ts` - Article, ArticleFilters, CreateArticleDto
- `category.ts` - Category types
- `common.ts` - ApiResponse wrapper

### Key Implementation Details

**Article Editor** (`src/pages/ArticleEdit`):
- Supports both Markdown (Monaco) and HTML (Draft.js) formats
- Category selection for article classification
- Handles both create and update via URL params (`/articleEdit/:categoryId/:articleId`)

**Category Management** (`src/pages/CategoryManage`):
- Hierarchical category structure (fatherId, level)
- Modal-based add/edit interface

**Article List** (`src/pages/ArticleListManage`):
- Filterable by category, date range, and text search
- Paginated list view

## Configuration Files
- `vite.config.ts` - Vite bundler config with React Compiler plugin
- `tsconfig.json` - Strict TypeScript enabled with path aliases
- ESLint: Airbnb config + TypeScript rules + Prettier

## API Proxy
All API requests proxy through `https://blog-proxy-nine.vercel.app` regardless of environment (dev/prod/test).
