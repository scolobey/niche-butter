import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import DiscordProvider from "next-auth/providers/discord"
import Stripe from 'stripe';
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import prisma from "../../../prisma/prismadb"

const scopes = [
  "https://www.googleapis.com/auth/webmasters",
  "https://www.googleapis.com/auth/webmasters.readonly"
];

const authorizationUrl = "https://accounts.google.com/o/oauth2/v2/auth?" +
new URLSearchParams({
  prompt: "consent",
  access_type: "offline",
  response_type: "code",
});

async function refreshAccessToken(token) {
  console.log("getting the token: " + token);

  try {
    const url =
      "https://oauth2.googleapis.com/token?" +
      new URLSearchParams({
        clientId: process.env.GOOGLE_ID,
        clientSecret: process.env.GOOGLE_SECRET,
        grant_type: "refresh_token",
        refresh_token: token.refreshToken,
      });

    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      method: "POST",
    });

    const refreshedTokens = await response.json();

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

const authOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
      authorizationUrl: authorizationUrl,
      scope: scopes.join(" "),
    }),
    DiscordProvider({
      clientId: process.env.DISCORD_CLIENT_ID,
      clientSecret: process.env.DISCORD_CLIENT_SECRET
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
    async jwt(token, user, account, profile, isNewUser) {
      console.log("jwt hit");

      if (account?.accessToken) {
        token.accessToken = account.accessToken;
      }
      return token;
    },
    // async jwt(token, user, account) {
    //   console.log("token callback: " + token);
    //
    //   // Initial sign in
    //   if (account && user) {
    //     return {
    //       accessToken: account.accessToken,
    //       accessTokenExpires: Date.now() + account.expires_in * 1000,
    //       refreshToken: account.refresh_token,
    //       user,
    //     };
    //   }
    //
    //   // Return previous token if the access token has not expired yet
    //   if (Date.now() < token.accessTokenExpires) {
    //     return token;
    //   }
    //
    //   // Access token has expired, try to update it
    //   return await refreshAccessToken(token);
    // },
    async session(session, token) {

      if (token) {
        console.log("token time: " + token);

        const dbUser = await prisma.user.findFirst({
          where: {
            id: token.id,
          }
        })
        session.user = token.user;
        session.accessToken = token.accessToken;
        session.error = token.error;

        // session.user.id = token.user;
        session.user.isActive = dbUser.isActive;
        session.user.credits = dbUser.credits;
        session.user.stripeId = dbUser.stripeId;
      }

      return session;
    },
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
