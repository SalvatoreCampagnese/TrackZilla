
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
        
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-6">
          <span className="text-red-500">TRACKZILLA</span>
        </h1>
        
        <p className="text-2xl sm:text-3xl font-semibold text-foreground mb-6 tracking-wide">TAME THE JOB HUNT 
Grrrrawwwwwwww!</p>
        
        <p className="text-xl text-muted-foreground mb-12 max-w-3xl mx-auto">Job hunt got you feeling like you're fighting a Gila monster with a spoon? 
Meet Trackzilla: your beast-taming, chaos-crushing, job-tracking sidekick. Grrrrrrowl less, track more. 


Built with brain, nerd fuel, and a deep hatred for chaos.</p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
          <Button size="lg" className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-8 py-3 text-lg shadow-lg" onClick={onGetStarted}>Start the hunt now</Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-green-500/20 border border-green-500/30 rounded-xl">
                <Target className="w-8 h-8 text-green-400" />
              </div>
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">Total Organization</h3>
            <p className="text-muted-foreground">
              Keep all your applications organized in one awesome place
            </p>
          </div>
          
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-purple-500/20 border border-purple-500/30 rounded-xl">
                <TrendingUp className="w-8 h-8 text-purple-400" />
              </div>
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">Detailed Analytics</h3>
            <p className="text-muted-foreground">
              Discover patterns and trends to boost your success rate
            </p>
          </div>
          
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-red-500/20 border border-red-500/30 rounded-xl">
                <Briefcase className="w-8 h-8 text-red-500" />
              </div>
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">Smart Tracking</h3>
            <p className="text-muted-foreground">Let Trackzilla grrrrrrrowl at you when it's time to act</p>
          </div>
        </div>
      </div>
    </section>;
};
