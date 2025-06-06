
import React from 'react';
import { JobApplication } from '@/types/job';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Clock, TrendingUp, Users, CheckCircle } from 'lucide-react';

interface StatisticsProps {
  applications: JobApplication[];
}

export const Statistics: React.FC<StatisticsProps> = ({ applications }) => {
  // Calculations for metrics
  const totalApplications = applications.length;
  const responsesReceived = applications.filter(app => 
    !['in-corso', 'ghosting'].includes(app.status)
  ).length;
  const responseRate = totalApplications > 0 ? (responsesReceived / totalApplications * 100) : 0;
  
  const interviewsObtained = applications.filter(app => 
    ['primo-colloquio', 'secondo-colloquio', 'colloquio-tecnico', 'colloquio-finale', 'offerta-ricevuta'].includes(app.status)
  ).length;

  // Average feedback time (simulated based on application date)
  const avgFeedbackTime = applications.length > 0 
    ? Math.round(applications.reduce((acc, app) => {
        const daysSinceApplication = Math.floor((new Date().getTime() - new Date(app.applicationDate).getTime()) / (1000 * 60 * 60 * 24));
        return acc + daysSinceApplication;
      }, 0) / applications.length)
    : 0;

  // Data for advanced interview stages chart - showing jobs with most advanced stages
  const advancedInterviewsData = applications
    .filter(app => ['primo-colloquio', 'secondo-colloquio', 'colloquio-tecnico', 'colloquio-finale', 'offerta-ricevuta'].includes(app.status))
    .map(app => {
      // Assign a score based on how advanced the stage is
      const stageScore = {
        'primo-colloquio': 1,
        'secondo-colloquio': 2,
        'colloquio-tecnico': 3,
        'colloquio-finale': 4,
        'offerta-ricevuta': 5
      }[app.status] || 0;

      return {
        company: app.companyName,
        role: app.roleDescription,
        stage: app.status,
        stageScore,
        displayName: `${app.companyName} - ${app.roleDescription.substring(0, 20)}${app.roleDescription.length > 20 ? '...' : ''}`
      };
    })
    .sort((a, b) => b.stageScore - a.stageScore)
    .slice(0, 5);

  // Data for companies with advanced stages (pie chart)
  const advancedStatusData = applications
    .filter(app => ['primo-colloquio', 'secondo-colloquio', 'colloquio-tecnico', 'colloquio-finale', 'offerta-ricevuta'].includes(app.status))
    .reduce((acc: any[], app) => {
      const existing = acc.find(item => item.company === app.companyName);
      if (existing) {
        existing.count += 1;
      } else {
        acc.push({
          company: app.companyName,
          count: 1,
          status: app.status
        });
      }
      return acc;
    }, [])
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  // Chart configuration
  const chartConfig = {
    company: {
      label: "Company",
    },
    stageScore: {
      label: "Interview Stage",
      color: "hsl(var(--chart-1))",
    },
    count: {
      label: "Interviews",
      color: "hsl(var(--chart-2))",
    },
  };

  const pieColors = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  return (
    <div className="space-y-6">
      {/* Main metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-gray-800 to-gray-900 border-white/30">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-900 dark:text-white">Total Applications</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground dark:text-gray-300" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{totalApplications}</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-gray-800 to-gray-900 border-white/30">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-900 dark:text-white">Response Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground dark:text-gray-300" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{responseRate.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground dark:text-gray-200">
              {responsesReceived} out of {totalApplications}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-gray-800 to-gray-900 border-white/30">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-900 dark:text-white">Average Feedback Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground dark:text-gray-300" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{avgFeedbackTime}</div>
            <p className="text-xs text-muted-foreground dark:text-gray-200">days</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-gray-800 to-gray-900 border-white/30">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-900 dark:text-white">Interviews Obtained</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground dark:text-gray-300" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{interviewsObtained}</div>
            <p className="text-xs text-muted-foreground dark:text-gray-200">
              {totalApplications > 0 ? ((interviewsObtained / totalApplications) * 100).toFixed(1) : 0}% of total
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Advanced interview stages chart */}
        <Card className="bg-gradient-to-br from-gray-800 to-gray-900 border-white/30">
          <CardHeader>
            <CardTitle className="text-gray-900 dark:text-white">Most Advanced Interview Stages</CardTitle>
          </CardHeader>
          <CardContent>
            {advancedInterviewsData.length > 0 ? (
              <ChartContainer config={chartConfig} className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={advancedInterviewsData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="displayName" 
                      tick={{ fontSize: 10 }}
                      angle={-45}
                      textAnchor="end"
                      height={100}
                    />
                    <YAxis domain={[0, 5]} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="stageScore" fill="var(--color-stageScore)" />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-muted-foreground dark:text-gray-200">
                No data available
              </div>
            )}
          </CardContent>
        </Card>

        {/* Companies with advanced stages */}
        <Card className="bg-gradient-to-br from-gray-800 to-gray-900 border-white/30">
          <CardHeader>
            <CardTitle className="text-gray-900 dark:text-white">Companies with Advanced Stages</CardTitle>
          </CardHeader>
          <CardContent>
            {advancedStatusData.length > 0 ? (
              <ChartContainer config={chartConfig} className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={advancedStatusData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ company, count }) => `${company}: ${count}`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="count"
                    >
                      {advancedStatusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={pieColors[index % pieColors.length]} />
                      ))}
                    </Pie>
                    <ChartTooltip content={<ChartTooltipContent />} />
                  </PieChart>
                </ResponsiveContainer>
              </ChartContainer>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-muted-foreground dark:text-gray-200">
                No data available
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
