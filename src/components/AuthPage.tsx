
import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { LandingPage } from './LandingPage';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Briefcase, ArrowLeft, Wand2 } from 'lucide-react';
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-background dark:to-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Button
          variant="ghost"
          onClick={() => setShowAuth(false)}
          className="mb-4 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Torna alla home
        </Button>

        <Card className="bg-white dark:bg-card border-gray-200 dark:border-border">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-blue-600 dark:bg-blue-500 rounded-xl">
                <Briefcase className="w-8 h-8 text-white" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900 dark:text-foreground">TrackZilla</CardTitle>
            <CardDescription className="text-gray-600 dark:text-muted-foreground">
              Accedi al tuo account per iniziare a tracciare le tue candidature
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-gray-100 dark:bg-muted">
                <TabsTrigger value="signin" className="dark:text-muted-foreground dark:data-[state=active]:bg-background dark:data-[state=active]:text-foreground">
                  Accedi
                </TabsTrigger>
                <TabsTrigger value="signup" className="dark:text-muted-foreground dark:data-[state=active]:bg-background dark:data-[state=active]:text-foreground">
                  Registrati
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="signin" className="space-y-4 mt-4">
                <form onSubmit={handleFormSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signin-email" className="text-gray-700 dark:text-foreground">Email</Label>
                    <Input
                      id="signin-email"
                      type="email"
                      placeholder="inserisci la tua email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="dark:bg-background dark:border-border dark:text-foreground"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signin-password" className="text-gray-700 dark:text-foreground">Password</Label>
                    <Input
                      id="signin-password"
                      type="password"
                      placeholder="inserisci la tua password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="dark:bg-background dark:border-border dark:text-foreground"
                    />
                  </div>
                  <Button 
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600" 
                    disabled={loading}
                  >
                    {loading ? 'Accesso in corso...' : 'Accedi'}
                  </Button>
                </form>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-gray-300 dark:border-border" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white dark:bg-card px-2 text-gray-500 dark:text-muted-foreground">
                      oppure
                    </span>
                  </div>
                </div>

                <Button 
                  variant="outline"
                  className="w-full border-blue-600 text-blue-600 hover:bg-blue-50 dark:border-blue-400 dark:text-blue-400 dark:hover:bg-background dark:hover:text-blue-400" 
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
                    <Label htmlFor="signup-email" className="text-gray-700 dark:text-foreground">Email</Label>
                    <Input
                      id="signup-email"
                      type="email"
                      placeholder="inserisci la tua email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="dark:bg-background dark:border-border dark:text-foreground"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-password" className="text-gray-700 dark:text-foreground">Password</Label>
                    <Input
                      id="signup-password"
                      type="password"
                      placeholder="crea una password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="dark:bg-background dark:border-border dark:text-foreground"
                    />
                  </div>
                  <Button 
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600" 
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
