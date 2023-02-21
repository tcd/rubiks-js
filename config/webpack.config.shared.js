const path = require("path")
const webpack = require("webpack")
const HtmlWebpackPlugin = require("html-webpack-plugin")
const TsconfigPathsPlugin = require("tsconfig-paths-webpack-plugin")

const { PROJECT_ROOT, ENV } = require("./helpers")

/**
 * See [Webpack Configuration docs](https://webpack.js.org/configuration/) for more information.
 *
 * @type {import("webpack").Configuration}
 */
const webpackConfig = {
    entry: path.join(PROJECT_ROOT, "src", "index.tsx"),
    output: {
        path: path.join(PROJECT_ROOT, "dist"),
        publicPath: "/",
        filename: "bundle.js",
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: path.join(PROJECT_ROOT, "src", "index.html"),
            hash: true,
            inject: true,
        }),
        new webpack.DefinePlugin({
            ENV: JSON.stringify(ENV),
        }),
        new webpack.ProvidePlugin({ process: "process/browser.js" }),
    ],
    resolve: {
        extensions: ["*", ".js", ".jsx", ".tsx", ".ts", ".scss", ".md"],
        modules: [__dirname, "src", "node_modules"],
        // fallback: {
        //     console: false,
        //     process: false,
        // },
        plugins: [
            new TsconfigPathsPlugin.TsconfigPathsPlugin(),
        ],
    },
    module: {
        rules: [
            {
                test: /\.[jt]sx?$/i,
                exclude: /node_modules/,
                use: ["babel-loader"],
            },
            {
                test: /\.(png|svg|gif)$/,
                type: "asset/resource",
            },
        ],
    },
}

module.exports = webpackConfig
