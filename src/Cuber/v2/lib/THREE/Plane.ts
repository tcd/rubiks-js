import { Matrix3 } from "./Matrix3"
import { Vector3 } from "./Vector3"

/**
 * @author [bhouston](http://exocortex.com)
 */
export class Plane {

    public normal?: Vector3
    public constant?: number

    constructor(
        normal: Vector3 = new Vector3(1, 0, 0),
        constant = 0,
    ) {
        this.normal   = normal
        this.constant = constant
    }

    public set(normal: Vector3, constant: number) {
        this.normal.copy(normal)
        this.constant = constant
        return this
    }

    public setComponents(x: number, y: number, z: number, w: number) {
        this.normal.set(x, y, z)
        this.constant = w
        return this
    }

    public setFromNormalAndCoplanarPoint(normal: __<Vector3>, point) {
        this.normal.copy(normal)
        this.constant = - point.dot(this.normal) // must be `this.normal`, not `normal`, as `this.normal` is normalized
        return this
    }

    public setFromCoplanarPoints(a, b, c) {
        const v1 = new Vector3()
        const v2 = new Vector3()
        const normal = v1.subVectors(c, b).cross(v2.subVectors(a, b)).normalize()
        // QUESTION: should an error be thrown if normal is zero (e.g. degenerate plane)?
        this.setFromNormalAndCoplanarPoint(normal, a)
        return this
    }

    public copy(plane: Plane) {
        this.normal.copy(plane.normal)
        this.constant = plane.constant
        return this
    }

    /**
     * NOTE: will lead to a divide by zero if the plane is invalid.
     */
    public normalize() {
        const inverseNormalLength = 1.0 / this.normal.length()
        this.normal.multiplyScalar(inverseNormalLength)
        this.constant *= inverseNormalLength
        return this
    }

    public negate() {
        this.constant *= -1
        this.normal.negate()
        return this
    }

    public distanceToPoint(point) {
        return this.normal.dot(point) + this.constant
    }

    public distanceToSphere(sphere) {
        return this.distanceToPoint(sphere.center) - sphere.radius
    }

    public projectPoint(point, optionalTarget) {
        return this.orthoPoint(point, optionalTarget).sub(point).negate()
    }

    public orthoPoint(point, optionalTarget) {
        const perpendicularMagnitude = this.distanceToPoint(point)
        const result = optionalTarget || new Vector3()
        return result.copy(this.normal).multiplyScalar(perpendicularMagnitude)
    }

    /**
     * NOTE: this tests if a line intersects the plane, not whether it (or its end-points) are coplanar with it.
     */
    public isIntersectionLine(line) {
        const startSign = this.distanceToPoint(line.start)
        const endSign   = this.distanceToPoint(line.end)
        return (startSign < 0 && endSign > 0) || (endSign < 0 && startSign > 0)
    }

    public intersectLine(line, optionalTarget) {
        const v1 = new Vector3()
        const result = optionalTarget || new Vector3()
        const direction = line.delta(v1)
        const denominator = this.normal.dot(direction)
        if (denominator == 0) {
            // line is coplanar, return origin
            if (this.distanceToPoint(line.start) == 0) {
                return result.copy(line.start)
            }
            // Unsure if this is the correct method to handle this case.
            return undefined
        }
        const t = - (line.start.dot(this.normal) + this.constant) / denominator
        if (t < 0 || t > 1) {
            return undefined
        }
        return result.copy(direction).multiplyScalar(t).add(line.start)
    }

    public coplanarPoint(optionalTarget) {
        const result = optionalTarget || new Vector3()
        return result.copy(this.normal).multiplyScalar(- this.constant)
    }

    /**
     * Compute new normal based on theory [here](http://www.songho.ca/opengl/gl_normaltransform.html)
     */
    public applyMatrix4(matrix, optionalNormalMatrix) {
        const v1 = new Vector3()
        const v2 = new Vector3()
        const m1 = new Matrix3()
        const normalMatrix = optionalNormalMatrix || m1.getNormalMatrix(matrix)
        const newNormal = v1.copy(this.normal).applyMatrix3(normalMatrix)
        const newCoplanarPoint = this.coplanarPoint(v2)
        newCoplanarPoint.applyMatrix4(matrix)
        this.setFromNormalAndCoplanarPoint(newNormal, newCoplanarPoint)
        return this
    }

    public translate(offset) {
        this.constant = this.constant - offset.dot(this.normal)
        return this
    }

    public equals(plane: Plane) {
        return plane.normal.equals(this.normal) && (plane.constant == this.constant)
    }

    public clone() {
        return new Plane().copy(this)
    }
}
