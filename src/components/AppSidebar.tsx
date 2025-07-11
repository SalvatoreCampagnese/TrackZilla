
import React from 'react';
import { useTranslation } from 'react-i18next';
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
  const { t } = useTranslation();
  const { user, signOut } = useAuth();
  const { subscribed, subscription_tier } = useSubscription();

  const menuItems = [
    {
      id: 'applications',
      title: t('dashboard.applications'),
      icon: FileText,
      onClick: () => onTabChange('applications')
    },
    {
      id: 'statistics',
      title: t('dashboard.statistics'),
      icon: BarChart3,
      onClick: () => onTabChange('statistics')
    },
    {
      id: 'subscription',
      title: t('dashboard.subscription'),
      icon: CreditCard,
      onClick: () => onTabChange('subscription')
    }
  ];

  // Add Pro tab if user is subscribed or remove the external navigation
  if (subscribed) {
    menuItems.push({
      id: 'pro',
      title: t('dashboard.pro'),
      icon: Plus,
      onClick: () => onTabChange('pro')
    });
  }

  const getUserInitials = (email: string) => {
    return email.split('@')[0].substring(0, 2).toUpperCase();
  };

  return (
    <Sidebar className="border-r border-white/10 bg-gradient-to-b from-gray-900 to-black">
      <SidebarHeader className="border-b border-white/10 p-4">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 bg-gradient-to-r from-red-500 to-red-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">TZ</span>
          </div>
          <div>
            <h2 className="text-white font-semibold text-sm">TrackZilla</h2>
          </div>
        </div>

        {/* User Information - Moved to top */}
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-white/10 text-white text-xs">
                {user?.email ? getUserInitials(user.email) : 'U'}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-white/90 truncate">{user?.email}</p>
            </div>
          </div>
          
          {/* Subscription Status - Right below user */}
          <div className="flex items-center gap-2">
            <Badge className={subscribed 
              ? "bg-green-500/20 text-green-400 text-xs" 
              : "bg-gray-500/20 text-gray-400 text-xs"
            }>
              {subscribed ? subscription_tier || 'PRO' : 'FREE'}
            </Badge>
            {subscribed && (
              <Badge className="bg-yellow-500/20 text-yellow-400 text-xs">ATTIVO</Badge>
            )}
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="p-2">
        <SidebarGroup>
          <SidebarGroupLabel className="text-white/70 text-xs uppercase tracking-wider px-2 mb-2">
            {t('dashboard.title')}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton
                    onClick={item.onClick}
                    isActive={activeTab === item.id}
                    className={`w-full justify-start transition-colors ${
                      activeTab === item.id
                        ? 'bg-white/10 text-white'
                        : 'text-white/70 hover:text-white hover:bg-white/5'
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

      <SidebarFooter className="border-t border-white/10 p-2 space-y-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={onSettingsClick}
          className="w-full justify-start text-white/70 hover:text-white hover:bg-white/5"
        >
          <Settings className="mr-3 h-4 w-4" />
          {t('common.settings')}
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={signOut}
          className="w-full justify-start text-white/70 hover:text-white hover:bg-white/5"
        >
          <LogOut className="mr-3 h-4 w-4" />
          {t('common.logout')}
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
};
