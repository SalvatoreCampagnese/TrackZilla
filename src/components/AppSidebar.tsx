
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { BarChart3, FileText, Settings, LogOut, User } from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  SidebarTrigger,
  useSidebar,
} from '@/components/ui/sidebar';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface AppSidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  onSettingsClick: () => void;
}

export const AppSidebar: React.FC<AppSidebarProps> = ({
  activeTab,
  onTabChange,
  onSettingsClick,
}) => {
  const navigate = useNavigate();
  const { signOut, user } = useAuth();
  const { state } = useSidebar();
  
  const isCollapsed = state === 'collapsed';

  const handleSignOut = async () => {
    await signOut();
  };

  const menuItems = [
    {
      title: 'Applications',
      icon: FileText,
      id: 'applications',
      onClick: () => onTabChange('applications'),
    },
    {
      title: 'Statistics',
      icon: BarChart3,
      id: 'statistics',
      onClick: () => onTabChange('statistics'),
    },
    {
      title: 'Settings',
      icon: Settings,
      id: 'settings',
      onClick: onSettingsClick,
    },
  ];

  const getUserInitials = () => {
    if (user?.email) {
      return user.email.substring(0, 2).toUpperCase();
    }
    return 'U';
  };

  return (
    <Sidebar className="border-r border-white/20 bg-gray-900/50 backdrop-blur-md">
      <SidebarHeader className="p-4 border-b border-white/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg overflow-hidden shadow-lg">
              <img 
                src="/lovable-uploads/95407aee-75ac-4d31-a281-db4fc0472751.png" 
                alt="TrackZilla Logo" 
                className="w-full h-full object-cover" 
              />
            </div>
            {!isCollapsed && (
              <h2 className="text-lg font-bold text-white">TrackZilla</h2>
            )}
          </div>
          <SidebarTrigger className="text-white hover:bg-white/10 h-8 w-8" />
        </div>
        
        {/* Profile Section */}
        <div className="flex items-center gap-3 mt-4 p-3 bg-white/5 rounded-lg">
          <Avatar className="w-8 h-8">
            <AvatarFallback className="bg-red-500 text-white text-xs">
              {getUserInitials()}
            </AvatarFallback>
          </Avatar>
          {!isCollapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm text-white/90 truncate">{user?.email}</p>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent className="flex-1">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton
                    onClick={item.onClick}
                    className={`w-full justify-start text-white/70 hover:text-white hover:bg-white/10 transition-colors ${
                      activeTab === item.id ? 'bg-gradient-to-r from-red-500 to-red-600 text-white' : ''
                    }`}
                  >
                    <item.icon className="w-4 h-4" />
                    {!isCollapsed && <span>{item.title}</span>}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4 border-t border-white/10">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={handleSignOut}
              className="w-full justify-start text-white/70 hover:text-white hover:bg-red-500/20 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              {!isCollapsed && <span>Logout</span>}
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
};
