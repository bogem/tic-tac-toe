const HtmlWebpackPlugin = require("html-webpack-plugin");
const LodashModuleReplacementPlugin = require("lodash-webpack-plugin");
const path = require("path");

const srcPath = path.join(__dirname, "src");
const distPath = path.join(__dirname, "dist");

module.exports = {
    entry: path.join(srcPath, "index.tsx"),

    output: {
        filename: `[name].[contenthash].js`,
        chunkFilename: `[name].[chunkhash].js`,
        path: distPath,
        pathinfo: false,
        publicPath: "/",
    },

    stats: {
        children: false,
        modules: false,
    },

    resolve: {
        alias: {
            common: path.resolve(__dirname, "../common"),
            frontend: path.resolve(__dirname),
        },
        extensions: [".ts", ".tsx", ".js"],
    },

    module: {
        rules: [
            {
                test: /\.(ts|tsx)$/,
                loader: "babel-loader",
                exclude: /node_modules/,
                query: {
                    cacheCompression: false,
                    cacheDirectory: true,
                },
            },
        ],
    },
    plugins: [
        new LodashModuleReplacementPlugin(),
        new HtmlWebpackPlugin({
            title: "Tic-Tac-Toe",
            template: path.join(srcPath, "index.html"),
            filename: path.join(distPath, "index.html"),
        }),
    ],
};
