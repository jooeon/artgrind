import {cookies} from "next/headers";
import {redirect} from "next/navigation";
import {SetupForm} from "@/app/setup/SetupForm";
import Footer from "@/app/components/Footer";
import React from "react";
import ProfilePanel from "@/app/components/ProfilePanel";
import {Board} from "@/app/setup/BoardCarousel";

export const runtime = "edge";

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

    return data.items.sort((a: any, b: any) => {
        return new Date(b.board_pins_modified_at).getTime() -
            new Date(a.board_pins_modified_at).getTime();
    });
}

async function getPresetBoards(): Promise<Board[]> {
    const token = process.env.PINTEREST_PRESET_TOKEN;
    const boardIds = process.env.PINTEREST_PRESET_BOARD_IDS?.split(",") ?? [];

    if (!token || boardIds.length === 0) return [];

    const boards = await Promise.all(
        boardIds.map(async (id) => {
            const res = await fetch(`https://api.pinterest.com/v5/boards/${id.trim()}`, {
                headers: { "Authorization": `Bearer ${token}` },
            });
            return res.json();
        })
    );

    return boards.filter(b => b.id); // filter out any failed fetches
}

async function getUser() {
    const cookieStore = await cookies();
    const token = cookieStore.get("access_token")?.value;

    if (!token) return null;

    const res = await fetch("https://api.pinterest.com/v5/user_account", {
        headers: {
            "Authorization": `Bearer ${token}`,
        },
    });

    return res.json();
}

async function getUsername(user: any) {
    if (user.account_type === `PINNER`) {
        return await user.username;
    } else if (user.account_type === `BUSINESS`) {
        return await user.business_name;
    } else {
        return await "Unknown Username";
    }
}

export default async function Setup() {
    const cookieStore = await cookies();
    const token = cookieStore.get("access_token")?.value;

    const presetBoards = await getPresetBoards();
    const userBoards = token ? await getBoards() : [];

    // console.log(userBoards)

    if (!token && presetBoards.length === 0) redirect("/");

    let username: string | null = null;
    if (token) {
        const user = await getUser();
        username = await getUsername(user);
    }

    return (
        <>
            <main className="flex flex-col min-h-[100dvh] pb-[3vh] xl:pb-[1vw]">
                <div className="flex flex-col justify-between flex-1 gap-[2vh] xl:gap-[2.5vw]">
                    <ProfilePanel username={username}/>
                    <SetupForm
                        boards={userBoards}
                        presetBoards={presetBoards}
                        isLoggedIn={!!token}
                    />
                </div>
            </main>
            <Footer/>
            {/*<div className="flex flex-col justify-center items-center gap-[4vh] xl:gap-[3vw] w-full min-h-[100dvh] p-[2vh]">*/}
            {/*    <ProfilePanel username={username} />*/}
            {/*    <p className="font-fornire text-center text-[5vh] xl:text-[4vw] leading-none">Create a board on Pinterest first and come back!</p>*/}
            {/*    <Link href="/setup" className="button text-[2vh] xl:text-[1.5vw]">*/}
            {/*        I created a board*/}
            {/*    </Link>*/}
            {/*    /!*<CharacterAnimation />*!/*/}
            {/*</div>*/}
        </>
    );
}