/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      { source: '/ask_query', destination: '/api/ask_query' },
      { source: '/colleges', destination: '/api/colleges' },
      { source: '/predict_colleges', destination: '/api/predict_colleges' },
      { source: '/news', destination: '/api/news' },
      { source: '/health', destination: '/api/health' },
    ];
  },
};

export default nextConfig;
