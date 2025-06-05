import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { createTool, getToolById, updateTool, ToolInsert, ToolUpdate } from '@/api/tools';
import { Constants } from '@/integrations/supabase/types';
import { toast } from 'sonner';

interface ToolFormValues {
  title: string;
  description: string;
  category: string;
  complexity: string;
  integration: string;
  url: string;
}

const ToolForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditMode = !!id;
  const [loading, setLoading] = useState(false);

  const form = useForm<ToolFormValues>({
    defaultValues: {
      title: '',
      description: '',
      category: '',
      complexity: 'BEGINNER',
      integration: '',
      url: ''
    }
  });

  useEffect(() => {
    if (isEditMode) {
      loadTool();
    }
  }, [id]);

  const loadTool = async () => {
    const tool = await getToolById(id as string);
    if (tool) {
      form.reset({
        title: tool.title,
        description: tool.description || '',
        category: tool.category || '',
        complexity: tool.complexity,
        integration: tool.integration || '',
        url: tool.url || ''
      });
    }
  };

  const onSubmit = async (values: ToolFormValues) => {
    try {
      setLoading(true);
      if (isEditMode) {
        const update: ToolUpdate = { ...values };
        await updateTool(id as string, update);
        toast.success('Tool updated');
      } else {
        const insert: ToolInsert = { ...values };
        await createTool(insert);
        toast.success('Tool created');
      }
      navigate('/tools');
    } catch (err) {
      console.error('Error saving tool', err);
      toast.error('Failed to save tool');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="heading-2">{isEditMode ? 'Edit Tool' : 'Add Tool'}</h1>
      <Card>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardHeader>
              <CardTitle>Tool Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
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
                      <Textarea rows={4} {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="complexity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Complexity</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select complexity" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Constants.public.Enums.tool_complexity.map(level => (
                          <SelectItem key={level} value={level}>{level}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="integration"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Integration</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>URL</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => navigate('/tools')}>Cancel</Button>
              <Button type="submit" disabled={loading}>{loading ? 'Saving...' : 'Save'}</Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  );
};

export default ToolForm;
