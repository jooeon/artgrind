import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const runtime = "edge";

export async function GET() {
    const cookieStore = await cookies();
    cookieStore.delete("access_token");
    redirect("/");
}