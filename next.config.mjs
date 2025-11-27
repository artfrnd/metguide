/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['three'],
  images: {
    formats: ['image/webp'], // AVIF 제거 (변환 횟수 50% 감소)
    deviceSizes: [640, 750, 1080, 1920], // 기본값보다 적게
    imageSizes: [16, 32, 48, 64, 96], // 작은 이미지용
    minimumCacheTTL: 31536000, // 1년 캐싱
    remotePatterns: [
      {
        protocol: 'http',
        hostname: '**',
      },
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  webpack: (config) => {
    config.externals.push({
      'utf-8-validate': 'commonjs utf-8-validate',
      'bufferutil': 'commonjs bufferutil',
    });
    return config;
  },
};

export default nextConfig;
