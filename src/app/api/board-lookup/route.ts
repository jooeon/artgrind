export const runtime = "edge";

async function getAppToken(): Promise<string | null> {
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
    // console.log("App token response:", data);
    return data.access_token ?? null;
}

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const username = searchParams.get("username");
    const boardname = searchParams.get("boardname");

    if (!username || !boardname) {
        return Response.json({ error: "Missing params" }, { status: 400 });
    }

    const token = await getAppToken();
    if (!token) {
        return Response.json({ error: "Could not authenticate" }, { status: 500 });
    }

    const apiUrl = `https://api.pinterest.com/v5/boards/${username}%2F${boardname}`;
    // console.log("Fetching:", apiUrl);

    const testRes = await fetch("https://api.pinterest.com/v5/boards/641763084340857729", {
        headers: { "Authorization": `Bearer ${token}` },
    });
    console.log("Test with ID:", await testRes.json());

    const res = await fetch(apiUrl, {
        headers: { "Authorization": `Bearer ${token}` },
    });

    const data = await res.json();
    // console.log("Board response:", data);
    return Response.json(data);
}