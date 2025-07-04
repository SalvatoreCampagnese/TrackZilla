import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { BarChart3, FileText, Settings, LogOut, Calendar, Clock, Crown, Zap } from 'lucide-react';
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

  const handleSettingsClick = () => {
    onSettingsClick();
  };

  const handleProClick = () => {
    navigate('/pro');
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
      onClick: handleSettingsClick,
    },
  ];

  const getUserInitials = () => {
    if (user?.email) {
      return user.email.substring(0, 2).toUpperCase();
    }
    return 'U';
  };

  // Date and time display component
  const DateTimeDisplay = () => {
    const [currentDateTime, setCurrentDateTime] = React.useState(new Date());

    React.useEffect(() => {
      const timer = setInterval(() => {
        setCurrentDateTime(new Date());
      }, 1000);

      return () => clearInterval(timer);
    }, []);

    const formatDate = (date: Date) => {
      return date.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric'
      });
    };

    const formatTime = (date: Date) => {
      return date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit'
      });
    };

    if (isCollapsed) {
      return (
        <div className="flex flex-col items-center gap-1 p-2">
          <Calendar className="w-4 h-4 text-white/70" />
          <Clock className="w-4 h-4 text-white/70" />
        </div>
      );
    }

    return (
      <div className="space-y-2 p-3 bg-white/5 rounded-lg">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-white/70" />
          <span className="text-xs text-white/90 font-medium">
            {formatDate(currentDateTime)}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-white/70" />
          <span className="text-xs text-white/90 font-mono">
            {formatTime(currentDateTime)}
          </span>
        </div>
      </div>
    );
  };

  return (
    <Sidebar className="border-r border-white/20 bg-gradient-to-b from-blue-900 to-blue-800 backdrop-blur-md">
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
            <AvatarFallback className="bg-blue-500 text-white text-xs">
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
                      activeTab === item.id ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white' : ''
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

        {/* ProZilla Upgrade Section - Highlighted */}
        <div className="px-2 pb-4">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                onClick={handleProClick}
                className="w-full justify-start bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold shadow-lg border-2 border-red-400/50 transition-all duration-200 hover:scale-105"
              >
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    <Crown className="w-4 h-4" />
                    <Zap className="w-3 h-3" />
                  </div>
                  {!isCollapsed && (
                    <div className="flex flex-col items-start">
                      <span className="text-sm font-bold">Diventa ProZilla</span>
                      <span className="text-xs opacity-90">Sblocca tutto!</span>
                    </div>
                  )}
                </div>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </div>
      </SidebarContent>

      <SidebarFooter className="p-4 border-t border-white/10 space-y-3">
        {/* Date and Time Display */}
        <DateTimeDisplay />
        
        {/* Logout Button */}
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
