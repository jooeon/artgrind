import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { SetupForm } from "@/app/setup/SetupForm";
import Footer from "@/app/components/Footer";
import React from "react";
import ProfilePanel from "@/app/components/ProfilePanel";
import { Board } from "@/app/setup/BoardCarousel";

export const runtime = "edge";

async function getBoards() {
    const cookieStore = await cookies();
    const token = cookieStore.get("access_token")?.value;

    if (!token) return [];

    const res = await fetch("https://api.pinterest.com/v5/boards", {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    if (!res.ok) {
        if (res.status === 401 || res.status === 403) {
            throw new Error("Your Pinterest session expired. Please reconnect your account.");
        }
        throw new Error(`Failed to load boards: ${res.statusText}`);
    }

    const data = await res.json();

    // Safety check: Ensure items exist before sorting
    if (!data.items || !Array.isArray(data.items)) {
        return [];
    }

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

            if (!res.ok) {
                const errorText = await res.text();
                console.error(`DEBUG: Fetch failed for board ${id}. Status: ${res.status}`, errorText);
                return null;
            }
            return await res.json();
        })
    );

    // Filter out nulls from failed fetches and ensure an ID exists
    return boards.filter((b): b is Board => b !== null && !!b.id);
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

    if (!res.ok) {
        return null; // If getting the user fails, we just won't show the username, no need to crash
    }

    return res.json();
}

// Removed the unnecessary `await` keywords here
function getUsername(user: any) {
    if (!user) return null;

    if (user.account_type === `PINNER`) {
        return user.username;
    } else if (user.account_type === `BUSINESS`) {
        return user.business_name;
    } else {
        return "Unknown Username";
    }
}

export default async function Setup() {
    const cookieStore = await cookies();
    const token = cookieStore.get("access_token")?.value;

    const [presetBoards, userBoards, user] = await Promise.all([
        getPresetBoards(),
        token ? getBoards() : Promise.resolve([]),
        token ? getUser() : Promise.resolve(null)
    ]);

    if (!token && presetBoards.length === 0) {
        redirect("/");
    }

    const username = getUsername(user);

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
        </>
    );
}