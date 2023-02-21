const path = require("path")
const shared = require("./webpack.config.shared")
const { PROJECT_ROOT } = require("./helpers")

/**
 * See [Webpack Configuration docs](https://webpack.js.org/configuration/) for more information.
 *
 * @type {import("webpack").Configuration}
 */
const webpackConfig = {
    ...shared,
    mode: "development",
    devtool: "inline-source-map",
    /** @type {import("webpack").Configuration} */
    devServer: {
        static: [
            {
                directory: path.join(PROJECT_ROOT, "dist"),
            },
            {
                directory: path.join(PROJECT_ROOT, "src", "assets"),
                publicPath: "/public",
            },
        ],
        historyApiFallback: true,
        port: 1974,
        allowedHosts: "all",
        hot: true,
    },
    module: {
        rules: [
            ...shared.module.rules,
            {
                enforce: "pre",
                test: /\.tsx?$/,
                use: "source-map-loader",
            },
        ],
    },
}

module.exports = webpackConfig
