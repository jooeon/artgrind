import { redirect } from "next/navigation";

export const runtime = "edge";

export async function GET() {
    const clientId = process.env.PINTEREST_APP_ID!;
    const redirectUri = `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/callback`;

    // Pinterest OAuth URL structure:
    // https://www.pinterest.com/oauth/?
    //   client_id=YOUR_APP_ID
    //   &redirect_uri=http://localhost:3000/callback
    //   &response_type=code
    //   &scope=boards:read,pins:read
    const params = new URLSearchParams({
        client_id: clientId,
        redirect_uri: redirectUri,
        response_type: "code",
        scope: "boards:read,pins:read,user_accounts:read",
    });

    const authUrl = `https://www.pinterest.com/oauth/?${params.toString()}`;

    redirect(authUrl);
}