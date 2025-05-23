module.exports = {
  presets: [
    ['next/babel', { 'preset-react': { runtime: 'automatic' } }],
    '@babel/preset-typescript',
  ],
  plugins: [
    ['@babel/plugin-proposal-decorators', { legacy: true }],
    ['@babel/plugin-proposal-class-properties', { loose: true }],
    ['@babel/plugin-proposal-private-methods', { loose: true }],
    ['@babel/plugin-proposal-private-property-in-object', { loose: true }],
    '@babel/plugin-syntax-dynamic-import',
    'babel-plugin-macros',
    ['babel-plugin-styled-components', { ssr: true, displayName: true }],
    'babel-plugin-transform-typescript-metadata',
    ['@babel/plugin-transform-runtime', { regenerator: true }],
  ],
  env: {
    test: {
      presets: [
        ['next/babel', { 'preset-react': { runtime: 'automatic' } }],
        '@babel/preset-typescript',
      ],
      plugins: [
        '@babel/plugin-transform-modules-commonjs',
        'babel-plugin-dynamic-import-node',
        ['babel-plugin-styled-components', { ssr: true, displayName: true }],
      ],
    },
  },
};
