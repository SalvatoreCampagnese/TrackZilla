import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useSubscription } from '@/hooks/useSubscription';
import { BarChart3, FileText, Settings, LogOut, Calendar, Clock, Zap, Sparkles, CreditCard } from 'lucide-react';
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarHeader, SidebarFooter, SidebarTrigger, useSidebar } from '@/components/ui/sidebar';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
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
  const navigate = useNavigate();
  const {
    signOut,
    user
  } = useAuth();
  const {
    subscribed
  } = useSubscription();
  const {
    state,
    isMobile
  } = useSidebar();
  const isCollapsed = state === 'collapsed';
  const handleSignOut = async () => {
    await signOut();
  };
  const handleSettingsClick = () => {
    onSettingsClick();
  };
  const handleProClick = () => {
    onProClick();
  };
  const handleSubscriptionClick = () => {
    navigate('/subscription');
  };
  const menuItems = [{
    title: 'Applications',
    icon: FileText,
    id: 'applications',
    onClick: () => onTabChange('applications')
  }, {
    title: 'Statistics',
    icon: BarChart3,
    id: 'statistics',
    onClick: () => onTabChange('statistics')
  }, {
    title: 'Settings',
    icon: Settings,
    id: 'settings',
    onClick: handleSettingsClick
  },
  // Add Subscription menu item only for pro users
  ...(subscribed ? [{
    title: 'Subscription',
    icon: CreditCard,
    id: 'subscription',
    onClick: handleSubscriptionClick
  }] : [])];
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
    if (isCollapsed && !isMobile) {
      return <div className="flex flex-col items-center gap-2 p-3 bg-gradient-to-r from-purple-500/10 to-pink-500/10 backdrop-blur-sm border border-purple-300/20 rounded-xl">
          <Calendar className="w-4 h-4 text-purple-300" />
          <Clock className="w-4 h-4 text-purple-300" />
        </div>;
    }
    return <div className="space-y-3 p-4 bg-gradient-to-r from-purple-500/10 to-pink-500/10 backdrop-blur-sm border border-purple-300/20 rounded-xl shadow-lg py-[6px]">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-purple-500/20 rounded-lg">
            <Calendar className="w-4 h-4 text-purple-300" />
          </div>
          <span className="text-sm text-white/90 font-medium">
            {formatDate(currentDateTime)}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-500/20 rounded-lg">
            <Clock className="w-4 h-4 text-blue-300" />
          </div>
          <span className="text-sm text-white/90 font-mono">
            {formatTime(currentDateTime)}
          </span>
        </div>
      </div>;
  };
  return <Sidebar className="border-r border-white/10 bg-gradient-to-b from-slate-900 via-purple-900 to-slate-900 backdrop-blur-md shadow-2xl" collapsible="icon">
      <SidebarHeader className="p-6 border-b border-white/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl overflow-hidden shadow-lg bg-gradient-to-r from-purple-500 to-pink-500 p-0.5">
              <div className="w-full h-full rounded-lg flex items-center justify-center bg-white/0">
                <img src="/lovable-uploads/95407aee-75ac-4d31-a281-db4fc0472751.png" alt="TrackZilla Logo" className="w-6 h-6 object-cover" />
              </div>
            </div>
            {(!isCollapsed || isMobile) && <div>
                <h2 className="text-xl font-bold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
                  TrackZilla
                </h2>
                <p className="text-xs text-purple-200/70">Career Dashboard</p>
              </div>}
          </div>
          <SidebarTrigger className="text-white hover:bg-white/10 h-8 w-8 rounded-xl transition-all duration-200 hover:scale-105" />
        </div>
        
        {/* Enhanced Profile Section */}
        <div className={`flex items-center gap-4 mt-6 p-4 bg-gradient-to-r from-blue-500/10 to-purple-500/10 backdrop-blur-sm border border-blue-300/20 rounded-xl shadow-lg ${isCollapsed && !isMobile ? 'justify-center' : ''}`}>
          <Avatar className="w-10 h-10 border-2 border-purple-300/30">
            <AvatarFallback className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-sm font-semibold">
              {getUserInitials()}
            </AvatarFallback>
          </Avatar>
          {(!isCollapsed || isMobile) && <div className="flex-1 min-w-0">
              <p className="text-sm text-white/90 truncate font-medium">{user?.email}</p>
              <p className="text-xs text-purple-200/70">{subscribed ? 'Pro User' : 'Free User'}</p>
            </div>}
        </div>
      </SidebarHeader>

      <SidebarContent className="flex-1 px-4 py-6">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-2">
              {menuItems.map(item => <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton onClick={item.onClick} tooltip={isCollapsed && !isMobile ? item.title : undefined} className={`w-full justify-start text-white/80 hover:text-white hover:bg-gradient-to-r hover:from-purple-500/20 hover:to-pink-500/20 transition-all duration-200 rounded-xl h-12 ${activeTab === item.id ? 'bg-gradient-to-r from-purple-500/30 to-pink-500/30 text-white border border-purple-300/30 shadow-lg' : ''} ${isCollapsed && !isMobile ? 'justify-center' : ''}`}>
                    <div className={`p-2 rounded-lg ${activeTab === item.id ? 'bg-purple-500/20' : 'bg-white/10'}`}>
                      <item.icon className="w-5 h-5" />
                    </div>
                    {(!isCollapsed || isMobile) && <span className="font-medium">{item.title}</span>}
                  </SidebarMenuButton>
                </SidebarMenuItem>)}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4 border-t border-white/10 space-y-4">
        {/* Date and Time Display */}
        <DateTimeDisplay />
        
        <Separator className="bg-white/10" />
        
        {/* ProZilla Upgrade Section - Only show for non-pro users */}
        {!subscribed && <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton onClick={handleProClick} tooltip={isCollapsed && !isMobile ? "Diventa ProZilla" : undefined} className={`w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold shadow-xl border-2 border-purple-400/50 transition-all duration-300 hover:scale-105 rounded-xl h-14 ${activeTab === 'pro' ? 'scale-105 shadow-2xl border-purple-300/70' : ''} ${isCollapsed && !isMobile ? 'justify-center' : 'justify-start'}`}>
                <div className={`flex items-center ${isCollapsed && !isMobile ? '' : 'gap-3'}`}>
                  <div className="flex items-center gap-1 p-2 bg-gradient-to-r from-yellow-400/20 to-orange-400/20 rounded-lg">
                    <Zap className="w-5 h-5 text-yellow-300" />
                    {(!isCollapsed || isMobile) && <Sparkles className="w-4 h-4 text-orange-300" />}
                  </div>
                  {(!isCollapsed || isMobile) && <div className="flex flex-col items-start">
                      <span className="text-sm font-bold">Diventa ProZilla</span>
                      <span className="text-xs text-purple-200/80">Unlock Premium</span>
                    </div>}
                </div>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>}
        
        {/* Logout Button */}
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={handleSignOut} tooltip={isCollapsed && !isMobile ? "Logout" : undefined} className={`w-full text-white/70 hover:text-white hover:bg-red-500/20 transition-all duration-200 rounded-xl h-12 border border-transparent hover:border-red-400/30 ${isCollapsed && !isMobile ? 'justify-center' : 'justify-start'}`}>
              <div className="p-2 bg-red-500/20 rounded-lg">
                <LogOut className="w-5 h-5 text-red-300" />
              </div>
              {(!isCollapsed || isMobile) && <span className="font-medium">Logout</span>}
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>;
};