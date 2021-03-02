const path = require('path');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const webpack = require('webpack');
const SVGSpriteMapPlugin = require('svg-spritemap-webpack-plugin');


module.exports = {
    devtool: "cheap-module-source-map",
    context: path.resolve(__dirname, 'src'), // указываем в какой папке лежат все файлы (проект)
    entry: {
        app: './index.js', // откуда забрать все настройки (index.js)
    },
    output: {
        filename: './assets/js/[name][hash].js',
        path: path.resolve(__dirname, './public'), // куда сложить готовый app.js
    },
    externals: './node_modules/',
    plugins:[
        new SVGSpriteMapPlugin({
            input:{
                options: {
                    src:'./assets/img/svg/!*.svg',
                    externals: './node_modules/'
                }
            },
            output: {
                filename: './assets/img/sprite.svg',
                svg4everybody:{
                    nosvg: true,
                    polyfill: true
                },
                svg:{
                    sizes: true,
                }
            },
            sprite:{
                prefix:false,
                generate:{
                    title:false
                }
            }
        }),
        new MiniCssExtractPlugin({
            filename: './assets/css/[name][hash].css'
        }),
        new HTMLWebpackPlugin({ // создает index.html в public с подключеныйми js c hash
            template: './index.html',
            filename: 'index.html',
        }),
        new HTMLWebpackPlugin({
            template: './quiz.html',
            filename: 'quiz.html',
        }),
        new CleanWebpackPlugin(), // чистим папку public от js c hash
        new CopyWebpackPlugin({
            patterns: [
                { from: 'assets/img/any', to: 'assets/img/any' },
                { from: 'assets/fonts', to: 'assets/fonts' }
            ],
        }),
        new webpack.ProvidePlugin({ // без этого не будет работать owl.caruosel
            $: 'jquery',
            jQuery: 'jquery',
            'window.jQuery': 'jquery'
        })
    ],
    module:{
        rules: [
            {
                test: /\.js$/,
                loader: 'babel-loader',
                exclude: '/node_modules/'
            },{
                test: /\.css$/,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            publicPath: '../',
                        },
                    }, 'css-loader']
            },{
                test: /\.s[ac]ss$/,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            publicPath: '../',
                        },
                    },
                    'css-loader',
                    'sass-loader',
                ],
            },{
                test: /\.(png|jpg|svg)$/,
                exclude: '/node_modules/',
                use:{
                    loader: 'file-loader',
                    options: {
                        name: '[name].[ext]',
                        outputPath: './img/any',
                    },
                }
            },{
                test: /\.(woff(2)?|ttf|eot|otf)$/,
                use:{
                    loader: 'file-loader',
                    options: {
                        name: '[name].[ext]',
                        outputPath: './assets/fonts',
                    },
                }
            }
        ]
    }
};
