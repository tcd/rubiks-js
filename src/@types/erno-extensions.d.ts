/* eslint-disable @typescript-eslint/ban-types */

export declare global {
    export interface String {
        capitalize: () => string
        invert: () => string
        justifyCenter: (n: number) => string
        justifyLeft: (n: number) => string
        justifyRight: (n: number) => string
        multiply: (n: number) => string
        reverse: () => string
        size: () => number
        toEntities: () => string
        toCamelCase: () => string
        directionToDegrees: () => number
        toArray: () => string[]
        toNumber: () => number
        toUnderscoreCase: () => string
        toUnicode: () => string
    }
}
