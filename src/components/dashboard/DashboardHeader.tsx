import React from 'react';
import { Sparkles, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
interface DashboardHeaderProps {
  activeTab: string;
  onAddApplication: () => void;
}
export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  activeTab,
  onAddApplication
}) => {
  return <header className="sticky top-0 z-20 backdrop-blur-xl bg-black/20 border-b border-white/10">
      <div className="flex items-center justify-between p-4 lg:p-6">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
            
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent sm:ml-4 ml-0">
                TrackZilla
              </h1>
              <p className="text-sm text-purple-200/70">Your Career Dashboard</p>
            </div>
          </div>
        </div>
        
        {activeTab === 'applications' && <Button onClick={onAddApplication} className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 transition-all duration-300 text-white shadow-lg hover:shadow-xl hover:scale-105 rounded-xl px-4 sm:px-6">
            <Plus className="w-5 h-5 mr-2" />
            <span className="hidden sm:inline">Add Application</span>
            <span className="sm:hidden">Add</span>
          </Button>}
      </div>
    </header>;
};