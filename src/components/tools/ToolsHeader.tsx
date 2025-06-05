
import React from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Plus, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface ToolsHeaderProps {
  totalTools: number;
  onSearch: (searchTerm: string) => void;
  onViewChange: (view: string) => void;
  currentView: string;
  onAdd?: () => void;
}

const ToolsHeader: React.FC<ToolsHeaderProps> = ({
  totalTools,
  onSearch,
  onViewChange,
  currentView,
  onAdd
}) => {
  return (
    <div className="mb-6 space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="heading-2">Tools Catalog</h1>
          <p className="text-muted-foreground">{totalTools} tools documented and organized by category</p>
        </div>
        <Button onClick={onAdd}>
          <Plus className="mr-2 h-4 w-4" />
          Add New Tool
        </Button>
      </div>

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Input
            placeholder="Search tools by name, category, or capability..."
            onChange={(e) => onSearch(e.target.value)}
            className="pl-3"
          />
        </div>

        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm">
            <Filter className="mr-1.5 h-3.5 w-3.5" />
            Filters
          </Button>
          <Tabs defaultValue={currentView} onValueChange={onViewChange}>
            <TabsList className="grid grid-cols-2 w-[180px]">
              <TabsTrigger value="grid">Grid</TabsTrigger>
              <TabsTrigger value="list">List</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default ToolsHeader;
