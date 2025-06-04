import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PromptCard from '@/components/prompts/PromptCard';
import PromptFilters from '@/components/prompts/PromptFilters';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Plus, BookOpen, Search, Download } from 'lucide-react';
import { searchPrompts, Prompt, PromptFilters as PromptFiltersType } from '@/api/prompts';
import { Enums } from '@/integrations/supabase/types';
import { downloadJSON } from '@/lib/export';

const PromptsPage: React.FC = () => {
  const navigate = useNavigate();
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedInterface, setSelectedInterface] = useState('all');
  const [selectedDomain, setSelectedDomain] = useState('all');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState('all');
  const [page, setPage] = useState(0);
  const [pageSize] = useState(20);

  useEffect(() => {
    fetchPrompts();
  }, [activeTab, selectedInterface, selectedDomain, selectedTags, page, searchTerm]);

  const fetchPrompts = async () => {
    try {
      setLoading(true);
      console.log('Fetching prompts with current filters:');
      
      // Build filters based on current state
      const filters: PromptFiltersType = {
        search: searchTerm || undefined,
        page,
        pageSize,
        onlyFavorites: activeTab === 'favorites'
      };
      
      // Add interface filter if not "all"
      if (selectedInterface !== 'all') {
        filters.interfaces = [selectedInterface as Enums<'ai_interface'>];
        console.log(`Filtering by interface: ${selectedInterface}`);
      }
      
      // Add domain filter if not "all"
      if (selectedDomain !== 'all') {
        filters.domains = [selectedDomain as Enums<'prompt_domain'>];
        console.log(`Filtering by domain: ${selectedDomain}`);
      }
      
      // Add tags filter if any selected
      if (selectedTags.length > 0) {
        filters.tags = selectedTags;
        console.log(`Filtering by tags: ${selectedTags.join(', ')}`);
      }

      console.log('Final filter object:', filters);
      const result = await searchPrompts(filters);
      console.log(`Received ${result.prompts.length} prompts of ${result.totalCount} total`);
      setPrompts(result.prompts);
      setTotalCount(result.totalCount);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching prompts:', error);
      setLoading(false);
    }
  };

  const handleFilterChange = (filter: string, value: string) => {
    // Reset page when changing filters
    setPage(0);
    console.log(`Filter changed: ${filter} = ${value}`);
    
    if (filter === 'interface') {
      setSelectedInterface(value);
    } else if (filter === 'domain') {
      setSelectedDomain(value);
    }
  };

  const handleTagToggle = (tag: string) => {
    // Reset page when changing tags
    setPage(0);
    
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleCreatePrompt = () => {
    console.log('Navigating to Create Prompt page');
    navigate('/prompts/create');
  };

  const handleExport = async () => {
    try {
      const filters: PromptFiltersType = {
        search: searchTerm || undefined,
        interfaces: selectedInterface !== 'all' ? [selectedInterface as Enums<'ai_interface'>] : undefined,
        domains: selectedDomain !== 'all' ? [selectedDomain as Enums<'prompt_domain'>] : undefined,
        tags: selectedTags.length > 0 ? selectedTags : undefined,
        onlyFavorites: activeTab === 'favorites',
        page: 0,
        pageSize: 1000
      };

      const result = await searchPrompts(filters);
      downloadJSON(result.prompts, 'prompts.json');
    } catch (err) {
      console.error('Error exporting prompts:', err);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Only search when user stops typing (debounce)
    const value = e.target.value;
    setSearchTerm(value);
    setPage(0); // Reset to first page on new search
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="heading-2">Prompts Library</h1>
          <p className="text-muted-foreground">Discover and use prompts for various AI interfaces and use cases</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleCreatePrompt}>
            <Plus className="mr-2 h-4 w-4" />
            Create Prompt
          </Button>
          <Button variant="outline" onClick={handleExport}>
            <Download className="mr-2 h-4 w-4" />
            Export JSON
          </Button>
        </div>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all" className="flex items-center gap-1.5">
            <BookOpen className="h-4 w-4" />
            <span>All Prompts</span>
          </TabsTrigger>
          <TabsTrigger value="favorites" className="flex items-center gap-1.5">
            <BookOpen className="h-4 w-4" />
            <span>Favorites</span>
          </TabsTrigger>
        </TabsList>
      </Tabs>
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search prompts..."
            className="pl-8"
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>
      </div>
      
      <PromptFilters 
        onFilterChange={handleFilterChange} 
        selectedInterface={selectedInterface}
        selectedDomain={selectedDomain}
        selectedTags={selectedTags}
        onTagToggle={handleTagToggle}
      />
      
      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
          <p className="mt-2">Loading prompts...</p>
        </div>
      ) : prompts.length === 0 ? (
        <div className="text-center py-12 border rounded-lg bg-muted/40">
          <BookOpen className="h-12 w-12 mx-auto text-muted-foreground" />
          <h3 className="mt-4 text-lg font-medium">No prompts found</h3>
          <p className="text-muted-foreground">Try adjusting your filters or create a new prompt</p>
        </div>
      ) : (
        <div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {prompts.map(prompt => (
              <PromptCard key={prompt.id} {...prompt} />
            ))}
          </div>
          
          {totalCount > pageSize && (
            <div className="flex justify-center items-center gap-2 mt-6">
              <Button 
                variant="outline" 
                onClick={() => setPage(Math.max(0, page - 1))}
                disabled={page === 0}
              >
                Previous
              </Button>
              <span className="text-sm text-muted-foreground">
                Page {page + 1} of {Math.ceil(totalCount / pageSize)}
              </span>
              <Button 
                variant="outline" 
                onClick={() => setPage(Math.min(Math.ceil(totalCount / pageSize) - 1, page + 1))}
                disabled={(page + 1) * pageSize >= totalCount}
              >
                Next
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PromptsPage;
