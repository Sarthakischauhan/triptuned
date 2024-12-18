import NextAuth from 'next-auth'

declare module 'next-auth' {
    // Add accessToken attribute to Session type.
    interface Session {
      accessToken?: string, 
      refreshToken?: string,
    }
    // I am making changes to a seperate spotifyToken type
    interface JWT {
      access_token: string
      expires_at: number
      refresh_token?: string
      error?: "RefreshTokenError"
    }
  }