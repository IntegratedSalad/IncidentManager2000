import NextAuth from "next-auth"

export const authOptions = {
  providers: [
    {
      id: "microsoft",
      name: "Microsoft",
      type: "oauth",
      wellKnown: `https://login.microsoftonline.com/organizations/v2.0/.well-known/openid-configuration`,
      authorization: {
        params: {
          scope: "openid profile email",
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
    maxAge: 24 * 60 * 60, // 24 hours
  },
  jwt: {
    maxAge: 24 * 60 * 60, // 24 hours
  },
  callbacks: {
    async jwt({ token, account, profile }) {
      if (account) {
        // Store BOTH tokens - id_token for backend, access_token for Graph API
        token.idToken = account.id_token
        token.accessToken = account.access_token
        token.email = profile?.email || account.email
        token.name = profile?.name || account.name
        
        // Default role
        let roles = ['User']
        
        // Override: if user email is szymon@felinoire.com, make them Admin
        if (token.email === 'szymon@felinoire.com') {
          roles = ['Admin']
          console.log('[JWT] ✓ Assigned Admin role to szymon@felinoire.com')
        } else {
          console.log('[JWT] User email:', token.email)
        }
        
        console.log('[JWT] Final roles assigned:', roles)
        
        token.roles = roles
      }
      return token
    },
    async session({ session, token }) {
      // Send id_token to backend, not access_token
      session.idToken = token.idToken
      session.accessToken = token.idToken  // Use id_token for backend authentication
      session.user.email = token.email
      session.user.roles = token.roles
      
      console.log('[SESSION] Returning session:')
      console.log('[SESSION]   - email:', session.user.email)
      console.log('[SESSION]   - roles:', session.user.roles)
      console.log('[SESSION]   - accessToken present:', !!session.accessToken)
      console.log('[SESSION]   - idToken present:', !!session.idToken)
      
      // Sync user to backend database
      try {
        console.log('[SESSION] Syncing user to database:', token.email)
        // Use internal Docker hostname for backend communication
        const backendUrl = process.env.BACKEND_INTERNAL_URL || process.env.NEXT_PUBLIC_BACKEND_URL || 'http://incident-manager:8082'
        const syncUrl = `${backendUrl}/api/users/sync`
        console.log('[SESSION] Sync URL:', syncUrl)
        console.log('[SESSION] User data:', { email: token.email, name: token.name, role: token.roles[0] || 'User' })
        
        const response = await fetch(syncUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token.idToken}`
          },
          body: JSON.stringify({
            email: token.email,
            name: token.name,
            role: token.roles[0] || 'User'
          })
        })
        
        console.log('[SESSION] Sync response status:', response.status)
        
        if (response.ok) {
          const userData = await response.json()
          console.log('[SESSION] ✓ User synced successfully:', userData)
        } else {
          const errorText = await response.text()
          console.error('[SESSION] ✗ Failed to sync user:', response.status, errorText.substring(0, 200))
        }
      } catch (e) {
        console.error('[SESSION] ✗ Error syncing user:', e.message, e.stack)
      }
      
      return session
    },
  },
  pages: {
    signIn: "/login",
    signOut: "/",
    error: "/login",
  },
}

export default NextAuth(authOptions)