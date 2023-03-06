import { Matrix4 } from "./Matrix4"
import { Vector3 } from "./Vector3"

/**
 * @author [alteredq](http://alteredqualia.com/)
 * @author [WestLangley](http://github.com/WestLangley)
 * @author [bhouston](http://exocortex.com)
 */
export class Matrix3 {

    public elements

    constructor(
        n11 = 1,
        n12 = 0,
        n13 = 0,
        n21 = 0,
        n22 = 1,
        n23 = 0,
        n31 = 0,
        n32 = 0,
        n33 = 1,
    ) {
        this.elements = new Float32Array(9)
        this.set(
            (n11 !== undefined) ? n11 : 1,
            n12 || 0,
            n13 || 0,
            n21 || 0,
            (n22 !== undefined) ? n22 : 1,
            n23 || 0,
            n31 || 0,
            n32 || 0,
            (n33 !== undefined) ? n33 : 1,
        )
    }

    public set(n11, n12, n13, n21, n22, n23, n31, n32, n33) {
        const te = this.elements
        te[0] = n11; te[3] = n12; te[6] = n13
        te[1] = n21; te[4] = n22; te[7] = n23
        te[2] = n31; te[5] = n32; te[8] = n33
        return this
    }

    public identity() {
        this.set(
            1, 0, 0,
            0, 1, 0,
            0, 0, 1,
        )
        return this
    }

    public copy(m) {
        const me = m.elements
        this.set(
            me[0], me[3], me[6],
            me[1], me[4], me[7],
            me[2], me[5], me[8],
        )
        return this
    }

    public multiplyVector3(vector) {
        console.warn("DEPRECATED: Matrix3's .multiplyVector3() has been removed. Use vector.applyMatrix3( matrix ) instead.")
        return vector.applyMatrix3(this)
    }

    public multiplyVector3Array(a) {
        const v1 = new Vector3()
        for (let i = 0, il = a.length; i < il; i += 3) {
            v1.x = a[i]
            v1.y = a[i + 1]
            v1.z = a[i + 2]
            v1.applyMatrix3(this)
            a[i] = v1.x
            a[i + 1] = v1.y
            a[i + 2] = v1.z
        }
        return a
    }

    public multiplyScalar(s) {
        const te = this.elements
        te[0] *= s; te[3] *= s; te[6] *= s
        te[1] *= s; te[4] *= s; te[7] *= s
        te[2] *= s; te[5] *= s; te[8] *= s
        return this
    }

    public determinant() {
        const te = this.elements
        const a = te[0]
        const b = te[1]
        const c = te[2]
        const d = te[3]
        const e = te[4]
        const f = te[5]
        const g = te[6]
        const h = te[7]
        const i = te[8]
        return a * e * i - a * f * h - b * d * i + b * f * g + c * d * h - c * e * g
    }

    /** based on http://code.google.com/p/webgl-mjs/ */
    public getInverse(matrix: Matrix4, throwOnInvertible: boolean = undefined) {
        const me = matrix.elements
        const te = this.elements
        te[0] =  me[10] * me[5] - me[6] * me[9]
        te[1] = -me[10] * me[1] + me[2] * me[9]
        te[2] =  me[6]  * me[1] - me[2] * me[5]
        te[3] = -me[10] * me[4] + me[6] * me[8]
        te[4] =  me[10] * me[0] - me[2] * me[8]
        te[5] = -me[6]  * me[0] + me[2] * me[4]
        te[6] =  me[9]  * me[4] - me[5] * me[8]
        te[7] = -me[9]  * me[0] + me[1] * me[8]
        te[8] =  me[5]  * me[0] - me[1] * me[4]
        const det = me[0] * te[0] + me[1] * te[3] + me[2] * te[6]
        // no inverse
        if (det === 0) {
            const msg = "Matrix3.getInverse(): can't invert matrix, determinant is 0"
            if (throwOnInvertible || false) {
                throw new Error(msg)
            } else {
                console.warn(msg)
            }
            this.identity()
            return this
        }
        this.multiplyScalar(1.0 / det)
        return this
    }

    public transpose() {
        let tmp
        let m = this.elements
        tmp = m[1]; m[1] = m[3]; m[3] = tmp
        tmp = m[2]; m[2] = m[6]; m[6] = tmp
        tmp = m[5]; m[5] = m[7]; m[7] = tmp
        return this
    }

    public getNormalMatrix(m) {
        // input: THREE.Matrix4
        this.getInverse(m).transpose()
        return this
    }

    public transposeIntoArray(r) {
        const m = this.elements
        r[0] = m[0]
        r[1] = m[3]
        r[2] = m[6]
        r[3] = m[1]
        r[4] = m[4]
        r[5] = m[7]
        r[6] = m[2]
        r[7] = m[5]
        r[8] = m[8]
        return this
    }

    public fromArray(array) {
        this.elements.set(array)
        return this
    }

    public toArray() {
        const te = this.elements
        return [
            te[0], te[1], te[2],
            te[3], te[4], te[5],
            te[6], te[7], te[8],
        ]
    }

    public clone() {
        const te = this.elements
        return new Matrix3(
            te[0], te[3], te[6],
            te[1], te[4], te[7],
            te[2], te[5], te[8],
        )
    }


}
