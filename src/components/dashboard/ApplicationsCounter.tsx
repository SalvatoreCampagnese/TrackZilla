
import React from 'react';
import { Target, Activity } from 'lucide-react';

interface ApplicationsCounterProps {
  totalApplications: number;
  inProgressApplications: number;
}

export const ApplicationsCounter: React.FC<ApplicationsCounterProps> = ({
  totalApplications,
  inProgressApplications
}) => {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
      <div className="flex items-center gap-4 px-4 sm:px-6 py-4 bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-xl border border-purple-300/20 rounded-2xl shadow-lg w-full sm:w-auto">
        <div className="p-2 bg-purple-500/20 rounded-xl">
          <Target className="w-6 h-6 text-purple-300" />
        </div>
        <div>
          <p className="text-sm text-purple-200/70 font-medium">Total Applications</p>
          <p className="text-2xl font-bold text-white">{totalApplications}</p>
        </div>
      </div>
      <div className="flex items-center gap-4 px-4 sm:px-6 py-4 bg-gradient-to-r from-green-500/20 to-emerald-500/20 backdrop-blur-xl border border-green-300/20 rounded-2xl shadow-lg w-full sm:w-auto">
        <div className="p-2 bg-green-500/20 rounded-xl">
          <Activity className="w-6 h-6 text-green-300" />
        </div>
        <div>
          <p className="text-sm text-green-200/70 font-medium">In Progress</p>
          <p className="text-2xl font-bold text-white">{inProgressApplications}</p>
        </div>
      </div>
    </div>
  );
};
