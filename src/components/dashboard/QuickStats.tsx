
import React from 'react';
import { Target, TrendingUp, CheckCircle, Clock } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface QuickStatsProps {
  totalApplications: number;
  responseRate: number;
  interviewsObtained: number;
  avgFeedbackTime: number;
}

export const QuickStats: React.FC<QuickStatsProps> = ({
  totalApplications,
  responseRate,
  interviewsObtained,
  avgFeedbackTime
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
      <Card className="group hover:scale-105 transition-all duration-300 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 backdrop-blur-xl border-blue-300/20 shadow-xl hover:shadow-2xl rounded-2xl">
        <CardContent className="flex items-center justify-between p-4 sm:p-6">
          <div>
            <p className="text-sm font-medium text-blue-200/70 mb-2">Total</p>
            <p className="text-2xl sm:text-3xl font-bold text-white">{totalApplications}</p>
            <div className="w-12 h-1 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full mt-3"></div>
          </div>
          <div className="p-3 sm:p-4 bg-blue-500/20 rounded-2xl group-hover:scale-110 transition-transform">
            <Target className="w-6 h-6 sm:w-8 sm:h-8 text-blue-300" />
          </div>
        </CardContent>
      </Card>

      <Card className="group hover:scale-105 transition-all duration-300 bg-gradient-to-br from-green-500/20 to-emerald-500/20 backdrop-blur-xl border-green-300/20 shadow-xl hover:shadow-2xl rounded-2xl">
        <CardContent className="flex items-center justify-between p-4 sm:p-6">
          <div>
            <p className="text-sm font-medium text-green-200/70 mb-2">Response Rate</p>
            <p className="text-2xl sm:text-3xl font-bold text-white">{responseRate.toFixed(1)}%</p>
            <div className="w-12 h-1 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full mt-3"></div>
          </div>
          <div className="p-3 sm:p-4 bg-green-500/20 rounded-2xl group-hover:scale-110 transition-transform">
            <TrendingUp className="w-6 h-6 sm:w-8 sm:h-8 text-green-300" />
          </div>
        </CardContent>
      </Card>

      <Card className="group hover:scale-105 transition-all duration-300 bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-xl border-purple-300/20 shadow-xl hover:shadow-2xl rounded-2xl">
        <CardContent className="flex items-center justify-between p-4 sm:p-6">
          <div>
            <p className="text-sm font-medium text-purple-200/70 mb-2">Interviews</p>
            <p className="text-2xl sm:text-3xl font-bold text-white">{interviewsObtained}</p>
            <div className="w-12 h-1 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full mt-3"></div>
          </div>
          <div className="p-3 sm:p-4 bg-purple-500/20 rounded-2xl group-hover:scale-110 transition-transform">
            <CheckCircle className="w-6 h-6 sm:w-8 sm:h-8 text-purple-300" />
          </div>
        </CardContent>
      </Card>

      <Card className="group hover:scale-105 transition-all duration-300 bg-gradient-to-br from-orange-500/20 to-red-500/20 backdrop-blur-xl border-orange-300/20 shadow-xl hover:shadow-2xl rounded-2xl">
        <CardContent className="flex items-center justify-between p-4 sm:p-6">
          <div>
            <p className="text-sm font-medium text-orange-200/70 mb-2">Avg Time</p>
            <p className="text-2xl sm:text-3xl font-bold text-white">{avgFeedbackTime}d</p>
            <div className="w-12 h-1 bg-gradient-to-r from-orange-400 to-red-400 rounded-full mt-3"></div>
          </div>
          <div className="p-3 sm:p-4 bg-orange-500/20 rounded-2xl group-hover:scale-110 transition-transform">
            <Clock className="w-6 h-6 sm:w-8 sm:h-8 text-orange-300" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
