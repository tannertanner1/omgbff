import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // experimental: {
  //   reactCompiler: true
  //   // ppr: "incremental",
  //   // staleTimes: { dynamic: 30 },
  //   // after: true ,
  // },
  typescript: {
    ignoreBuildErrors: true
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
}

export default nextConfig
