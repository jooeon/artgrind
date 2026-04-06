import { cookies } from "next/headers";
import PracticeSession from "@/app/practice/PracticeSession";

export const runtime = "edge";

async function getListOfPins(boardId: string) {
    const cookieStore = await cookies();
    const token = cookieStore.get("access_token")?.value;

    if (!token) {
        throw new Error("You are not logged in. Please reconnect your Pinterest account.");
    }

    // Fallback 1: Encode the ID just in case
    const safeBoardId = encodeURIComponent(boardId.trim());

    const res = await fetch(`https://api.pinterest.com/v5/boards/${safeBoardId}/pins?page_size=250`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
    });

    // Fallback 2: Throw explicit errors to trigger error.tsx
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

// async function getPin(pinId: string) {
//     const cookieStore = await cookies();
//     const token = cookieStore.get("access_token")?.value;
//
//     if (!token) return null;
//
//     const res = await fetch(`https://api.pinterest.com/v5/pins/${pinId}?pin_id=${pinId}`, {
//         method: 'GET',
//         headers: {
//             'Authorization': `Bearer ${token}`,
//             'Content-Type': 'application/json',
//             'Accept': 'application/json',
//         },
//     });
//
//     return res.json();
// }

export default async function PracticePage({
                                               searchParams,
                                           }: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {

    const { index, rounds, time, intervals, isPreset } = await searchParams;

    if (!index || typeof index !== 'string') {
        throw new Error("No board index provided. Please go back and select a board.");
    }

    const rawTime = time as string;
    const parsedTime = rawTime === "null" ? null : Number(rawTime);

    // parse intervals as numbers
    const parsedIntervals = intervals
        ? (Array.isArray(intervals) ? intervals : [intervals]).map(Number)
        : [];

    const isPresetBoard = isPreset === "true";

    // If these fail, error.tsx will catch the thrown errors automatically
    const data = isPresetBoard
        ? await getPresetBoardPins(index)
        : await getListOfPins(index);

    if (!data || !Array.isArray(data.items)) {
        throw new Error("Pinterest returned an unexpected data format or missing pins.");
    }

    return (
        <>
            <main>
                <section className="bg-black">
                    <PracticeSession
                        pins={data.items}
                        rounds={Number(rounds)}
                        timePerImage={parsedTime}
                        warnIntervals={parsedIntervals}
                        boardId={index}
                    />
                </section>
            </main>
        </>
    );
}