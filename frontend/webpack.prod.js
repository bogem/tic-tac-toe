const common = require("./webpack.common.js");
const merge = require("webpack-merge");
const { DefinePlugin, HashedModuleIdsPlugin } = require("webpack");
const CompressionPlugin = require("compression-webpack-plugin");

module.exports = merge(common, {
    mode: "production",

    optimization: {
        splitChunks: {
            chunks: "all",
        },
    },

    plugins: [
        new CompressionPlugin({
            test: /\.js(\?.*)?$/i,
        }),
        new DefinePlugin({
            "process.env.SERVER_URL": JSON.stringify(process.env.SERVER_URL),
        }),
        new HashedModuleIdsPlugin(),
    ],
});
