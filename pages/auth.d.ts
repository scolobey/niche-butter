import "next-auth";

declare module "next-auth" {
  interface User {
    stripeId: string;
  }

  interface Session {
    user: User;
  }
}
