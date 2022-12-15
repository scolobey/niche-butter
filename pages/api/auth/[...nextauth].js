import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import DiscordProvider from "next-auth/providers/discord"
import Stripe from 'stripe';
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import prisma from "../../../prisma/prismadb"

export const authOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET
    }),
    DiscordProvider({
      clientId: process.env.DISCORD_CLIENT_ID,
      clientSecret: process.env.DISCORD_CLIENT_SECRET
    })
  ],
  theme: {
    colorScheme: "dark",
  },
  callbacks: {
    async session({ session, user }) {

      const dbUser = await prisma.user.findFirst({
        where: {
          id: user.id,
        }
      })

      session.user.id = user.id;
      session.user.isActive = dbUser.isActive;
      session.user.credits = dbUser.credits;
      session.user.stripeId = dbUser.stripeId;

      return session;
    },
  },
  secret: process.env.SECRET,
  events: {
    updateUser: async ({ user }) => {
      console.log("update user callback");
    },
    createUser: async ({ user }) => {
      // Create stripe API client using the secret key env variable
      const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
        apiVersion: "2020-08-27"
      });

      // Create a stripe customer for the user with their email address
      await stripe.customers
      .create({
        email: user.email,
      })
      .then(async (customer) => {
        // Use the Prisma Client to update the user in the database with their new Stripe customer ID
        console.log("setting stripe user:" + JSON.stringify(customer));
        return prisma.user.update({
          where: { id: user.id },
          data: {
            stripeId: customer.id,
            credits: 10000
          },
        });

      });
    }
  }
}

export default NextAuth(authOptions)
