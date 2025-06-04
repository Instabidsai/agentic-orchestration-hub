import { supabase } from '@/integrations/supabase/client';
import {
  Tables,
  TablesInsert,
  TablesUpdate,
  Enums
} from '@/integrations/supabase/types';

async function getCurrentUserId() {
  const { data } = await supabase.auth.getUser();
  return data.user?.id || null;
}

// Define detailed types that match our database schema
export type Prompt = Tables<'prompts'> & {
  interfaces: Enums<'ai_interface'>[];
  domains: Enums<'prompt_domain'>[];
  tags: string[];
};

export type PromptInsert = TablesInsert<'prompts'> & {
  interfaces: Enums<'ai_interface'>[];
  domains: Enums<'prompt_domain'>[];
  tags: string[];
  change_notes?: string; // For version history
};

export type PromptUpdate = TablesUpdate<'prompts'> & {
  interfaces?: Enums<'ai_interface'>[];
  domains?: Enums<'prompt_domain'>[];
  tags?: string[];
  change_notes?: string; // For version history
};

export type PromptFilters = {
  search?: string;
  types?: Enums<'prompt_type'>[];
  status?: Enums<'prompt_status'>[];
  interfaces?: Enums<'ai_interface'>[];
  domains?: Enums<'prompt_domain'>[];
  tags?: string[];
  createdBy?: string;
  onlyFavorites?: boolean;
  page?: number;
  pageSize?: number;
};

export type PromptSearchResult = {
  prompts: Prompt[];
  totalCount: number;
};

/**
 * Fetch prompts with filtering and pagination
 */
export async function searchPrompts(filters: PromptFilters = {}): Promise<PromptSearchResult> {
  const {
    search,
    types,
    status,
    interfaces,
    domains,
    tags,
    createdBy,
    onlyFavorites = false,
    page = 0,
    pageSize = 20
  } = filters;

  let query = supabase
    .from('prompts')
    .select(
      `*,
      prompt_interfaces!left(interface),
      prompt_domains!left(domain),
      prompt_tags!left(tag_id(id,name))`,
      { count: 'exact' }
    );

  if (search) {
    const like = `%${search}%`;
    query = query.or(`title.ilike.${like},description.ilike.${like}`);
  }

  if (types && types.length > 0) {
    query = query.in('type', types);
  }

  if (status && status.length > 0) {
    query = query.in('status', status);
  }

  if (createdBy) {
    query = query.eq('created_by', createdBy);
  }

  if (onlyFavorites) {
    query = query.eq('is_favorite', true);
  }

  if (interfaces && interfaces.length > 0) {
    query = query.in('prompt_interfaces.interface', interfaces);
  }

  if (domains && domains.length > 0) {
    query = query.in('prompt_domains.domain', domains);
  }

  if (tags && tags.length > 0) {
    const { data: tagRows, error: tagErr } = await supabase
      .from('tags')
      .select('id')
      .in('name', tags);
    if (tagErr) throw tagErr;
    const tagIds = tagRows?.map(t => t.id) || [];
    if (tagIds.length > 0) {
      query = query.in('prompt_tags.tag_id', tagIds);
    } else {
      return { prompts: [], totalCount: 0 };
    }
  }

  query = query
    .order('updated_at', { ascending: false })
    .range(page * pageSize, (page + 1) * pageSize - 1);

  const { data, error, count } = await query;
  if (error) {
    console.error('Error fetching prompts:', error);
    throw error;
  }

  const prompts: Prompt[] = (data || []).map(item => ({
    ...item,
    interfaces: item.prompt_interfaces.map(i => i.interface),
    domains: item.prompt_domains.map(d => d.domain),
    tags: item.prompt_tags.map(t => t.tag_id.name)
  }));

  return {
    prompts,
    totalCount: count || 0
  };
}

/**
 * Get a single prompt by ID
 */
export async function getPromptById(id: string): Promise<Prompt | null> {
  const { data, error } = await supabase
    .from('prompts')
    .select(`
      *,
      prompt_interfaces (interface),
      prompt_domains (domain),
      prompt_tags (tags:tag_id (id, name))
    `)
    .eq('id', id)
    .single();

  if (error) {
    console.error(`Error fetching prompt with ID ${id}:`, error);
    return null;
  }

  // Transform to match our Prompt interface
  const prompt: Prompt = {
    ...data,
    interfaces: data.prompt_interfaces.map(i => i.interface),
    domains: data.prompt_domains.map(d => d.domain),
    tags: data.prompt_tags.map(t => t.tags.name)
  };

  return prompt;
}

/**
 * Create a new prompt with all its relationships
 */
export async function createPrompt(prompt: PromptInsert): Promise<Prompt | null> {
  // Start a transaction (simplified, but will run operations in sequence)

  // 1. Insert main prompt record
  const userId = await getCurrentUserId();
  const { data: newPrompt, error: promptError } = await supabase
    .from('prompts')
    .insert({
      title: prompt.title,
      description: prompt.description,
      content: prompt.content,
      type: prompt.type,
      status: prompt.status || 'DRAFT',
      created_by: prompt.created_by || userId,
      is_favorite: prompt.is_favorite || false,
      use_count: 0
    })
    .select()
    .single();

  if (promptError || !newPrompt) {
    console.error('Error creating prompt:', promptError);
    return null;
  }

  // 2. Add interfaces
  const interfaceInserts = prompt.interfaces.map(interface_type => ({
    prompt_id: newPrompt.id,
    interface: interface_type
  }));

  const { error: interfacesError } = await supabase
    .from('prompt_interfaces')
    .insert(interfaceInserts);

  if (interfacesError) {
    console.error('Error adding interfaces:', interfacesError);
    // In a real application, we would roll back the transaction
  }

  // 3. Add domains
  const domainInserts = prompt.domains.map(domain => ({
    prompt_id: newPrompt.id,
    domain
  }));

  const { error: domainsError } = await supabase
    .from('prompt_domains')
    .insert(domainInserts);

  if (domainsError) {
    console.error('Error adding domains:', domainsError);
  }

  // 4. Handle tags
  for (const tagName of prompt.tags) {
    // Check if tag exists
    const { data: existingTag } = await supabase
      .from('tags')
      .select('id')
      .eq('name', tagName)
      .single();

    let tagId: string;
    
    if (!existingTag) {
      // Create the tag if it doesn't exist
      const { data: newTag, error: tagError } = await supabase
        .from('tags')
        .insert({ name: tagName })
        .select()
        .single();

      if (tagError || !newTag) {
        console.error('Error creating tag:', tagError);
        continue;
      }
      
      tagId = newTag.id;
    } else {
      tagId = existingTag.id;
    }
    
    // Create the tag association
    await supabase
      .from('prompt_tags')
      .insert({
        prompt_id: newPrompt.id,
        tag_id: tagId
      });
  }

  // 5. Create an initial version record
  await supabase
    .from('prompt_versions')
    .insert({
      prompt_id: newPrompt.id,
      version: 1,
      content: prompt.content,
      change_notes: prompt.change_notes || 'Initial version',
      changed_by: prompt.created_by || userId
    });

  // Fetch the complete prompt with all relationships
  return getPromptById(newPrompt.id);
}

/**
 * Update an existing prompt
 */
export async function updatePrompt(id: string, updates: PromptUpdate): Promise<Prompt | null> {
  // Prepare update object for the main prompt record
  const promptUpdates: TablesUpdate<'prompts'> = {
    title: updates.title,
    description: updates.description,
    content: updates.content,
    status: updates.status,
    updated_at: new Date().toISOString(),
    is_favorite: updates.is_favorite
  };

  // Remove undefined values
  Object.keys(promptUpdates).forEach(key => {
    if (promptUpdates[key as keyof typeof promptUpdates] === undefined) {
      delete promptUpdates[key as keyof typeof promptUpdates];
    }
  });

  // 1. Update the main prompt record
  const { error: promptError } = await supabase
    .from('prompts')
    .update(promptUpdates)
    .eq('id', id);

  if (promptError) {
    console.error(`Error updating prompt with ID ${id}:`, promptError);
    return null;
  }

  // 2. If content was updated, create a new version
  if (updates.content) {
    // Get the current version number
    const { data: versionData } = await supabase
      .from('prompt_versions')
      .select('version')
      .eq('prompt_id', id)
      .order('version', { ascending: false })
      .limit(1)
      .single();

    const newVersion = versionData ? versionData.version + 1 : 1;

    // Create a new version record
    const userId = await getCurrentUserId();
    await supabase
      .from('prompt_versions')
      .insert({
        prompt_id: id,
        version: newVersion,
        content: updates.content,
        change_notes: updates.change_notes || 'Updated prompt content',
        changed_by: updates.changed_by || userId
      });

    // Update the version in the main prompt record
    await supabase
      .from('prompts')
      .update({ version: newVersion })
      .eq('id', id);
  }

  // 3. Update interfaces if provided
  if (updates.interfaces && updates.interfaces.length > 0) {
    // Delete existing interfaces
    await supabase
      .from('prompt_interfaces')
      .delete()
      .eq('prompt_id', id);

    // Add new interfaces
    const interfaceInserts = updates.interfaces.map(interface_type => ({
      prompt_id: id,
      interface: interface_type
    }));

    await supabase
      .from('prompt_interfaces')
      .insert(interfaceInserts);
  }

  // 4. Update domains if provided
  if (updates.domains && updates.domains.length > 0) {
    // Delete existing domains
    await supabase
      .from('prompt_domains')
      .delete()
      .eq('prompt_id', id);

    // Add new domains
    const domainInserts = updates.domains.map(domain => ({
      prompt_id: id,
      domain
    }));

    await supabase
      .from('prompt_domains')
      .insert(domainInserts);
  }

  // 5. Update tags if provided
  if (updates.tags && updates.tags.length > 0) {
    // Delete existing tag associations
    await supabase
      .from('prompt_tags')
      .delete()
      .eq('prompt_id', id);

    for (const tagName of updates.tags) {
      // Check if tag exists
      const { data: existingTag } = await supabase
        .from('tags')
        .select('id')
        .eq('name', tagName)
        .single();

      let tagId: string;
      
      if (!existingTag) {
        // Create the tag if it doesn't exist
        const { data: newTag, error: tagError } = await supabase
          .from('tags')
          .insert({ name: tagName })
          .select()
          .single();

        if (tagError || !newTag) {
          console.error('Error creating tag:', tagError);
          continue;
        }
        
        tagId = newTag.id;
      } else {
        tagId = existingTag.id;
      }
      
      // Create the tag association
      await supabase
        .from('prompt_tags')
        .insert({
          prompt_id: id,
          tag_id: tagId
        });
    }
  }

  // Fetch the updated prompt with all relationships
  return getPromptById(id);
}

/**
 * Toggle favorite status
 */
export async function toggleFavorite(id: string, isFavorite: boolean): Promise<void> {
  const { error } = await supabase
    .from('prompts')
    .update({ is_favorite: isFavorite })
    .eq('id', id);

  if (error) {
    console.error(`Error toggling favorite status for prompt ${id}:`, error);
    throw error;
  }
}

/**
 * Record prompt usage
 */
export async function recordPromptUsage(
  promptId: string, 
  version: number, 
  userId?: string,
  context?: any,
  result?: string
): Promise<void> {
  // 1. Record the usage
  const { error: usageError } = await supabase
    .from('prompt_usage')
    .insert({
      prompt_id: promptId,
      version: version,
      user_id: userId,
      context: context || null,
      result: result || null
    });

  if (usageError) {
    console.error('Error recording prompt usage:', usageError);
  }

  // 2. Increment the usage count and update last_used_at
  // Retrieve current usage count
  const { data: promptData, error: fetchError } = await supabase
    .from('prompts')
    .select('use_count')
    .eq('id', promptId)
    .single();

  if (fetchError) {
    console.error('Error fetching prompt usage count:', fetchError);
    return;
  }

  const newCount = (promptData?.use_count || 0) + 1;

  const { error: countError } = await supabase
    .from('prompts')
    .update({
      use_count: newCount,
      last_used_at: new Date().toISOString()
    })
    .eq('id', promptId);

  if (countError) {
    console.error('Error incrementing usage count:', countError);
  }
}

/**
 * Delete a prompt
 */
export async function deletePrompt(id: string): Promise<void> {
  const { error } = await supabase
    .from('prompts')
    .delete()
    .eq('id', id);

  if (error) {
    console.error(`Error deleting prompt ${id}:`, error);
    throw error;
  }
}

/**
 * Get available filters for prompts
 */
export async function getPromptFilters() {
  console.log('Fetching available prompt filters');
  // Get all used interfaces
  const { data: interfaces, error: interfacesError } = await supabase
    .from('prompt_interfaces')
    .select('interface')
    .distinct();

  if (interfacesError) {
    console.error('Error fetching interfaces:', interfacesError);
    throw interfacesError;
  }

  // Get all used domains
  const { data: domains, error: domainsError } = await supabase
    .from('prompt_domains')
    .select('domain')
    .distinct();

  if (domainsError) {
    console.error('Error fetching domains:', domainsError);
    throw domainsError;
  }

  // Get all tags
  const { data: tags, error: tagsError } = await supabase
    .from('tags')
    .select('id, name');

  if (tagsError) {
    console.error('Error fetching tags:', tagsError);
    throw tagsError;
  }

  const result = {
    interfaces: interfaces?.map(i => i.interface) || [],
    domains: domains?.map(d => d.domain) || [],
    tags: tags || []
  };
  
  console.log('Available filters:', {
    interfaces: result.interfaces,
    domains: result.domains,
    tagCount: result.tags.length
  });
  
  return result;
}

/**
 * Get prompt version history
 */
export async function getPromptVersions(promptId: string) {
  const { data, error } = await supabase
    .from('prompt_versions')
    .select('*')
    .eq('prompt_id', promptId)
    .order('version', { ascending: false });

  if (error) {
    console.error(`Error fetching versions for prompt ${promptId}:`, error);
    throw error;
  }

  return data || [];
}

/**
 * Find related prompts
 */
export async function getRelatedPrompts(promptId: string) {
  // Get prompts that are sources to this prompt
  const { data: sourcesData, error: sourcesError } = await supabase
    .from('prompt_relations')
    .select(`
      id,

      relation_type,
      prompts:source_prompt_id (
        id,
        title,
        description,
        type,
        status
      )`
    )
    .eq('target_prompt_id', promptId);

  if (sourcesError) {
    console.error(`Error fetching source relations for prompt ${promptId}:`, sourcesError);
    throw sourcesError;
  }

  // Get prompts that this prompt targets
  const { data: targetsData, error: targetsError } = await supabase
    .from('prompt_relations')
    .select(
      `id,
      relation_type,
      prompts:target_prompt_id (
        id,
        title,
        description,
        type,
        status
      )`
    )
    .eq('source_prompt_id', promptId);

  if (targetsError) {
    console.error(`Error fetching target relations for prompt ${promptId}:`, targetsError);
    throw targetsError;
  }

  return {
    sources: (sourcesData || []).map(r => ({
      id: r.id,
      relation_type: r.relation_type,
      prompt: r.prompts
    })),
    targets: (targetsData || []).map(r => ({
      id: r.id,
      relation_type: r.relation_type,
      prompt: r.prompts
    }))
  };
}

/**
 * Create a relation between two prompts
 */
export async function addPromptRelation(
  sourceId: string,
  targetId: string,
  relationType: Enums<'relation_type'>
): Promise<void> {
  const { error } = await supabase.from('prompt_relations').insert({
    source_prompt_id: sourceId,
    target_prompt_id: targetId,
    relation_type: relationType
  });
  if (error) {
    console.error('Error creating prompt relation:', error);
    throw error;
  }
}

/**

 * Delete a prompt relation by id
 */
export async function deletePromptRelation(id: string): Promise<void> {
  const { error } = await supabase.from('prompt_relations').delete().eq('id', id);

  if (error) {
    console.error('Error deleting prompt relation:', error);
    throw error;
  }
}
