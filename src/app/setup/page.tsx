import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import BoardCarousel from "@/app/setup/BoardCarousel";

// Get the first x boards, sorted by last modified
async function getBoards() {
    const cookieStore = await cookies();
    const token = cookieStore.get("access_token")?.value;

    if (!token) return null;

    const res = await fetch("https://api.pinterest.com/v5/boards", {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    const data = await res.json();

    const sorted = data.items.sort((a: any, b: any) => {
        return new Date(b.board_pins_modified_at).getTime() -
            new Date(a.board_pins_modified_at).getTime();
    });

    return sorted;
}

export default async function Setup() {
    const data = await getBoards();

    if (!data) redirect("/");

    // console.log(data)

    return (
        <main
            className="flex xl:flex-col justify-between gap-[2.5vh] xl:gap-[4vw] px-[2.5vh] xl:px-[2vw] pt-[5vh] xl:pt-[4vw]">
            <BoardCarousel boards={data}/>
            <section className="flex justify-center items-center w-full">
                <div className="relative w-9/12 xl:w-1/2 h-9/12 xl:h-[40vh]">
                    {/* shadow box */}
                    <div className="absolute inset-0 translate-y-4 border-3 rounded-xl bg-custom-black"></div>
                    {/* main box */}
                    <div className="absolute inset-0 border-3 rounded-xl bg-custom-white z-10"></div>
                </div>
            </section>
        </main>
    );
}