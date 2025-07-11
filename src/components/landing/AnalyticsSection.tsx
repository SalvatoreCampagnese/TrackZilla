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
  return <section className="relative py-24 lg:py-32">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="order-2 lg:order-1 animate-slide-up">
            <div className="card-modern p-4 rounded-3xl">
              <img alt="Illustration of two monsters facing off, symbolising the challenges and obstacles in the job search process." className="w-full h-64 sm:h-80 lg:h-96 object-cover rounded-2xl shadow-xl hover:scale-105 transition-transform duration-500" src="/lovable-uploads/f61d87db-5687-49cc-b7d3-0c015efe390f.png" />
            </div>
          </div>
          
          <div className="order-1 lg:order-2 animate-fade-in">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-sm font-medium text-white/90 mb-6">
              📊 Analytics & Insights
            </div>
            
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
              Monster-Slaying 101
            </h2>
            
            <p className="text-xl text-white/70 mb-8 leading-relaxed font-light">
              TrackZilla gives you detailed insights into your response rates, helps you spot success patterns, 
              and optimizes your job hunting strategy. It's like having analytics superpowers for your career! 📊
            </p>
            
            <ul className="space-y-4 mb-8">
              {benefits.map((benefit, index) => <li key={index} className="flex items-start gap-4 animate-slide-up" style={{
              animationDelay: `${index * 0.1}s`
            }}>
                  <div className="w-6 h-6 bg-gradient-to-r from-red-500 to-red-600 rounded-full flex items-center justify-center min-w-6 min-h-6 mt-0.5">
                    <CheckCircle className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-white/80 leading-relaxed">{benefit}</span>
                </li>)}
            </ul>
            
            <Button onClick={onGetStarted} size="lg" className="bg-white text-gray-900 hover:bg-white/90 px-8 py-4 rounded-2xl font-semibold shadow-2xl transition-all duration-300 hover:scale-105">
              Hunt now with TrackZilla
            </Button>
          </div>
        </div>
      </div>
    </section>;
};