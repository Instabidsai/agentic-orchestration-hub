
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import AppLayout from "@/components/layout/AppLayout";
import Dashboard from "@/pages/Dashboard";
import Prompts from "@/pages/Prompts";
import PromptDetail from "@/pages/PromptDetail";
import PromptForm from "@/components/prompts/PromptForm";
import Tools from "@/pages/Tools";
import ToolForm from "@/components/tools/ToolForm";
import MCPRepository from "@/pages/MCPRepository";
import WorkflowBuilder from "@/pages/WorkflowBuilder";
import WorkflowsPage from "@/pages/Workflows";
import AIIntelligence from "@/pages/AIIntelligence";
import NotFound from "@/pages/NotFound";
import LandingPage from "@/pages/LandingPage";
import LoginPage from "@/pages/Login";
import { AuthProvider } from "@/hooks/use-auth";

const queryClient = new QueryClient();

const App = () => (
  <AuthProvider>
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
        <BrowserRouter>
          <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/dashboard" element={
            <AppLayout>
              <Dashboard />
            </AppLayout>
          } />

          {/* Prompts section - use a catch-all pattern */}
          <Route path="/prompts" element={<AppLayout />}>
            <Route index element={<Prompts />} />
            <Route path="create" element={<PromptForm />} />
            <Route path="edit/:id" element={<PromptForm />} />
            <Route path=":id" element={<PromptDetail />} />
          </Route>

          <Route path="/tools" element={<AppLayout />}> 
            <Route index element={<Tools />} />
            <Route path="create" element={<ToolForm />} />
            <Route path="edit/:id" element={<ToolForm />} />
          </Route>
          <Route path="/mcp" element={<AppLayout />}>
            <Route index element={<MCPRepository />} />
            <Route path="builder" element={<WorkflowBuilder />} />
          </Route>
          <Route path="/workflows" element={<AppLayout />}>
            <Route index element={<WorkflowsPage />} />
          </Route>
          <Route path="/intelligence" element={
            <AppLayout>
              <AIIntelligence />
            </AppLayout>
          } />
          
          {/* Fallback for missing routes */}
          <Route path="*" element={
            <AppLayout>
              <NotFound />
            </AppLayout>
          } />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
    </ThemeProvider>
</AuthProvider>
);

export default App;
