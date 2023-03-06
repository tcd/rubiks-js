/* eslint-disable @typescript-eslint/ban-types */

export declare global {

    export interface Array<T> {
        distanceTo: () => null | number
        first: () => T
        last: () => T
        maximum: () => T
        middle: () => T
        minimum: () => T
        rand: () => T
        random: () => T
        shuffle: () => false | Array<T>
        toArray: () => Array<T>
        toHtml: () => string
        toText: (depth: number) => string
    }

    export interface Number {
        /** Return the value of a number as a new variable to avoid mutation.  */
        dupe: () => number

        absolute: () => number
        add: (...numbers: number[]) => number
        arcCosine: () => number
        arcSine: () => number
        arcTangent: () => number
        constrain: (a: number, b: number = 0) => number
        cosine: () => number
        degreesToDirection: () => string
        degreesToRadians: () => number
        divide: (...numbers: number[]) => number
        isBetween: (a: number, b: number) => boolean
        lerp: (a: number, b: number) => number
        log: (base?: number) => number
        log10: () => number
        maximum: (n: number) => number
        minimum: (n: number) => number
        modulo: (n: number) => number
        multiply: (...numbers: number[]) => number
        normalize: (a: number, b: number) => number
        raiseTo: (exponent: number) => number
        radiansToDegrees: () => number
        rand: (n?: number) => number
        random: (n?: number) => number
        remainder: (n: number) => number
        round: (decimals?: number) => number
        roundDown: () => number
        roundUp: () => number
        scale: (a0: number, a1: number, b0: number, b1: number) => number
        sine: () => number
        subtract: (...numbers: number[]) => number
        tangent: () => number
        toArray: () => number[]
        toNumber: () => number
        toPaddedString: (padding: number) => string
        toSignedString: () => string
    }

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
