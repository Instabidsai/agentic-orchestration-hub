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

These helpers return raw Supabase query results and may throw errors on failure.
