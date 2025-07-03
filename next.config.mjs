/** @type {import('next').NextConfig} */
const nextConfig = {
    eslint : {
        ignoreDuringBuilds : true
    },
    typescript: {
    ignoreBuildErrors: true, // ✅ This disables TypeScript errors during build
  },
    images:{
        remotePatterns : [
            {
                protocol: 'https',
                hostname: 'ui-avatars.com',
                port: '',
                pathname: '/api/**',
                
              },
        ]
    }
};

export default nextConfig;
