const path = require("path")
const CopyPlugin = require("copy-webpack-plugin")

const shared = require("./webpack.config.shared")
const { PROJECT_ROOT } = require("./helpers")

/**
 * See [Webpack Configuration docs](https://webpack.js.org/configuration/) for more information.
 *
 * @type {import("webpack").Configuration}
 */
const webpackConfig = {
    ...shared,
    mode: "production",
    plugins: [
        ...shared.plugins,
        new CopyPlugin({
            patterns: [
                {
                    from: path.resolve(PROJECT_ROOT, "src", "assets"),
                    to: path.resolve(PROJECT_ROOT, "dist", "assets"),
                },
            ],
        }),
    ],
}

module.exports = webpackConfig
