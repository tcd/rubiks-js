import { Euler } from "../Euler"

/**
 * @author [mrdoob](http://mrdoob.com/)
 * @author [kile](http://kile.stravaganza.org/)
 * @author [philogb](http://blog.thejit.org/)
 * @author [mikael emtinger](http://gomo.se/)
 * @author [egraether](http://egraether.com/)
 * @author [WestLangley](http://github.com/WestLangley)
 */
export class Vector3 {

    public x
    public y
    public z

    constructor(x = 0, y = 0, z = 0) {
        this.x = x || 0
        this.y = y || 0
        this.z = z || 0
    }

    set(x, y, z) {
        this.x = x
        this.y = y
        this.z = z
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
    setZ(z) {
        this.z = z
        return this
    }
    setComponent(index, value) {
        switch (index) {
            case 0: this.x = value; break
            case 1: this.y = value; break
            case 2: this.z = value; break
            default: throw new Error("index is out of range: " + index)
        }
    }
    getComponent(index) {
        switch (index) {
            case 0: return this.x
            case 1: return this.y
            case 2: return this.z
            default: throw new Error("index is out of range: " + index)
        }
    }
    copy(v) {
        this.x = v.x
        this.y = v.y
        this.z = v.z
        return this
    }
    add(v, w) {
        if (w !== undefined) {
            console.warn("DEPRECATED: Vector3's .add() now only accepts one argument. Use .addVectors( a, b ) instead.")
            return this.addVectors(v, w)
        }
        this.x += v.x
        this.y += v.y
        this.z += v.z
        return this
    }
    addScalar(s) {
        this.x += s
        this.y += s
        this.z += s
        return this
    }
    addVectors(a, b) {
        this.x = a.x + b.x
        this.y = a.y + b.y
        this.z = a.z + b.z
        return this
    }
    sub(v, w = undefined) {
        if (w !== undefined) {
            console.warn("DEPRECATED: Vector3's .sub() now only accepts one argument. Use .subVectors( a, b ) instead.")
            return this.subVectors(v, w)
        }
        this.x -= v.x
        this.y -= v.y
        this.z -= v.z
        return this
    }
    subVectors(a, b) {
        this.x = a.x - b.x
        this.y = a.y - b.y
        this.z = a.z - b.z
        return this
    }
    multiply(v, w) {
        if (w !== undefined) {
            console.warn("DEPRECATED: Vector3's .multiply() now only accepts one argument. Use .multiplyVectors( a, b ) instead.")
            return this.multiplyVectors(v, w)
        }
        this.x *= v.x
        this.y *= v.y
        this.z *= v.z
        return this
    }
    multiplyScalar(scalar) {
        this.x *= scalar
        this.y *= scalar
        this.z *= scalar
        return this
    }
    multiplyVectors(a, b) {
        this.x = a.x * b.x
        this.y = a.y * b.y
        this.z = a.z * b.z
        return this
    }
    applyEuler(euler: Euler) {
        let quaternion
        if (euler instanceof Euler === false) {
            console.error("ERROR: Vector3's .applyEuler() now expects a Euler rotation rather than a Vector3 and order.  Please update your code.")
        }
        if (quaternion === undefined) quaternion = new THREE.Quaternion()
        this.applyQuaternion(quaternion.setFromEuler(euler))
        return this
    }
    applyAxisAngle(axis, angle) {
        let quaternion
        if (quaternion === undefined) { quaternion = new THREE.Quaternion() }
        this.applyQuaternion(quaternion.setFromAxisAngle(axis, angle))
        return this
    }
    applyMatrix3(m) {
        const x = this.x
        const y = this.y
        const z = this.z
        const e = m.elements
        this.x = e[0] * x + e[3] * y + e[6] * z
        this.y = e[1] * x + e[4] * y + e[7] * z
        this.z = e[2] * x + e[5] * y + e[8] * z
        return this
    }
    applyMatrix4(m) {
        // input: THREE.Matrix4 affine matrix
        const x = this.x, y = this.y, z = this.z
        const e = m.elements
        this.x = e[0] * x + e[4] * y + e[8] * z + e[12]
        this.y = e[1] * x + e[5] * y + e[9] * z + e[13]
        this.z = e[2] * x + e[6] * y + e[10] * z + e[14]
        return this
    }
    applyProjection(m) {
        // input: THREE.Matrix4 projection matrix
        const x = this.x, y = this.y, z = this.z
        const e = m.elements
        const d = 1 / (e[3] * x + e[7] * y + e[11] * z + e[15]) // perspective divide
        this.x = (e[0] * x + e[4] * y + e[8] * z + e[12]) * d
        this.y = (e[1] * x + e[5] * y + e[9] * z + e[13]) * d
        this.z = (e[2] * x + e[6] * y + e[10] * z + e[14]) * d
        return this
    }
    applyQuaternion(q) {
        const x = this.x
        const y = this.y
        const z = this.z
        const qx = q.x
        const qy = q.y
        const qz = q.z
        const qw = q.w
        // calculate quat * vector
        const ix = qw * x + qy * z - qz * y
        const iy = qw * y + qz * x - qx * z
        const iz = qw * z + qx * y - qy * x
        const iw = -qx * x - qy * y - qz * z
        // calculate result * inverse quat
        this.x = ix * qw + iw * -qx + iy * -qz - iz * -qy
        this.y = iy * qw + iw * -qy + iz * -qx - ix * -qz
        this.z = iz * qw + iw * -qz + ix * -qy - iy * -qx
        return this
    }
    transformDirection(m) {
        // input: THREE.Matrix4 affine matrix
        // vector interpreted as a direction
        const x = this.x, y = this.y, z = this.z
        const e = m.elements
        this.x = e[0] * x + e[4] * y + e[8] * z
        this.y = e[1] * x + e[5] * y + e[9] * z
        this.z = e[2] * x + e[6] * y + e[10] * z
        this.normalize()
        return this
    }
    divide(v) {
        this.x /= v.x
        this.y /= v.y
        this.z /= v.z
        return this
    }
    divideScalar(scalar) {
        if (scalar !== 0) {
            const invScalar = 1 / scalar
            this.x *= invScalar
            this.y *= invScalar
            this.z *= invScalar
        } else {
            this.x = 0
            this.y = 0
            this.z = 0
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
        if (this.z > v.z) {
            this.z = v.z
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
        if (this.z < v.z) {
            this.z = v.z
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
        if (this.z < min.z) {
            this.z = min.z
        } else if (this.z > max.z) {
            this.z = max.z
        }
        return this
    }
    clampScalar(minVal, maxVal) {
        let min, max
        if (min === undefined) {
            min = new THREE.Vector3()
            max = new THREE.Vector3()
        }
        min.set(minVal, minVal, minVal)
        max.set(maxVal, maxVal, maxVal)
        return this.clamp(min, max)
    }
    floor() {
        this.x = Math.floor(this.x)
        this.y = Math.floor(this.y)
        this.z = Math.floor(this.z)
        return this
    }
    ceil() {
        this.x = Math.ceil(this.x)
        this.y = Math.ceil(this.y)
        this.z = Math.ceil(this.z)
        return this
    }
    round() {
        this.x = Math.round(this.x)
        this.y = Math.round(this.y)
        this.z = Math.round(this.z)
        return this
    }
    roundToZero() {
        this.x = (this.x < 0) ? Math.ceil(this.x) : Math.floor(this.x)
        this.y = (this.y < 0) ? Math.ceil(this.y) : Math.floor(this.y)
        this.z = (this.z < 0) ? Math.ceil(this.z) : Math.floor(this.z)
        return this
    }
    negate() {
        return this.multiplyScalar(- 1)
    }
    dot(v) {
        return this.x * v.x + this.y * v.y + this.z * v.z
    }
    lengthSq() {
        return this.x * this.x + this.y * this.y + this.z * this.z
    }
    length() {
        return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z)
    }
    lengthManhattan() {
        return Math.abs(this.x) + Math.abs(this.y) + Math.abs(this.z)
    }
    normalize() {
        return this.divideScalar(this.length())
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
        this.z += (v.z - this.z) * alpha
        return this
    }
    cross(v, w) {
        if (w !== undefined) {
            console.warn("DEPRECATED: Vector3's .cross() now only accepts one argument. Use .crossVectors( a, b ) instead.")
            return this.crossVectors(v, w)
        }
        const x = this.x, y = this.y, z = this.z
        this.x = y * v.z - z * v.y
        this.y = z * v.x - x * v.z
        this.z = x * v.y - y * v.x
        return this
    }
    crossVectors(a, b) {
        const ax = a.x, ay = a.y, az = a.z
        const bx = b.x, by = b.y, bz = b.z
        this.x = ay * bz - az * by
        this.y = az * bx - ax * bz
        this.z = ax * by - ay * bx
        return this
    }
    projectOnVector(vector) {
        let v1
        let dot
        if (v1 === undefined) v1 = new THREE.Vector3()
        v1.copy(vector).normalize()
        dot = this.dot(v1)
        return this.copy(v1).multiplyScalar(dot)
    }
    projectOnPlane(planeNormal) {
        let v1
        if (v1 === undefined) v1 = new THREE.Vector3()
        v1.copy(this).projectOnVector(planeNormal)
        return this.sub(v1)
    }
    reflect(normal) {
        // reflect incident vector off plane orthogonal to normal
        // normal is assumed to have unit length
        let v1
        if (v1 === undefined) v1 = new THREE.Vector3()
        return this.sub(v1.copy(normal).multiplyScalar(2 * this.dot(normal)))
    }
    angleTo(v) {
        const theta = this.dot(v) / (this.length() * v.length())
        // clamp, to handle numerical problems
        return Math.acos(THREE.Math.clamp(theta, -1, 1))
    }
    distanceTo(v) {
        return Math.sqrt(this.distanceToSquared(v))
    }
    distanceToSquared(v) {
        const dx = this.x - v.x
        const dy = this.y - v.y
        const dz = this.z - v.z
        return dx * dx + dy * dy + dz * dz
    }
    setEulerFromRotationMatrix(m, order) {
        console.error("REMOVED: Vector3\'s setEulerFromRotationMatrix has been removed in favor of Euler.setFromRotationMatrix(), please update your code.")
    }
    setEulerFromQuaternion(q, order) {
        console.error("REMOVED: Vector3\'s setEulerFromQuaternion: has been removed in favor of Euler.setFromQuaternion(), please update your code.")
    }
    getPositionFromMatrix(m) {
        console.warn("DEPRECATED: Vector3\'s .getPositionFromMatrix() has been renamed to .setFromMatrixPosition(). Please update your code.")
        return this.setFromMatrixPosition(m)
    }
    getScaleFromMatrix(m) {
        console.warn("DEPRECATED: Vector3\'s .getScaleFromMatrix() has been renamed to .setFromMatrixScale(). Please update your code.")
        return this.setFromMatrixScale(m)
    }
    getColumnFromMatrix(index, matrix) {
        console.warn("DEPRECATED: Vector3\'s .getColumnFromMatrix() has been renamed to .setFromMatrixColumn(). Please update your code.")
        return this.setFromMatrixColumn(index, matrix)
    }
    setFromMatrixPosition(m) {
        this.x = m.elements[12]
        this.y = m.elements[13]
        this.z = m.elements[14]
        return this
    }
    setFromMatrixScale(m) {
        const sx = this.set(m.elements[0], m.elements[1], m.elements[2]).length()
        const sy = this.set(m.elements[4], m.elements[5], m.elements[6]).length()
        const sz = this.set(m.elements[8], m.elements[9], m.elements[10]).length()
        this.x = sx
        this.y = sy
        this.z = sz
        return this
    }
    setFromMatrixColumn(index, matrix) {
        const offset = index * 4
        const me = matrix.elements
        this.x = me[offset]
        this.y = me[offset + 1]
        this.z = me[offset + 2]
        return this
    }
    equals(v) {
        return ((v.x === this.x) && (v.y === this.y) && (v.z === this.z))
    }
    fromArray(array) {
        this.x = array[0]
        this.y = array[1]
        this.z = array[2]
        return this
    }
    toArray() {
        return [this.x, this.y, this.z]
    }
    clone() {
        return new THREE.Vector3(this.x, this.y, this.z)
    }

}
