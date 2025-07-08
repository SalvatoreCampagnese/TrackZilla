
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, Crown, Zap } from 'lucide-react';

interface PricingSectionProps {
  onGetStarted: () => void;
}

export const PricingSection: React.FC<PricingSectionProps> = ({
  onGetStarted
}) => {
  const features = {
    free: [
      "Track up to 50 applications",
      "Basic analytics dashboard", 
      "Manual status updates",
      "Basic export functionality"
    ],
    pro: [
      "Unlimited applications tracking",
      "Kanban board for Jobs",
      "Advanced analytics & insights", 
      "Interview questions history",
      "Company reviews database"
    ]
  };

  return (
    <section className="relative py-12 lg:py-16 overflow-hidden">
      {/* Background gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/10 to-transparent"></div>
      
      <div className="relative container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 animate-fade-in">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-sm font-medium text-white/90 mb-6">
            💰 Simple Pricing
          </div>
          <h2 className="text-4xl lg:text-6xl font-bold text-white mb-6">
            Choose your hunting power level
          </h2>
          <p className="text-xl text-white/70 max-w-2xl mx-auto font-light">
            Start free, upgrade when you're ready to unleash the full beast
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Free Plan */}
          <Card className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300">
            <CardHeader className="pb-4 p-0">
              <div className="flex items-center justify-between mb-4">
                <CardTitle className="text-white text-2xl font-bold">
                  Free Zilla
                </CardTitle>
                <Zap className="w-6 h-6 text-blue-400" />
              </div>
              <div className="text-white mb-6">
                <span className="text-4xl font-bold">€0</span>
                <span className="text-white/60 ml-2">/month</span>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <ul className="space-y-3 mb-8">
                {features.free.map((feature, index) => (
                  <li key={index} className="flex items-center text-white/80">
                    <Check className="w-4 h-4 text-green-400 mr-3 flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Pro Plan */}
          <Card className="bg-gradient-to-br from-purple-500/20 to-red-500/20 backdrop-blur-lg border border-purple-300/30 rounded-2xl p-6 hover:from-purple-500/30 hover:to-red-500/30 transition-all duration-300 relative overflow-hidden">
            <CardHeader className="pb-4 p-0">
              <div className="flex items-center justify-between mb-4">
                <CardTitle className="text-white text-2xl font-bold">
                  ProZilla
                </CardTitle>
                <Crown className="w-6 h-6 text-yellow-400" />
              </div>
              <div className="text-white mb-6">
                <span className="text-4xl font-bold">€4.79</span>
                <span className="text-white/60 ml-2">/month</span>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <ul className="space-y-3 mb-8">
                {features.pro.map((feature, index) => (
                  <li key={index} className="flex items-center text-white/90">
                    <Check className="w-4 h-4 text-green-400 mr-3 flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};
