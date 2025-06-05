import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, X } from 'lucide-react';
import { getTools, Tool } from '@/api/tools';
import { createWorkflow } from '@/api/workflows';

const WorkflowBuilder: React.FC = () => {
  const navigate = useNavigate();
  const [tools, setTools] = useState<Tool[]>([]);
  const [workflow, setWorkflow] = useState<Tool[]>([]);
  const [name, setName] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadTools();
  }, []);

  const loadTools = async () => {
    try {
      const data = await getTools();
      setTools(data);
    } catch (err) {
      console.error('Failed to load tools', err);
    }
  };

  const addTool = (tool: Tool) => {
    if (!workflow.find(t => t.id === tool.id)) {
      setWorkflow([...workflow, tool]);
    }
  };

  const removeTool = (toolId: string) => {
    setWorkflow(workflow.filter(t => t.id !== toolId));
  };

  const handleSave = async () => {
    if (!name || workflow.length === 0) return;
    setSaving(true);
    try {
      await createWorkflow({ name, tool_ids: workflow.map(t => t.id) });
      navigate('/mcp');
    } catch (err) {
      console.error('Failed to save workflow', err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="heading-2">Create Workflow</h1>
      <Card>
        <CardHeader>
          <CardTitle>Select Tools</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {tools.map(tool => (
            <Button key={tool.id} variant="outline" className="w-full justify-start" onClick={() => addTool(tool)}>
              {tool.title}
            </Button>
          ))}
        </CardContent>
      </Card>

      {workflow.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Workflow</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4">
              {workflow.map((tool, idx) => (
                <div key={tool.id} className="flex items-center gap-2">
                  <Button variant="secondary" className="flex-1 justify-start" onClick={() => removeTool(tool.id)}>
                    {tool.title}
                    <X className="ml-2 h-4 w-4" />
                  </Button>
                  {idx < workflow.length - 1 && <ArrowRight className="h-4 w-4" />}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="flex gap-2">
        <input
          className="border rounded-md px-2 py-1 flex-1"
          placeholder="Workflow name"
          value={name}
          onChange={e => setName(e.target.value)}
        />
        <Button onClick={handleSave} disabled={saving || !name || workflow.length === 0}>
          {saving ? 'Saving...' : 'Save'}
        </Button>
      </div>
    </div>
  );
};

export default WorkflowBuilder;
