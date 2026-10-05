/**
 * Next.js configuration file.
 * Enables loading remote images from images.unsplash.com for the Next/Image component.
 */
module.exports = {
  // Existing config can be extended here if needed
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**"
      },
      {
        protocol: "https",
        hostname: "cdn.simpleicons.org",
        pathname: "/**"
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/**"
      }
    ]
  }
};
