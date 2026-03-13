const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Agregar .wasm como tipo de asset
config.resolver.assetExts.push('wasm');

module.exports = config;
