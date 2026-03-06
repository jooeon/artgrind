import {NextRequest} from "next/server";
import {cookies} from "next/headers";

export const runtime = "edge";

export async function GET(request: NextRequest) {
    const code = request.nextUrl.searchParams.get("code");
    const redirectUri = `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/callback`;
    const credentials = Buffer.from(`${process.env.PINTEREST_APP_ID}:${process.env.PINTEREST_APP_SECRET}`).toString("base64");

    if (!code) {
        return new Response ("No code provided", {status: 400});
    }

    // Pinterest AUTH API
    // https://developers.pinterest.com/docs/getting-started/set-up-authentication-and-authorization/
    const tokenResponse  = await fetch("https://api.pinterest.com/v5/oauth/token", {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "Authorization": `Basic ${credentials}`
        },
        body: new URLSearchParams({
            code: code,
            redirect_uri: redirectUri,
            grant_type: 'authorization_code',
        })
    });

    const data = await tokenResponse.json();
    // console.log("Status:", tokenResponse.status);
    // console.log("Data:", JSON.stringify(data, null, 2));

    const cookieStore = await cookies();
    cookieStore.set("access_token", data.access_token, {
        httpOnly: true,
        path: "/",
        maxAge: data.expires_in,
    });

    return new Response(null, {
        status: 302,
        headers: {
            "Location": "/",
        },
    });
}