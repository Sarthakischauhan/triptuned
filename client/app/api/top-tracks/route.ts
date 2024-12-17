import { NextResponse, NextRequest } from "next/server";
import { auth } from "auth/auth";

export async function GET(request: NextRequest){
    const session = await auth()
    const response = await fetch("https://api.spotify.com/v1/me/top/tracks?time_range=medium_term&limit=5",{
        headers : {"Authorization": `Bearer ${session?.accessToken}`},
    })
    const data = await response.json();
    return NextResponse.json(data)
}
