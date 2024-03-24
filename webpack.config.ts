const path = require('path');

module.exports = {
  entry: './src/Vue/index.jsx', // 入口文件设置为 index.jsx
  output: {
    path: path.resolve(__dirname, 'src/Vue'), // 输出目录为原目录 "src"
    filename: 'index.js', // 输出文件命名为 index.js
    libary: {
      type: 'module'
    }
  },
  module: {
    rules: [
      {
        test: /\.jsx$/, // 只针对 .jsx 文件
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-react'], // 对 React JSX 进行转换
          },
        },
      },
    ],
  },
  externals: /^(?!(src\/index\.jsx$)).*$/, // 排除 index.jsx 外的所有文件，不打包进输出文件
  resolve: {
    extensions: ['.js', '.jsx'], // 解析扩展名
  },
  optimization: {
    minimize: false
  }
};