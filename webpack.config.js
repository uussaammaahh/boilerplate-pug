const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyPlugin = require('copy-webpack-plugin');

const devMode = process.env.NODE_ENV === 'development';
const publicPath = devMode ? 'http://localhost:8080/' : '';
const outputDir = 'dist';

module.exports = {
    context: path.resolve(__dirname),
    devtool: devMode ? 'source-map' : false,
    entry: {
        app: './src/app.js'
    },
    output: {
        filename: './assets/' + (devMode ? '[name].bundle.js' : '[name].bundle.js'),
        path: path.join(__dirname, outputDir),
        publicPath: publicPath
    },
    module: {
        rules: [{
            test: /\.(pdf|gif|png|jpe?g|svg)$/i,
            loader: 'image-webpack-loader',
            enforce: 'pre',
            options: {
                disable: devMode,
                mozjpeg: {
                    progressive: true,
                    quality: 65
                },
                optipng: {
                    enabled: true,
                },
                pngquant: {
                    quality: [0.65, 0.90],
                    speed: 4
                },
                gifsicle: {
                    interlaced: false,
                },
            },
        }, {
            test: /\.(eot|ttf|woff|woff2)$/,
            loader: 'url-loader',
            options: {
                name: 'fonts/[name].[ext]',
                context: 'src',
                publicPath: publicPath + './assets/',
                outputPath: 'assets/',
                limit: 1 * 1024 //1KB
            }
        }, {
            test: /\.(pdf|png|jpeg|jpg|gif)$/,
            loader: 'url-loader',
            options: {
                name: 'images/[name].[ext]',
                context: 'src',
                publicPath: publicPath + './assets/',
                outputPath: 'assets/',
                limit: 1 * 1024, //1KB
                esModule: false
            }
        }, {
            test: /\.svg$/,
            loader: 'svg-url-loader',
            options: {
                name(file) {
                    if (/fonts/.test(file)) {
                        return 'fonts/[name].[ext]';
                    }
                    return 'vectors/[name].[ext]';
                },
                context: 'src',
                publicPath: publicPath + './assets/',
                outputPath: 'assets/',
                limit: 2 * 1024, //2KB
                noquotes: true,
            }
        }, {
            test: /\.(sa|sc|c)ss$/,
            use: [{
                loader: MiniCssExtractPlugin.loader,
                options: {
                    sourceMap: devMode
                }
            }, {
                loader: 'css-loader',
                options: {
                    sourceMap: devMode
                }
            }, {
                loader: "postcss-loader",
                options: {
                    ident: 'postcss',
                    plugins: (loader) => [
                        require('postcss-import')({ root: loader.resourcePath }),
                        require('postcss-preset-env')(),
                        require("autoprefixer")({ grid: false }),
                        require("css-mqpacker")(),
                        require('cssnano')()
                    ],
                    sourceMap: devMode
                }
            }, {
                loader: 'sass-loader',
                options: {
                    sassOptions: {
                        includePaths: [
                            './node_modules',
                            path.join(__dirname, 'src', 'images')
                        ],
                    },
                    sourceMap: devMode
                }
            }]
        }, {
            test: /\.js$/,
            exclude: /node_modules/,
            use: {
                loader: 'babel-loader'
            }
        }, {
            test: /\.(pug|jade)$/,
            use: [{
                loader: 'pug-loader',
                options: {
                    pretty: true
                },
            }, ]
        }]
    },
    resolve: {
        extensions: [
            '.js',
            '.pug', '.jade',
            '.scss', '.sass', '.css',
            '.eot', '.ttf', '.woff', '.woff2',
            '.jpg', '.jpeg', '.png', '.svg', '.gif', '.ico',
        ],
        alias: {
            'src': path.join(__dirname, 'src')
        }
    },
    plugins: [
        new CleanWebpackPlugin(),
        new MiniCssExtractPlugin({
            filename: './' + (devMode ? '[name].bundle.css' : '[name].bundle.css')
        }),
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: 'src/pug/index.pug',
            minify: false, // remove to minify html
        }),
        // new CopyPlugin({
        //     patterns: [
        //         { from: 'src/js/jquery.js', to: '' }
        //     ],
        // }),
    ],
    optimization: {
        minimize: false,
        minimizer: [new TerserPlugin({
            parallel: false,
            sourceMap: false,
            terserOptions: {
                warnings: false,
            },
            extractComments: true,
        })],
    },
}