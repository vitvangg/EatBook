// babel.config.js
module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'module-resolver',
        {
          alias: {
            // Định nghĩa các alias của bạn ở đây
            '@components': './src/components',
            '@screens': './src/screens',
            '@navigation': './src/navigation',
            '@assets': './assets', // Alias cho thư mục assets
            '@constants': './src/constants',
            '@hooks': './src/hooks',
          },
          extensions: [
            '.js',
            '.jsx',
            '.ts',
            '.tsx',
            '.android.js',
            '.android.tsx',
            '.ios.js',
            '.ios.tsx',
          ],
        },
      ],
    ],
  };
};