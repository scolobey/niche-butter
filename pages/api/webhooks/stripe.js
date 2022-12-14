import { NextApiRequest, NextApiResponse } from 'next';
import { buffer } from 'micro';
import Stripe from 'stripe';
import prisma from "../../../prisma/prismadb"

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET

export const config = {
  api: {
    bodyParser: false, // don't parse body of incoming requests because we need it raw to verify signature
  },
};

export default async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
  try {
    console.log("an event is occurring.");
    const requestBuffer = await buffer(req);
    const sig = req.headers['stripe-signature'] as string;
    const stripe = new Stripe(endpointSecret as string, {
      apiVersion: '2020-08-27',
    });

    let event;

    try {
      // Use the Stripe SDK and request info to verify this Webhook request actually came from Stripe
      event = stripe.webhooks.constructEvent(
        requestBuffer.toString(), // Stringify the request for the Stripe library
        sig,
        endpointSecret
      );
    } catch (err: any) {
      console.log(`⚠️  Webhook signature verification failed.`, err.message);
      return res.status(400).send(`Webhook signature verification failed.`);
    }

    // Handle the event
    switch (event.type) {
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object;
        console.log(`PaymentIntent for ${JSON.stringify(paymentIntent)} was successful!`);
         // Then define and call a method to handle the successful payment intent.
         await prisma.user.update({
           where: { stripeId: paymentIntent.customer as string },
           data: {
             isActive: true,
             credits: {increment: 2000}
           }
         })

        break;
      default:
         // Unexpected event type
         console.log(`Unhandled event type ${event.type}.`);
     }

    // Return a 200 response to acknowledge receipt of the event
    res.status(200).json({ received: true });
  } catch (err) {
    // Return a 500 error
    console.log(err);
    res.status(500).end();
  }
};
