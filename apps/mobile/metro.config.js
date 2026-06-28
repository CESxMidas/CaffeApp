const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const projectRoot = __dirname;
const monorepoRoot = path.resolve(projectRoot, '../..');
const sharedRoot = path.resolve(monorepoRoot, 'packages/shared');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(projectRoot);

// Chỉ watch shared package — tránh quét apps/api/dist (build artifact, dễ ENOENT)
config.watchFolders = [...new Set([...(config.watchFolders ?? []), sharedRoot])];
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, 'node_modules'),
  path.resolve(monorepoRoot, 'node_modules'),
];

const distBlockList = [
  /[\\/]apps[\\/]api[\\/]dist[\\/].*/,
  /[\\/]packages[\\/]shared[\\/]dist[\\/].*/,
];
config.resolver.blockList = [
  ...(Array.isArray(config.resolver.blockList) ? config.resolver.blockList : []),
  ...distBlockList,
];

module.exports = config;
