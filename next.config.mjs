import { createMDX } from 'fumadocs-mdx/next';

const withMDX = createMDX();

/** @type {import('next').NextConfig} */
const config = {
  reactStrictMode: true,
  turbopack: {
    resolveAlias: {
      'fumadocs-ui/components': 'fumadocs-ui/mdx',
    },
  },
  webpack: (cfg) => {
    cfg.resolve = cfg.resolve || {};
    cfg.resolve.alias = cfg.resolve.alias || {};
    cfg.resolve.alias['fumadocs-ui/components'] = 'fumadocs-ui/mdx';
    return cfg;
  },
};

export default withMDX(config);
