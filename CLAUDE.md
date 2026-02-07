# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Blog Admin is a React 19 + TypeScript admin panel for managing blog articles and categories. It uses Vite as the build tool, Ant Design for UI components, and TanStack Query for data fetching.

## Development Commands

- `npm run dev` or `npm start` - Start development server on http://localhost:3000
- `npm run build` - Build for production (runs TypeScript compiler then Vite build)
- `npm test` - Run tests with Vitest
- `npm run preview` - Preview production build locally
- `pnpm` - package manager

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
- **TanStack Query v5** for server state with best practices
- **Query Keys Factory**: Centralized in `src/lib/query-keys.ts` for type-safe query management
- **QueryClient**: Configured in `src/lib/query-client.ts` with optimized defaults (5min staleTime, gcTime, etc.)
- **DevTools**: React Query DevTools integrated for debugging (bottom-right corner)
- **Error Boundaries**: QueryErrorResetBoundary integrated for error recovery
- Custom hooks in `src/hooks/`:
  - `useAuth.ts` - Login/logout mutations with cache clearing
  - `useArticleList.ts` - Article list queries with optimistic updates
  - `useCategories.ts` - Category queries with add/delete mutations
  - `useArticleEdit.ts` - Article editing state and publish mutation

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

## TDD Development Rules

### 自动更新规则 📝
**⚠️ 强制要求**: 每次完成 TDD 开发后，必须自动更新 `TDD_PROGRESS_REPORT.md` 文件

#### 触发条件
完成以下任一 TDD 任务后，必须更新进度报告：
- ✅ 修复 Bug（遵循 RED → GREEN → REFACTOR 流程）
- ✅ 实现新功能（先写测试，再写实现）
- ✅ 重构代码（测试保护下的重构）
- ✅ 修复失败测试

#### 更新内容模板
```markdown
# 🎉 第N次更新：[任务标题] (YYYY-MM-DD)

**阶段**: [当前阶段] - [完成度]
**测试通过率**: [测试数]/[总数] ([百分比]%)

## 本次修复/新增内容

### 问题描述
- [问题类型]: Bug/新功能/重构
- [影响范围]: [相关模块]

### 解决方案
- ✅ [解决方案1]
- ✅ [解决方案2]

### 测试结果
```
✓ [测试文件路径] ([测试数] passed)
✓ All tests ([总数] passed)
```

### 修改清单
1. `[文件路径1]` - [修改说明]
2. `[文件路径2]` - [修改说明]

### TDD 流程遵循
- 🔴 RED: [描述测试失败阶段]
- 🟢 GREEN: [描述修复阶段]
- ✅ 验证: [描述验证阶段]

---

*将此内容插入到 TDD_PROGRESS_REPORT.md 的最前面，作为第N次更新*
```

#### 更新位置
将新内容添加到 `TDD_PROGRESS_REPORT.md` 文件的**最顶部**，作为最新的更新记录

#### 更新格式
- 使用清晰的标题和章节结构
- 包含测试结果统计
- 列出修改的文件清单
- 标注 TDD 流程遵循情况
- 使用表情符号增强可读性

#### 验证要求
更新完成后，必须验证：
- ✅ 测试套件全部通过
- ✅ 无 TypeScript 类型错误
- ✅ 报告格式符合模板
- ✅ 数据准确无误

#### 示例参考
参考 `TDD_PROGRESS_REPORT.md` 中的历史更新记录
