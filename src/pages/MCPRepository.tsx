
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { 
  Database, Plus, Search, ArrowRight, 
  ArrowLeft, Settings, Wrench, Layout 
} from 'lucide-react';
import { AspectRatio } from '@/components/ui/aspect-ratio';

// Sample MCP tools data
const mcpTools = [
  {
    id: 1,
    name: "Data Extractor",
    description: "Extracts structured data from unstructured text sources",
    category: "Data Processing",
    complexity: "Medium",
    lastUpdated: "2025-04-28",
    github: "https://github.com/instabids/mcp-data-extractor",
    tags: ["extraction", "data", "parsing"],
    views: 245
  },
  {
    id: 2,
    name: "Code Generator",
    description: "Generates boilerplate code based on project specifications",
    category: "Development",
    complexity: "High",
    lastUpdated: "2025-05-01",
    github: "https://github.com/instabids/mcp-code-generator",
    tags: ["code", "generation", "development"],
    views: 189
  },
  {
    id: 3,
    name: "Research Assistant",
    description: "Summarizes and analyzes research papers and articles",
    category: "Research",
    complexity: "Medium",
    lastUpdated: "2025-04-15",
    github: "https://github.com/instabids/mcp-research-assistant",
    tags: ["research", "summary", "analysis"],
    views: 312
  },
  {
    id: 4,
    name: "Content Optimizer",
    description: "Enhances content quality and SEO performance",
    category: "Content",
    complexity: "Low",
    lastUpdated: "2025-04-22",
    github: "https://github.com/instabids/mcp-content-optimizer",
    tags: ["content", "seo", "optimization"],
    views: 156
  },
  {
    id: 5,
    name: "Workflow Automator",
    description: "Creates automated workflows combining multiple AI tools",
    category: "Automation",
    complexity: "High",
    lastUpdated: "2025-05-05",
    github: "https://github.com/instabids/mcp-workflow-automator",
    tags: ["workflow", "automation", "pipeline"],
    views: 278
  }
];

// Sample workflows data
const workflowTemplates = [
  {
    id: 101,
    name: "Content Research & Creation",
    description: "Research a topic, generate outline, and create content",
    tools: ["Research Assistant", "Content Optimizer"],
    lastUpdated: "2025-04-20",
    creator: "Alex Johnson",
    popularity: "High"
  },
  {
    id: 102,
    name: "Data Analysis Pipeline",
    description: "Extract data, process it, and generate insights",
    tools: ["Data Extractor", "Workflow Automator"],
    lastUpdated: "2025-04-18",
    creator: "Maya Roberts",
    popularity: "Medium"
  },
  {
    id: 103,
    name: "Code Documentation Generator",
    description: "Analyze codebase and generate comprehensive documentation",
    tools: ["Code Generator", "Content Optimizer"],
    lastUpdated: "2025-05-02",
    creator: "Sam Liu",
    popularity: "Medium"
  }
];

const MCPRepository: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  
  const filteredTools = mcpTools.filter(tool => 
    (activeCategory === 'All' || tool.category === activeCategory) &&
    (tool.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
     tool.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );
  
  const categories = ['All', ...Array.from(new Set(mcpTools.map(tool => tool.category)))];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="heading-2">MCP Tools Repository</h1>
          <p className="text-muted-foreground">Manage and discover Multi-Component Process tools</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Create MCP Tool
        </Button>
      </div>
      
      <Card className="bg-gradient-to-br from-purple-100 to-blue-100 border-none">
        <CardContent className="p-8">
          <div className="flex items-center justify-between">
            <div className="space-y-3 max-w-2xl">
              <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur px-3 py-1 rounded-full text-sm font-medium text-purple-800">
                <Database className="h-4 w-4" />
                <span>Multi-Component Process</span>
              </div>
              <h2 className="text-2xl font-bold text-gray-800">Create systems that do the work for you</h2>
              <p className="text-gray-600">
                Multi-Component Process (MCP) tools combine multiple AI components to create automated workflows
                that solve complex problems. Browse our repository or create your own.
              </p>
              <div className="pt-2">
                <Button variant="default" className="bg-purple-700 hover:bg-purple-800">
                  Explore MCP Tools
                </Button>
              </div>
            </div>
            <div className="hidden lg:block">
              <Database className="h-32 w-32 text-purple-700/20" />
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-[250px_1fr] gap-6">
        {/* Sidebar filter */}
        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Filters</CardTitle>
              <CardDescription>Narrow down MCP tools</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Categories</h4>
                <div className="flex flex-col space-y-1">
                  {categories.map(category => (
                    <Button
                      key={category}
                      variant={activeCategory === category ? "default" : "ghost"}
                      className="justify-start"
                      onClick={() => setActiveCategory(category)}
                    >
                      {category}
                    </Button>
                  ))}
                </div>
              </div>
              <Separator />
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Complexity</h4>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline" className="cursor-pointer">Low</Badge>
                  <Badge variant="outline" className="cursor-pointer">Medium</Badge>
                  <Badge variant="outline" className="cursor-pointer">High</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Main content */}
        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search MCP tools..."
              className="flex-1"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <Tabs defaultValue="tools">
            <TabsList className="mb-4">
              <TabsTrigger value="tools">MCP Tools</TabsTrigger>
              <TabsTrigger value="workflows">Workflow Templates</TabsTrigger>
            </TabsList>
            
            <TabsContent value="tools" className="space-y-4">
              {filteredTools.map(tool => (
                <Card key={tool.id} className="overflow-hidden card-hover">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-center">
                      <CardTitle>{tool.name}</CardTitle>
                      <Badge variant={tool.complexity === "High" ? "default" : tool.complexity === "Medium" ? "secondary" : "outline"}>
                        {tool.complexity}
                      </Badge>
                    </div>
                    <CardDescription>{tool.category}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{tool.description}</p>
                    <div className="flex flex-wrap gap-1 mt-3">
                      {tool.tags.map(tag => (
                        <Badge key={tag} variant="outline" className="text-xs">{tag}</Badge>
                      ))}
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between border-t pt-3 text-xs text-muted-foreground">
                    <div>Last updated: {tool.lastUpdated}</div>
                    <div>{tool.views} views</div>
                  </CardFooter>
                </Card>
              ))}
              {filteredTools.length === 0 && (
                <div className="text-center py-10 text-muted-foreground">
                  <Database className="mx-auto h-10 w-10 mb-2 opacity-20" />
                  <p>No MCP tools found matching your criteria</p>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="workflows" className="space-y-4">
              {workflowTemplates.map(workflow => (
                <Card key={workflow.id} className="overflow-hidden card-hover">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <CardTitle>{workflow.name}</CardTitle>
                      <Badge variant="secondary">
                        {workflow.popularity}
                      </Badge>
                    </div>
                    <CardDescription>By {workflow.creator}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{workflow.description}</p>
                    <div className="mt-3 space-y-2">
                      <div className="text-sm font-medium">Tools in this workflow:</div>
                      <div className="flex gap-2 items-center">
                        {workflow.tools.map((tool, index) => (
                          <React.Fragment key={tool}>
                            <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-200">{tool}</Badge>
                            {index < workflow.tools.length - 1 && <ArrowRight className="h-3 w-3 text-muted-foreground" />}
                          </React.Fragment>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between border-t pt-3 text-xs text-muted-foreground">
                    <div>Last updated: {workflow.lastUpdated}</div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">Preview</Button>
                      <Button size="sm">Use Template</Button>
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </TabsContent>
          </Tabs>
        </div>
      </div>
      
      {/* Workflow builder section - preview/teaser */}
      <Card className="border-dashed border-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Layout className="h-5 w-5" />
            Workflow Builder
          </CardTitle>
          <CardDescription>
            Create custom workflows by combining MCP tools in a visual interface
          </CardDescription>
        </CardHeader>
        <CardContent className="pb-6">
          <div className="bg-muted/50 rounded-lg p-6 text-center">
            <div className="flex justify-center items-center gap-4 mb-4">
              <div className="bg-background p-3 rounded-md shadow-sm border">
                <Database className="h-8 w-8 text-purple-500" />
                <p className="text-xs mt-1 font-medium">Data Extractor</p>
              </div>
              <ArrowRight className="h-6 w-6 text-muted-foreground" />
              <div className="bg-background p-3 rounded-md shadow-sm border">
                <Wrench className="h-8 w-8 text-blue-500" />
                <p className="text-xs mt-1 font-medium">Processor</p>
              </div>
              <ArrowRight className="h-6 w-6 text-muted-foreground" />
              <div className="bg-background p-3 rounded-md shadow-sm border border-dashed flex items-center justify-center" style={{minWidth: '80px', minHeight: '80px'}}>
                <Plus className="h-6 w-6 text-muted-foreground" />
              </div>
            </div>
            <Button onClick={() => navigate('/mcp/builder')}>
              <Plus className="mr-2 h-4 w-4" />
              Create New Workflow
            </Button>
          </div>
        </CardContent>
      </Card>
      
      {/* Documentation section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            MCP Documentation
          </CardTitle>
        </CardHeader>
        <CardContent className="pb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Getting Started</CardTitle>
              </CardHeader>
              <CardContent className="text-xs text-muted-foreground">
                Introduction to MCP tools and how to use them effectively
              </CardContent>
              <CardFooter>
                <Button variant="ghost" size="sm" className="w-full">Read Guide</Button>
              </CardFooter>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">API Documentation</CardTitle>
              </CardHeader>
              <CardContent className="text-xs text-muted-foreground">
                Technical details for integrating MCP tools into your workflows
              </CardContent>
              <CardFooter>
                <Button variant="ghost" size="sm" className="w-full">View Docs</Button>
              </CardFooter>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Best Practices</CardTitle>
              </CardHeader>
              <CardContent className="text-xs text-muted-foreground">
                Learn optimal ways to combine and configure MCP tools
              </CardContent>
              <CardFooter>
                <Button variant="ghost" size="sm" className="w-full">Read Article</Button>
              </CardFooter>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MCPRepository;
