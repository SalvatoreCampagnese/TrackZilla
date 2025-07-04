
import React from "react";
import { Sidebar, SidebarContent, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import { BarChart3, Settings, Crown, Target } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useSubscription } from "@/hooks/useSubscription";
import { Badge } from "@/components/ui/badge";

interface AppSidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  onSettingsClick: () => void;
}

export const AppSidebar = ({ activeTab, onTabChange, onSettingsClick }: AppSidebarProps) => {
  const { user, signOut } = useAuth();
  const { isPro } = useSubscription();

  const handleProClick = () => {
    window.location.href = '/pro';
  };

  return (
    <Sidebar className="bg-gradient-to-br from-gray-900 to-gray-800 border-r border-white/20">
      <SidebarHeader className="p-4 border-b border-white/20">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-r from-red-500 to-red-600 rounded-lg flex items-center justify-center">
            <Target className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              TrackZilla
              {isPro && <Crown className="w-4 h-4 text-yellow-500" />}
            </h2>
            {isPro && (
              <Badge variant="secondary" className="text-xs bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
                Pro
              </Badge>
            )}
          </div>
        </div>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarMenu className="p-4 space-y-2">
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={() => onTabChange('applications')}
              className={`w-full justify-start text-white hover:bg-white/10 transition-colors ${
                activeTab === 'applications' ? 'bg-white/20' : ''
              }`}
            >
              <Target className="w-4 h-4 mr-3" />
              Applications
            </SidebarMenuButton>
          </SidebarMenuItem>
          
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={() => onTabChange('statistics')}
              className={`w-full justify-start text-white hover:bg-white/10 transition-colors ${
                activeTab === 'statistics' ? 'bg-white/20' : ''
              }`}
            >
              <BarChart3 className="w-4 h-4 mr-3" />
              Statistics
            </SidebarMenuButton>
          </SidebarMenuItem>

          {!isPro && (
            <SidebarMenuItem>
              <SidebarMenuButton
                onClick={handleProClick}
                className="w-full justify-start text-yellow-400 hover:bg-yellow-500/20 transition-colors border border-yellow-500/30 bg-yellow-500/10"
              >
                <Crown className="w-4 h-4 mr-3" />
                🚀 Become Prozilla
              </SidebarMenuButton>
            </SidebarMenuItem>
          )}
          
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={onSettingsClick}
              className={`w-full justify-start text-white hover:bg-white/10 transition-colors ${
                activeTab === 'settings' ? 'bg-white/20' : ''
              }`}
            >
              <Settings className="w-4 h-4 mr-3" />
              Settings
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  );
};
