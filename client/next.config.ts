import type { NextConfig } from "next";

const nextConfig = {
    allowedDevOrigins: ['192.168.101.106'],
    experimental: {
        serverActions: {
            bodySizeLimit: '15mb'
        }
    }
};

export default nextConfig;
