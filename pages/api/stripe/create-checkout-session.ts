import type { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import Stripe from 'stripe';

export default async (req: NextApiRequest, res: NextApiResponse) => {

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
    apiVersion: '2022-11-15',
  });

  // This object will contain the user's data if the user is signed in
  const session = await getSession({ req });

  // Error handling
  if (!session?.user) {
    return res.status(401).json({
      error: {
        code: 'no-access',
        message: 'You are not signed in.',
      },
    });
  };

  const checkoutSession = await stripe.checkout.sessions.create({
    mode: 'payment',
    customer: session?.user?.stripeId?,
    line_items: [
      {
        price: "price_1MEjzuKTvAilJ9RoLxoLOJLj",
        quantity: 1,
      },
    ],
    success_url: `${req.headers.origin}/?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${req.headers.origin}/?cancelledPayment=true`
  });

  if (!checkoutSession.url) {
    return res
      .status(500)
      .json({ cpde: 'stripe-error', error: 'Could not create checkout session' });
  }

  // Return the newly-created checkoutSession URL and let the frontend render it
  return res.status(200).json({ redirectUrl: checkoutSession.url });

};
