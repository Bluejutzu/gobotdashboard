import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
