
/** @type {import('next').NextConfig} */

const path = require('path');

const nextConfig = {
  images: {
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  sassOptions: {
    includePaths: [path.join(__dirname, 'styles')],
  },
  typescript: {
    //TODO: Fix when we'll fix all the TS error in components/three
    ignoreBuildErrors: true
  }
}

module.exports = nextConfig
