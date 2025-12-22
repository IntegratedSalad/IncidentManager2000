import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session extends DefaultSession {
    accessToken?: string;
    refreshToken?: string;
  }

  interface JWT {
    accessToken?: string;
    refreshToken?: string;
  }
}
