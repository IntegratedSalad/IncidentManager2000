import type { DefaultSession } from "next-auth"

declare module "next-auth" {
  interface Session {
    accessToken?: string
    refreshToken?: string
    idToken?: string
    roles?: string[]
    user: {
      id?: string
      roles?: string[]
    } & DefaultSession["user"]
  }

  interface JWT {
    accessToken?: string
    refreshToken?: string
    idToken?: string
    roles?: string[]
  }
}
