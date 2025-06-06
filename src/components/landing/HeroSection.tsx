
import React from 'react';
import { Button } from '@/components/ui/button';
import { Play } from 'lucide-react';

interface HeroSectionProps {
  onGetStarted: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onGetStarted
}) => {
  return (
    <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Left side - Text content */}
        <div className="max-w-2xl">
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-foreground mb-6 leading-tight">
            TAME THE JOB HUNT{' '}
            <span className="relative">
              Grrrawww!
              <svg 
                className="absolute -bottom-2 left-0 w-full h-3" 
                viewBox="0 0 400 20" 
                fill="none"
              >
                <path 
                  d="M10 15 Q200 5 390 15" 
                  stroke="#dc2626" 
                  strokeWidth="4" 
                  fill="none"
                  strokeLinecap="round"
                />
              </svg>
            </span>
          </h1>
          
          <p className="text-lg text-muted-foreground mb-8 max-w-lg leading-relaxed">
            Job hunt got you feeling like you're fighting a Gila monster with a spoon? Meet Trackzilla: your beast-taming, chaos-crushing, job-tracking sidekick. Grrrrrrowl less, track more. Built with brain, nerd fuel, and a deep hatred for chaos.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <Button 
              onClick={onGetStarted}
              size="lg"
              className="bg-red-600 hover:bg-red-700 text-white px-8 py-4 text-lg rounded-full"
            >
              Try free trial
            </Button>
            <Button 
              variant="outline"
              size="lg"
              className="border-gray-600 text-foreground hover:bg-gray-800 px-8 py-4 text-lg rounded-full flex items-center gap-2"
            >
              <div className="w-8 h-8 bg-foreground rounded-full flex items-center justify-center">
                <Play className="w-4 h-4 text-background fill-background" />
              </div>
              View Demo
            </Button>
          </div>
        </div>

        {/* Right side - Visual elements */}
        <div className="relative">
          {/* Main dashboard mockup */}
          <div className="relative bg-gradient-to-br from-red-500 to-red-700 rounded-3xl p-8 min-h-[500px]">
            {/* Profile section */}
            <div className="flex justify-center mb-8">
              <img 
                src="/lovable-uploads/1cfab0e7-65a8-4956-b798-4ac8733c8283.png" 
                alt="TrackZilla User" 
                className="w-32 h-32 rounded-full border-4 border-white/20"
              />
            </div>
            
            <div className="absolute bottom-0 right-1/4 transform translate-y-4 bg-pink-400 rounded-full p-3 shadow-lg">
              <div className="w-6 h-6 bg-white rounded flex items-center justify-center">
                <div className="w-3 h-3 bg-pink-400 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
