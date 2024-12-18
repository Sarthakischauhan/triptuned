import NextAuth from "next-auth"
import Spotify from "next-auth/providers/spotify"
import { SpotifyToken } from "@/types/spotifyToken"

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
        token.refreshToken = account.refresh_token
        token.expires_at = account.expires_at
        return token
      }
      const typedToken = token as SpotifyToken;
      if (Date.now() < typedToken.expires_at * 1000) {
        // Do nothing and return 
        return token
      }
      else {
        // If the access_token has expired then call for a new one using refresh_token
        try {
          const response = await fetch("https://accounts.spotify.com/api/token", {
            method:"POST",
            headers:{ 
              'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: new URLSearchParams({
              grant_type: 'refresh_token', 
              refresh_token: typedToken?.refreshToken || "",
              client_id: process.env.AUTH_SPOTIFY_ID || "",
            })
          })
          const data = await response.json() as SpotifyToken
          token.accessToken = data.accessToken
          token.expires_at = Math.floor(
            Date.now() / 1000 + data.expires_in
          )  
          if ( data.refreshToken ){
            token.refresh_token = data.refreshToken
          }
          return token
        }
        catch (error) {
          console.error("Error refreshing access_token", error)
          // If we fail to refresh the token, return an error so we can handle it on the page
          token.error = "RefreshTokenError"
          return token
        }
      }
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken as string
      session.refreshToken = token.refreshToken as string
      return session
    }
  }
})
