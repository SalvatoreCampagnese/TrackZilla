import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Target, TrendingUp, Clock, BarChart3, CheckCircle, Zap } from 'lucide-react';
export const FeaturesSection: React.FC = () => {
  const features = [{
    icon: Target,
    title: "Track every application",
    description: "Organize all your job applications in one place. Monitor status, dates, and details of every opportunity like a boss.",
    color: "red"
  }, {
    icon: TrendingUp,
    title: "Advanced analytics",
    description: "View detailed stats on your response rates, feedback times, and overall performance. Data-driven job hunting FTW!",
    color: "green"
  }, {
    icon: Clock,
    title: "Automatic follow-ups",
    description: "Never miss an opportunity. The system automatically detects ghosted applications so you can follow up like a pro.",
    color: "purple"
  }, {
    icon: BarChart3,
    title: "Intuitive dashboard",
    description: "See your progress at a glance with clear metrics and informative charts. Beautiful data visualization included!",
    color: "orange"
  }, {
    icon: CheckCircle,
    title: "Customizable statuses",
    description: "Track every phase of the process: applications, interviews, feedback, and job offers. Your workflow, your rules.",
    color: "red"
  }, {
    icon: Zap,
    title: "Lightning-fast setup",
    description: "Get started in seconds. Simple and intuitive interface designed to maximize your productivity. No PhD required!",
    color: "indigo"
  }];
  const getColorClasses = (color: string) => {
    const colors = {
      red: "bg-red-500/20 border-red-500/30 text-red-400",
      green: "bg-green-500/20 border-green-500/30 text-green-400",
      purple: "bg-purple-500/20 border-purple-500/30 text-purple-400",
      orange: "bg-orange-500/20 border-orange-500/30 text-orange-400",
      indigo: "bg-indigo-500/20 border-indigo-500/30 text-indigo-400"
    };
    return colors[color as keyof typeof colors] || colors.red;
  };
  return <section className="bg-gray-900 py-16 sm:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 sm:mb-16">
          <h3 className="text-2xl sm:text-4xl font-bold text-foreground mb-4">
            Everything you need for epic job hunting
          </h3>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">Because job hunting is a multi-headed hydra and your memory is not a database.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {features.map(feature => <Card key={feature.title} className="bg-gradient-to-br from-gray-800 to-black border-gray-100/30 shadow-lg hover:shadow-xl transition-all duration-300 ">
              <CardHeader>
                <div className={`w-12 h-12 ${getColorClasses(feature.color)} border rounded-lg flex items-center justify-center mb-4`}>
                  <feature.icon className="w-6 h-6" />
                </div>
                <CardTitle className="text-foreground">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent className="text-base text-zinc-100">
                <p className="text-muted-foreground">
                  {feature.description}
                </p>
              </CardContent>
            </Card>)}
        </div>
      </div>
    </section>;
};