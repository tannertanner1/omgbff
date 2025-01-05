import NextAuth, { DefaultSession } from "next-auth";

// TypeScript module augmentation
declare module "next-auth" {
  interface User {
    id?: string;
    role?: string;
    emailVerified?: Date | null;
  }
  interface Session {
    user: {
      id: string;
      role?: string;
      emailVerified?: Date | null;
    } & DefaultSession["user"];
  }
}
