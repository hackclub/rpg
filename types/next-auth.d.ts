import NextAuth, { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      treasure?: number;
      attacking?: boolean;
      experience?: number;
    } & DefaultSession["user"];
  }
}
