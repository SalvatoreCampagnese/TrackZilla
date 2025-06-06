
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Target, TrendingUp, Clock, BarChart3, CheckCircle, Zap } from 'lucide-react';

export const FeaturesSection: React.FC = () => {
  const features = [
    {
      icon: Target,
      title: "Track every application",
      description: "Organize all your job applications in one place. Monitor status, dates, and details of every opportunity like a boss.",
      color: "red"
    },
    {
      icon: TrendingUp,
      title: "Advanced analytics",
      description: "View detailed stats on your response rates, feedback times, and overall performance. Data-driven job hunting FTW!",
      color: "blue"
    },
    {
      icon: Clock,
      title: "Automatic follow-ups",
      description: "Never miss an opportunity. The system automatically detects ghosted applications so you can follow up like a pro.",
      color: "purple"
    },
    {
      icon: BarChart3,
      title: "Intuitive dashboard",
      description: "See your progress at a glance with clear metrics and informative charts. Beautiful data visualization included!",
      color: "orange"
    },
    {
      icon: CheckCircle,
      title: "Customizable statuses",
      description: "Track every phase of the process: applications, interviews, feedback, and job offers. Your workflow, your rules.",
      color: "green"
    },
    {
      icon: Zap,
      title: "Lightning-fast setup",
      description: "Get started in seconds. Simple and intuitive interface designed to maximize your productivity. No PhD required!",
      color: "indigo"
    }
  ];

  const getIconClasses = (color: string) => {
    const colors = {
      red: "text-red-400",
      blue: "text-blue-400",
      purple: "text-purple-400",
      orange: "text-orange-400",
      green: "text-green-400",
      indigo: "text-indigo-400"
    };
    return colors[color as keyof typeof colors] || colors.red;
  };

  return (
    <section className="relative py-24 lg:py-32 overflow-hidden">
      {/* Background gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-transparent"></div>
      
      <div className="relative container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 animate-fade-in">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-sm font-medium text-white/90 mb-6">
            ⚡ Powerful Features
          </div>
          <h2 className="text-4xl lg:text-6xl font-bold text-white mb-6">
            Everything you need for epic job hunting
          </h2>
          <p className="text-xl text-white/70 max-w-2xl mx-auto font-light">
            Because job hunting is a multi-headed hydra and your memory is not a database.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card 
              key={feature.title} 
              className="card-modern hover:scale-105 transition-all duration-300 group cursor-pointer animate-slide-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardHeader className="pb-4">
                <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center mb-4 group-hover:bg-white/20 transition-all duration-300">
                  <feature.icon className={`w-6 h-6 ${getIconClasses(feature.color)}`} />
                </div>
                <CardTitle className="text-white text-xl font-semibold">
                  {feature.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-white/70 leading-relaxed">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
