/**
 * @author [mrdoob](http://mrdoob.com/)
 * @author [philogb](http://blog.thejit.org/)
 * @author [egraether](http://egraether.com/)
 * @author [zz85](http://www.lab4games.net/zz85/blog)
 */
export class Vector2 {

    public x
    public y

    constructor(x = 0, y = 0) {
        this.x = x || 0
        this.y = y || 0
    }

    set(x, y) {
        this.x = x
        this.y = y
        return this
    }
    setX(x) {
        this.x = x
        return this
    }
    setY(y) {
        this.y = y
        return this
    }
    setComponent(index, value) {
        switch (index) {
            case 0: this.x = value; break
            case 1: this.y = value; break
            default: throw new Error(`index is out of range: ${index}`)
        }
    }
    getComponent(index) {
        switch (index) {
            case 0: return this.x
            case 1: return this.y
            default: throw new Error(`index is out of range: ${index}`)
        }
    }
    copy(v) {
        this.x = v.x
        this.y = v.y
        return this
    }
    add(v, w) {
        if (w !== undefined) {
            console.warn("DEPRECATED: Vector2's .add() now only accepts one argument. Use .addVectors( a, b ) instead.")
            return this.addVectors(v, w)
        }
        this.x += v.x
        this.y += v.y
        return this
    }
    addVectors(a, b) {
        this.x = a.x + b.x
        this.y = a.y + b.y
        return this
    }
    addScalar(s) {
        this.x += s
        this.y += s
        return this
    }
    sub(v, w) {
        if (w !== undefined) {
            console.warn("DEPRECATED: Vector2's .sub() now only accepts one argument. Use .subVectors( a, b ) instead.")
            return this.subVectors(v, w)
        }
        this.x -= v.x
        this.y -= v.y
        return this
    }
    subVectors(a, b) {
        this.x = a.x - b.x
        this.y = a.y - b.y
        return this
    }
    multiplyScalar(s) {
        this.x *= s
        this.y *= s
        return this
    }
    divideScalar(scalar) {
        if (scalar !== 0) {
            const invScalar = 1 / scalar
            this.x *= invScalar
            this.y *= invScalar
        } else {
            this.x = 0
            this.y = 0
        }
        return this
    }
    min(v) {
        if (this.x > v.x) {
            this.x = v.x
        }
        if (this.y > v.y) {
            this.y = v.y
        }
        return this
    }
    max(v) {
        if (this.x < v.x) {
            this.x = v.x
        }
        if (this.y < v.y) {
            this.y = v.y
        }
        return this
    }
    clamp(min, max) {
        // This function assumes min < max, if this assumption isn't true it will not operate correctly
        if (this.x < min.x) {
            this.x = min.x
        } else if (this.x > max.x) {
            this.x = max.x
        }
        if (this.y < min.y) {
            this.y = min.y
        } else if (this.y > max.y) {
            this.y = max.y
        }
        return this
    }
    clampScalar(minVal, maxVal) {
        let min
        let max
        if (min === undefined) {
            min = new Vector2()
            max = new Vector2()
        }
        min.set(minVal, minVal)
        max.set(maxVal, maxVal)
        return this.clamp(min, max)
    }
    floor() {
        this.x = Math.floor(this.x)
        this.y = Math.floor(this.y)
        return this
    }
    ceil() {
        this.x = Math.ceil(this.x)
        this.y = Math.ceil(this.y)
        return this
    }
    round() {
        this.x = Math.round(this.x)
        this.y = Math.round(this.y)
        return this
    }
    roundToZero() {
        this.x = (this.x < 0) ? Math.ceil(this.x) : Math.floor(this.x)
        this.y = (this.y < 0) ? Math.ceil(this.y) : Math.floor(this.y)
        return this
    }
    negate() {
        return this.multiplyScalar(- 1)
    }
    dot(v) {
        return this.x * v.x + this.y * v.y
    }
    lengthSq() {
        return this.x * this.x + this.y * this.y
    }
    length() {
        return Math.sqrt(this.x * this.x + this.y * this.y)
    }
    normalize() {
        return this.divideScalar(this.length())
    }
    distanceTo(v) {
        return Math.sqrt(this.distanceToSquared(v))
    }
    distanceToSquared(v) {
        const dx = this.x - v.x, dy = this.y - v.y
        return dx * dx + dy * dy
    }
    setLength(l) {
        const oldLength = this.length()
        if (oldLength !== 0 && l !== oldLength) {
            this.multiplyScalar(l / oldLength)
        }
        return this
    }
    lerp(v, alpha) {
        this.x += (v.x - this.x) * alpha
        this.y += (v.y - this.y) * alpha
        return this
    }
    equals(v) {
        return ((v.x === this.x) && (v.y === this.y))
    }
    fromArray(array) {
        this.x = array[0]
        this.y = array[1]
        return this
    }
    toArray() {
        return [this.x, this.y]
    }
    clone() {
        return new Vector2(this.x, this.y)
    }
}
