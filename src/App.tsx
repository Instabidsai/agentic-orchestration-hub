
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AppLayout from "@/components/layout/AppLayout";
import Dashboard from "@/pages/Dashboard";
import Prompts from "@/pages/Prompts";
import PromptDetail from "@/pages/PromptDetail";
import PromptForm from "@/components/prompts/PromptForm";
import Tools from "@/pages/Tools";
import MCPRepository from "@/pages/MCPRepository";
import AIIntelligence from "@/pages/AIIntelligence";
import NotFound from "@/pages/NotFound";
import LandingPage from "@/pages/LandingPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/dashboard" element={
            <AppLayout>
              <Dashboard />
            </AppLayout>
          } />
          <Route path="/prompts" element={
            <AppLayout>
              <Prompts />
            </AppLayout>
          } />
          <Route path="/prompts/create" element={
            <AppLayout>
              <PromptForm />
            </AppLayout>
          } />
          <Route path="/prompts/:id" element={
            <AppLayout>
              <PromptDetail />
            </AppLayout>
          } />
          <Route path="/prompts/edit/:id" element={
            <AppLayout>
              <PromptForm />
            </AppLayout>
          } />
          <Route path="/tools" element={
            <AppLayout>
              <Tools />
            </AppLayout>
          } />
          <Route path="/mcp" element={
            <AppLayout>
              <MCPRepository />
            </AppLayout>
          } />
          <Route path="/intelligence" element={
            <AppLayout>
              <AIIntelligence />
            </AppLayout>
          } />
          <Route path="*" element={
            <AppLayout>
              <NotFound />
            </AppLayout>
          } />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
