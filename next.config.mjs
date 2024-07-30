/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental:{
        staleTimes:{
            dynamic: 30, //client side router  caches the pages for 30 seconds
        },
    },
};

export default nextConfig;
