/**
 * @author [mrdoob](http://mrdoob.com/)
 * @author [philogb](http://blog.thejit.org/)
 * @author [egraether](http://egraether.com/)
 * @author [zz85](http://www.lab4games.net/zz85/blog)
 */
export class Vector2 {

    public x: __<number>
    public y: __<number>

    constructor(x = 0, y = 0) {
        this.x = x || 0
        this.y = y || 0
    }

    public set(x, y) {
        this.x = x
        this.y = y
        return this
    }
    public setX(x) {
        this.x = x
        return this
    }
    public setY(y) {
        this.y = y
        return this
    }
    public setComponent(index, value) {
        switch (index) {
            case 0: this.x = value; break
            case 1: this.y = value; break
            default: throw new Error(`index is out of range: ${index}`)
        }
    }
    public getComponent(index) {
        switch (index) {
            case 0: return this.x
            case 1: return this.y
            default: throw new Error(`index is out of range: ${index}`)
        }
    }
    public copy(v) {
        this.x = v.x
        this.y = v.y
        return this
    }
    public add(v, w) {
        if (w !== undefined) {
            console.warn("DEPRECATED: Vector2's .add() now only accepts one argument. Use .addVectors( a, b ) instead.")
            return this.addVectors(v, w)
        }
        this.x += v.x
        this.y += v.y
        return this
    }
    public addVectors(a, b) {
        this.x = a.x + b.x
        this.y = a.y + b.y
        return this
    }
    public addScalar(s) {
        this.x += s
        this.y += s
        return this
    }
    public sub(v, w) {
        if (w !== undefined) {
            console.warn("DEPRECATED: Vector2's .sub() now only accepts one argument. Use .subVectors( a, b ) instead.")
            return this.subVectors(v, w)
        }
        this.x -= v.x
        this.y -= v.y
        return this
    }
    public subVectors(a, b) {
        this.x = a.x - b.x
        this.y = a.y - b.y
        return this
    }
    public multiplyScalar(s) {
        this.x *= s
        this.y *= s
        return this
    }
    public divideScalar(scalar) {
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
    public min(v) {
        if (this.x > v.x) {
            this.x = v.x
        }
        if (this.y > v.y) {
            this.y = v.y
        }
        return this
    }
    public max(v) {
        if (this.x < v.x) {
            this.x = v.x
        }
        if (this.y < v.y) {
            this.y = v.y
        }
        return this
    }
    // This function assumes min < max, if this assumption isn't true it will not operate correctly
    public clamp(min, max) {
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
    public clampScalar(minVal, maxVal) {
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
    public floor() {
        this.x = Math.floor(this.x)
        this.y = Math.floor(this.y)
        return this
    }
    public ceil() {
        this.x = Math.ceil(this.x)
        this.y = Math.ceil(this.y)
        return this
    }
    public round() {
        this.x = Math.round(this.x)
        this.y = Math.round(this.y)
        return this
    }
    public roundToZero() {
        this.x = (this.x < 0) ? Math.ceil(this.x) : Math.floor(this.x)
        this.y = (this.y < 0) ? Math.ceil(this.y) : Math.floor(this.y)
        return this
    }
    public negate() {
        return this.multiplyScalar(- 1)
    }
    public dot(v) {
        return this.x * v.x + this.y * v.y
    }
    public lengthSq() {
        return this.x * this.x + this.y * this.y
    }
    public length() {
        return Math.sqrt(this.x * this.x + this.y * this.y)
    }
    public normalize() {
        return this.divideScalar(this.length())
    }
    public distanceTo(v) {
        return Math.sqrt(this.distanceToSquared(v))
    }
    public distanceToSquared(v) {
        const dx = this.x - v.x, dy = this.y - v.y
        return dx * dx + dy * dy
    }
    public setLength(l) {
        const oldLength = this.length()
        if (oldLength !== 0 && l !== oldLength) {
            this.multiplyScalar(l / oldLength)
        }
        return this
    }
    public lerp(v, alpha) {
        this.x += (v.x - this.x) * alpha
        this.y += (v.y - this.y) * alpha
        return this
    }
    public equals(v) {
        return ((v.x === this.x) && (v.y === this.y))
    }
    public fromArray(array) {
        this.x = array[0]
        this.y = array[1]
        return this
    }
    public toArray() {
        return [this.x, this.y]
    }
    public clone() {
        return new Vector2(this.x, this.y)
    }
}
