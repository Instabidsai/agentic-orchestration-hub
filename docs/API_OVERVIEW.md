# API Overview

This project communicates with Supabase using helper functions in `src/api/`.
The primary module is `src/api/prompts.ts` which exposes CRUD utilities for
prompt records. Types are generated from the Supabase schema and imported from
`src/integrations/supabase/types.ts`.

The key exported functions are:

- `searchPrompts(filters)` - fetch a list of prompts with pagination and
  filtering.
- `getPromptById(id)` - retrieve a single prompt including related interfaces,
  domains and tags.
- `createPrompt(prompt)` - create a new prompt and related entities.
- `updatePrompt(id, updates)` - update a prompt and manage relations.
- `toggleFavorite(id, favorite)` - mark a prompt as a favorite.
- `getPromptFilters()` - return lists of interfaces, domains and tags for filter
  UIs.
- `getPromptVersions(id)` - retrieve version history of a prompt.
- `getRelatedPrompts(id)` - fetch relation data for a prompt.
- `addPromptRelation(sourceId, targetId, type)` - create a relation between prompts.
- `deletePromptRelation(id)` - remove a relation.

These utilities are used throughout the React components and hooks to interact
with the backend.
