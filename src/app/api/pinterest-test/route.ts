import { cookies } from "next/headers";

export const runtime = "edge";

export async function GET() {
    const cookieStore = await cookies();
    // console.log("All cookies:", cookieStore.getAll());
    const token = cookieStore.get("access_token")?.value;
    // console.log("Token:", token);

    if (!token) {
        return Response.json({ error: "Not authenticated" }, { status: 401 });
    }

    const response = await fetch("https://api.pinterest.com/v5/boards?", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
        }
    })

    const data = await response.json();
    return Response.json(data);
}