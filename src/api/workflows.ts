import { supabase } from '@/integrations/supabase/client';
import { Tables, TablesInsert, TablesUpdate } from '@/integrations/supabase/types';

export type Workflow = Tables<'workflows'>;
export type WorkflowInsert = TablesInsert<'workflows'>;
export type WorkflowUpdate = TablesUpdate<'workflows'>;

export async function getWorkflows(): Promise<Workflow[]> {
  const { data, error } = await supabase
    .from('workflows')
    .select('*')
    .order('updated_at', { ascending: false });
  if (error) {
    console.error('Error fetching workflows:', error);
    throw error;
  }
  return data || [];
}

export async function getWorkflow(id: string): Promise<Workflow | null> {
  const { data, error } = await supabase
    .from('workflows')
    .select('*')
    .eq('id', id)
    .single();
  if (error) {
    console.error('Error fetching workflow', error);
    return null;
  }
  return data;
}

export async function createWorkflow(workflow: WorkflowInsert): Promise<Workflow | null> {
  const { data, error } = await supabase
    .from('workflows')
    .insert(workflow)
    .select('*')
    .single();
  if (error) {
    console.error('Error creating workflow', error);
    return null;
  }
  return data;
}

export async function updateWorkflow(id: string, updates: WorkflowUpdate): Promise<Workflow | null> {
  const { data, error } = await supabase
    .from('workflows')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select('*')
    .single();
  if (error) {
    console.error('Error updating workflow', error);
    return null;
  }
  return data;
}

export async function deleteWorkflow(id: string): Promise<void> {
  const { error } = await supabase.from('workflows').delete().eq('id', id);
  if (error) {
    console.error('Error deleting workflow', error);
    throw error;
  }
}

