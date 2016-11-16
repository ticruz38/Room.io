var path = require("path");
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var webpack = require('webpack');

module.exports = {
    entry: {
        app: ["./src/index.js"]
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
        // Add '.ts' and '.tsx' as resolvable extensions.
        extensions: ["", ".webpack.js", ".web.js", ".ts", ".tsx", ".js"]
    },

    module: {
        loaders: [{
            test: /\.js$/,
            loader: 'babel',
            exclude: /node_modules/,
            query: {
                presets: ['react', 'es2015', 'stage-0'],
                plugins: ['transform-class-properties', 'transform-decorators-legacy']
                }
            },
            {
                test: /\.tsx?$/,
                loader: "ts-loader"
            }, {
                test: /\.scss|sass|css$/,
                loader: ExtractTextPlugin.extract("style-loader", "css-loader!sass-loader")
            }, {
                test: /\.(jpe?g|png|gif|svg|eot|woff|ttf)$/i,
                loader: 'file'
            }
        ],

        preLoaders: [
            // All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
            {
                test: /\.js$/,
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