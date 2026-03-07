import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    headers: async () => [
        {
            source: "/(.*)",
            headers: [
                { key: "X-Content-Type-Options", value: "nosniff" },
                { key: "X-Frame-Options", value: "DENY" },
                { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
                {
                    key: "Content-Security-Policy",
                    value: [
                        "default-src 'self'",
                        "img-src 'self' https://i.pinimg.com https://assets.pinterest.com",
                        "connect-src 'self' https://api.pinterest.com",
                        "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
                        "style-src 'self' 'unsafe-inline' https://use.typekit.net https://p.typekit.net",
                        "font-src 'self' https://use.typekit.net https://p.typekit.net",
                    ].join("; ")
                },
            ],
        },
    ],
};

export default nextConfig;
