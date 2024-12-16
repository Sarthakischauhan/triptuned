import NextAuth from 'next-auth'

declare module 'next-auth' {
    // Add accessToken attribute to Session type.
    interface Session {
      accessToken?: string
    }
  }