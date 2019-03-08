const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const LodashModuleReplacementPlugin = require("lodash-webpack-plugin");
const path = require("path");

const frontendPath = path.join(__dirname, "frontend");
const srcPath = path.join(frontendPath, "src");
const distPath = path.join(frontendPath, "dist");

module.exports = {
    entry: path.join(srcPath, "index.tsx"),

    output: {
        path: distPath,
        pathinfo: false,
        publicPath: "/",
    },

    stats: {
        children: false,
        modules: false,
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
        new ForkTsCheckerWebpackPlugin({ tsconfig: path.join(__dirname, "tsconfig.json"), watch: frontendPath }),
        new LodashModuleReplacementPlugin(),
        new HtmlWebpackPlugin({
            title: "Tic-Tac-Toe",
            template: path.join(srcPath, "index.html"),
            filename: path.join(distPath, "index.html"),
        }),
    ],
};
