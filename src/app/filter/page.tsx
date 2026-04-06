import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import FilterClient from "./FilterClient";

export const runtime = "edge";

async function getListOfPins(boardId: string) {
    const cookieStore = await cookies();
    const token = cookieStore.get("access_token")?.value;

    if (!token) {
        throw new Error("You are not logged in. Please reconnect your Pinterest account.");
    }

    const safeBoardId = encodeURIComponent(boardId.trim());

    const res = await fetch(`https://api.pinterest.com/v5/boards/${safeBoardId}/pins?page_size=250`, {
        headers: { "Authorization": `Bearer ${token}` },
    });

    // Throw specific errors based on API status codes
    if (!res.ok) {
        if (res.status === 401 || res.status === 403) {
            throw new Error("Pinterest authorization failed. Your session may have expired, or the app lacks 'pins:read' permissions.");
        }
        if (res.status === 404) {
            throw new Error("Board not found. It may have been deleted or made private.");
        }
        throw new Error(`Pinterest API returned an error: ${res.statusText}`);
    }

    return res.json();
}

async function getPresetBoardPins(boardId: string) {
    const token = process.env.PINTEREST_PRESET_TOKEN;

    if (!token) {
        throw new Error("Server configuration error: Preset token is missing.");
    }

    const safeBoardId = encodeURIComponent(boardId.trim());

    const res = await fetch(`https://api.pinterest.com/v5/boards/${safeBoardId}/pins?page_size=250`, {
        headers: { "Authorization": `Bearer ${token}` },
    });

    if (!res.ok) {
        throw new Error(`Failed to load preset pins. Pinterest API responded with status: ${res.status}`);
    }

    return res.json();
}

export default async function FilterPage({
                                             searchParams
                                         }: {
    searchParams: Promise<{ [key: string]: string | undefined }>
}) {
    const { boardId, name, isPreset } = await searchParams;

    // We keep the redirect ONLY for missing URL params, because that means
    // the user navigated to this page incorrectly, not that the API failed.
    if (!boardId || !name) redirect("/setup");

    const isPresetBoard = isPreset === "true";

    // If these fail, they will throw an Error and automatically trigger error.tsx
    const data = isPresetBoard
        ? await getPresetBoardPins(boardId)
        : await getListOfPins(boardId);

    // Just a final safety net in case the API returns a 200 OK but the JSON is malformed
    if (!data || !Array.isArray(data.items)) {
        throw new Error("Pinterest returned an unexpected data format.");
    }

    return <FilterClient pins={data.items} boardId={boardId} boardName={name} />;
}