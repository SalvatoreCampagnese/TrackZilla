
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { BarChart3, FileText, Settings, LogOut } from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  useSidebar,
} from '@/components/ui/sidebar';

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
  const { signOut } = useAuth();
  const { collapsed } = useSidebar();

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
    {
      title: 'Logout',
      icon: LogOut,
      id: 'logout',
      onClick: handleSignOut,
    },
  ];

  return (
    <Sidebar className="border-r border-white/20 bg-gray-900/50 backdrop-blur-md">
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg overflow-hidden shadow-lg">
            <img 
              src="/lovable-uploads/95407aee-75ac-4d31-a281-db4fc0472751.png" 
              alt="TrackZilla Logo" 
              className="w-full h-full object-cover" 
            />
          </div>
          {!collapsed && (
            <h2 className="text-lg font-bold text-white">TrackZilla</h2>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent>
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
                    {!collapsed && <span>{item.title}</span>}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};
