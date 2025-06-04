import { supabase } from '@/integrations/supabase/client';

export interface DashboardStats {
  prompts: number;
  tools: number;
  mcps: number;
  articles: number;
}

export async function getDashboardStats(): Promise<DashboardStats> {
  const [{ count: promptCount }, { count: toolCount }, { count: mcpCount }, { count: articleCount }] = await Promise.all([
    supabase.from('prompts').select('*', { count: 'exact', head: true }),
    supabase.from('tools').select('*', { count: 'exact', head: true }),
    supabase.from('mcp_components').select('*', { count: 'exact', head: true }),
    supabase.from('intelligence_articles').select('*', { count: 'exact', head: true })
  ]);

  return {
    prompts: promptCount ?? 0,
    tools: toolCount ?? 0,
    mcps: mcpCount ?? 0,
    articles: articleCount ?? 0
  };
}
