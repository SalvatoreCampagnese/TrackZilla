import React from 'react';
import { Button } from '@/components/ui/button';
import { Play } from 'lucide-react';
interface HeroSectionProps {
  onGetStarted: () => void;
}
export const HeroSection: React.FC<HeroSectionProps> = ({
  onGetStarted
}) => {
  return <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Left side - Text content */}
        <div className="max-w-2xl">
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-foreground mb-6 leading-tight">
            TAME THE JOB HUNT{' '}
            <span className="relative">
              Grrrawww!
              <svg className="absolute -bottom-2 left-0 w-full h-3" viewBox="0 0 400 20" fill="none">
                <path d="M10 15 Q200 5 390 15" stroke="#dc2626" strokeWidth="4" fill="none" strokeLinecap="round" />
              </svg>
            </span>
          </h1>
          
          <p className="text-lg mb-8 max-w-lg leading-relaxed text-zinc-50">Job hunt got you feeling like you're fighting a Gila monster with a spoon? 
Meet Trackzilla: your beast-taming, chaos-crushing, job-tracking sidekick. Grrrrrrowl less, track more. 


Built with brain, nerd fuel, and a deep hatred for chaos.</p>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <Button onClick={onGetStarted} size="lg" className="bg-red-600 hover:bg-red-700 text-white px-8 py-4 text-lg rounded-full">
              Start the hunt now
            </Button>
            
          </div>
        </div>

        {/* Right side - Visual elements */}
        <div className="relative">
          {/* Main dashboard mockup */}
          <div className="">
            {/* Profile section */}
            <div className="flex justify-center mb-8">
              <div className="w-full h-96 animate-[scale-in_0.8s_ease-out] rounded-xl overflow-hidden">
                <img alt="TrackZilla User" src="/lovable-uploads/dc85d098-e320-47c7-af56-a63300bf46ae.png" className="w-full h-full object-contain" style={{
                minHeight: '384px'
              }} />
              </div>
            </div>
            
            
          </div>
        </div>
      </div>
    </section>;
};