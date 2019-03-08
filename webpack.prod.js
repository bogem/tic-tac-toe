const common = require("./webpack.common.js");
const merge = require("webpack-merge");
const { HashedModuleIdsPlugin } = require("webpack");

module.exports = merge(common, {
    mode: "production",

    plugins: [new HashedModuleIdsPlugin()],
});
