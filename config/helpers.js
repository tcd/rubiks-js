/* eslint-disable @typescript-eslint/no-var-requires */
const path = require("path")

const PROJECT_ROOT = path.resolve(__dirname, "..")
const APP_VERSION = require("../package.json").version
const IS_DEVELOPMENT = process.env.NODE_ENV !== "production"

const ENV = {
    APP_VERSION,
}

module.exports = {
    PROJECT_ROOT,
    IS_DEVELOPMENT,
    ENV,
}
