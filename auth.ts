import NextAuth from "next-auth";
import authConfig from "./auth.config";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { PrismaClient } from "@prisma/client";
import { getUserById } from "./app/data/user";

const prisma = new PrismaClient();

export const { handlers, auth, signIn, signOut } = NextAuth({
  pages: {
    signIn: "/auth/login",
    error: "/auth/error",
    signOut: "/",
  },

  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider !== "credentials") return true;
      if (!user.id) return false;

      const existingUser = await getUserById(user.id);
      if (!existingUser) return false;

      return true;
    },

    async session({ token, session }) {
      if (token.sub && session.user) {
        session.user.id = token.sub;
   
        session.user.email = token.email as string; 
      }
      return session;
    },

    async jwt({ token }) {
      if (token && typeof token === 'object' && token.sub) {
        const userExist = await getUserById(token.sub);
        if (userExist) {
          token.email = userExist.email;  
          token.username = userExist.username;  
        }
      }
      return token;
    },
  },

  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
  },
  ...authConfig,
  secret: process.env.AUTH_SECRET,
});
