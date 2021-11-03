const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyPlugin = require('copy-webpack-plugin');

const yourWebsiteLinkHere = './';
const devMode = process.env.NODE_ENV === 'development';
const port = 8080;
const publicPath = devMode ? `http://localhost:${port}/` : yourWebsiteLinkHere;
const outputDir = 'dist';

module.exports = {
    devServer: {
        static: {
            directory: path.join(__dirname, 'public'),
        },
        compress: true,
        port
    },
    context: path.resolve(__dirname),
    devtool: devMode ? 'source-map' : false,
    entry: {
        app: './src/app.js'
    },
    output: {
        filename: (devMode ? '[name].js' : '[name].bundle-[hash].js'),
        path: path.join(__dirname, outputDir),
        publicPath: publicPath
    },
    module: {
        rules: [
            // {
            //     test: /\.(pdf|gif|png|jpe?g|svg)$/i,
            //     loader: 'image-webpack-loader',
            //     enforce: 'pre',
            //     options: {
            //         disable: devMode,
            //         mozjpeg: {
            //             progressive: true,
            //             quality: 65
            //         },
            //         optipng: {
            //             enabled: true,
            //         },
            //         pngquant: {
            //             quality: [0.65, 0.90],
            //             speed: 4
            //         },
            //         gifsicle: {
            //             interlaced: false,
            //         },
            //     },
            // },
            {
                test: /\.(eot|ttf|woff|woff2)$/,
                loader: 'url-loader',
                options: {
                    name: 'fonts/[name].[ext]',
                    publicPath: publicPath,
                    outputPath: '/',
                    limit: false
                }
            },
            {
                test: /\.(pdf|png|jpeg|jpg|gif)$/,
                loader: 'url-loader',
                options: {
                    name: 'images/[name].[ext]',
                    publicPath: publicPath,
                    outputPath: '/',
                    limit: 1024,
                    esModule: false,
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
                    publicPath: publicPath,
                    outputPath: '/',
                    limit: 2 * 1024, //2KB
                    noquotes: true,
                }
            }, {
                test: /\.(sa|sc|c)ss$/,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            esModule: false
                        },
                    },
                    {
                        loader: 'css-loader',
                        options: {
                            esModule: false
                        }
                    },
                    {
                        loader: "postcss-loader"
                    },
                    {
                        loader: 'sass-loader',
                        options: {
                            sassOptions: {
                                includePaths: [
                                    './node_modules',
                                    path.join(__dirname, 'src', 'images')
                                ]
                            }
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
                },]
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
            filename: (devMode ? '[name].css' : '[name].bundle-[hash].css')
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
            terserOptions: {
                warnings: false,
            },
            extractComments: true,
        })],
    },
}