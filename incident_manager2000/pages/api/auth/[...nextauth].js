import NextAuth from "next-auth"

export const authOptions = {
  debug: true,
  providers: [
    {
      id: "microsoft",
      name: "Microsoft",
      type: "oauth",
      wellKnown: `https://login.microsoftonline.com/consumers/v2.0/.well-known/openid-configuration`,
      authorization: {
        params: {
          scope: "openid profile email User.Read",
        }
      },
      idToken: true,
      checks: ["state", "pkce"],
      clientId: process.env.MICROSOFT_ID,
      clientSecret: process.env.MICROSOFT_SECRET,
      profile(profile) {
        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          image: null,
        }
      },
    },
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, account, profile }) {
      if (account) {
        token.accessToken = account.access_token
        token.refreshToken = account.refresh_token
        token.idToken = account.id_token  // Dodaj też id_token
      }
      if (profile) {
        token.name = profile.name
        token.email = profile.email
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.name = token.name
        session.user.email = token.email
      }
      session.accessToken = token.accessToken
      session.idToken = token.idToken  // id_token dla Spring Backend
      return session
    },
    async redirect({ url, baseUrl }) {
      if (url.startsWith("/")) return url
      else if (new URL(url).origin === baseUrl) return url
      return baseUrl
    },
  },
  pages: {
    signIn: "/login",
    signOut: "/",
    error: "/login",
  },
}

export default NextAuth(authOptions)