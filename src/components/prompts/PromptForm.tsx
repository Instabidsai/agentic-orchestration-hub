import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  Card, 
  CardContent, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from '@/components/ui/form';
import { X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { createPrompt, getPromptById, updatePrompt, PromptInsert, PromptUpdate } from '@/api/prompts';
import { Constants } from '@/integrations/supabase/types';
import { useForm } from 'react-hook-form';

interface PromptFormValues {
  title: string;
  description: string;
  content: string;
  type: string;
  status: string;
  interfaces: string[];
  domains: string[];
  tags: string[];
  change_notes?: string;
}

const PromptForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{id: string}>();
  const [loading, setLoading] = useState(false);
  const [newTag, setNewTag] = useState('');
  const isEditMode = !!id;

  const form = useForm<PromptFormValues>({
    defaultValues: {
      title: '',
      description: '',
      content: '',
      type: 'FUNCTIONAL',
      status: 'DRAFT',
      interfaces: ['CLAUDE'],
      domains: ['GENERAL'],
      tags: [],
      change_notes: ''
    }
  });

  useEffect(() => {
    if (isEditMode) {
      fetchPrompt();
    }
  }, [id]);

  const fetchPrompt = async () => {
    try {
      setLoading(true);
      const prompt = await getPromptById(id as string);
      if (prompt) {
        form.reset({
          title: prompt.title,
          description: prompt.description || '',
          content: prompt.content,
          type: prompt.type,
          status: prompt.status,
          interfaces: prompt.interfaces,
          domains: prompt.domains,
          tags: prompt.tags,
          change_notes: ''
        });
      } else {
        toast.error('Prompt not found');
        navigate('/prompts');
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching prompt:', error);
      setLoading(false);
      toast.error('Failed to load prompt');
    }
  };

  const onSubmit = async (values: PromptFormValues) => {
    try {
      setLoading(true);
      
      if (isEditMode) {
        // Update existing prompt
        const promptUpdate: PromptUpdate = {
          ...values,
          // Add additional fields for update if needed
        };
        
        await updatePrompt(id as string, promptUpdate);
        toast.success('Prompt updated successfully');
      } else {
        // Create new prompt
        const promptInsert: PromptInsert = {
          ...values,
          created_by: 'current-user-id', // This would be the actual user ID in a real app
        };
        
        await createPrompt(promptInsert);
        toast.success('Prompt created successfully');
      }
      
      navigate('/prompts');
    } catch (error) {
      console.error('Error saving prompt:', error);
      toast.error('Failed to save prompt');
      setLoading(false);
    }
  };

  const handleAddTag = () => {
    if (newTag.trim() && !form.getValues().tags.includes(newTag.trim())) {
      form.setValue('tags', [...form.getValues().tags, newTag.trim()]);
      setNewTag('');
    }
  };

  const handleRemoveTag = (tag: string) => {
    form.setValue('tags', form.getValues().tags.filter(t => t !== tag));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="heading-2">{isEditMode ? 'Edit Prompt' : 'Create New Prompt'}</h1>
      </div>
      
      <Card>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="space-y-4 pt-6">
              <FormField
                control={form.control}
                name="title"
                rules={{ required: 'Title is required' }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter prompt title" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Describe what this prompt does" 
                        {...field} 
                        rows={3}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="content"
                rules={{ required: 'Prompt content is required' }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Prompt Content</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Enter the prompt content" 
                        {...field} 
                        rows={8}
                        className="font-mono"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="type"
                  rules={{ required: 'Type is required' }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Type</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {Constants.public.Enums.prompt_type.map((type) => (
                            <SelectItem key={type} value={type}>
                              {type}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="status"
                  rules={{ required: 'Status is required' }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {Constants.public.Enums.prompt_status.map((status) => (
                            <SelectItem key={status} value={status}>
                              {status}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="interfaces"
                rules={{ required: 'At least one interface is required' }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Compatible Interfaces</FormLabel>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {form.watch('interfaces').map((interface_type) => (
                        <Badge key={interface_type}>
                          {interface_type}
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="h-4 w-4 p-0 ml-1"
                            onClick={() => {
                              const newInterfaces = form.getValues().interfaces
                                .filter((i) => i !== interface_type);
                              form.setValue('interfaces', newInterfaces.length ? newInterfaces : ['CLAUDE']);
                            }}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </Badge>
                      ))}
                    </div>
                    <Select
                      onValueChange={(value) => {
                        if (!form.getValues().interfaces.includes(value)) {
                          form.setValue('interfaces', [...form.getValues().interfaces, value]);
                        }
                      }}
                      value=""
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Add interface" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Constants.public.Enums.ai_interface
                          .filter((i) => !form.watch('interfaces').includes(i))
                          .map((interface_type) => (
                            <SelectItem key={interface_type} value={interface_type}>
                              {interface_type}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="domains"
                rules={{ required: 'At least one domain is required' }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Domains (Use Cases)</FormLabel>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {form.watch('domains').map((domain) => (
                        <Badge key={domain}>
                          {domain.replace('_', ' ')}
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="h-4 w-4 p-0 ml-1"
                            onClick={() => {
                              const newDomains = form.getValues().domains
                                .filter((d) => d !== domain);
                              form.setValue('domains', newDomains.length ? newDomains : ['GENERAL']);
                            }}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </Badge>
                      ))}
                    </div>
                    <Select
                      onValueChange={(value) => {
                        if (!form.getValues().domains.includes(value)) {
                          form.setValue('domains', [...form.getValues().domains, value]);
                        }
                      }}
                      value=""
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Add domain" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Constants.public.Enums.prompt_domain
                          .filter((d) => !form.watch('domains').includes(d))
                          .map((domain) => (
                            <SelectItem key={domain} value={domain}>
                              {domain.replace('_', ' ')}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="tags"
                render={() => (
                  <FormItem>
                    <FormLabel>Tags</FormLabel>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {form.watch('tags').map((tag) => (
                        <Badge key={tag} variant="secondary">
                          {tag}
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="h-4 w-4 p-0 ml-1"
                            onClick={() => handleRemoveTag(tag)}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </Badge>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <Input
                        placeholder="Add tag"
                        value={newTag}
                        onChange={(e) => setNewTag(e.target.value)}
                        onKeyDown={handleKeyDown}
                      />
                      <Button
                        type="button"
                        onClick={handleAddTag}
                        variant="outline"
                      >
                        Add
                      </Button>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {isEditMode && (
                <FormField
                  control={form.control}
                  name="change_notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Change Notes</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Describe the changes you made to this prompt" 
                          {...field} 
                          rows={2}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/prompts')}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? (
                  <>
                    <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full mr-2"></div>
                    {isEditMode ? 'Updating...' : 'Creating...'}
                  </>
                ) : (
                  <>{isEditMode ? 'Update Prompt' : 'Create Prompt'}</>
                )}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  );
};

export default PromptForm;
