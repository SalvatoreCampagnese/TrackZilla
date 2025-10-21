
import React from 'react';
import { JobApplication } from '@/types/job';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock, TrendingUp, Users, CheckCircle, Award, Target, Calendar, Building2 } from 'lucide-react';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from 'recharts';

interface StatisticsProps {
  applications: JobApplication[];
}

export const Statistics: React.FC<StatisticsProps> = ({ applications }) => {
  console.log('Statistics component rendered with applications:', applications);

  // Early return with fallback if no applications
  if (!applications || applications.length === 0) {
    return (
      <div className="space-y-6">
        <div className="text-center py-12">
          <div className="text-white/70 text-lg mb-4">No applications found</div>
          <div className="text-white/50 text-sm">Add some job applications to see statistics</div>
        </div>
      </div>
    );
  }

  const totalApplications = applications.length;
  const responsesReceived = applications.filter(app => 
    !['in-corso', 'ghosting'].includes(app.status)
  ).length;
  const responseRate = totalApplications > 0 ? (responsesReceived / totalApplications * 100) : 0;
  
  const interviewsObtained = applications.filter(app => 
    ['primo-colloquio', 'secondo-colloquio', 'colloquio-tecnico', 'colloquio-finale', 'offerta-ricevuta'].includes(app.status)
  ).length;

  const offersReceived = applications.filter(app => app.status === 'offerta-ricevuta').length;
  const successRate = totalApplications > 0 ? (offersReceived / totalApplications * 100) : 0;

  const fourWeeksAgo = new Date();
  fourWeeksAgo.setDate(fourWeeksAgo.getDate() - 28);
  const recentApplications = applications.filter(app => 
    new Date(app.applicationDate) >= fourWeeksAgo
  );
  const applicationsPerWeek = recentApplications.length / 4;

  const firstInterviewApps = applications.filter(app => 
    ['primo-colloquio', 'secondo-colloquio', 'colloquio-tecnico', 'colloquio-finale', 'offerta-ricevuta'].includes(app.status)
  );
  const avgTimeToInterview = firstInterviewApps.length > 0 
    ? Math.round(firstInterviewApps.reduce((acc, app) => {
        const daysSinceApplication = Math.floor((new Date().getTime() - new Date(app.applicationDate).getTime()) / (1000 * 60 * 60 * 24));
        return acc + daysSinceApplication;
      }, 0) / firstInterviewApps.length)
    : 0;

  const avgFeedbackTime = applications.length > 0 
    ? Math.round(applications.reduce((acc, app) => {
        const daysSinceApplication = Math.floor((new Date().getTime() - new Date(app.applicationDate).getTime()) / (1000 * 60 * 60 * 24));
        return acc + daysSinceApplication;
      }, 0) / applications.length)
    : 0;

  const workModeDistribution = applications.reduce((acc, app) => {
    const mode = app.workMode || 'ND';
    acc[mode] = (acc[mode] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const workModeData = Object.entries(workModeDistribution).map(([mode, count]) => ({
    name: mode === 'ND' ? 'Not Specified' : 
          mode === 'remoto' ? 'Remote' :
          mode === 'ibrido' ? 'Hybrid' :
          mode === 'in-presenza' ? 'On-site' : mode,
    value: count,
    percentage: totalApplications > 0 ? Math.round((count / totalApplications) * 100) : 0
  }));

  const statusDistribution = applications.reduce((acc, app) => {
    acc[app.status] = (acc[app.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const statusData = Object.entries(statusDistribution).map(([status, count]) => ({
    name: status === 'in-corso' ? 'In Progress' :
          status === 'primo-colloquio' ? 'First Interview' :
          status === 'secondo-colloquio' ? 'Second Interview' :
          status === 'colloquio-tecnico' ? 'Technical Interview' :
          status === 'colloquio-finale' ? 'Final Interview' :
          status === 'offerta-ricevuta' ? 'Offer Received' :
          status === 'rifiutato' ? 'Rejected' :
          status === 'ghosting' ? 'Ghosting' :
          status === 'ritirato' ? 'Withdrawn' : status,
    value: count,
    percentage: totalApplications > 0 ? Math.round((count / totalApplications) * 100) : 0
  }));

  const companyCount = applications.reduce((acc, app) => {
    const company = app.companyName || 'Unknown';
    acc[company] = (acc[company] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const topCompanies = Object.entries(companyCount)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([company, count]) => ({ company, count }));

  const advancedInterviewsData = applications
    .filter(app => ['primo-colloquio', 'secondo-colloquio', 'colloquio-tecnico', 'colloquio-finale', 'offerta-ricevuta'].includes(app.status))
    .map(app => {
      const stageScore = {
        'primo-colloquio': 1,
        'secondo-colloquio': 2,
        'colloquio-tecnico': 3,
        'colloquio-finale': 4,
        'offerta-ricevuta': 5
      }[app.status] || 0;

      const stageLabels = {
        'primo-colloquio': 'First Interview',
        'secondo-colloquio': 'Second Interview',
        'colloquio-tecnico': 'Technical Interview',
        'colloquio-finale': 'Final Interview',
        'offerta-ricevuta': 'Offer Received'
      };

      return {
        company: app.companyName,
        role: app.roleDescription,
        stage: stageLabels[app.status as keyof typeof stageLabels] || app.status,
        stageScore,
        applicationDate: app.applicationDate
      };
    })
    .sort((a, b) => b.stageScore - a.stageScore)
    .slice(0, 10);

  const COLORS = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6', '#8b5cf6'];

  return (
    <div className="space-y-6">
      {/* Main metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-gray-800 to-gray-900 border-white/30">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">Total Applications</CardTitle>
            <Users className="h-4 w-4 text-white/70" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{totalApplications}</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-gray-800 to-gray-900 border-white/30">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">Response Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-white/70" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{responseRate.toFixed(1)}%</div>
            <p className="text-xs text-white/70">
              {responsesReceived} out of {totalApplications}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-gray-800 to-gray-900 border-white/30">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">Interview Rate</CardTitle>
            <CheckCircle className="h-4 w-4 text-white/70" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{interviewsObtained}</div>
            <p className="text-xs text-white/70">
              {totalApplications > 0 ? ((interviewsObtained / totalApplications) * 100).toFixed(1) : 0}% of total
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-gray-800 to-gray-900 border-white/30">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">Success Rate</CardTitle>
            <Target className="h-4 w-4 text-white/70" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{successRate.toFixed(1)}%</div>
            <p className="text-xs text-white/70">
              {offersReceived} offers received
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Additional metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-gray-800 to-gray-900 border-white/30">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">Avg Feedback Time</CardTitle>
            <Clock className="h-4 w-4 text-white/70" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{avgFeedbackTime}</div>
            <p className="text-xs text-white/70">days</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-gray-800 to-gray-900 border-white/30">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">Time to Interview</CardTitle>
            <Calendar className="h-4 w-4 text-white/70" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{avgTimeToInterview}</div>
            <p className="text-xs text-white/70">avg days</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-gray-800 to-gray-900 border-white/30">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">Weekly Applications</CardTitle>
            <TrendingUp className="h-4 w-4 text-white/70" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{applicationsPerWeek.toFixed(1)}</div>
            <p className="text-xs text-white/70">last 4 weeks</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-gray-800 to-gray-900 border-white/30">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">Active Companies</CardTitle>
            <Building2 className="h-4 w-4 text-white/70" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{Object.keys(companyCount).length}</div>
            <p className="text-xs text-white/70">companies applied to</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts section - Fully responsive */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Work Mode Distribution */}
        <Card className="bg-gradient-to-br from-gray-800 to-gray-900 border-white/30">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              Work Mode Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            {workModeData.length > 0 ? (
              <div className="w-full">
                <div className="w-full h-[200px] sm:h-[250px] md:h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={workModeData}
                        cx="50%"
                        cy="50%"
                        innerRadius={30}
                        outerRadius={60}
                        dataKey="value"
                      >
                        {workModeData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <ChartTooltip 
                        content={({ active, payload }) => {
                          if (active && payload && payload.length) {
                            return (
                              <div className="bg-gray-800 border border-white/20 rounded-lg p-2">
                                <p className="text-white text-sm">{`${payload[0].name}: ${payload[0].value} (${payload[0].payload.percentage}%)`}</p>
                              </div>
                            );
                          }
                          return null;
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-4 space-y-2">
                  {workModeData.map((item, index) => (
                    <div key={item.name} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-3 h-3 rounded"
                          style={{ backgroundColor: COLORS[index % COLORS.length] }}
                        />
                        <span className="text-sm text-white/70">{item.name}</span>
                      </div>
                      <span className="text-sm text-white font-medium">{item.percentage}%</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-white/70">
                No data available
              </div>
            )}
          </CardContent>
        </Card>

        {/* Application Status Distribution */}
        <Card className="bg-gradient-to-br from-gray-800 to-gray-900 border-white/30">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              Application Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            {statusData.length > 0 ? (
              <div className="w-full h-[200px] sm:h-[250px] md:h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={statusData} layout="vertical" margin={{ top: 5, right: 30, left: 5, bottom: 5 }}>
                    <XAxis type="number" hide />
                    <YAxis 
                      type="category" 
                      dataKey="name" 
                      tick={{ fill: 'rgba(255,255,255,0.7)', fontSize: 10 }}
                      width={60}
                    />
                    <Bar dataKey="value" fill="#ef4444" radius={[0, 4, 4, 0]} />
                    <ChartTooltip 
                      content={({ active, payload, label }) => {
                        if (active && payload && payload.length) {
                          return (
                            <div className="bg-gray-800 border border-white/20 rounded-lg p-2">
                              <p className="text-white text-sm">{`${label}: ${payload[0].value}`}</p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-white/70">
                No data available
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Top Companies */}
      <Card className="bg-gradient-to-br from-gray-800 to-gray-900 border-white/30">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Building2 className="w-5 h-5" />
            Top Companies by Applications
          </CardTitle>
        </CardHeader>
        <CardContent>
          {topCompanies.length > 0 ? (
            <div className="space-y-3">
              {topCompanies.map((item, index) => (
                <div 
                  key={item.company}
                  className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-medium text-white bg-gradient-to-r from-red-500 to-red-600 px-2 py-1 rounded-full">
                      #{index + 1}
                    </span>
                    <span className="font-medium text-white">{item.company}</span>
                  </div>
                  <span className="text-sm font-medium text-white/90">
                    {item.count} application{item.count > 1 ? 's' : ''}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="h-[200px] flex items-center justify-center text-white/70">
              No companies data available
            </div>
          )}
        </CardContent>
      </Card>

      {/* Most advanced interview stages list */}
      <Card className="bg-gradient-to-br from-gray-800 to-gray-900 border-white/30">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Award className="w-5 h-5" />
            Most Advanced Interview Stages
          </CardTitle>
        </CardHeader>
        <CardContent>
          {advancedInterviewsData.length > 0 ? (
            <div className="space-y-3">
              {advancedInterviewsData.map((item, index) => (
                <div 
                  key={`${item.company}-${item.role}-${index}`}
                  className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10"
                >
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-white truncate">
                      {item.company}
                    </div>
                    <div className="text-sm text-white/70 truncate">
                      {item.role}
                    </div>
                    <div className="text-xs text-white/50">
                      Applied: {new Date(item.applicationDate).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    <span className="text-xs font-medium text-white bg-gradient-to-r from-red-500 to-red-600 px-2 py-1 rounded-full">
                      #{index + 1}
                    </span>
                    <span className="text-sm font-medium text-white/90 text-right min-w-0">
                      {item.stage}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-white/70">
              No interview data available
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
