const common = require("./webpack.common.js");
const merge = require("webpack-merge");
const { DefinePlugin, HashedModuleIdsPlugin } = require("webpack");
const CompressionPlugin = require("compression-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");

module.exports = merge(common, {
    mode: "production",

    optimization: {
        minimizer: [
            new TerserPlugin({
                cache: false,
                parallel: true,
                terserOptions: {
                    ecma: 6,
                },
            }),
        ],
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
