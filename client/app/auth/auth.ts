import NextAuth from "next-auth";
import Spotify from "next-auth/providers/spotify";
import { SpotifyToken } from "@/types/spotifyToken";

const SCOPES = [
  "user-read-private",
  "user-read-email",
  "playlist-read-private",
  "playlist-read-collaborative",
  "user-top-read",
  "user-read-recently-played",
].join(" ");

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Spotify({
      clientId: process.env.AUTH_SPOTIFY_ID,
      clientSecret: process.env.AUTH_SPOTIFY_SECRET,
      authorization: {
        url: "https://accounts.spotify.com/authorize",
        params: {
          scope: SCOPES,
        },
      },
    }),
  ],
  secret: process.env.AUTH_SECRET,
  callbacks: {
    async jwt({ token, account }) {
      // Handle initial sign-in
      if (account) {
        token.accessToken = account.access_token;
        token.refreshToken = account.refresh_token;
        token.expires_at = Date.now() + account.expires_in * 1000; // Convert expires_in to timestamp
        console.log("Initial Token Expires At:", token.expires_at);
        return token;
      }

      const typedToken = token as SpotifyToken;

      // Check if the access token has expired
      if (Date.now() < typedToken.expires_at) {
        return token; // Access token is still valid
      }

      // If access token has expired, refresh it
      try {
        const basicAuth = Buffer.from(
          `${process.env.AUTH_SPOTIFY_ID}:${process.env.AUTH_SPOTIFY_SECRET}`
        ).toString("base64");

        const response = await fetch("https://accounts.spotify.com/api/token", {
          method: "POST",
          headers: {
            Authorization: `Basic ${basicAuth}`,
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: new URLSearchParams({
            grant_type: "refresh_token",
            refresh_token: typedToken.refreshToken || "", // Use the stored refresh token
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error("Failed to refresh access token");
        }

        console.log("Refreshed Token Data:", data);

        // Update the token
        token.accessToken = data.access_token;
        token.expires_at = Date.now() + data.expires_in * 1000; // Calculate new expiration time

        // Use new refresh token if provided, otherwise keep the old one
        token.refreshToken = data.refresh_token || typedToken.refreshToken;

        return token;
      } catch (error) {
        console.error("Error refreshing access token:", error);
        token.error = "RefreshAccessTokenError";
        return token;
      }
    },

    async session({ session, token }) {
      session.accessToken = token.accessToken as string;
      session.refreshToken = token.refreshToken as string;
      session.error = token.error as string; // Pass error to the session for client-side handling
      return session;
    },
  },
});
