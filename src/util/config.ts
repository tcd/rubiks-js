// Provided using `webpack.DefinePlugin`
// @ts-ignore: next-line
const env: IConfig = ENV

class Config implements IConfig {

    public NODE_ENV: NodeEnv
    public APP_VERSION: string


    constructor() {
        this.NODE_ENV = env.NODE_ENV
        this.APP_VERSION = env.APP_VERSION
    }

}

const CONFIG = new Config()

export default CONFIG
