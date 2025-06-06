import React from 'react';
import { Button } from '@/components/ui/button';
interface HeroSectionProps {
  onGetStarted: () => void;
}
export const HeroSection: React.FC<HeroSectionProps> = ({
  onGetStarted
}) => {
  return <section className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-12">
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-red-500/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gray-500/20 rounded-full blur-3xl"></div>
      </div>
      
      <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
        {/* Left side - Text content */}
        <div className="max-w-2xl animate-fade-in">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-sm font-medium text-white/90 mb-8">
            🚀 Now in Beta - Start tracking for free
          </div>
          
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
            TAME THE JOB HUNT{' '}
            <span className="relative inline-block">
              <span className="text-white">
                Grrrawww!
              </span>
              <svg className="absolute -bottom-2 left-0 w-full h-3" viewBox="0 0 400 20" fill="none">
                <path d="M10 15 Q200 5 390 15" stroke="#ffffff" strokeWidth="4" fill="none" strokeLinecap="round" />
              </svg>
            </span>
          </h1>
          
          <p className="text-xl text-white/80 mb-8 max-w-lg leading-relaxed font-light">
            Job hunt got you feeling like you're fighting a Gila monster with a spoon? 
            Meet Trackzilla: your beast-taming, chaos-crushing, job-tracking sidekick.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <Button onClick={onGetStarted} size="lg" className="bg-white text-gray-900 hover:bg-white/90 px-8 py-4 text-lg rounded-2xl font-semibold shadow-2xl transition-all duration-300 hover:scale-105">
              Start the hunt now
            </Button>
          </div>
        </div>

        {/* Right side - Visual elements */}
        <div className="relative animate-slide-up">
          <div className="card-modern p-8 max-w-md mx-auto">
            <div className="flex justify-center">
              <div className="w-full h-80 rounded-xl overflow-hidden shadow-2xl">
                <img alt="TrackZilla Dashboard" src="/lovable-uploads/dc85d098-e320-47c7-af56-a63300bf46ae.png" className="w-full h-full object-contain hover:scale-105 transition-transform duration-500" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>;
};