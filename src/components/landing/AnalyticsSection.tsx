import React from 'react';
import { Button } from '@/components/ui/button';
import { CheckCircle } from 'lucide-react';
interface AnalyticsSectionProps {
  onGetStarted: () => void;
}
export const AnalyticsSection: React.FC<AnalyticsSectionProps> = ({
  onGetStarted
}) => {
  const benefits = ["Automatic response time tracking (because who has time to count days?)", "Identify the most responsive companies (find the keepers!)", "Smart suggestions to level up your approach (like having a job hunt mentor)"];
  return <section className="py-16 sm:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="order-2 lg:order-1">
            <img alt="Job application analytics dashboard" className="w-full h-64 sm:h-80 lg:h-96 object-cover rounded-2xl shadow-xl" src="/lovable-uploads/df62053e-b5a6-405f-9c75-b973cfe27a5c.jpg" />
          </div>
          <div className="order-1 lg:order-2">
            <h3 className="text-2xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-6">Monster-Slaying 101</h3>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
              TrackZilla gives you detailed insights into your response rates, helps you spot success patterns, and optimizes your job hunting strategy. It's like having analytics superpowers for your career! 📊
            </p>
            <ul className="space-y-4 mb-8">
              {benefits.map((benefit, index) => <li key={index} className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center min-w-6 min-h-6">
                    <CheckCircle className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-zinc-50">{benefit}</span>
                </li>)}
            </ul>
            <Button onClick={onGetStarted} size="lg" className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-full">Hunt now with TrackZilla</Button>
          </div>
        </div>
      </div>
    </section>;
};