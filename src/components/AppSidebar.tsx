
import React from 'react';
import { BarChart3, FileText, CreditCard, Settings, LogOut, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarHeader, SidebarFooter } from '@/components/ui/sidebar';
import { useAuth } from '@/hooks/useAuth';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useSubscription } from '@/hooks/useSubscription';

interface AppSidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  onSettingsClick: () => void;
  onProClick: () => void;
}

export const AppSidebar: React.FC<AppSidebarProps> = ({
  activeTab,
  onTabChange,
  onSettingsClick,
  onProClick
}) => {
  const { user, signOut } = useAuth();
  const { subscribed } = useSubscription();

  const menuItems = [
    {
      id: 'applications',
      title: 'Applications',
      icon: FileText,
      onClick: () => onTabChange('applications')
    },
    {
      id: 'statistics',
      title: 'Statistics',
      icon: BarChart3,
      onClick: () => onTabChange('statistics')
    },
    {
      id: 'subscription',
      title: 'Subscription',
      icon: CreditCard,
      onClick: () => onTabChange('subscription')
    }
  ];

  // Add Pro tab if user is subscribed or remove the external navigation
  if (subscribed) {
    menuItems.push({
      id: 'pro',
      title: 'Pro Features',
      icon: Plus,
      onClick: () => onTabChange('pro')
    });
  }

  return (
    <Sidebar className="border-r border-white/10 bg-black/20 backdrop-blur-xl">
      <SidebarHeader className="p-4 border-b border-white/10">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10 bg-gradient-to-r from-purple-500 to-pink-500">
            <AvatarFallback className="bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold">
              {user?.email?.charAt(0).toUpperCase() || 'U'}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">
              {user?.email}
            </p>
            <div className="flex items-center gap-2 mt-1">
              <Badge className={subscribed 
                ? "bg-green-500/20 text-green-400 border-green-500/30" 
                : "bg-gray-500/20 text-gray-400 border-gray-500/30"
              }>
                {subscribed ? 'ProZilla' : 'Free'}
              </Badge>
            </div>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="p-2">
        <SidebarGroup>
          <SidebarGroupLabel className="text-white/70 text-xs uppercase tracking-wider px-2 mb-2">
            Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton
                    onClick={item.onClick}
                    className={`w-full justify-start text-left transition-all duration-200 rounded-xl ${
                      activeTab === item.id
                        ? 'bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-white border border-purple-500/30 shadow-lg'
                        : 'text-white/70 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    <item.icon className="mr-3 h-4 w-4" />
                    {item.title}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4 border-t border-white/10">
        <div className="space-y-2">
          <Button
            onClick={onSettingsClick}
            variant="ghost"
            className="w-full justify-start text-white/70 hover:text-white hover:bg-white/10 rounded-xl"
          >
            <Settings className="mr-3 h-4 w-4" />
            Settings
          </Button>
          <Button
            onClick={signOut}
            variant="ghost"
            className="w-full justify-start text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-xl"
          >
            <LogOut className="mr-3 h-4 w-4" />
            Sign Out
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
};
