import type { NextConfig } from "next";

const nextConfig = {
    allowedDevOrigins: ['192.168.101.106'],
    experimental: {
        serverActions: {
            bodySizeLimit: '10mb'
        }
    }
};

export default nextConfig;
