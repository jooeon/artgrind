export const runtime = "edge";

export async function GET() {
    const clientId = process.env.PINTEREST_APP_ID!;
    const clientSecret = process.env.PINTEREST_APP_SECRET!;
    const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");

    const res = await fetch("https://api.pinterest.com/v5/oauth/token", {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "Authorization": `Basic ${credentials}`,
        },
        body: new URLSearchParams({
            grant_type: "client_credentials",
            scope: "boards:read,pins:read",
        }),
    });

    const data = await res.json();
    console.log(data);
    return Response.json(data);
}