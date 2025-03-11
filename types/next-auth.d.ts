import NextAuth, { DefaultSession, DefaultUser } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      treasure?: number;
      attacking?: boolean;
      experience?: number;
    } & DefaultSession["user"];
  }

  export interface User extends DefaultUser() {
    providerAccountId: string
  }
}
