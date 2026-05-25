import Stripe from 'stripe';
import { env } from '../config/env.js';

const stripe = env.stripeSecretKey ? new Stripe(env.stripeSecretKey) : null;

export async function createPaymentIntent({ amountCents, currency = 'usd', metadata = {} }) {
  if (!stripe) {
    return {
      id: 'pi_development_mock',
      clientSecret: 'pi_development_mock_secret',
      amount: amountCents,
      currency,
      metadata,
      mode: 'mock',
    };
  }

  return stripe.paymentIntents.create({
    amount: amountCents,
    currency,
    metadata,
    automatic_payment_methods: { enabled: true },
  });
}

