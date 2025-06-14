import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Target, TrendingUp, Clock, BarChart3, CheckCircle, Zap } from 'lucide-react';

export const FeaturesSection: React.FC = () => {
  const features = [
    {
      icon: Target,
      title: "Track every application",
      description: "No job shall escape! Trackzilla logs every role you go after, complete with timestamps, notes, and juicy details. 🦖 RAWR! Application tracked!",
      color: "red"
    },
    {
      icon: TrendingUp,
      title: "Advanced analytics",
      description: "Want to know which companies ghost you faster than a vampire in sunlight? We've got cold-blooded stats. Trackzilla sees all. Even your self-doubt. 👁️",
      color: "blue"
    },
    {
      icon: Clock,
      title: "Automatic follow-ups",
      description: "Never let a ghosted app get away. Trackzilla remembers what you forget and roars when it's time to ping. 💌 Grrrrrr... where's my interview?!",
      color: "purple"
    },
    {
      icon: BarChart3,
      title: "Intuitive dashboard",
      description: "See your quest progress with shiny charts and tasty metrics. So easy, even a cave troll could use it. ✨ Oooh, bars go up!",
      color: "orange"
    },
    {
      icon: CheckCircle,
      title: "Customizable statuses",
      description: "Application? Interview? Waiting in eternal silence? Customize your workflow like a true monster master. 🧌 You roll for control.",
      color: "green"
    },
    {
      icon: Zap,
      title: "Summon in seconds",
      description: "No tutorials. No rituals. Just click and boom, your job-hunting lair is live. ⚡️ Trackzilla has entered the chat.",
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
    <section className="relative py-12 lg:py-12 overflow-hidden">
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
              className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6 hover:bg-white/10 hover:scale-105 transition-all duration-300 group cursor-pointer animate-slide-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardHeader className="pb-4 p-0">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-white/20 to-white/5 backdrop-blur-sm border border-white/20 flex items-center justify-center mb-4 group-hover:from-white/30 group-hover:to-white/10 transition-all duration-300">
                  <feature.icon className={`w-6 h-6 ${getIconClasses(feature.color)}`} />
                </div>
                <CardTitle className="text-white text-xl font-semibold leading-tight">
                  {feature.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <p className="text-white/70 leading-relaxed text-sm">
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
