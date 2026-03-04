import {cookies} from "next/headers";
import {redirect} from "next/navigation";
import PracticeSession from "@/app/practice/PracticeSession";

async function getListOfPins(boardId: string) {
    const cookieStore = await cookies();
    const token = cookieStore.get("access_token")?.value;

    if (!token) return null;

    const res = await fetch(`https://api.pinterest.com/v5/boards/${boardId}/pins?board_id=${boardId}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
    });

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

    const { index } = await searchParams;
    const { rounds } = await searchParams;
    const { time } = await searchParams;
    const { intervals } = await searchParams;

    if (!index || typeof index !== 'string') {
        throw new Error("No index provided");
    }

    const rawTime = time as string;
    const parsedTime = rawTime === "null" ? null : Number(rawTime);

    // parse intervals as numbers
    const parsedIntervals = intervals
        ? (Array.isArray(intervals) ? intervals : [intervals]).map(Number)
        : [];

    const data = await getListOfPins(index);

    if (!data) redirect("/setup");

    // console.log(data)

    return (
        <>
            <main>
                <section className="bg-black-light">
                    <PracticeSession
                        pins={data.items}
                        rounds={Number(rounds)}
                        timePerImage={parsedTime}
                        warnIntervals={parsedIntervals}
                    />
                </section>
            </main>
        </>
    );
}