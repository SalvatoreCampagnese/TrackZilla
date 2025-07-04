import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import Index from "./pages/Index";
import AddJobPage from "./pages/AddJobPage";
import ImportPage from "./pages/ImportPage";
import ApplicationDetailPage from "./pages/ApplicationDetailPage";
import SettingsPage from "./pages/SettingsPage";
import SitemapPage from "./components/SitemapPage";
import TermsPage from "./pages/TermsPage";
import { SubscriptionProvider } from "@/hooks/useSubscription";
import ProPage from "./pages/ProPage";
import ProSuccessPage from "./pages/ProSuccessPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <SubscriptionProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/add-job" element={<AddJobPage />} />
              <Route path="/import" element={<ImportPage />} />
              <Route path="/application/:id" element={<ApplicationDetailPage />} />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="/pro" element={<ProPage />} />
              <Route path="/pro-success" element={<ProSuccessPage />} />
              <Route path="/sitemap" element={<SitemapPage />} />
              <Route path="/sitemap.xml" element={<SitemapPage />} />
              <Route path="/terms" element={<TermsPage />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </SubscriptionProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
