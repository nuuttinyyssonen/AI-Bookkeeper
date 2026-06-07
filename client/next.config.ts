import type { NextConfig } from "next";

const nextConfig = {
    allowedDevOrigins: ['192.168.1.105'],
    experimental: {
        serverActions: {
            bodySizeLimit: '15mb'
        }
    }
};

export default nextConfig;
