// /** @type {import('next').NextConfig} */
// const nextConfig = {
//     experimental:{
//         staleTimes:{
//             dynamic: 30, //client side router  caches the pages for 30 seconds
//         },
//     },
//     serverExternalPackages: ["@node-rs/argon2"],  //described in lucia doc
// };

// export default nextConfig;


/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
      staleTimes: {
        dynamic: 30, // client-side router caches the pages for 30 seconds
      },
    },
    webpack: (config, { isServer }) => {
      if (isServer) {
        config.externals.push("@node-rs/argon2");
      }
      return config;
    },
  };
  
  export default nextConfig;
  