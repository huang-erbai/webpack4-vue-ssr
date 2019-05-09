/*
 * @Author: 黄 楠
 * @Date: 2019-04-30 13:59:45
 * @Last Modified by: 黄 楠
 * @Last Modified time: 2019-05-09 11:34:08
 * @Description:
 */
const path = require("path");
const VueLoaderPlugin = require("vue-loader/lib/plugin");
const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");
const FriendlyErrorsPlugin = require("friendly-errors-webpack-plugin");
const ExtractCssChunks = require("extract-css-chunks-webpack-plugin")
const OptimizeCssAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");

const isProd = process.env.NODE_ENV === "production";

const baseConfig = {
    mode: isProd ? 'production' : 'development',
    devtool: isProd ?
        false : '#cheap-module-source-map',
    output: {
        path: path.resolve(__dirname, "../dist"),
        publicPath: "/dist/",
        filename: "[name].[chunkhash].js",
    },
    resolve: {
        extensions: [".ts", ".js"],
    },
    module: {
        rules: [{
                test: /\.vue$/,
                use: {
                    loader: "vue-loader",
                    options: {
                        compilerOptions: {
                            preserveWhitespace: false
                        }
                    }
                },
            }, {
                test: /\.(ts|js)$/,
                exclude: (file) => (
                    /node_modules/.test(file) &&
                    !/\.vue\.js/.test(file)
                ),
                use: "babel-loader",
            },
            {
                test: /\.ts$/,
                use: [{
                    loader: "ts-loader",
                    options: {
                        appendTsSuffixTo: [/\.vue$/],
                        transpileOnly: true,
                    },
                }],
            },
            {
                test: /\.styl(us)?$/,
                use: [
                    isProd ? {
                        loader: ExtractCssChunks.loader,
                        options: {
                            hot: false, // if you want HMR - we try to automatically inject hot reloading but if it's not working, add it to the config
                            reloadAll: false, // when desperation kicks in - this is a brute force HMR flag
                        }
                    } : 'vue-style-loader',
                    'css-loader',
                    'stylus-loader'
                ]
            },
            {
                oneOf: [{
                        test: /\.(png|jpg|gif|woff|svg|eot|ttf)$/,
                        use: [{
                            loader: "url-loader",
                            options: {
                                limit: 8192,
                                name: "static/media/[name].[hash:8].[ext]",
                            },
                        }],
                    },
                    {
                        test: /\.(png|jpg|gif|woff|svg|eot|ttf)$/,
                        use: [{
                            loader: "file-loader",
                            options: {
                                name: "static/media/[name].[hash:8].[ext]",
                            },
                        }],
                    },
                ],
            },
        ],
    },
    plugins: [
        new VueLoaderPlugin(),
        new ForkTsCheckerWebpackPlugin({
            tslint: true,
            vue: true,
        }),
        ...isProd ? [new ExtractCssChunks({
            // Options similar to the same options in webpackOptions.output
            // both options are optional
            filename: "[name].[chunkhash].css",
            chunkFilename: "[name].css",
            orderWarning: true, // Disable to remove warnings about conflicting order between imports
        }), ] : [new FriendlyErrorsPlugin()]
    ],
    performance: {
        maxEntrypointSize: 300000,
        hints: isProd ? 'warning' : false
    },
    optimization: {}
};

if (isProd) {
    baseConfig.optimization.minimizer = [
        new UglifyJsPlugin({
            uglifyOptions: {
                compress: {
                    unused: true,
                    drop_debugger: true
                },
                output: {
                    comments: false
                }
            },
            extractComments: false, // 移除注释
            sourceMap: false,
            parallel: true, // 开启并行压缩，充分利用cpu
            cache: true,
            exclude: /\.min\.js$/ // 过滤掉以".min.js"结尾的文件
        }),
        new OptimizeCssAssetsPlugin({
            assetNameRegExp: /\.css$/g,
            cssProcessor: require('cssnano'),
            cssProcessorPluginOptions: {
                preset: ['default', {
                    autoprefixer: {
                        disable: true
                    },
                    mergeLonghand: false,
                    discardComments: {
                        removeAll: true
                    }
                }],
            },
            canPrint: true
        })
    ];
}

module.exports = baseConfig;