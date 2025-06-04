# Component Guide

This project uses React with shadcn-ui components. Below are a few key components.

## Prompt Components
- **PromptCard** (`src/components/prompts/PromptCard.tsx`)
  Displays a summary of a prompt with title, description and tags.
- **PromptForm** (`src/components/prompts/PromptForm.tsx`)
  Used for creating and editing prompts. Implements validation with `react-hook-form`.
- **PromptFilters** (`src/components/prompts/PromptFilters.tsx`)
  UI controls for filtering prompts by interface, domain and tags.

## Tool Components
- **ToolCard** (`src/components/tools/ToolCard.tsx`)
  Shows details for a single tool such as category and complexity.
- **ToolsHeader** (`src/components/tools/ToolsHeader.tsx`)
  Search and view controls for the Tools page.

## Dashboard
- **StatsCard** (`src/components/dashboard/StatsCard.tsx`)
  Displays summary statistics for prompts, tools, MCP components and articles.

Additional layout and UI primitives live under `src/components/ui/`.
