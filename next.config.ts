import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack: (config) => {
    return config;
  },

	async rewrites() {
		return [
			{
				source: "/api/:path*",
				destination: `${process.env.NEXT_PUBLIC_BACKEND_URL}/:path*`
			}
		]
	}
};

export default nextConfig;
