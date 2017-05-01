var path = require("path");
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var webpack = require('webpack');


module.exports = {
    entry: {
        app: ["./index.tsx"],
        vendor: [
            'mobx', 'mobx-react', 'react', 'react-dom', 'react-router', 'ipfs', 'moment'
        ],
    },
    output: {
        path: path.resolve(__dirname, "dist"),
        // build publicpath "/ipns/QmRiVcrZ7Jibn5CddvwE4UCGvQkDALy3e1h8aEUxu9PbcG/"
        publicPath: "/",
        filename: "bundle.js"
    },

    // Enable sourcemaps for debugging webpack's output.
    devtool: "eval",

    resolve: {
        alias: {
          zlib: 'browserify-zlib-next', // for js-ipfs to integrate with the right deps in browser mode
          routes: path.resolve('./routes'),
          graph: path.resolve('./graph'),
          contract: path.resolve('./contract'),
          public: path.resolve('./public'),
          components: path.resolve('./components'),
          models: path.resolve('./models'),
        },
        modules: [
            path.resolve('.'),
            "node_modules"
        ],
        // Add '.ts' and '.tsx' as resolvable extensions.
        extensions: [".webpack.js", ".web.js", ".ts", ".tsx", ".js", ".json"]
    },

    module: {
        rules: [
            // All files with a '.ts' or '.tsx' extension will be handled by 'ts-loader'.
            {
                test: /\.tsx?|ts$/,
                exclude: /node_modules/,
                loader: "ts-loader"
            }, {
                test: /\.scss|sass|css$/,
                loader: ExtractTextPlugin.extract({
                    fallback: "style-loader",
                    use: ["css-loader", "sass-loader"] 
                } )
            }, {
                test: /\.(jpe?g|png|gif|svg|eot|woff|ttf)$/i,
                exclude: /node_modules/,
                loader: 'file-loader'
            }, {
                test: /\.(graphql|gql)$/,
                exclude: /node_modules/,
                loader: 'graphql-tag/loader'
            }, { // All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
                test: /\.js$/,
                exclude: /node_modules/,
                loader: "source-map-loader"
            }
        ]
    },
    plugins: [
        new webpack.optimize.CommonsChunkPlugin({
            name: 'vendor',
            minChunks: Infinity,
            filename: 'vendor.js'
        }),
        new webpack.HotModuleReplacementPlugin(),
        new ExtractTextPlugin("[name].css")
    ]
};