import { JWT } from "next-auth/jwt";

export interface SpotifyToken extends JWT {
    accessToken: string;
    refreshToken: string;
    expires_at: number; 
    error?: string;    
    expires_in: number;
  }
