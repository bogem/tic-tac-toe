const path = require("path");
const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");
const { NamedModulesPlugin } = require("webpack");
const merge = require("webpack-merge");

const common = require("./webpack.common.js");

module.exports = merge(common, {
    mode: "development",

    devtool: "source-map",

    devServer: {
        contentBase: path.join(__dirname, "dist"),
        historyApiFallback: true,
        port: 3002,
    },

    plugins: [
        new NamedModulesPlugin(),
        new ForkTsCheckerWebpackPlugin({ tsconfig: path.join(__dirname, "tsconfig.json"), watch: __dirname }),
    ],
});
