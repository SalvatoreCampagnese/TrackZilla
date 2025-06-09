
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MagicLinkButton } from './MagicLinkButton';

interface AuthTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  email: string;
  setEmail: (email: string) => void;
  password: string;
  setPassword: (password: string) => void;
  loading: boolean;
  magicLinkLoading: boolean;
  onFormSubmit: (e: React.FormEvent) => void;
  onMagicLink: () => void;
}

const TermsNotice = () => (
  <p className="text-xs text-white/70 text-center mt-4">
    By continuing, you accept our{' '}
    <a 
      href="/terms" 
      target="_blank" 
      rel="noopener noreferrer"
      className="text-white underline hover:text-white/90"
    >
      Terms & Conditions and Privacy Policy
    </a>
  </p>
);

export const AuthTabs: React.FC<AuthTabsProps> = ({
  activeTab,
  setActiveTab,
  email,
  setEmail,
  password,
  setPassword,
  loading,
  magicLinkLoading,
  onFormSubmit,
  onMagicLink,
}) => {
  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="grid w-full grid-cols-2 bg-white/10 backdrop-blur-md border border-white/20">
        <TabsTrigger value="signin" className="text-white/70 data-[state=active]:bg-white/20 data-[state=active]:text-white">
          Sign In
        </TabsTrigger>
        <TabsTrigger value="signup" className="text-white/70 data-[state=active]:bg-white/20 data-[state=active]:text-white">
          Sign Up
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="signin" className="space-y-4 mt-4">
        <form onSubmit={onFormSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="signin-email" className="text-white">Email</Label>
            <Input
              id="signin-email"
              type="email"
              placeholder="enter your email"
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
              placeholder="enter your password"
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
            {loading ? 'Signing in...' : 'Sign In'}
          </Button>
        </form>

        <MagicLinkButton onClick={onMagicLink} loading={magicLinkLoading} />
        <TermsNotice />
      </TabsContent>
      
      <TabsContent value="signup" className="space-y-4 mt-4">
        <form onSubmit={onFormSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="signup-email" className="text-white">Email</Label>
            <Input
              id="signup-email"
              type="email"
              placeholder="enter your email"
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
              placeholder="create a password"
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
            {loading ? 'Creating account...' : 'Sign Up'}
          </Button>
        </form>
        <TermsNotice />
      </TabsContent>
    </Tabs>
  );
};
