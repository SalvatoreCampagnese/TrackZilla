
import React from 'react';
import { Button } from '@/components/ui/button';

interface CTASectionProps {
  onGetStarted: () => void;
}

export const CTASection: React.FC<CTASectionProps> = ({ onGetStarted }) => {
  return (
    <section className="py-16 sm:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gray-900 rounded-2xl px-6 sm:px-12 py-12 sm:py-16 text-center border border-gray-800">
          <h3 className="text-2xl sm:text-4xl font-bold text-white mb-4">
            Ready to level up your job hunting game?
          </h3>
          <p className="text-lg sm:text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Join thousands of smart professionals who've already upgraded their job hunting process with TrackZilla. Time to become the apex predator of the job market! 🦖
          </p>
          <Button 
            onClick={onGetStarted}
            size="lg"
            className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 text-lg rounded-full"
          >
            Start hunting for free
          </Button>
        </div>
      </div>
    </section>
  );
};
