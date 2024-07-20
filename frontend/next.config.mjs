import CopyPlugin from "copy-webpack-plugin";
import path from "node:path";
/** @type {import('next').NextConfig} */
const nextConfig = {
  generateBuildId: async () => {
    // This could be anything, using the latest git hash
    return process.env.GIT_HASH;
  },
  reactStrictMode: false,
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    // console.log(isServer); // true or false
    // Note: we provide webpack above so you should not `require` it
    // Perform customizations to webpack config
    if (!isServer) {
      config.plugins.push(
        new CopyPlugin({
          patterns: [
            {
              from: path.resolve(
                ".",
                "node_modules",
                "vscode-material-icons",
                "generated",
                "icons",
              ),
              to: path.resolve(
                ".",
                "public",
                "assets",
                "icons",
                "material-icons",
              ),
            },
          ],
        }),
      );
    }

    // Important: return the modified config
    return config;
  },
};

export default nextConfig;
