# API Overview

This project communicates with Supabase through a small API layer located in `src/api/`.

## Prompts API (`src/api/prompts.ts`)
- `searchPrompts(filters)` – fetch a paginated list of prompts with optional filters.
- `getPromptById(id)` – retrieve a single prompt with its relations.
- `createPrompt(prompt)` – create a new prompt and its related interfaces, domains and tags.
- `updatePrompt(id, updates)` – update an existing prompt.
- `toggleFavorite(id, isFavorite)` – mark a prompt as favorite.
- `recordPromptUsage(promptId, version, userId?, context?, result?)` – log prompt usage.
- `getPromptVersions(id)` – fetch version history for a prompt.
- `getRelatedPrompts(id)` – list sources and targets connected to a prompt.
- `addPromptRelation(sourceId, targetId, type)` – connect two prompts.
- `removePromptRelation(relationId)` – delete a relation.

## Stats API (`src/api/stats.ts`)
- `getDashboardStats()` – returns counts for prompts, tools, MCP components and articles.

## Tools API (`src/api/tools.ts`)
- `getTools()` – list all tools ordered by last update.
- `getToolById(id)` – fetch a single tool record.
- `createTool(tool)` – insert a new tool.
- `updateTool(id, updates)` – update an existing tool.
- `deleteTool(id)` – remove a tool.

## Workflows API (`src/api/workflows.ts`)
- `getWorkflows()` – list saved workflows.
- `getWorkflow(id)` – fetch a single workflow.
- `createWorkflow(workflow)` – insert a new workflow record.
- `updateWorkflow(id, updates)` – modify an existing workflow.

These helpers return raw Supabase query results and may throw errors on failure.
