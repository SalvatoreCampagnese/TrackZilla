
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[STRIPE-WEBHOOK] ${step}${detailsStr}`);
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseClient = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    { auth: { persistSession: false } }
  );

  try {
    logStep("Webhook received");
    
    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2023-10-16",
    });

    const body = await req.text();
    const signature = req.headers.get("stripe-signature");
    
    if (!signature) {
      throw new Error("No Stripe signature found");
    }

    // Verify webhook signature
    const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET");
    if (!webhookSecret) {
      throw new Error("STRIPE_WEBHOOK_SECRET not configured");
    }

    let event;
    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err) {
      logStep("Webhook signature verification failed", { error: err.message });
      return new Response(`Webhook Error: ${err.message}`, { status: 400 });
    }

    logStep("Event received", { type: event.type, id: event.id });

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        logStep("Checkout session completed", { sessionId: session.id, customerEmail: session.customer_email });
        
        if (session.mode === 'subscription' && session.customer_email) {
          await supabaseClient.from("subscribers").upsert({
            email: session.customer_email,
            stripe_customer_id: session.customer,
            subscribed: true,
            subscription_tier: "ProZilla",
            subscription_status: "active",
            updated_at: new Date().toISOString(),
          }, { onConflict: 'email' });
          
          logStep("User subscription activated", { email: session.customer_email });
        }
        break;
      }
      
      case 'customer.subscription.updated':
      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        logStep("Subscription updated/deleted", { subscriptionId: subscription.id, status: subscription.status });
        
        const customer = await stripe.customers.retrieve(subscription.customer as string);
        if (customer && !customer.deleted && customer.email) {
          const isActive = subscription.status === 'active';
          const subscriptionEnd = isActive 
            ? new Date(subscription.current_period_end * 1000).toISOString()
            : null;
          
          await supabaseClient.from("subscribers").upsert({
            email: customer.email,
            stripe_customer_id: customer.id,
            subscribed: isActive,
            subscription_tier: isActive ? "ProZilla" : null,
            subscription_status: subscription.status,
            subscription_end: subscriptionEnd,
            updated_at: new Date().toISOString(),
          }, { onConflict: 'email' });
          
          logStep("User subscription updated", { 
            email: customer.email, 
            subscribed: isActive, 
            status: subscription.status 
          });
        }
        break;
      }
      
      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice;
        logStep("Payment failed", { invoiceId: invoice.id });
        
        if (invoice.customer_email) {
          await supabaseClient.from("subscribers").upsert({
            email: invoice.customer_email,
            subscribed: false,
            subscription_status: "past_due",
            updated_at: new Date().toISOString(),
          }, { onConflict: 'email' });
          
          logStep("User subscription marked as past due", { email: invoice.customer_email });
        }
        break;
      }
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR in webhook", { message: errorMessage });
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
