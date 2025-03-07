import NextAuth, { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      treasure?: number;
      attacking?: boolean;
      level?: number;
    } & DefaultSession["user"];
  }
}
