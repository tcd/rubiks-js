import { Euler } from "./Euler"

/**
 * @author mikael emtinger / http://gomo.se/
 * @author alteredq / http://alteredqualia.com/
 * @author WestLangley / http://github.com/WestLangley
 * @author bhouston / http://exocortex.com
 */
export class Quaternion {

    public _x: any
    public _y: any
    public _z: any
    public _w: any
    public _euler: Euler

    constructor(x = 0, y = 0, z = 0, w = 0) {
        this._x = x || 0
        this._y = y || 0
        this._z = z || 0
        this._w = (w !== undefined) ? w : 1
    }

    public _updateEuler(callback: any = undefined) {
        if (this._euler !== undefined) {
            this._euler.setFromQuaternion(this, undefined, false)
        }
        return
    }

    public static slerp = function(qa, qb, qm, t) {
        return qm.copy(qa).slerp(qb, t)
    }

    // =========================================================================
    // Accessors
    // =========================================================================

    public get x() {
        return this._x
    }

    public set x(value) {
        this._x = value
        this._updateEuler()
    }

    public get y() {
        return this._y
    }

    public set y(value) {
        this._y = value
        this._updateEuler()
    }

    public get z() {
        return this._z
    }

    public set z(value) {
        this._z = value
        this._updateEuler()
    }

    public get w() {
        return this._w
    }

    public set w(value) {
        this._w = value
        this._updateEuler()
    }

    // =========================================================================
    // Methods
    // =========================================================================

    public set(x, y, z, w) {
        this._x = x
        this._y = y
        this._z = z
        this._w = w
        this._updateEuler()
        return this
    }

    public copy(quaternion: Quaternion) {
        this._x = quaternion._x
        this._y = quaternion._y
        this._z = quaternion._z
        this._w = quaternion._w
        this._updateEuler()
        return this
    }

    public setFromEuler(euler: Euler, update: boolean) {
        if (euler instanceof Euler === false) {
            throw new Error("ERROR: Quaternion's .setFromEuler() now expects a Euler rotation rather than a Vector3 and order.  Please update your code.")
        }
        // http://www.mathworks.com/matlabcentral/fileexchange/
        // 	20696-function-to-convert-between-dcm-euler-angles-quaternions-and-euler-vectors/
        //	content/SpinCalc.m
        const c1 = Math.cos(euler._x / 2)
        const c2 = Math.cos(euler._y / 2)
        const c3 = Math.cos(euler._z / 2)
        const s1 = Math.sin(euler._x / 2)
        const s2 = Math.sin(euler._y / 2)
        const s3 = Math.sin(euler._z / 2)
        if (euler.order === "XYZ") {
            this._x = s1 * c2 * c3 + c1 * s2 * s3
            this._y = c1 * s2 * c3 - s1 * c2 * s3
            this._z = c1 * c2 * s3 + s1 * s2 * c3
            this._w = c1 * c2 * c3 - s1 * s2 * s3
        } else if (euler.order === "YXZ") {
            this._x = s1 * c2 * c3 + c1 * s2 * s3
            this._y = c1 * s2 * c3 - s1 * c2 * s3
            this._z = c1 * c2 * s3 - s1 * s2 * c3
            this._w = c1 * c2 * c3 + s1 * s2 * s3
        } else if (euler.order === "ZXY") {
            this._x = s1 * c2 * c3 - c1 * s2 * s3
            this._y = c1 * s2 * c3 + s1 * c2 * s3
            this._z = c1 * c2 * s3 + s1 * s2 * c3
            this._w = c1 * c2 * c3 - s1 * s2 * s3
        } else if (euler.order === "ZYX") {
            this._x = s1 * c2 * c3 - c1 * s2 * s3
            this._y = c1 * s2 * c3 + s1 * c2 * s3
            this._z = c1 * c2 * s3 - s1 * s2 * c3
            this._w = c1 * c2 * c3 + s1 * s2 * s3
        } else if (euler.order === "YZX") {
            this._x = s1 * c2 * c3 + c1 * s2 * s3
            this._y = c1 * s2 * c3 + s1 * c2 * s3
            this._z = c1 * c2 * s3 - s1 * s2 * c3
            this._w = c1 * c2 * c3 - s1 * s2 * s3
        } else if (euler.order === "XZY") {
            this._x = s1 * c2 * c3 - c1 * s2 * s3
            this._y = c1 * s2 * c3 - s1 * c2 * s3
            this._z = c1 * c2 * s3 + s1 * s2 * c3
            this._w = c1 * c2 * c3 + s1 * s2 * s3
        }
        if (update !== false) this._updateEuler()
        return this
    }

    /**
     * from http://www.euclideanspace.com/maths/geometry/rotations/conversions/angleToQuaternion/index.htm
     */
    public setFromAxisAngle(axis, angle) {
        // axis have to be normalized
        const  halfAngle = angle / 2
        const  s = Math.sin(halfAngle)
        this._x = axis.x * s
        this._y = axis.y * s
        this._z = axis.z * s
        this._w = Math.cos(halfAngle)
        this._updateEuler()
        return this
    }

    /**
     * http://www.euclideanspace.com/maths/geometry/rotations/conversions/matrixToQuaternion/index.htm
     */
    public setFromRotationMatrix(m) {
        // assumes the upper 3x3 of m is a pure rotation matrix (i.e, unscaled)
        const te = m.elements
        const m11 = te[0]
        const m12 = te[4]
        const m13 = te[8]
        const m21 = te[1]
        const m22 = te[5]
        const m23 = te[9]
        const m31 = te[2]
        const m32 = te[6]
        const m33 = te[10]
        const trace = m11 + m22 + m33
        let s: number

        if (trace > 0) {
            s = 0.5 / Math.sqrt(trace + 1.0)
            this._w = 0.25 / s
            this._x = (m32 - m23) * s
            this._y = (m13 - m31) * s
            this._z = (m21 - m12) * s
        } else if (m11 > m22 && m11 > m33) {
            s = 2.0 * Math.sqrt(1.0 + m11 - m22 - m33)
            this._w = (m32 - m23) / s
            this._x = 0.25 * s
            this._y = (m12 + m21) / s
            this._z = (m13 + m31) / s
        } else if (m22 > m33) {
            s = 2.0 * Math.sqrt(1.0 + m22 - m11 - m33)
            this._w = (m13 - m31) / s
            this._x = (m12 + m21) / s
            this._y = 0.25 * s
            this._z = (m23 + m32) / s
        } else {
            s = 2.0 * Math.sqrt(1.0 + m33 - m11 - m22)
            this._w = (m21 - m12) / s
            this._x = (m13 + m31) / s
            this._y = (m23 + m32) / s
            this._z = 0.25 * s
        }
        this._updateEuler()
        return this
    }

    public length() {
        return Math.sqrt(this._x * this._x + this._y * this._y + this._z * this._z + this._w * this._w)
    }

    public lengthSq() {
        return this._x * this._x + this._y * this._y + this._z * this._z + this._w * this._w
    }

    public conjugate() {
        this._x *= -1
        this._y *= -1
        this._z *= -1
        this._updateEuler()
        return this
    }

    public normalize() {
        let l = this.length()
        if (l === 0) {
            this._x = 0
            this._y = 0
            this._z = 0
            this._w = 1
        } else {
            l = 1 / l
            this._x = this._x * l
            this._y = this._y * l
            this._z = this._z * l
            this._w = this._w * l
        }
        return this
    }

    public inverse() {
        this.conjugate().normalize()
        return this
    }

    /**
     * from http://www.euclideanspace.com/maths/algebra/realNormedAlgebra/quaternions/code/index.htm
     */
    public multiplyQuaternions(a, b) {
        const qax = a._x
        const qay = a._y
        const qaz = a._z
        const qaw = a._w

        const qbx = b._x
        const qby = b._y
        const qbz = b._z
        const qbw = b._w

        this._x = qax * qbw + qaw * qbx + qay * qbz - qaz * qby
        this._y = qay * qbw + qaw * qby + qaz * qbx - qax * qbz
        this._z = qaz * qbw + qaw * qbz + qax * qby - qay * qbx
        this._w = qaw * qbw - qax * qbx - qay * qby - qaz * qbz

        this._updateEuler()
        return this
    }

    public multiply(q, p = undefined) {
        if (p !== undefined) {
            console.warn("DEPRECATED: Quaternion's .multiply() now only accepts one argument. Use .multiplyQuaternions( a, b ) instead.")
            return this.multiplyQuaternions(q, p)
        }
        return this.multiplyQuaternions(this, q)
    }

    public multiplyVector3(vector) {
        console.warn("DEPRECATED: Quaternion's .multiplyVector3() has been removed. Use is now vector.applyQuaternion( quaternion ) instead.")
        return vector.applyQuaternion(this)
    }

    public equals(quaternion) {
        return (quaternion._x === this._x) && (quaternion._y === this._y) && (quaternion._z === this._z) && (quaternion._w === this._w)
    }

    public fromArray(array) {
        this._x = array[0]
        this._y = array[1]
        this._z = array[2]
        this._w = array[3]
        this._updateEuler()
        return this
    }

    public toArray() {
        return [this._x, this._y, this._z, this._w]
    }

    public clone() {
        return new Quaternion(this._x, this._y, this._z, this._w)
    }

    public slerp(qb, t) {
        let x = this._x, y = this._y, z = this._z, w = this._w
        // http://www.euclideanspace.com/maths/algebra/realNormedAlgebra/quaternions/slerp/
        let cosHalfTheta = w * qb._w + x * qb._x + y * qb._y + z * qb._z
        if (cosHalfTheta < 0) {
            this._w = -qb._w
            this._x = -qb._x
            this._y = -qb._y
            this._z = -qb._z
            cosHalfTheta = -cosHalfTheta
        } else {
            this.copy(qb)
        }
        if (cosHalfTheta >= 1.0) {
            this._w = w
            this._x = x
            this._y = y
            this._z = z
            return this
        }
        let halfTheta = Math.acos(cosHalfTheta)
        let sinHalfTheta = Math.sqrt(1.0 - cosHalfTheta * cosHalfTheta)
        if (Math.abs(sinHalfTheta) < 0.001) {
            this._w = 0.5 * (w + this._w)
            this._x = 0.5 * (x + this._x)
            this._y = 0.5 * (y + this._y)
            this._z = 0.5 * (z + this._z)
            return this
        }
        let ratioA = Math.sin((1 - t) * halfTheta) / sinHalfTheta,
            ratioB = Math.sin(t * halfTheta) / sinHalfTheta
        this._w = (w * ratioA + this._w * ratioB)
        this._x = (x * ratioA + this._x * ratioB)
        this._y = (y * ratioA + this._y * ratioB)
        this._z = (z * ratioA + this._z * ratioB)
        this._updateEuler()
        return this
    }
}
