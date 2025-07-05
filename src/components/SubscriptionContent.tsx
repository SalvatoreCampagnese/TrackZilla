
import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useSubscription } from '@/hooks/useSubscription';
import { Crown, CreditCard, Mail, AlertTriangle, ExternalLink, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const SubscriptionContent = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { subscribed, subscription_tier, subscription_end, loading: subscriptionLoading, checkSubscription } = useSubscription();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [supportForm, setSupportForm] = useState({
    subject: '',
    message: '',
    email: user?.email || ''
  });
  const [isSendingSupport, setIsSendingSupport] = useState(false);
  const [supportDialogOpen, setSupportDialogOpen] = useState(false);

  const handleRefreshSubscription = async () => {
    setIsRefreshing(true);
    await checkSubscription();
    setIsRefreshing(false);
    toast({
      title: "Stato abbonamento aggiornato",
      description: "Le informazioni dell'abbonamento sono state aggiornate.",
    });
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
        title: "Errore",
        description: "Impossibile aprire il portale di gestione.",
        variant: "destructive",
      });
    }
  };

  const handleSendSupportEmail = async () => {
    if (!supportForm.subject.trim() || !supportForm.message.trim()) {
      toast({
        title: "Errore",
        description: "Compila tutti i campi richiesti.",
        variant: "destructive",
      });
      return;
    }

    setIsSendingSupport(true);
    try {
      const mailtoLink = `mailto:payments@trackzilla.cv?subject=${encodeURIComponent(supportForm.subject)}&body=${encodeURIComponent(
        `From: ${supportForm.email}\n\n${supportForm.message}\n\n---\nUser ID: ${user?.id}\nSubscription Tier: ${subscription_tier || 'N/A'}`
      )}`;
      
      window.location.href = mailtoLink;
      
      setSupportDialogOpen(false);
      setSupportForm({ subject: '', message: '', email: user?.email || '' });
      
      toast({
        title: "Email preparata",
        description: "L'email è stata preparata nel tuo client di posta.",
      });
    } catch (error) {
      console.error('Error preparing support email:', error);
      toast({
        title: "Errore",
        description: "Errore durante la preparazione dell'email.",
        variant: "destructive",
      });
    } finally {
      setIsSendingSupport(false);
    }
  };

  if (subscriptionLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-500 mx-auto"></div>
          <p className="mt-4 text-white">Caricamento stato abbonamento...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 lg:space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Crown className="w-8 h-8 text-purple-500" />
          <h1 className="text-2xl lg:text-3xl font-bold text-white">Gestione Abbonamento</h1>
        </div>
        <Button 
          onClick={handleRefreshSubscription}
          disabled={isRefreshing}
          variant="outline"
          className="border-white/20 bg-white/10 hover:bg-white/20 text-white"
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
          Aggiorna
        </Button>
      </div>

      {/* Subscription Status */}
      <Card className="bg-white/10 backdrop-blur-md border-white/20">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <CreditCard className="w-5 h-5" />
            Stato Abbonamento
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <p className="text-white/70 mb-2">Piano Attuale</p>
              <div className="flex items-center gap-2">
                <Badge className={subscribed 
                  ? "bg-green-500 text-white" 
                  : "bg-gray-500 text-white"
                }>
                  {subscribed ? subscription_tier || 'ProZilla' : 'Free'}
                </Badge>
                {subscribed && <Crown className="w-4 h-4 text-yellow-400" />}
              </div>
            </div>
            <div>
              <p className="text-white/70 mb-2">Stato</p>
              <Badge variant={subscribed ? "default" : "secondary"}>
                {subscribed ? 'Attivo' : 'Non Attivo'}
              </Badge>
            </div>
            {subscription_end && (
              <div className="md:col-span-2">
                <p className="text-white/70 mb-2">Prossimo Rinnovo</p>
                <p className="text-white">
                  {new Date(subscription_end).toLocaleDateString('it-IT', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>
            )}
          </div>
          
          {subscribed && (
            <div className="mt-6">
              <Button 
                onClick={handleManageSubscription}
                className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Gestisci con Stripe
              </Button>
              <p className="text-sm text-white/60 mt-2">
                Apre il portale Stripe per gestire pagamenti, fatture e cancellazione
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Transaction History Placeholder */}
      <Card className="bg-white/10 backdrop-blur-md border-white/20">
        <CardHeader>
          <CardTitle className="text-white">Cronologia Transazioni</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <CreditCard className="w-12 h-12 text-white/40 mx-auto mb-4" />
            <p className="text-white/70 mb-4">
              Per visualizzare la cronologia completa delle transazioni e scaricare le fatture
            </p>
            <Button 
              onClick={handleManageSubscription}
              variant="outline"
              className="border-white/20 bg-white/10 hover:bg-white/20 text-white"
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              Apri Portale Stripe
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Support Section */}
      <Card className="bg-white/10 backdrop-blur-md border-white/20">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Mail className="w-5 h-5" />
            Supporto e Reclami
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Alert className="mb-6 bg-yellow-500/10 border-yellow-500/20">
            <AlertTriangle className="h-4 w-4 text-yellow-500" />
            <AlertDescription className="text-yellow-100">
              <strong>Tempo di risposta:</strong> Rispondiamo a tutti i reclami e richieste di refund entro 72 ore lavorative.
            </AlertDescription>
          </Alert>
          
          <p className="text-white/70 mb-6">
            Hai problemi con il tuo abbonamento o hai bisogno di un refund? Contattaci direttamente.
          </p>
          
          <Dialog open={supportDialogOpen} onOpenChange={setSupportDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white">
                <Mail className="w-4 h-4 mr-2" />
                Contatta Supporto
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-gray-800 border-white/20 text-white">
              <DialogHeader>
                <DialogTitle>Contatta il Supporto</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="email">La tua Email</Label>
                  <Input 
                    id="email"
                    value={supportForm.email}
                    onChange={(e) => setSupportForm({...supportForm, email: e.target.value})}
                    className="bg-white/10 border-white/20 text-white"
                    disabled
                  />
                </div>
                <div>
                  <Label htmlFor="subject">Oggetto *</Label>
                  <Input 
                    id="subject"
                    value={supportForm.subject}
                    onChange={(e) => setSupportForm({...supportForm, subject: e.target.value})}
                    placeholder="Es: Richiesta refund abbonamento"
                    className="bg-white/10 border-white/20 text-white"
                  />
                </div>
                <div>
                  <Label htmlFor="message">Messaggio *</Label>
                  <Textarea 
                    id="message"
                    value={supportForm.message}
                    onChange={(e) => setSupportForm({...supportForm, message: e.target.value})}
                    placeholder="Descrivi il tuo problema o la tua richiesta in dettaglio..."
                    className="bg-white/10 border-white/20 text-white min-h-[120px]"
                  />
                </div>
                <div className="flex gap-2">
                  <Button 
                    onClick={handleSendSupportEmail}
                    disabled={isSendingSupport}
                    className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white"
                  >
                    {isSendingSupport ? "Preparazione..." : "Invia Email"}
                  </Button>
                  <Button 
                    onClick={() => setSupportDialogOpen(false)}
                    variant="outline"
                    className="border-white/20 bg-white/10 hover:bg-white/20 text-white"
                  >
                    Annulla
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>
    </div>
  );
};
