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
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip';
import { toast } from 'sonner';
import { 
  ArrowLeft, 
  Copy, 
  Edit, 
  Star, 
  History, 
  Tag, 
  FileText,
  Trash,
  Link, 
} from 'lucide-react';
import { getPromptById, toggleFavorite, recordPromptUsage, deletePrompt, getPromptVersions, getRelatedPrompts, addPromptRelation, removePromptRelation, searchPrompts } from '@/api/prompts';
import { Input } from '@/components/ui/input';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Constants, Enums } from '@/integrations/supabase/types';
import { formatDistanceToNow } from 'date-fns';

const PromptDetailPage: React.FC = () => {
  const { id } = useParams<{id: string}>();
  const navigate = useNavigate();
  const [prompt, setPrompt] = useState<any>(null);
  const [versions, setVersions] = useState<any[]>([]);
  const [relatedPrompts, setRelatedPrompts] = useState<{sources: any[], targets: any[]}>({
    sources: [],
    targets: []
  });
  const [relationSearch, setRelationSearch] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [newRelationType, setNewRelationType] = useState<Enums<'relation_type'>>('DEPENDS_ON');
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('content');
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (id) {
      fetchPromptData();
    }
  }, [id]);

  const fetchPromptData = async () => {
    try {
      setLoading(true);
      // Fetch prompt details
      const promptData = await getPromptById(id as string);
      if (!promptData) {
        toast.error('Prompt not found');
        navigate('/prompts');
        return;
      }
      setPrompt(promptData);
      
      // Fetch version history if needed
      if (activeTab === 'versions') {
        fetchVersions();
      }
      
      // Fetch related prompts if needed
      if (activeTab === 'related') {
        fetchRelatedPrompts();
      }
      
      setLoading(false);
    } catch (error) {
      console.error('Error fetching prompt details:', error);
      setLoading(false);
      toast.error('Failed to load prompt details');
    }
  };

  const fetchVersions = async () => {
    try {
      const versionData = await getPromptVersions(id as string);
      setVersions(versionData);
    } catch (error) {
      console.error('Error fetching versions:', error);
      toast.error('Failed to load version history');
    }
  };

  const fetchRelatedPrompts = async () => {
    try {
      const relatedData = await getRelatedPrompts(id as string);
      setRelatedPrompts(relatedData);
    } catch (error) {
      console.error('Error fetching related prompts:', error);
      toast.error('Failed to load related prompts');
    }
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    
    // Fetch additional data based on selected tab
    if (value === 'versions' && versions.length === 0) {
      fetchVersions();
    }
    
    if (value === 'related' && (relatedPrompts.sources.length === 0 && relatedPrompts.targets.length === 0)) {
      fetchRelatedPrompts();
    }
  };

  const handleToggleFavorite = async () => {
    if (!prompt) return;
    
    try {
      await toggleFavorite(prompt.id, !prompt.is_favorite);
      setPrompt({...prompt, is_favorite: !prompt.is_favorite});
      toast.success(prompt.is_favorite ? 'Removed from favorites' : 'Added to favorites');
    } catch (error) {
      console.error('Error toggling favorite status:', error);
      toast.error('Failed to update favorite status');
    }
  };

  const handleCopyPrompt = async () => {
    if (!prompt) return;
    
    try {
      await navigator.clipboard.writeText(prompt.content);
      await recordPromptUsage(prompt.id, prompt.version);
      toast.success('Prompt copied to clipboard');
      
      // Update local state to reflect usage
      setPrompt({
        ...prompt,
        use_count: prompt.use_count + 1,
        last_used_at: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error copying prompt:', error);
      toast.error('Failed to copy prompt');
    }
  };

  const handleEditPrompt = () => {
    navigate(`/prompts/edit/${id}`);
  };

  const handleDeletePrompt = async () => {
    if (!prompt) return;
    
    try {
      setDeleting(true);
      await deletePrompt(prompt.id);
      toast.success('Prompt deleted successfully');
      navigate('/prompts');
    } catch (error) {
      console.error('Error deleting prompt:', error);
      toast.error('Failed to delete prompt');
      setDeleting(false);
    }
  };

  const handleRelationSearch = async (value: string) => {
    setRelationSearch(value);
    if (value.length < 2) {
      setSearchResults([]);
      return;
    }
    try {
      const result = await searchPrompts({ search: value, pageSize: 5 });
      setSearchResults(result.prompts.filter(p => p.id !== id));
    } catch (error) {
      console.error('Error searching prompts for relation:', error);
    }
  };

  const handleAddRelation = async (targetId: string) => {
    if (!id) return;
    try {
      await addPromptRelation(id, targetId, newRelationType);
      setRelationSearch('');
      setSearchResults([]);
      fetchRelatedPrompts();
    } catch (error) {
      console.error('Error adding relation:', error);
      toast.error('Failed to add relation');
    }
  };

  const handleRemoveRelation = async (relationId: string) => {
    try {
      await removePromptRelation(relationId);
      fetchRelatedPrompts();
    } catch (error) {
      console.error('Error removing relation:', error);
      toast.error('Failed to remove relation');
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Never';
    return formatDistanceToNow(new Date(dateString), { addSuffix: true });
  };
  
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
        <p className="ml-2">Loading prompt details...</p>
      </div>
    );
  }

  if (!prompt) {
    return (
      <div className="text-center py-12 border rounded-lg bg-muted/40">
        <FileText className="h-12 w-12 mx-auto text-muted-foreground" />
        <h3 className="mt-4 text-lg font-medium">Prompt not found</h3>
        <p className="text-muted-foreground">The prompt may have been deleted or moved</p>
        <Button 
          variant="outline" 
          className="mt-4"
          onClick={() => navigate('/prompts')}
        >
          Back to Prompts
        </Button>
      </div>
    );
  }

  // Status colors for display
  const statusColors = {
    'DRAFT': 'bg-yellow-100 text-yellow-800',
    'ACTIVE': 'bg-green-100 text-green-800',
    'DEPRECATED': 'bg-red-100 text-red-800'
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-8 w-8 p-0"
            onClick={() => navigate('/prompts')}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="heading-2">{prompt.title}</h1>
        </div>
        <div className="flex gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className={prompt.is_favorite ? "text-amber-500" : "text-muted-foreground"}
                  onClick={handleToggleFavorite}
                >
                  <Star className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{prompt.is_favorite ? 'Remove from favorites' : 'Add to favorites'}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <Button variant="outline" onClick={handleCopyPrompt}>
            <Copy className="h-4 w-4 mr-2" />
            Copy
          </Button>
          
          <Button variant="outline" onClick={handleEditPrompt}>
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
          
          <Button variant="destructive" onClick={handleDeletePrompt} disabled={deleting}>
            {deleting ? (
              <>
                <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full mr-2"></div>
                Deleting...
              </>
            ) : (
              <>
                <Trash className="h-4 w-4 mr-2" />
                Delete
              </>
            )}
          </Button>
        </div>
      </div>
      
      <div className="flex flex-wrap gap-2">
        <Badge variant="secondary">{prompt.type}</Badge>
        <Badge variant="outline" className={statusColors[prompt.status as keyof typeof statusColors]}>
          {prompt.status}
        </Badge>
        
        {prompt.interfaces.map((interface_type: string) => (
          <Badge key={interface_type} variant="outline">
            {interface_type}
          </Badge>
        ))}
        
        {prompt.domains.map((domain: string) => (
          <Badge key={domain} variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            {domain.replace('_', ' ')}
          </Badge>
        ))}
        
        {prompt.tags.map((tag: string) => (
          <Badge key={tag} variant="outline" className="bg-muted/50">
            {tag}
          </Badge>
        ))}
      </div>

      <div className="flex flex-col md:flex-row text-sm text-muted-foreground gap-4">
        <div>Created: {formatDate(prompt.created_at)}</div>
        <div>Updated: {formatDate(prompt.updated_at)}</div>
        <div>Last used: {formatDate(prompt.last_used_at)}</div>
        <div>Usage count: {prompt.use_count}</div>
        <div>Version: {prompt.version}</div>
      </div>
      
      {prompt.description && (
        <Card>
          <CardContent className="pt-6">
            <p>{prompt.description}</p>
          </CardContent>
        </Card>
      )}
      
      <Tabs value={activeTab} onValueChange={handleTabChange}>
        <TabsList>
          <TabsTrigger value="content" className="flex items-center gap-1.5">
            <FileText className="h-4 w-4" />
            <span>Content</span>
          </TabsTrigger>
          <TabsTrigger value="versions" className="flex items-center gap-1.5">
            <History className="h-4 w-4" />
            <span>Version History</span>
          </TabsTrigger>
          <TabsTrigger value="related" className="flex items-center gap-1.5">
            <Link className="h-4 w-4" />
            <span>Related Prompts</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="content" className="mt-4">
          <Card>
            <CardContent className="pt-6">
              <pre className="whitespace-pre-wrap font-mono bg-muted p-4 rounded-md">{prompt.content}</pre>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="versions" className="mt-4">
          <Card>
            <CardContent className="pt-6">
              {versions.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8">
                  <History className="h-8 w-8 text-muted-foreground mb-2" />
                  <p className="text-muted-foreground">
                    {loading ? 'Loading version history...' : 'No version history available'}
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {versions.map((version) => (
                    <div key={version.id} className="border rounded-md p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-medium">Version {version.version}</h3>
                          <p className="text-sm text-muted-foreground">
                            {formatDate(version.changed_at)} by {version.changed_by || 'Unknown'}
                          </p>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => {
                            navigator.clipboard.writeText(version.content);
                            toast.success('Version content copied to clipboard');
                          }}
                        >
                          <Copy className="h-3.5 w-3.5 mr-1" />
                          Copy
                        </Button>
                      </div>
                      {version.change_notes && (
                        <div className="mb-2 bg-muted px-3 py-2 rounded-md">
                          <p className="text-sm">{version.change_notes}</p>
                        </div>
                      )}
                      <details className="cursor-pointer">
                        <summary className="text-sm text-muted-foreground">Show content</summary>
                        <pre className="whitespace-pre-wrap font-mono bg-muted p-3 rounded-md mt-2 text-sm">{version.content}</pre>
                      </details>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="related" className="mt-4">
          <Card>
            <CardContent className="pt-6">
              {relatedPrompts.sources.length === 0 && relatedPrompts.targets.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8">
                  <Link className="h-8 w-8 text-muted-foreground mb-2" />
                  <p className="text-muted-foreground">
                    {loading ? 'Loading related prompts...' : 'No related prompts found'}
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  {relatedPrompts.sources.length > 0 && (
                    <div>
                      <h3 className="font-medium mb-2">Sources (prompts that this prompt depends on)</h3>
                      <div className="space-y-2">
                        {relatedPrompts.sources.map((source) => (
                          <div key={source.id} className="border rounded-md p-3">
                            <div className="flex justify-between items-start">
                              <div>
                                <h4 className="font-medium">{source.prompt.title}</h4>
                                <p className="text-sm text-muted-foreground line-clamp-1">
                                  {source.prompt.description}
                                </p>
                                <div className="flex items-center gap-2 mt-1">
                                  <Badge variant="outline" className="text-xs">
                                    {source.relation_type}
                                  </Badge>
                                  <Badge variant="secondary" className="text-xs">
                                    {source.prompt.type}
                                  </Badge>
                                  <Badge variant="outline" className={statusColors[source.prompt.status as keyof typeof statusColors] + " text-xs"}>
                                    {source.prompt.status}
                                  </Badge>
                                </div>
                              </div>
                              <div className="flex gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => navigate(`/prompts/${source.prompt.id}`)}
                                >
                                  View
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleRemoveRelation(source.id)}
                                >
                                  Remove
                                </Button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {relatedPrompts.targets.length > 0 && (
                    <div>
                      <h3 className="font-medium mb-2">Targets (prompts that depend on this prompt)</h3>
                      <div className="space-y-2">
                        {relatedPrompts.targets.map((target) => (
                          <div key={target.id} className="border rounded-md p-3">
                            <div className="flex justify-between items-start">
                              <div>
                                <h4 className="font-medium">{target.prompt.title}</h4>
                                <p className="text-sm text-muted-foreground line-clamp-1">
                                  {target.prompt.description}
                                </p>
                                <div className="flex items-center gap-2 mt-1">
                                  <Badge variant="outline" className="text-xs">
                                    {target.relation_type}
                                  </Badge>
                                  <Badge variant="secondary" className="text-xs">
                                    {target.prompt.type}
                                  </Badge>
                                  <Badge variant="outline" className={statusColors[target.prompt.status as keyof typeof statusColors] + " text-xs"}>
                                    {target.prompt.status}
                                  </Badge>
                                </div>
                              </div>
                              <div className="flex gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => navigate(`/prompts/${target.prompt.id}`)}
                                >
                                  View
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleRemoveRelation(target.id)}
                                >
                                  Remove
                                </Button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              <div className="mt-6 space-y-2">
                <h3 className="font-medium">Add Relation</h3>
                <div className="flex flex-col sm:flex-row gap-2">
                  <Select value={newRelationType} onValueChange={setNewRelationType}>
                    <SelectTrigger className="w-36">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Constants.public.Enums.relation_type.map(type => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Input
                    placeholder="Search prompts..."
                    value={relationSearch}
                    onChange={e => handleRelationSearch(e.target.value)}
                    className="flex-1"
                  />
                </div>
                {searchResults.length > 0 && (
                  <div className="border rounded-md divide-y mt-2">
                    {searchResults.map(result => (
                      <button
                        key={result.id}
                        className="block w-full text-left p-2 hover:bg-muted"
                        onClick={() => handleAddRelation(result.id)}
                      >
                        {result.title}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PromptDetailPage;
