
import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { LandingPage } from './LandingPage';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Wand2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const AuthPage = () => {
  const [showAuth, setShowAuth] = useState(false);
  const [activeTab, setActiveTab] = useState('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [magicLinkLoading, setMagicLinkLoading] = useState(false);
  const { signIn, signUp, signInWithMagicLink } = useAuth();
  const { toast } = useToast();

  const handleAuth = async (type: 'signin' | 'signup') => {
    if (!email || !password) {
      toast({
        title: "Errore",
        description: "Inserisci email e password",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      if (type === 'signin') {
        await signIn(email, password);
      } else {
        await signUp(email, password);
        toast({
          title: "Registrazione completata",
          description: "Controlla la tua email per confermare l'account",
        });
      }
    } catch (error: any) {
      toast({
        title: "Errore",
        description: error.message || "Si è verificato un errore",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleMagicLink = async () => {
    if (!email) {
      toast({
        title: "Errore",
        description: "Inserisci la tua email nel campo sopra",
        variant: "destructive",
      });
      return;
    }

    setMagicLinkLoading(true);
    try {
      await signInWithMagicLink(email);
      toast({
        title: "Magic Link inviato",
        description: "Controlla la tua email per il link di accesso",
      });
    } catch (error: any) {
      toast({
        title: "Errore",
        description: error.message || "Si è verificato un errore",
        variant: "destructive",
      });
    } finally {
      setMagicLinkLoading(false);
    }
  };

  const handleLogin = () => {
    setActiveTab('signin');
    setShowAuth(true);
  };

  const handleSignup = () => {
    setActiveTab('signup');
    setShowAuth(true);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleAuth(activeTab as 'signin' | 'signup');
  };

  if (!showAuth) {
    return (
      <LandingPage 
        onGetStarted={() => setShowAuth(true)} 
        onLogin={handleLogin}
        onSignup={handleSignup}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Button
          variant="ghost"
          onClick={() => setShowAuth(false)}
          className="mb-4 text-white/70 hover:text-white hover:bg-white/10 rounded-xl"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Torna alla home
        </Button>

        <Card className="bg-white/10 backdrop-blur-md border-white/20 shadow-2xl">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="w-12 h-12 rounded-xl overflow-hidden">
                <img src="/lovable-uploads/95407aee-75ac-4d31-a281-db4fc0472751.png" alt="TrackZilla Logo" className="w-full h-full object-cover" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold text-white">TrackZilla</CardTitle>
            <CardDescription className="text-white/70">
              Accedi al tuo account per iniziare a tracciare le tue candidature
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-white/10 backdrop-blur-md border border-white/20">
                <TabsTrigger value="signin" className="text-white/70 data-[state=active]:bg-white/20 data-[state=active]:text-white">
                  Accedi
                </TabsTrigger>
                <TabsTrigger value="signup" className="text-white/70 data-[state=active]:bg-white/20 data-[state=active]:text-white">
                  Registrati
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="signin" className="space-y-4 mt-4">
                <form onSubmit={handleFormSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signin-email" className="text-white">Email</Label>
                    <Input
                      id="signin-email"
                      type="email"
                      placeholder="inserisci la tua email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-white/40"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signin-password" className="text-white">Password</Label>
                    <Input
                      id="signin-password"
                      type="password"
                      placeholder="inserisci la tua password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-white/40"
                    />
                  </div>
                  <Button 
                    type="submit"
                    className="w-full bg-red-600 hover:bg-red-700 text-white rounded-xl" 
                    disabled={loading}
                  >
                    {loading ? 'Accesso in corso...' : 'Accedi'}
                  </Button>
                </form>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-white/20" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-gradient-to-br from-gray-900 to-gray-800 px-2 text-white/70">
                      oppure
                    </span>
                  </div>
                </div>

                <Button 
                  variant="outline"
                  className="w-full border-red-600 text-red-400 hover:bg-red-600/20 hover:text-red-300 rounded-xl" 
                  onClick={handleMagicLink}
                  disabled={magicLinkLoading}
                >
                  <Wand2 className="w-4 h-4 mr-2" />
                  {magicLinkLoading ? 'Invio Magic Link...' : 'Accedi con Magic Link'}
                </Button>
              </TabsContent>
              
              <TabsContent value="signup" className="space-y-4 mt-4">
                <form onSubmit={handleFormSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signup-email" className="text-white">Email</Label>
                    <Input
                      id="signup-email"
                      type="email"
                      placeholder="inserisci la tua email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-white/40"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-password" className="text-white">Password</Label>
                    <Input
                      id="signup-password"
                      type="password"
                      placeholder="crea una password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-white/40"
                    />
                  </div>
                  <Button 
                    type="submit"
                    className="w-full bg-red-600 hover:bg-red-700 text-white rounded-xl" 
                    disabled={loading}
                  >
                    {loading ? 'Registrazione in corso...' : 'Registrati'}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
