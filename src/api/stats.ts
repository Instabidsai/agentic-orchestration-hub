import { supabase } from '@/integrations/supabase/client';

export interface DashboardStats {
  prompts: number;
  tools: number;
  mcpComponents: number;
  intelligenceArticles: number;
}

async function getCount(table: string): Promise<number> {
  const { count } = await supabase
    .from(table)
    .select('*', { count: 'exact', head: true });
  return count || 0;
}

export async function getDashboardStats(): Promise<DashboardStats> {
  const [prompts, tools, mcpComponents, intelligenceArticles] = await Promise.all([
    getCount('prompts'),
    getCount('tools'),
    getCount('mcp_components'),
    getCount('intelligence_articles'),
  ]);

  return {
    prompts,
    tools,
    mcpComponents,
    intelligenceArticles,
  };
}
