
import React from 'react';
import { JobApplication } from '@/types/job';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock, TrendingUp, Users, CheckCircle, Award } from 'lucide-react';

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

  // Data for advanced interview stages - showing jobs with most advanced stages
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

      {/* Most advanced interview stages list */}
      <Card className="bg-gradient-to-br from-gray-800 to-gray-900 border-white/30">
        <CardHeader>
          <CardTitle className="text-gray-900 dark:text-white flex items-center gap-2">
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
            <div className="h-[300px] flex items-center justify-center text-muted-foreground dark:text-gray-200">
              No data available
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
