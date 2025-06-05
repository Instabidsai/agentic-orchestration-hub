
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ToolCard from '@/components/tools/ToolCard';
import ToolsHeader from '@/components/tools/ToolsHeader';
import { getTools, Tool } from '@/api/tools';

const Tools: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [currentView, setCurrentView] = useState('grid');
  const [tools, setTools] = useState<Tool[]>([]);

  useEffect(() => {
    loadTools();
  }, []);

  const loadTools = async () => {
    try {
      const data = await getTools();
      setTools(data);
    } catch (error) {
      console.error('Error loading tools:', error);
    }
  };

  const filteredTools = tools.filter(tool => {
    const term = searchTerm.toLowerCase();
    return (
      term === '' ||
      tool.title.toLowerCase().includes(term) ||
      (tool.description || '').toLowerCase().includes(term) ||
      (tool.category || '').toLowerCase().includes(term)
    );
  });

  return (
    <div>
      <ToolsHeader
        totalTools={tools.length}
        onSearch={setSearchTerm}
        onViewChange={setCurrentView}
        currentView={currentView}
        onAdd={() => navigate('/tools/create')}
      />
      
      <div className={`grid gap-6 ${currentView === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
        {filteredTools.map(tool => (
          <ToolCard key={tool.id} {...tool} />
        ))}
      </div>
    </div>
  );
};

export default Tools;
