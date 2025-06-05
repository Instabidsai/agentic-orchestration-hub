import { supabase } from '@/integrations/supabase/client';
import { Tables, TablesInsert, TablesUpdate } from '@/integrations/supabase/types';

export type Tool = Tables<'tools'>;
export type ToolInsert = TablesInsert<'tools'>;
export type ToolUpdate = TablesUpdate<'tools'>;

export async function getTools(): Promise<Tool[]> {
  const { data, error } = await supabase
    .from('tools')
    .select('*')
    .order('updated_at', { ascending: false });
  if (error) {
    console.error('Error fetching tools:', error);
    throw error;
  }
  return data || [];
}

export async function getToolById(id: string): Promise<Tool | null> {
  const { data, error } = await supabase
    .from('tools')
    .select('*')
    .eq('id', id)
    .single();
  if (error) {
    console.error(`Error fetching tool ${id}:`, error);
    return null;
  }
  return data;
}

export async function createTool(tool: ToolInsert): Promise<Tool | null> {
  const { data, error } = await supabase
    .from('tools')
    .insert(tool)
    .select('*')
    .single();
  if (error) {
    console.error('Error creating tool:', error);
    return null;
  }
  return data;
}

export async function updateTool(id: string, updates: ToolUpdate): Promise<Tool | null> {
  const { data, error } = await supabase
    .from('tools')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select('*')
    .single();
  if (error) {
    console.error('Error updating tool:', error);
    return null;
  }
  return data;
}

export async function deleteTool(id: string): Promise<void> {
  const { error } = await supabase.from('tools').delete().eq('id', id);
  if (error) {
    console.error('Error deleting tool:', error);
    throw error;
  }
}
