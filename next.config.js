/**
 * Next.js configuration file.
 * Enables loading remote images from images.unsplash.com for the Next/Image component.
 */
module.exports = {
  // Existing config can be extended here if needed
  images: {

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
      }
    ]
  }
};
