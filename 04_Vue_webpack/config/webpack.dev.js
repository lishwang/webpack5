const path = require('path');
const ESLintPlugin = require('eslint-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './src/main.js',
  output: {
    path: path.resolve(__dirname, '../dist'),
    filename: "static/js/[name].js",
    chunkFilename: "static/js/[name].chunk.js",
    assetModuleFilename: "static/media/[hash:6][ext][query]",
    clean: true,
  },
  module: {
    rules: [
      {
        oneOf: [
          {
            test: /\.css$/,
            use: [
              "style-loader",
              "css-loader",
              {
                loader: "postcss-loader",
                options: {
                  postcssOptions: {
                    plugins: [
                      [
                        "postcss-preset-env",
                      ],
                    ],
                  },
                },
              },
            ],
          },
          {
            test: /\.less$/,
            use: [
              "style-loader",
              "css-loader",
              {
                loader: "postcss-loader",
                options: {
                  plugins: [
                    [
                      "postcss-preset-env",
                    ],
                  ],
                },
              },
              "less-loader",
            ],
          },
          {
            test: /\.s[ac]ss$/,
            use: [
              "style-loader",
              "css-loader",
              {
                loader: "postcss-loader",
                options: {
                  plugins: [
                    [
                      "postcss-preset-env",
                    ],
                  ],
                },
              },
            ],
          },
          {
            test: /\.styl$/,
            use: [
              "style-loader",
              "css-loader",
              {
                loader: "postcss-loader",
                options: {
                  plugins: [
                    [
                      "postcss-preset-env",
                    ],
                  ],
                },
              },
            ],
          },
          {
            test: /\.(png|jpe?g|gif|svg)$/,
            type: 'asset',
            parser: {
              dataUrlCondition: {
                maxSize: 4 * 1024 // 4kb
              }
            }
          },
          {
            test: /\.(ttf|woff2?|mp3|mp4)$/,
            type: "asset/resource",
          },
          {
            test: /\.js$/,
            exclude: /node_modules[\\/]/,
            // include: path.resolve(__dirname, "../src"), // 指定处理范围
            use: {
              loader: 'babel-loader',
              options: {
                cacheDirectory: true,
                cacheCompression: false,
                presets: ['@babel/preset-env']
              }
            }
          }
        ]
      }
    ]
  },
  plugins: [
    new ESLintPlugin({
      context: path.resolve(__dirname, '../src'),
      exclude: "node_modules",
      cache: true,
      cacheLocation: path.resolve(__dirname, "../node_modules/.cache/.eslintcache"),
    }),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, "../public/index.html"),
    })
  ],
  mode: "development",
}