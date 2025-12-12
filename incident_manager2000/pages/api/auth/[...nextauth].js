import NextAuth from "next-auth"

export const authOptions = {
  debug: true,
  providers: [
    {
      id: "microsoft",
      name: "Microsoft",
      type: "oauth",
      wellKnown: "https://login.microsoftonline.com/common/v2.0/.well-known/openid-configuration",
      authorization: { params: { scope: "openid profile email" } },
      idToken: true,
      checks: ["state", "pkce"],
      clientId: process.env.MICROSOFT_ID,
      clientSecret: process.env.MICROSOFT_SECRET,
      callbackUrl: `${process.env.NEXTAUTH_URL}/api/auth/callback/microsoft`,
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
  callbacks: {
    async jwt({ token, account, profile }) {
      if (account) {
        token.accessToken = account.access_token
        token.refreshToken = account.refresh_token
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
      return session
    },
    async redirect({ url, baseUrl }) {
      // Redirect to home page on successful login
      // url is the callbackUrl or a relative/absolute URL to redirect to
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
  secret: process.env.NEXTAUTH_SECRET,
}

export default NextAuth(authOptions)
