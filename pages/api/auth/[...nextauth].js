import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import DiscordProvider from "next-auth/providers/discord"
import Stripe from 'stripe';
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import prisma from "../../../prisma/prismadb"

async function refreshAccessToken(token) {
  console.log("getting a refresh token: " + token);

  try {
    const url =
      "https://oauth2.googleapis.com/token?" +
      new URLSearchParams({
        clientId: process.env.GOOGLE_ID,
        clientSecret: process.env.GOOGLE_SECRET,
        grant_type: "refresh_token",
        refresh_token: token,
      });

    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      method: "POST",
    });

    const refreshedTokens = await response.json();

    console.log("the refresh toke got bak: " + JSON.stringify(refreshedTokens));

    if (!response.ok) {
      throw refreshedTokens;
    }

    return {
      ...token,
      accessToken: refreshedTokens.access_token,
      accessTokenExpires: Date.now() + refreshedTokens.expires_in * 1000,
      refreshToken: refreshedTokens.refresh_token ?? token.refreshToken, // Fall back to old refresh token
    };
  } catch (error) {
    console.log(error);

    return {
      ...token,
      error: "RefreshAccessTokenError",
    };
  }
}

const scopes = [
  "https://www.googleapis.com/auth/webmasters https://www.googleapis.com/auth/webmasters.readonly https://www.googleapis.com/auth/adwords"
];

const authOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
          scope: "openid email profile https://www.googleapis.com/auth/webmasters https://www.googleapis.com/auth/webmasters.readonly https://www.googleapis.com/auth/adwords"
        }
      }
    })
  ],
  theme: {
    colorScheme: "dark",
  },
  secret: process.env.SECRET,
  jwt: {
    encryption: true,
    secret: process.env.SECRET,
  },
  callbacks: {
    async session({ session, user }) {
      const dbUser = await prisma.user.findFirst({
        where: {
          id: user.id,
        }
      })

      const getToken = await prisma.account.findFirst({
        where: {
          userId: user.id,
        },
      });

      const refreshToken = await refreshAccessToken(getToken);

      let accessToken;

      if (getToken) {
        accessToken = getToken.access_token;
      }

      session.user.token = accessToken;
      session.user.refreshToken = refreshToken.refresh_token;

      session.user.id = user.id;
      session.user.isActive = dbUser.isActive;
      session.user.credits = dbUser.credits;
      session.user.stripeId = dbUser.stripeId;

      return session
    }
  },
  events: {
    updateUser: async ({ user }) => {
      console.log("update user callback");
    },
    createUser: async ({ user }) => {
      console.log("creating user");
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
