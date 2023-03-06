Number.prototype.dupe = function(this: number): number { return this + 0 }

Number.prototype.absolute = function(this: number) {
    return Math.abs(this)
}

Number.prototype.add = function(this: number, ...numbers: number[]): number {
    let sum = this.dupe()
    numbers.forEach((n) => {
        sum += n
    })
    return sum
}

Number.prototype.arcCosine = function(this: number) {
    return Math.acos(this)
}

Number.prototype.arcSine = function(this: number) {
    return Math.asin(this)
}

Number.prototype.arcTangent = function(this: number) {
    return Math.atan(this)
}

Number.prototype.constrain = function(this: number, a: number, b: number = 0): number {
    let c = this.dupe()
    const higher = Math.max(a, b)
    const lower = Math.min(a, b)
    c = Math.min(c, higher)
    c = Math.max(c, lower)
    return c
}

Number.prototype.cosine = function(this: number) {
    return Math.cos(this)
}

Number.prototype.degreesToDirection = function(this: number) {
    // const d = this % 360
    const directions = ["N", "NNE", "NE", "NEE", "E", "SEE", "SE", "SSE", "S", "SSW", "SW", "SWW", "W", "NWW", "NW", "NNW", "N"]
    return directions[this.scale(0, 360, 0, directions.length - 1).round()]
}

Number.prototype.degreesToRadians = function(this: number) {
    return this * Math.PI / 180
}

Number.prototype.divide = function(this: number, ...numbers: number[]): number {
    let sum = this.dupe()
    numbers.forEach((n) => {
        sum /= n
    })
    return sum
}

Number.prototype.isBetween = function(this: number, a: number, b: number) {
    const min = Math.min(a, b)
    const max = Math.max(a, b)
    return (min <= this && this <= max)
}

Number.prototype.lerp = function(this: number, a, b) {
    return a + (b - a) * this
}

Number.prototype.log = function(this: number, base: number = undefined) {
    return Math.log(this) / (base === undefined ? 1 : Math.log(base))
}

// is this more pragmatic? ---> return ( '' + this.round() ).length;
Number.prototype.log10 = function(this: number) {
    return Math.log(this) / Math.LN10
}

Number.prototype.maximum = function(this: number, n: number) {
    return Math.max(this, n)
}

Number.prototype.minimum = function(this: number, n: number) {
    return Math.min(this, n)
}

Number.prototype.modulo = function(this: number, n: number) {
    return ((this % n) + n) % n
}

Number.prototype.multiply = function(this: number, ...numbers: number[]): number {
    let sum = this.dupe()
    numbers.forEach((n) => {
        sum *= n
    })
    return sum
}

Number.prototype.normalize = function(this: number, a: number, b: number): number {
    if (a == b) { return 1.0 }
    return (this - a) / (b - a)
}

Number.prototype.raiseTo = function(this: number, exponent: number): number {
    return Math.pow(this, exponent)
}

Number.prototype.radiansToDegrees = function(this: number): number {
    return this * 180 / Math.PI
}

Number.prototype.rand = function(this: number, n: number = undefined): number {
    if (n !== undefined) {
        const min = Math.min(this, n)
        const max = Math.max(this, n)
        return min + Math.floor(Math.random() * (max - min))
    }
    return Math.floor(Math.random() * this)
}

Number.prototype.random = function(this: number, n: number = undefined) {
    if (n !== undefined) {
        const min = Math.min(this, n)
        const max = Math.max(this, n)
        return min + Math.random() * (max - min)
    }
    return Math.random() * this
}

Number.prototype.remainder = function(this: number, n: number): number {
    return this % n
}

Number.prototype.round = function(this: number, decimals: number = 0): number {
    let n = this.dupe()
    decimals = decimals || 0
    n *= Math.pow(10, decimals)
    n = Math.round(n)
    n /= Math.pow(10, decimals)
    return n
}

Number.prototype.roundDown = function(this: number): number {
    return Math.floor(this)
}

Number.prototype.roundUp = function(this: number): number {
    return Math.ceil(this)
}

Number.prototype.scale = function(this: number, a0: number, a1: number, b0: number, b1: number): number {
    const phase = this.normalize(a0, a1)
    if (b0 == b1) { return b1 }
    return b0 + phase * (b1 - b0)
}

Number.prototype.sine = function(this: number): number {
    return Math.sin(this)
}

Number.prototype.subtract = function(this: number, ...numbers: number[]): number {
    let sum = this.dupe()
    numbers.forEach((n) => {
        sum -= n
    })
    return sum
}

Number.prototype.tangent = function(this: number): number {
    return Math.tan(this)
}

Number.prototype.toArray = function(this: number): number[] {
    return [this.valueOf()]
}

Number.prototype.toNumber = function(this: number): number {
    return this.valueOf()
}

Number.prototype.toPaddedString = function(this: number, padding: number) {
    return ("0000000000000" + String(this)).slice(-padding)
}

Number.prototype.toSignedString = function(this: number): string {
    let stringed = "" + this
    if (this >= 0) { stringed = "+" + stringed }
    return stringed
}

Number.prototype.toString = function(this: number): string {
    return `${this}`
}
