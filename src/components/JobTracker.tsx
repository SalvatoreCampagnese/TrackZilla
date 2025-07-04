
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useJobApplications } from '@/hooks/useJobApplications';
import { useGhostingUpdater } from '@/hooks/useGhostingUpdater';
import { JobList } from './JobList';
import { Statistics } from './Statistics';
import { KanbanBoard } from './kanban/KanbanBoard';
import { AppSidebar } from './AppSidebar';
import { SettingsContent } from './SettingsContent';
import ProPage from '@/pages/ProPage';
import { Plus, Target, TrendingUp, Clock, CheckCircle, List, Columns, Sparkles, Activity } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export const JobTracker = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { applications, loading, updateApplicationStatus, deleteApplication, refetch } = useJobApplications();
  const [viewMode, setViewMode] = useState<'list' | 'kanban'>('list');
  const [activeTab, setActiveTab] = useState('applications');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Initialize the ghosting updater
  useGhostingUpdater();

  const handleUpdateStatus = async (id: string, status: any) => {
    await updateApplicationStatus(id, status);
    await refetch();
  };

  const handleAddApplication = () => {
    navigate('/add-job');
  };

  const handleSettingsClick = () => {
    setActiveTab('settings');
  };

  const handleProClick = () => {
    setActiveTab('pro');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-20 w-20 border-4 border-purple-200 border-t-purple-500 mx-auto"></div>
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 opacity-20 animate-pulse"></div>
          </div>
          <p className="mt-6 text-white text-lg font-medium">Loading applications...</p>
          <div className="mt-2 flex items-center justify-center gap-1">
            <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
            <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
          </div>
        </div>
      </div>
    );
  };

  // Filter applications based on status
  const filteredApplications = statusFilter === 'all' 
    ? applications 
    : applications.filter(app => app.status === statusFilter);

  // Calculations for quick counters
  const totalApplications = filteredApplications.length;
  const responsesReceived = filteredApplications.filter(app => 
    !['in-corso', 'ghosting'].includes(app.status)
  ).length;
  const responseRate = totalApplications > 0 ? (responsesReceived / totalApplications * 100) : 0;
  const interviewsObtained = filteredApplications.filter(app => 
    ['primo-colloquio', 'secondo-colloquio', 'colloquio-tecnico', 'colloquio-finale', 'offerta-ricevuta'].includes(app.status)
  ).length;
  const avgFeedbackTime = filteredApplications.length > 0 
    ? Math.round(filteredApplications.reduce((acc, app) => {
        const daysSinceApplication = Math.floor((new Date().getTime() - new Date(app.applicationDate).getTime()) / (1000 * 60 * 60 * 24));
        return acc + daysSinceApplication;
      }, 0) / filteredApplications.length)
    : 0;

  // Calculate applications in progress (excluding ghosting, retired, and refused)
  const inProgressApplications = filteredApplications.filter(app => 
    !['ghosting', 'ritirato', 'rifiutato'].includes(app.status)
  ).length;

  // Get unique statuses for filter dropdown
  const uniqueStatuses = [...new Set(applications.map(app => app.status))];

  return (
    <SidebarProvider>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex w-full relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
          <div className="absolute top-3/4 left-3/4 w-64 h-64 bg-pink-500/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '4s'}}></div>
        </div>

        <AppSidebar 
          activeTab={activeTab}
          onTabChange={setActiveTab}
          onSettingsClick={handleSettingsClick}
          onProClick={handleProClick}
        />
        
        <main className="flex-1 flex flex-col min-w-0 relative z-10">
          {/* Enhanced Header */}
          <header className="sticky top-0 z-20 backdrop-blur-xl bg-black/20 border-b border-white/10">
            <div className="flex items-center justify-between p-4 lg:p-6">
              <div className="flex items-center gap-6">
                <SidebarTrigger className="text-white hover:bg-white/10 h-10 w-10 rounded-xl transition-all duration-200" />
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                    <Sparkles className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
                      TrackZilla
                    </h1>
                    <p className="text-sm text-purple-200/70">Your Career Dashboard</p>
                  </div>
                </div>
              </div>
              
              {activeTab === 'applications' && (
                <Button 
                  onClick={handleAddApplication}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 transition-all duration-300 text-white shadow-lg hover:shadow-xl hover:scale-105 rounded-xl px-6"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Add Application
                </Button>
              )}
            </div>
          </header>

          <div className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8 max-w-full space-y-8">
            {/* Enhanced Applications counter */}
            {activeTab === 'applications' && (
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
                <div className="flex items-center gap-4 px-6 py-4 bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-xl border border-purple-300/20 rounded-2xl shadow-lg">
                  <div className="p-2 bg-purple-500/20 rounded-xl">
                    <Target className="w-6 h-6 text-purple-300" />
                  </div>
                  <div>
                    <p className="text-sm text-purple-200/70 font-medium">Total Applications</p>
                    <p className="text-2xl font-bold text-white">{applications.length}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 px-6 py-4 bg-gradient-to-r from-green-500/20 to-emerald-500/20 backdrop-blur-xl border border-green-300/20 rounded-2xl shadow-lg">
                  <div className="p-2 bg-green-500/20 rounded-xl">
                    <Activity className="w-6 h-6 text-green-300" />
                  </div>
                  <div>
                    <p className="text-sm text-green-200/70 font-medium">In Progress</p>
                    <p className="text-2xl font-bold text-white">{inProgressApplications}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Enhanced Quick counters */}
            {activeTab === 'applications' && (
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
                <Card className="group hover:scale-105 transition-all duration-300 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 backdrop-blur-xl border-blue-300/20 shadow-xl hover:shadow-2xl rounded-2xl">
                  <CardContent className="flex items-center justify-between p-6">
                    <div>
                      <p className="text-sm font-medium text-blue-200/70 mb-2">Total</p>
                      <p className="text-3xl font-bold text-white">{totalApplications}</p>
                      <div className="w-12 h-1 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full mt-3"></div>
                    </div>
                    <div className="p-4 bg-blue-500/20 rounded-2xl group-hover:scale-110 transition-transform">
                      <Target className="w-8 h-8 text-blue-300" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="group hover:scale-105 transition-all duration-300 bg-gradient-to-br from-green-500/20 to-emerald-500/20 backdrop-blur-xl border-green-300/20 shadow-xl hover:shadow-2xl rounded-2xl">
                  <CardContent className="flex items-center justify-between p-6">
                    <div>
                      <p className="text-sm font-medium text-green-200/70 mb-2">Response Rate</p>
                      <p className="text-3xl font-bold text-white">{responseRate.toFixed(1)}%</p>
                      <div className="w-12 h-1 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full mt-3"></div>
                    </div>
                    <div className="p-4 bg-green-500/20 rounded-2xl group-hover:scale-110 transition-transform">
                      <TrendingUp className="w-8 h-8 text-green-300" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="group hover:scale-105 transition-all duration-300 bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-xl border-purple-300/20 shadow-xl hover:shadow-2xl rounded-2xl">
                  <CardContent className="flex items-center justify-between p-6">
                    <div>
                      <p className="text-sm font-medium text-purple-200/70 mb-2">Interviews</p>
                      <p className="text-3xl font-bold text-white">{interviewsObtained}</p>
                      <div className="w-12 h-1 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full mt-3"></div>
                    </div>
                    <div className="p-4 bg-purple-500/20 rounded-2xl group-hover:scale-110 transition-transform">
                      <CheckCircle className="w-8 h-8 text-purple-300" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="group hover:scale-105 transition-all duration-300 bg-gradient-to-br from-orange-500/20 to-red-500/20 backdrop-blur-xl border-orange-300/20 shadow-xl hover:shadow-2xl rounded-2xl">
                  <CardContent className="flex items-center justify-between p-6">
                    <div>
                      <p className="text-sm font-medium text-orange-200/70 mb-2">Avg Time</p>
                      <p className="text-3xl font-bold text-white">{avgFeedbackTime}d</p>
                      <div className="w-12 h-1 bg-gradient-to-r from-orange-400 to-red-400 rounded-full mt-3"></div>
                    </div>
                    <div className="p-4 bg-orange-500/20 rounded-2xl group-hover:scale-110 transition-transform">
                      <Clock className="w-8 h-8 text-orange-300" />
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Enhanced Filters and View Mode Switcher */}
            {activeTab === 'applications' && (
              <div className="flex flex-col sm:flex-row items-start w-full sm:items-center justify-between gap-6 p-6 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-lg">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full sm:w-[220px] border-white/20 bg-white/10 hover:bg-white/20 text-white rounded-xl h-12 transition-all duration-200">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-white/20 rounded-xl">
                    <SelectItem value="all" className="text-white hover:bg-white/10 rounded-lg">All Applications</SelectItem>
                    {uniqueStatuses.map((status) => (
                      <SelectItem key={status} value={status} className="text-white hover:bg-white/10 rounded-lg">
                        {status === 'in-corso' ? 'In Progress' :
                         status === 'primo-colloquio' ? 'First Interview' :
                         status === 'secondo-colloquio' ? 'Second Interview' :
                         status === 'colloquio-tecnico' ? 'Technical Interview' :
                         status === 'colloquio-finale' ? 'Final Interview' :
                         status === 'offerta-ricevuta' ? 'Offer Received' :
                         status === 'rifiutato' ? 'Rejected' :
                         status === 'ghosting' ? 'Ghosting' :
                         status === 'ritirato' ? 'Withdrawn' : status}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <div className="flex items-center gap-3 p-2 bg-white/10 rounded-2xl backdrop-blur-sm">
                  <Button
                    onClick={() => setViewMode('list')}
                    variant={viewMode === 'list' ? 'default' : 'ghost'}
                    size="sm"
                    className={viewMode === 'list' 
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl px-6 shadow-lg'
                      : 'text-white/70 hover:text-white hover:bg-white/10 rounded-xl px-6'
                    }
                  >
                    <List className="w-4 h-4 mr-2" />
                    List
                  </Button>
                  <Button
                    onClick={() => setViewMode('kanban')}
                    variant={viewMode === 'kanban' ? 'default' : 'ghost'}
                    size="sm"
                    className={viewMode === 'kanban' 
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl px-6 shadow-lg'
                      : 'text-white/70 hover:text-white hover:bg-white/10 rounded-xl px-6'
                    }
                  >
                    <Columns className="w-4 h-4 mr-2" />
                    Kanban
                  </Button>
                </div>
              </div>
            )}

            {/* Content based on active tab */}
            {activeTab === 'applications' && (
              <div className="overflow-hidden">
                {viewMode === 'list' ? (
                  <JobList
                    applications={filteredApplications}
                    onUpdateStatus={handleUpdateStatus}
                    onDelete={deleteApplication}
                  />
                ) : (
                  <KanbanBoard
                    applications={filteredApplications}
                    onUpdateStatus={handleUpdateStatus}
                    onDelete={deleteApplication}
                  />
                )}
              </div>
            )}
            
            {activeTab === 'statistics' && (
              <Statistics applications={applications} />
            )}
            
            {activeTab === 'settings' && (
              <SettingsContent />
            )}

            {activeTab === 'pro' && (
              <ProPage />
            )}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};
