// auth.ts
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {},
      authorize: async (credentials) => {
        if (!credentials) return null;

        const user = {
          id: credentials.id,
          name: credentials.name,
          role: credentials.role,
          token: credentials.token,
          loginType: credentials.loginType,
        };

        if (user) {
          return user;
        } else {
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.role = user.role;
        token.token = user.token;
        token.loginType = user.loginType;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id;
      session.user.name = token.name;
      session.user.role = token.role;
      session.user.token = token.token;
      session.user.loginType = token.loginType;
      return session;
    },
  },
  secret: process.env.AUTH_SECRET,
};

export const handler = NextAuth(authOptions);
