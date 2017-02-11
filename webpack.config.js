var path = require("path");
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var webpack = require('webpack');

module.exports = {
    entry: {
        app: ["./index.tsx"]
    },
    output: {
        path: path.resolve(__dirname, "dist"),
        publicPath: "/",
        filename: "bundle.js"
    },
    
    //allow cross origin request
    headers: {
        "Access-Control-Allow-Origin": "*"
    },

    // Enable sourcemaps for debugging webpack's output.
    devtool: "source-map",

    resolve: {
        root: [
          path.resolve('.')
        ],
        alias: {
          routes: path.resolve('./routes'),
          graph: path.resolve('./graph'),
          contract: path.resolve('./contract'),
          public: path.resolve('./public'),
          components: path.resolve('./components')
        },
        // Add '.ts' and '.tsx' as resolvable extensions.
        extensions: ["", ".webpack.js", ".web.js", ".ts", ".tsx", ".js", ".json"]
    },

    module: {
        loaders: [
            // All files with a '.ts' or '.tsx' extension will be handled by 'ts-loader'.
            {
                test: /\.tsx?|ts$/,
                exclude: /node_modules/,
                loader: "ts-loader"
            }, {
                test: /\.scss|sass|css$/,
                loader: ExtractTextPlugin.extract("style-loader", "css-loader!sass-loader")
            }, {
                test: /\.(jpe?g|png|gif|svg|eot|woff|ttf)$/i,
                loader: 'file'
            }, {
                test: /\.(graphql|gql)$/,
                exclude: /node_modules/,
                loader: 'graphql-tag/loader'
            }
        ],

        preLoaders: [
            // All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
            { test: /\.json$/, loader: 'json'},
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: "source-map-loader"
            }
        ]
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new ExtractTextPlugin("stylesheets/[name].css")
    ],

    sassLoader: {
        includePaths: [
            path.resolve(__dirname, 'node_modules') + 'kickstart-node'
        ]
    }
};