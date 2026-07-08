/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Verification builds (CI, e2e, agent checks) set NEXT_DIST_DIR=.next-verify
  // so they never clobber the .next directory a running dev server serves from.
  distDir: process.env.NEXT_DIST_DIR || ".next",
};
export default nextConfig;
