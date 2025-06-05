import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { getWorkflows, Workflow } from '@/api/workflows';
import { getTools } from '@/api/tools';

const WorkflowsPage: React.FC = () => {
  const navigate = useNavigate();
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [toolsMap, setToolsMap] = useState<Record<string, string>>({});

  useEffect(() => {
    loadWorkflows();
    loadTools();
  }, []);

  const loadWorkflows = async () => {
    try {
      const data = await getWorkflows();
      setWorkflows(data);
    } catch (err) {
      console.error('Failed to load workflows', err);
    }
  };

  const loadTools = async () => {
    try {
      const tools = await getTools();
      const map: Record<string, string> = {};
      tools.forEach(t => {
        map[t.id] = t.title;
      });
      setToolsMap(map);
    } catch (err) {
      console.error('Failed to load tools', err);
    }
  };

  const getToolNames = (ids: string[]) => ids.map(id => toolsMap[id]).filter(Boolean);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="heading-2">Saved Workflows</h1>
        <Button onClick={() => navigate('/mcp/builder')}>Create Workflow</Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {workflows.map(wf => (
          <Card key={wf.id} className="card-hover">
            <CardHeader>
              <CardTitle>{wf.name}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-1 text-sm text-muted-foreground">
              {wf.description && <p>{wf.description}</p>}
              <p className="font-medium">Tools: {getToolNames(wf.tool_ids).join(' -> ')}</p>
            </CardContent>
          </Card>
        ))}
        {workflows.length === 0 && (
          <div className="text-muted-foreground">No workflows found.</div>
        )}
      </div>
    </div>
  );
};

export default WorkflowsPage;
