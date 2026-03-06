import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import FilterClient from "./FilterClient";

export const runtime = "edge";

async function getListOfPins(boardId: string) {
    const cookieStore = await cookies();
    const token = cookieStore.get("access_token")?.value;

    if (!token) return null;

    const res = await fetch(`https://api.pinterest.com/v5/boards/${boardId}/pins?page_size=250`, {
        headers: { "Authorization": `Bearer ${token}` },
    });

    return res.json();
}

export default async function FilterPage({
                                             searchParams
                                         }: {
    searchParams: Promise<{ [key: string]: string | undefined }>
}) {
    const { boardId } = await searchParams;
    const { name } = await searchParams;
    if (!boardId || !name) redirect("/setup");

    const data = await getListOfPins(boardId);
    if (!data) redirect("/setup");

    return <FilterClient pins={data.items} boardId={boardId} boardName={name} />;
}