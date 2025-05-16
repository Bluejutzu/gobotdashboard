import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    redirects: async () => {
        if (process.env.NODE_ENV === "development") {
            return [
                {
                    source: "/error-demo/:slug*",
                    destination: '/404',
                    permanent: true,
                }
            ];
        } else {
            return []
        }
    },
    eslint: {
        ignoreDuringBuilds: true,
    },
    webpack: (config) => {
        config.watchOptions = {
            ...config.watchOptions,
            ignored: ['**/bot/**']
        }
        return config
    },
    serverExternalPackages: ['bot']
};

export default nextConfig;
