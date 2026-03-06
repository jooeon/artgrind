import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import FilterClient from "./FilterClient";

async function getListOfPins(boardId: string) {
    const cookieStore = await cookies();
    const token = cookieStore.get("access_token")?.value;

    if (!token) return null;

    const res = await fetch(`https://api.pinterest.com/v5/boards/${boardId}/pins?page_size=250`, {
        headers: { "Authorization": `Bearer ${token}` },
    });

    return res.json();
}

export default async function FilterPage({ searchParams }) {
    const { boardId } = await searchParams;
    if (!boardId) redirect("/setup");

    const { name } = await searchParams;

    const data = await getListOfPins(boardId);
    if (!data) redirect("/setup");

    return <FilterClient pins={data.items} boardId={boardId} boardName={name} />;
}