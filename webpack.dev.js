const path = require("path");
const { NamedModulesPlugin } = require("webpack");
const merge = require("webpack-merge");

const common = require("./webpack.common.js");

module.exports = merge(common, {
    mode: "development",

    devtool: "source-map",

    devServer: {
        contentBase: path.join(__dirname, "frontend", "dist"),
        port: 3000,
    },

    plugins: [new NamedModulesPlugin()],
});
