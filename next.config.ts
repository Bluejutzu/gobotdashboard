import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    images: {
        remotePatterns: [
            {
                hostname: "cdn.discordapp.com",
                protocol: "https",
                pathname: "/icons/**"
            },
        ]
    },
    eslint: {
        ignoreDuringBuilds: true
    },
    webpack: config => {
        config.watchOptions = {
            ...config.watchOptions,
            ignored: ["**/bot/**"]
        };
        return config;
    },
    serverExternalPackages: ["bot"]
};

export default nextConfig;
