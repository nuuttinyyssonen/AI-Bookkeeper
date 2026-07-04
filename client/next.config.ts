import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
    allowedDevOrigins: ['192.168.101.114'],
    experimental: {
        serverActions: {
            bodySizeLimit: '15mb'
        }
    }
};

export default withNextIntl(nextConfig);