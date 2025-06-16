
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import Index from "./pages/Index";
import AddJobPage from "./pages/AddJobPage";
import ImportPage from "./pages/ImportPage";
import SitemapPage from "./components/SitemapPage";
import TermsPage from "./pages/TermsPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/add-job" element={<AddJobPage />} />
            <Route path="/import" element={<ImportPage />} />
            <Route path="/sitemap" element={<SitemapPage />} />
            <Route path="/sitemap.xml" element={<SitemapPage />} />
            <Route path="/terms" element={<TermsPage />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
