import type { Quaternion } from "./Quaternion"

/**
 * @author mrdoob / http://mrdoob.com/
 * @author WestLangley / http://github.com/WestLangley
 * @author bhouston / http://exocortex.com
 */
export class Euler {

    public _x: number
    public _y: number
    public _z: number
    public _order: string
    public _quaternion: Quaternion

    public static DefaultOrder: string = "XYZ"
    public static RotationOrders = ["XYZ", "YZX", "ZXY", "XZY", "YXZ", "ZYX"]

    constructor(x: number, y: number, z: number, order: string) {
        this._x = x || 0
        this._y = y || 0
        this._z = z || 0
        this._order = order || Euler.DefaultOrder
    }

    private _updateQuaternion () {
        if (this._quaternion !== undefined) {
            this._quaternion.setFromEuler(this, false)
        }
    }

    // =========================================================================
    // Accessors
    // =========================================================================

    public get x() {
        return this._x
    }
    public set x(value) {
        this._x = value
        this._updateQuaternion()
    }
    public get y() {
        return this._y
    }
    public set y(value) {
        this._y = value
        this._updateQuaternion()
    }
    public get z() {
        return this._z
    }
    public set z(value) {
        this._z = value
        this._updateQuaternion()
    }
    public get order() {
        return this._order
    }
    public set order(value) {
        this._order = value
        this._updateQuaternion()
    }

    // =========================================================================
    // Methods
    // =========================================================================

    public set(x: number, y: number, z: number, order: string) {
        this._x = x
        this._y = y
        this._z = z
        this._order = order || this._order
        this._updateQuaternion()
        return this
    }

    public copy(euler: Euler) {
        this._x = euler._x
        this._y = euler._y
        this._z = euler._z
        this._order = euler._order
        this._updateQuaternion()
        return this
    }

    public setFromRotationMatrix(m: any, order: any) {
        // assumes the upper 3x3 of m is a pure rotation matrix (i.e, unscaled)
        // clamp, to handle numerical problems
        function clamp(x: number) {
            return Math.min(Math.max(x, -1), 1)
        }
        const te = m.elements
        const m11 = te[0], m12 = te[4], m13 = te[8]
        const m21 = te[1], m22 = te[5], m23 = te[9]
        const m31 = te[2], m32 = te[6], m33 = te[10]
        order = order || this._order
        if (order === "XYZ") {
            this._y = Math.asin(clamp(m13))
            if (Math.abs(m13) < 0.99999) {
                this._x = Math.atan2(- m23, m33)
                this._z = Math.atan2(- m12, m11)
            } else {
                this._x = Math.atan2(m32, m22)
                this._z = 0
            }
        } else if (order === "YXZ") {
            this._x = Math.asin(- clamp(m23))
            if (Math.abs(m23) < 0.99999) {
                this._y = Math.atan2(m13, m33)
                this._z = Math.atan2(m21, m22)
            } else {
                this._y = Math.atan2(- m31, m11)
                this._z = 0
            }
        } else if (order === "ZXY") {
            this._x = Math.asin(clamp(m32))
            if (Math.abs(m32) < 0.99999) {
                this._y = Math.atan2(- m31, m33)
                this._z = Math.atan2(- m12, m22)
            } else {
                this._y = 0
                this._z = Math.atan2(m21, m11)
            }
        } else if (order === "ZYX") {
            this._y = Math.asin(- clamp(m31))
            if (Math.abs(m31) < 0.99999) {
                this._x = Math.atan2(m32, m33)
                this._z = Math.atan2(m21, m11)
            } else {
                this._x = 0
                this._z = Math.atan2(- m12, m22)
            }
        } else if (order === "YZX") {
            this._z = Math.asin(clamp(m21))
            if (Math.abs(m21) < 0.99999) {
                this._x = Math.atan2(- m23, m22)
                this._y = Math.atan2(- m31, m11)
            } else {
                this._x = 0
                this._y = Math.atan2(m13, m33)
            }
        } else if (order === "XZY") {
            this._z = Math.asin(- clamp(m12))
            if (Math.abs(m12) < 0.99999) {
                this._x = Math.atan2(m32, m22)
                this._y = Math.atan2(m13, m11)
            } else {
                this._x = Math.atan2(- m23, m33)
                this._y = 0
            }
        } else {
            console.warn(`WARNING: Euler.setFromRotationMatrix() given unsupported order: ${order}`)
        }
        this._order = order
        this._updateQuaternion()
        return this
    }

    public setFromQuaternion(q: Quaternion, order: string, update: boolean = undefined) {
        // q is assumed to be normalized
        // clamp, to handle numerical problems
        function clamp(x: number) {
            return Math.min(Math.max(x, -1), 1)
        }
        // http://www.mathworks.com/matlabcentral/fileexchange/20696-function-to-convert-between-dcm-euler-angles-quaternions-and-euler-vectors/content/SpinCalc.m
        const sqx = q.x * q.x
        const sqy = q.y * q.y
        const sqz = q.z * q.z
        const sqw = q.w * q.w
        order = order || this._order
        if (order === "XYZ") {
            this._x = Math.atan2(2 * (q.x * q.w - q.y * q.z), (sqw - sqx - sqy + sqz))
            this._y = Math.asin(clamp(2 * (q.x * q.z + q.y * q.w)))
            this._z = Math.atan2(2 * (q.z * q.w - q.x * q.y), (sqw + sqx - sqy - sqz))
        } else if (order === "YXZ") {
            this._x = Math.asin(clamp(2 * (q.x * q.w - q.y * q.z)))
            this._y = Math.atan2(2 * (q.x * q.z + q.y * q.w), (sqw - sqx - sqy + sqz))
            this._z = Math.atan2(2 * (q.x * q.y + q.z * q.w), (sqw - sqx + sqy - sqz))
        } else if (order === "ZXY") {
            this._x = Math.asin(clamp(2 * (q.x * q.w + q.y * q.z)))
            this._y = Math.atan2(2 * (q.y * q.w - q.z * q.x), (sqw - sqx - sqy + sqz))
            this._z = Math.atan2(2 * (q.z * q.w - q.x * q.y), (sqw - sqx + sqy - sqz))
        } else if (order === "ZYX") {
            this._x = Math.atan2(2 * (q.x * q.w + q.z * q.y), (sqw - sqx - sqy + sqz))
            this._y = Math.asin(clamp(2 * (q.y * q.w - q.x * q.z)))
            this._z = Math.atan2(2 * (q.x * q.y + q.z * q.w), (sqw + sqx - sqy - sqz))
        } else if (order === "YZX") {
            this._x = Math.atan2(2 * (q.x * q.w - q.z * q.y), (sqw - sqx + sqy - sqz))
            this._y = Math.atan2(2 * (q.y * q.w - q.x * q.z), (sqw + sqx - sqy - sqz))
            this._z = Math.asin(clamp(2 * (q.x * q.y + q.z * q.w)))
        } else if (order === "XZY") {
            this._x = Math.atan2(2 * (q.x * q.w + q.y * q.z), (sqw - sqx + sqy - sqz))
            this._y = Math.atan2(2 * (q.x * q.z + q.y * q.w), (sqw + sqx - sqy - sqz))
            this._z = Math.asin(clamp(2 * (q.z * q.w - q.x * q.y)))
        } else {
            console.warn("WARNING: Euler.setFromQuaternion() given unsupported order: " + order)
        }
        this._order = order
        if (update !== false) this._updateQuaternion()
        return this
    }

    public fromArray(array: any[]) {
        this._x = array[0]
        this._y = array[1]
        this._z = array[2]
        if (array[3] !== undefined) {
            this._order = array[3]
        }
        this._updateQuaternion()
        return this
    }

    public toArray() {
        return [this._x, this._y, this._z, this._order]
    }

    public equals(euler: Euler) {
        return (euler._x === this._x) && (euler._y === this._y) && (euler._z === this._z) && (euler._order === this._order)
    }

    public clone() {
        return new Euler(this._x, this._y, this._z, this._order)
    }

    // WARNING(bhouston): this discards revolution information
    reorder(newOrder) {
        const q = new THREE.Quaternion()
        q.setFromEuler(this)
        this.setFromQuaternion(q, newOrder)
    }

}
