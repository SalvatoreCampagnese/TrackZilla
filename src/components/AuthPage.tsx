
import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Mail, Lock, User, Briefcase, Sparkles, WandSparkles } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

export const AuthPage = () => {
  const { signIn, signUp, signInWithMagicLink } = useAuth();
  
  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [useMagicLink, setUseMagicLink] = useState(false);
  
  // Registration form state
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [magicLinkSent, setMagicLinkSent] = useState(false);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const { error } = await signIn(loginEmail, loginPassword);
    
    if (error) {
      toast({
        title: "Errore di accesso",
        description: error.message,
        variant: "destructive"
      });
    } else {
      toast({
        title: "Accesso effettuato",
        description: "Benvenuto in Job Tracker!"
      });
    }
    
    setLoading(false);
  };

  const handleMagicLink = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const { error } = await signInWithMagicLink(loginEmail);
    
    if (error) {
      toast({
        title: "Errore invio magic link",
        description: error.message,
        variant: "destructive"
      });
    } else {
      setMagicLinkSent(true);
      toast({
        title: "Magic link inviato",
        description: "Controlla la tua email per accedere"
      });
    }
    
    setLoading(false);
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const metadata = {
      full_name: fullName,
      role: role
    };
    
    const { error } = await signUp(registerEmail, registerPassword, metadata);
    
    if (error) {
      toast({
        title: "Errore di registrazione",
        description: error.message,
        variant: "destructive"
      });
    } else {
      toast({
        title: "Registrazione completata",
        description: "Controlla la tua email per confermare l'account"
      });
    }
    
    setLoading(false);
  };

  const resetMagicLinkState = () => {
    setMagicLinkSent(false);
    setUseMagicLink(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-blue-950 dark:to-blue-900 flex items-center justify-center p-4 transition-colors duration-300">
      <Card className="w-full max-w-md dark:bg-blue-900/40 dark:border-blue-800">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
            Job Tracker
          </CardTitle>
          <p className="text-gray-600 dark:text-gray-300">
            Traccia le tue candidature lavorative
          </p>
        </CardHeader>
        
        <CardContent>
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2 dark:bg-blue-800">
              <TabsTrigger 
                value="login" 
                className="dark:data-[state=active]:bg-blue-700 dark:data-[state=active]:text-white dark:text-gray-200"
              >
                Accedi
              </TabsTrigger>
              <TabsTrigger 
                value="register" 
                className="dark:data-[state=active]:bg-blue-700 dark:data-[state=active]:text-white dark:text-gray-200"
              >
                Registrati
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="login">
              {magicLinkSent ? (
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 bg-green-100 dark:bg-blue-800 rounded-full flex items-center justify-center mx-auto">
                    <Mail className="w-8 h-8 text-green-600 dark:text-blue-300" />
                  </div>
                  <h3 className="text-lg font-semibold dark:text-white">Magic link inviato!</h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Controlla la tua email e clicca sul link per accedere
                  </p>
                  <Button 
                    variant="outline" 
                    onClick={resetMagicLinkState}
                    className="w-full dark:bg-blue-800 dark:border-blue-700 dark:hover:bg-blue-700 dark:text-white"
                  >
                    Torna al login
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {!useMagicLink ? (
                    <form onSubmit={handleSignIn} className="space-y-4">
                      <div className="space-y-2">
                        <div className="relative">
                          <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400 dark:text-gray-300" />
                          <Input
                            type="email"
                            placeholder="Email"
                            value={loginEmail}
                            onChange={(e) => setLoginEmail(e.target.value)}
                            className="pl-10 dark:bg-blue-800/50 dark:border-blue-700 dark:text-white"
                            required
                          />
                        </div>
                        <div className="relative">
                          <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400 dark:text-gray-300" />
                          <Input
                            type="password"
                            placeholder="Password"
                            value={loginPassword}
                            onChange={(e) => setLoginPassword(e.target.value)}
                            className="pl-10 dark:bg-blue-800/50 dark:border-blue-700 dark:text-white"
                            required
                          />
                        </div>
                      </div>
                      <Button 
                        type="submit" 
                        className="w-full dark:bg-blue-700 dark:hover:bg-blue-600" 
                        disabled={loading}
                      >
                        {loading ? 'Accesso in corso...' : 'Accedi'}
                      </Button>
                    </form>
                  ) : (
                    <form onSubmit={handleMagicLink} className="space-y-4">
                      <div className="space-y-2">
                        <div className="relative">
                          <Sparkles className="absolute left-3 top-3 h-4 w-4 text-gray-400 dark:text-gray-300" />
                          <Input
                            type="email"
                            placeholder="Email"
                            value={loginEmail}
                            onChange={(e) => setLoginEmail(e.target.value)}
                            className="pl-10 dark:bg-blue-800/50 dark:border-blue-700 dark:text-white"
                            required
                          />
                        </div>
                      </div>
                      <Button 
                        type="submit" 
                        className="w-full dark:bg-blue-700 dark:hover:bg-blue-600" 
                        disabled={loading}
                      >
                        {loading ? 'Invio in corso...' : 'Invia Magic Link'}
                      </Button>
                      <p className="text-sm text-gray-600 dark:text-gray-300 text-center">
                        Ti invieremo un link per accedere senza password
                      </p>
                    </form>
                  )}
                  
                  <div className="text-center">
                    <Button 
                      variant="link" 
                      onClick={() => setUseMagicLink(!useMagicLink)}
                      className="text-sm flex items-center gap-1 mx-auto dark:text-blue-300"
                    >
                      {useMagicLink ? (
                        'Accedi con password'
                      ) : (
                        <>
                          <WandSparkles className="w-4 h-4" />
                          Accedi con magic link
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="register">
              <form onSubmit={handleSignUp} className="space-y-4">
                <div className="space-y-2">
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-gray-400 dark:text-gray-300" />
                    <Input
                      type="text"
                      placeholder="Nome completo"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="pl-10 dark:bg-blue-800/50 dark:border-blue-700 dark:text-white"
                      required
                    />
                  </div>
                  <div className="relative">
                    <Briefcase className="absolute left-3 top-3 h-4 w-4 text-gray-400 dark:text-gray-300" />
                    <Input
                      type="text"
                      placeholder="Ruolo/Posizione (opzionale)"
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      className="pl-10 dark:bg-blue-800/50 dark:border-blue-700 dark:text-white"
                    />
                  </div>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400 dark:text-gray-300" />
                    <Input
                      type="email"
                      placeholder="Email"
                      value={registerEmail}
                      onChange={(e) => setRegisterEmail(e.target.value)}
                      className="pl-10 dark:bg-blue-800/50 dark:border-blue-700 dark:text-white"
                      required
                    />
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400 dark:text-gray-300" />
                    <Input
                      type="password"
                      placeholder="Password (min 6 caratteri)"
                      value={registerPassword}
                      onChange={(e) => setRegisterPassword(e.target.value)}
                      className="pl-10 dark:bg-blue-800/50 dark:border-blue-700 dark:text-white"
                      required
                      minLength={6}
                    />
                  </div>
                </div>
                <Button 
                  type="submit" 
                  className="w-full dark:bg-blue-700 dark:hover:bg-blue-600" 
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
  );
};
