
import React from 'react';
import { Button } from '@/components/ui/button';

interface CTASectionProps {
  onGetStarted: () => void;
}

export const CTASection: React.FC<CTASectionProps> = ({
  onGetStarted
}) => {
  return (
    <section className="relative py-24 lg:py-32">
      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-red-500/20 rounded-full blur-3xl"></div>
      </div>
      
      <div className="relative container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="card-modern p-12 lg:p-16 text-center max-w-4xl mx-auto animate-fade-in">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-sm font-medium text-white/90 mb-8">
            🎯 Ready to dominate?
          </div>
          
          <h2 className="text-4xl lg:text-6xl font-bold text-white mb-6">
            Ready to level up your job hunting game?
          </h2>
          
          <p className="text-xl text-white/70 mb-10 max-w-2xl mx-auto leading-relaxed font-light">
            Join thousands of smart professionals who've already upgraded their job hunting process with TrackZilla. 
            Time to become the apex predator of the job market! 🦖
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              onClick={onGetStarted} 
              size="lg" 
              className="bg-white text-gray-900 hover:bg-white/90 px-10 py-4 text-lg rounded-2xl font-semibold shadow-2xl transition-all duration-300 hover:scale-105"
            >
              Start hunting for free
            </Button>
          </div>

          <div className="flex items-center justify-center gap-8 mt-8 text-sm text-white/60">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>Free forever plan</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>No setup fees</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>Cancel anytime</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
