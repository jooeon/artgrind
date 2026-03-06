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

// format time in seconds to mm:ss
export function formatTime(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
}