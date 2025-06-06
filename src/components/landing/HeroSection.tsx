import React from 'react';
import { Button } from '@/components/ui/button';
import { Target, TrendingUp, Briefcase } from 'lucide-react';
interface HeroSectionProps {
  onGetStarted: () => void;
}
export const HeroSection: React.FC<HeroSectionProps> = ({
  onGetStarted
}) => {
  return <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-center mb-8">
          <img src="/lovable-uploads/1cfab0e7-65a8-4956-b798-4ac8733c8283.png" alt="TrackZilla Logo" className="w-32 h-32 sm:w-40 sm:h-40 lg:w-48 lg:h-48" />
        </div>
        
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6">
          <span className="text-blue-600 dark:text-blue-400">TRACKZILLA</span>
        </h1>
        
        <p className="text-2xl sm:text-3xl font-semibold text-gray-700 dark:text-gray-300 mb-6 tracking-wide">TAME THE JOB HUNT
Grrrrawwwwwwww!</p>
        
        <p className="text-xl text-gray-600 dark:text-gray-300 mb-12 max-w-3xl mx-auto">Job hunt got you feeling like you’re fighting a Gila monster with a spoon? Meet Trackzilla: your beast-taming, chaos-crushing, job-tracking sidekick. Grrrrrrowl less, track more.


Built with brain, nerd fuel, and a deep hatred for chaos.</p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
          <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg dark:bg-blue-500 dark:hover:bg-blue-600" onClick={onGetStarted}>
            Start Hunting Now
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-xl">
                <Target className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Total Organization</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Keep all your applications organized in one awesome place
            </p>
          </div>
          
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-xl">
                <TrendingUp className="w-8 h-8 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Detailed Analytics</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Discover patterns and trends to boost your success rate
            </p>
          </div>
          
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
                <Briefcase className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Smart Tracking</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Automatically monitor your application status like magic
            </p>
          </div>
        </div>
      </div>
    </section>;
};