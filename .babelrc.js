module.exports = function(api) {
    const plugins = [["@babel/plugin-transform-runtime", { corejs: 2 }], "lodash"];

    api.cache(true);

    return {
        presets: [
            ["@babel/env", { targets: "last 3 Chrome versions", modules: false, useBuiltIns: "usage" }],
            "@babel/react",
            "@babel/typescript",
        ],
        plugins,
    };
};
