
import React from 'react';
import { Sparkles, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SidebarTrigger, useSidebar } from '@/components/ui/sidebar';

interface DashboardHeaderProps {
  activeTab: string;
  onAddApplication: () => void;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  activeTab,
  onAddApplication
}) => {
  const { state } = useSidebar();
  const isCollapsed = state === 'collapsed';

  return (
    <header className="sticky top-0 z-30 backdrop-blur-xl bg-black/30 border-b border-white/10 shadow-lg">
      <div className="flex items-center justify-between p-4 lg:p-6">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
              <SidebarTrigger className="text-white hover:bg-white/10 h-8 w-8 rounded-xl transition-all duration-200 hover:scale-105" />
            <div>
              {/* Header content can be added here if needed */}
            </div>
          </div>
        </div>
        
        {activeTab === 'applications' && (
          <Button 
            onClick={onAddApplication} 
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 transition-all duration-300 text-white shadow-lg hover:shadow-xl hover:scale-105 rounded-xl px-4 sm:px-6"
          >
            <Plus className="w-5 h-5 mr-2" />
            <span className="hidden sm:inline">Add Application</span>
            <span className="sm:hidden">Add</span>
          </Button>
        )}
      </div>
    </header>
  );
};
