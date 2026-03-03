// Parse the user provided URL
export function parsePinterestUrl(url: string): { username: string; boardname: string } | null {
    try {
        const parsed = new URL(url);
        const parts = parsed.pathname.split("/").filter(Boolean);
        // pathname: /username/boardname → ["username", "boardname"]
        if (parts.length < 2) return null;
        return { username: parts[0], boardname: parts[1] };
    } catch {
        return null;
    }
}