import { cookies } from "next/headers";
import { NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(request: NextRequest) {
    const boardId = request.nextUrl.searchParams.get("boardId");
    const cookieStore = await cookies();
    const token = cookieStore.get("access_token")?.value;

    if (!token || !boardId) return Response.json({ error: "Invalid request" }, { status: 400 });

    const res = await fetch(`https://api.pinterest.com/v5/boards/${boardId}/pins?page_size=250`, {
        headers: { "Authorization": `Bearer ${token}` },
    });

    return Response.json(await res.json());
}