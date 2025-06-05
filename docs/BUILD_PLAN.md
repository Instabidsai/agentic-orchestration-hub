# Build Plan

This document summarizes the current state of the codebase and outlines tasks for agents to implement full functionality. Each task can be taken on by a different agent.

## Repository Overview

The project is a React/TypeScript application that manages prompts and tools for an AI engineering hub. The API layer (e.g. `src/api/prompts.ts`) defines types and CRUD operations using Supabase. The UI includes pages for prompts, tools and a workflow builder.

## Suggested Improvements

1. **Authentication and user context** ✅
   - Integrate Supabase auth or another provider.
   - Update API calls to include the current user.
   - Add an auth context provider in `src/App.tsx`.

2. **Complete Supabase schema types** ✅
   - Fill out `src/integrations/supabase/types.ts` using generated types.

3. **Improve search and filtering** ✅
   - Move filter logic from the client to SQL-level queries.
   - Add pagination controls and a total count query.

4. **Prompt relations UI** ✅
   - Display and manage relations from `getRelatedPrompts` in the UI.

5. **Tool and MCP repositories** ✅
   - Replace mock data with real backend tables.
   - Add creation/edit forms like the prompt form.

6. **Dashboard statistics** ✅
   - Replace hard-coded numbers in `StatsCard` with data from queries.

7. **Workflow builder (MCPRepository)** ✅
   - Implement selecting tools and connecting them visually.
   - Persist the configuration.

8. **Testing and CI** ✅
   - Extend `vitest` coverage to API utilities and React components.
   - Add a GitHub Actions workflow to run tests. ✅

9. **Styling and responsiveness** ✅
   - Audit mobile layout and add dark/light theme support if desired.

10. **Documentation** ✅
   - Expand `README.md` with setup instructions and contribution guidelines.
   - Document components and APIs in this `docs/` directory. ✅

11. **Workflows list** ✅
   - Add a page to view saved workflows from Supabase.
   - Link the new page from the sidebar navigation.

12. **Workflow management** ✅
   - Allow deleting workflows from the Workflows list page.
   - Document the deleteWorkflow API helper.

Agents can pick any of the tasks above and implement them. Be sure to run `npm test` before committing.

