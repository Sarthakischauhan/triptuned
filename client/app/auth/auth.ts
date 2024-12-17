import NextAuth from "next-auth"
import Spotify from "next-auth/providers/spotify"
const SCOPES = [
  "user-read-private",
  "user-read-email",
  "playlist-read-private",
  "playlist-read-collaborative",
  "user-top-read",
  "user-read-recently-played"
].join(" ");
export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [ 
    Spotify({
    clientId: process.env.AUTH_SPOTIFY_ID,
    clientSecret: process.env.AUTH_SPOTIFY_SECRET,
    authorization:{
      url:"https://accounts.spotify.com/authorize",
      params:{
        scope:SCOPES,
      }
    }
  }),
  ],
  secret: process.env.AUTH_SECRET,
  callbacks:{
    async jwt({ token, account }) {
      if (account) {
        token.accessToken = account.access_token
      }
      return token
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken as string
      return session
    }
  }
})
