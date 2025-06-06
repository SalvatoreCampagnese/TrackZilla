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
  // Calcoli delle metriche
  const totalApplications = applications.length;
  const responsesReceived = applications.filter(app => 
    !['in-corso', 'ghosting'].includes(app.status)
  ).length;
  const responseRate = totalApplications > 0 ? (responsesReceived / totalApplications * 100) : 0;
  
  const interviewsObtained = applications.filter(app => 
    ['primo-colloquio', 'secondo-colloquio', 'colloquio-tecnico', 'colloquio-finale', 'offerta-ricevuta'].includes(app.status)
  ).length;

  // Tempo medio di feedback (simulato basato sulla data di candidatura)
  const avgFeedbackTime = applications.length > 0 
    ? Math.round(applications.reduce((acc, app) => {
        const daysSinceApplication = Math.floor((new Date().getTime() - new Date(app.applicationDate).getTime()) / (1000 * 60 * 60 * 24));
        return acc + daysSinceApplication;
      }, 0) / applications.length)
    : 0;

  // Dati per il grafico delle aziende più veloci
  const companyResponseData = applications
    .filter(app => app.status !== 'in-corso' && app.status !== 'ghosting')
    .reduce((acc: any[], app) => {
      const existing = acc.find(item => item.company === app.companyName);
      const daysSinceApplication = Math.floor((new Date().getTime() - new Date(app.applicationDate).getTime()) / (1000 * 60 * 60 * 24));
      
      if (existing) {
        existing.avgDays = Math.round((existing.avgDays + daysSinceApplication) / 2);
      } else {
        acc.push({
          company: app.companyName,
          avgDays: daysSinceApplication
        });
      }
      return acc;
    }, [])
    .sort((a, b) => a.avgDays - b.avgDays)
    .slice(0, 5);

  // Dati per il grafico degli stati avanzati
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

  // Configurazione dei colori per i grafici
  const chartConfig = {
    company: {
      label: "Azienda",
    },
    avgDays: {
      label: "Giorni medi",
      color: "hsl(var(--chart-1))",
    },
    count: {
      label: "Colloqui",
      color: "hsl(var(--chart-2))",
    },
  };

  const pieColors = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  return (
    <div className="space-y-6">
      {/* Metriche principali */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-white dark:bg-gray-900/50 border-gray-200 dark:border-gray-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-900 dark:text-white">Candidature Totali</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground dark:text-gray-300" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{totalApplications}</div>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-gray-900/50 border-gray-200 dark:border-gray-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-900 dark:text-white">Tasso di Risposta</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground dark:text-gray-300" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{responseRate.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground dark:text-gray-200">
              {responsesReceived} su {totalApplications}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-gray-900/50 border-gray-200 dark:border-gray-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-900 dark:text-white">Tempo Medio Feedback</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground dark:text-gray-300" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{avgFeedbackTime}</div>
            <p className="text-xs text-muted-foreground dark:text-gray-200">giorni</p>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-gray-900/50 border-gray-200 dark:border-gray-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-900 dark:text-white">Colloqui Ottenuti</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground dark:text-gray-300" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{interviewsObtained}</div>
            <p className="text-xs text-muted-foreground dark:text-gray-200">
              {totalApplications > 0 ? ((interviewsObtained / totalApplications) * 100).toFixed(1) : 0}% del totale
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Grafici */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Grafico aziende più veloci */}
        <Card className="bg-white dark:bg-gray-900/50 border-gray-200 dark:border-gray-800">
          <CardHeader>
            <CardTitle className="text-gray-900 dark:text-white">Aziende Più Veloci a Rispondere</CardTitle>
          </CardHeader>
          <CardContent>
            {companyResponseData.length > 0 ? (
              <ChartContainer config={chartConfig} className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={companyResponseData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="company" 
                      tick={{ fontSize: 12 }}
                      angle={-45}
                      textAnchor="end"
                      height={80}
                    />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="avgDays" fill="var(--color-avgDays)" />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-muted-foreground dark:text-gray-200">
                Nessun dato disponibile
              </div>
            )}
          </CardContent>
        </Card>

        {/* Grafico stati avanzati */}
        <Card className="bg-white dark:bg-gray-900/50 border-gray-200 dark:border-gray-800">
          <CardHeader>
            <CardTitle className="text-gray-900 dark:text-white">Aziende con Stati Avanzati</CardTitle>
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
                Nessun dato disponibile
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
