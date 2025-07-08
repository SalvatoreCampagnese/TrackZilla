
import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useSubscription } from '@/hooks/useSubscription';
import { Crown, Check, X, Zap, Eye, Kanban, Infinity, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const ProPage = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { subscribed, subscription_tier, subscription_end, loading: subscriptionLoading } = useSubscription();
  const [isLoading, setIsLoading] = useState(false);

  const handleUpgrade = async () => {
    if (!user) {
      toast({
        title: "Login required",
        description: "You need to log in to proceed with the upgrade.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: {
          priceId: 'price_1Rh8BAJyLFziZ5rmdoQu3djS'
        }
      });

      if (error) throw error;

      if (data?.url) {
        window.open(data.url, '_blank');
      }
    } catch (error) {
      console.error('Error creating checkout:', error);
      toast({
        title: "Error",
        description: "An error occurred while starting the checkout. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleManageSubscription = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase.functions.invoke('customer-portal');
      
      if (error) throw error;
      
      if (data?.url) {
        window.open(data.url, '_blank');
      }
    } catch (error) {
      console.error('Error opening customer portal:', error);
      toast({
        title: "Error",
        description: "Unable to open the management portal.",
        variant: "destructive",
      });
    }
  };

  const features = {
    pro: [{
      icon: <Infinity className="w-5 h-5" />,
      title: "Unlimited applications",
      description: "Track all your job applications without limits"
    }, {
      icon: <Kanban className="w-5 h-5" />,
      title: "Full Kanban view",
      description: "Organize your applications with drag & drop"
    }, {
      icon: <Eye className="w-5 h-5" />,
      title: "Interview questions in advance",
      description: "Prepare better for your interviews"
    }, {
      icon: <Zap className="w-5 h-5" />,
      title: "Recommended resources",
      description: "Exclusive access to premium content"
    }],
    free: [{
      icon: <X className="w-5 h-5 text-red-500" />,
      title: "50 applications limit",
      description: "Limited application tracking"
    }, {
      icon: <X className="w-5 h-5 text-red-500" />,
      title: "Kanban view locked",
      description: "Only list view available"
    }, {
      icon: <X className="w-5 h-5 text-red-500" />,
      title: "Questions hidden",
      description: "No advance preparation"
    }, {
      icon: <X className="w-5 h-5 text-red-500" />,
      title: "No premium resources",
      description: "Basic content only"
    }]
  };

  if (subscriptionLoading) {
    return (
      <div className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8 max-w-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-red-500 mx-auto"></div>
          <p className="mt-4 text-white">Loading subscription status...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8 max-w-full">
      {/* Current Subscription Status */}
      {subscribed && (
        <div className="mb-8">
          <Card className="border-2 border-green-500 bg-gradient-to-br from-green-900/20 to-green-800/20 backdrop-blur-md">
            <CardHeader className="text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <CheckCircle className="w-8 h-8 text-green-400" />
                <h2 className="text-2xl font-bold text-white">Active Subscription</h2>
              </div>
              <Badge className="bg-green-500 text-white">
                {subscription_tier} - Active
              </Badge>
              {subscription_end && (
                <p className="text-green-100 mt-2">
                  Renewal: {new Date(subscription_end).toLocaleDateString('en-US')}
                </p>
              )}
            </CardHeader>
            <CardContent className="text-center">
              <Button 
                onClick={handleManageSubscription}
                className="bg-white/20 hover:bg-white/30 text-white border border-white/30"
                variant="outline"
              >
                Manage Subscription
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Crown className="w-8 h-8 text-red-500" />
          <h1 className="text-4xl font-bold bg-gradient-to-r from-red-500 to-red-600 bg-clip-text text-transparent">
            ProZilla
          </h1>
        </div>
        <p className="text-xl text-white/80 max-w-2xl mx-auto">
          {subscribed 
            ? "You're using the full potential of your job tracking!"
            : "Unlock the full potential of your job tracking. Manage unlimited applications with professional tools."
          }
        </p>
      </div>

      {/* Pricing Cards */}
      <div className="grid md:grid-cols-2 gap-8 mb-12">
        {/* Free Plan */}
        <Card className="relative border-2 border-white/20 bg-white/10 backdrop-blur-md">
          <CardHeader className="text-center pb-8">
            <CardTitle className="text-2xl font-bold text-white/90">Free</CardTitle>
            <div className="text-4xl font-bold text-white mt-4">
              €0<span className="text-lg font-normal text-white/70">/month</span>
            </div>
            <Badge variant="secondary" className="mt-2 bg-white/20 text-white">
              {!subscribed ? "Current" : "Basic Plan"}
            </Badge>
          </CardHeader>
          <CardContent className="space-y-4">
            {features.free.map((feature, index) => (
              <div key={index} className="flex items-start gap-3">
                {feature.icon}
                <div>
                  <h4 className="font-medium text-white">{feature.title}</h4>
                  <p className="text-sm text-white/70">{feature.description}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Pro Plan */}
        <Card className={`relative border-2 shadow-2xl backdrop-blur-md ${
          subscribed 
            ? 'border-green-500 bg-gradient-to-br from-green-900/20 to-green-800/20 scale-105' 
            : 'border-red-500 bg-gradient-to-br from-red-900/20 to-red-800/20 scale-105'
        }`}>
          <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
            <Badge className={`px-4 py-1 ${
              subscribed 
                ? 'bg-gradient-to-r from-green-500 to-green-600 text-white'
                : 'bg-gradient-to-r from-red-500 to-red-600 text-white'
            }`}>
              {subscribed ? '✅ Active' : '🚀 Recommended'}
            </Badge>
          </div>
          <CardHeader className={`text-center pb-8 text-white rounded-t-lg ${
            subscribed 
              ? 'bg-gradient-to-r from-green-500 to-green-600'
              : 'bg-gradient-to-r from-red-500 to-red-600'
          }`}>
            <div className="flex items-center justify-center gap-2">
              <Crown className="w-6 h-6 text-yellow-300" />
              <CardTitle className="text-2xl font-bold">ProZilla</CardTitle>
            </div>
            <div className="text-4xl font-bold mt-4">
              €4.79<span className="text-lg font-normal opacity-80">/month</span>
            </div>
            <p className={`mt-2 ${subscribed ? 'text-green-100' : 'text-red-100'}`}>
              Everything included
            </p>
          </CardHeader>
          <CardContent className="space-y-4 pt-6">
            {features.pro.map((feature, index) => (
              <div key={index} className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Check className="w-3 h-3 text-green-400" />
                </div>
                <div>
                  <h4 className="font-medium text-white">{feature.title}</h4>
                  <p className="text-sm text-white/70">{feature.description}</p>
                </div>
              </div>
            ))}
            
            <div className="pt-6">
              {subscribed ? (
                <Button 
                  onClick={handleManageSubscription}
                  className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold py-3 text-lg" 
                  size="lg"
                >
                  <Crown className="w-5 h-5 mr-2" />
                  Manage Subscription
                </Button>
              ) : (
                <Button 
                  onClick={handleUpgrade} 
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold py-3 text-lg" 
                  size="lg"
                >
                  <Crown className="w-5 h-5 mr-2" />
                  {isLoading ? "Loading..." : "Become ProZilla Now"}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Feature Comparison */}
      <Card className="mb-8 bg-white/10 backdrop-blur-md border-white/20">
        <CardHeader>
          <CardTitle className="text-center text-2xl text-white">Detailed Comparison</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/20">
                  <th className="text-left py-4 px-4 text-white">Features</th>
                  <th className="text-center py-4 px-4 text-white">Free</th>
                  <th className="text-center py-4 px-4">
                    <div className="flex items-center justify-center gap-2 text-white">
                      <Crown className="w-4 h-4 text-red-500" />
                      ProZilla
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-white/20">
                  <td className="py-4 px-4 font-medium text-white">Number of applications</td>
                  <td className="text-center py-4 px-4 text-white/70">50 max</td>
                  <td className="text-center py-4 px-4 text-green-400 font-semibold">Unlimited</td>
                </tr>
                <tr className="border-b border-white/20">
                  <td className="py-4 px-4 font-medium text-white">Kanban view</td>
                  <td className="text-center py-4 px-4">
                    <X className="w-5 h-5 text-red-500 mx-auto" />
                  </td>
                  <td className="text-center py-4 px-4">
                    <Check className="w-5 h-5 text-green-400 mx-auto" />
                  </td>
                </tr>
                <tr className="border-b border-white/20">
                  <td className="py-4 px-4 font-medium text-white">Interview questions</td>
                  <td className="text-center py-4 px-4">
                    <X className="w-5 h-5 text-red-500 mx-auto" />
                  </td>
                  <td className="text-center py-4 px-4">
                    <Check className="w-5 h-5 text-green-400 mx-auto" />
                  </td>
                </tr>
                <tr>
                  <td className="py-4 px-4 font-medium text-white">Premium resources</td>
                  <td className="text-center py-4 px-4">
                    <X className="w-5 h-5 text-red-500 mx-auto" />
                  </td>
                  <td className="text-center py-4 px-4">
                    <Check className="w-5 h-5 text-green-400 mx-auto" />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProPage;
