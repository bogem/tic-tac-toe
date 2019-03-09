const path = require("path");
const { NamedModulesPlugin } = require("webpack");
const merge = require("webpack-merge");

const common = require("./webpack.common.js");

module.exports = merge(common, {
    mode: "development",

    devtool: "source-map",

    devServer: {
        contentBase: path.join(__dirname, "dist"),
        historyApiFallback: true,
        port: 3001,
    },

    plugins: [new NamedModulesPlugin()],
});
