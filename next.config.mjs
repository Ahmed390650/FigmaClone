/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    PUBLIC_KEY:
      "pk_dev_MMUUPCuzhCWxNvpd54aNDErD_AME8VrWeuefFYv3JrUFDibqfL62c_XNLVfZDe6-",
  },
  webpack: (config) => {
    config.externals.push({
      "utf-8-validate": "commonjs utf-8-validate",
      bufferutil: "commonjs bufferutil",
      canvas: "commonjs canvas",
    });
    // config.infrastructureLogging = { debug: /PackFileCache/ };
    return config;
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "liveblocks.io",
        port: "",
      },
    ],
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
