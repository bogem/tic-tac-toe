const common = require("./webpack.common.js");
const merge = require("webpack-merge");
const { HashedModuleIdsPlugin } = require("webpack");
const CompressionPlugin = require("compression-webpack-plugin");

module.exports = merge(common, {
    mode: "production",

    optimization: {
        splitChunks: {
            chunks: "all",
        },
    },

    plugins: [
        new HashedModuleIdsPlugin(),
        new CompressionPlugin({
            test: /\.js(\?.*)?$/i,
        }),
    ],
});
