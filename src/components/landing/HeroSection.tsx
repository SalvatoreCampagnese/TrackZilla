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
          
          <p className="text-lg text-muted-foreground mb-8 max-w-lg leading-relaxed">
            Job hunt got you feeling like you're fighting a Gila monster with a spoon? Meet Trackzilla: your beast-taming, chaos-crushing, job-tracking sidekick. Grrrrrrowl less, track more. Built with brain, nerd fuel, and a deep hatred for chaos.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <Button onClick={onGetStarted} size="lg" className="bg-red-600 hover:bg-red-700 text-white px-8 py-4 text-lg rounded-full">Start the hunt now</Button>
            
          </div>
        </div>

        {/* Right side - Visual elements */}
        <div className="relative">
          {/* Main dashboard mockup */}
          <div className="relative  rounded-3xl p-8 min-h-[500px]">
            {/* Profile section */}
            <div className="flex justify-center mb-8">
              <img src="/lovable-uploads/1cfab0e7-65a8-4956-b798-4ac8733c8283.png" alt="TrackZilla User" className="w-32 h-32 rounded-full border-4 border-white/20" />
            </div>
            
            {/* Floating cards */}
            <div className="absolute top-4 right-4 bg-white rounded-xl p-4 shadow-lg">
              <p className="text-sm text-gray-500 mb-1">Enter amount</p>
              <p className="text-xl font-bold text-gray-800">$450.00</p>
              <div className="mt-2">
                <Button className="bg-red-600 hover:bg-red-700 text-white text-sm px-4 py-1 rounded-full">
                  Send
                </Button>
              </div>
            </div>
            
            <div className="absolute bottom-4 left-4 bg-white rounded-xl p-4 shadow-lg">
              <p className="text-sm text-gray-500 mb-1">Total Applications</p>
              <p className="text-xl font-bold text-gray-800">$245.00</p>
              <div className="flex items-center mt-2">
                <div className="flex space-x-1">
                  <div className="w-2 h-6 bg-red-600 rounded"></div>
                  <div className="w-2 h-4 bg-red-400 rounded"></div>
                  <div className="w-2 h-8 bg-red-700 rounded"></div>
                  <div className="w-2 h-3 bg-red-500 rounded"></div>
                </div>
              </div>
            </div>
            
            <div className="absolute top-1/3 left-1/4 bg-purple-600 rounded-xl p-3 shadow-lg">
              <div className="w-6 h-6 bg-white rounded flex items-center justify-center">
                <div className="w-3 h-3 bg-purple-600 rounded"></div>
              </div>
            </div>
            
            {/* Credit card mockup */}
            <div className="absolute bottom-8 right-8 bg-gray-900 rounded-xl p-4 w-48 shadow-lg transform rotate-12">
              <div className="flex justify-between items-start mb-4">
                <div className="w-8 h-6 bg-yellow-400 rounded"></div>
                <div className="flex space-x-1">
                  <div className="w-6 h-6 bg-gray-700 rounded-full"></div>
                  <div className="w-6 h-6 bg-gray-600 rounded-full"></div>
                </div>
              </div>
              <p className="text-white text-xs mb-1">Credit Card</p>
              <p className="text-white text-sm font-mono">•••• 1234</p>
              <p className="text-gray-400 text-xs mt-2">09/25</p>
            </div>
            
            {/* Floating notification */}
            <div className="absolute top-1/2 right-0 transform translate-x-4 bg-orange-400 rounded-full p-3 shadow-lg">
              <div className="w-6 h-6 bg-white rounded flex items-center justify-center">
                <div className="w-3 h-3 bg-orange-400 rounded"></div>
              </div>
            </div>
            
            <div className="absolute bottom-0 right-1/4 transform translate-y-4 bg-pink-400 rounded-full p-3 shadow-lg">
              <div className="w-6 h-6 bg-white rounded flex items-center justify-center">
                <div className="w-3 h-3 bg-pink-400 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>;
};