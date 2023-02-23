import { Box3 } from "./Box3"
import { Vector3 } from "./Vector3"

/**
 * @author [bhouston](http://exocortex.com)
 * @author [mrdoob](http://mrdoob.com/)
 */
export class Sphere {

    public center
    public radius

    constructor(center = undefined, radius = undefined) {
        this.center = (center !== undefined) ? center : new Vector3()
        this.radius = (radius !== undefined) ? radius : 0
    }

    set(center, radius) {
        this.center.copy(center)
        this.radius = radius
        return this
    }

    setFromPoints(points, optionalCenter) {
        const box = new Box3()
        const center = this.center
        if (optionalCenter !== undefined) {
            center.copy(optionalCenter)
        } else {
            box.setFromPoints(points).center(center)
        }
        let maxRadiusSq = 0
        for (let i = 0, il = points.length; i < il; i++) {
            maxRadiusSq = Math.max(maxRadiusSq, center.distanceToSquared(points[i]))
        }
        this.radius = Math.sqrt(maxRadiusSq)
        return this
    }

    copy(sphere) {
        this.center.copy(sphere.center)
        this.radius = sphere.radius
        return this
    }

    empty() {
        return (this.radius <= 0)
    }

    containsPoint(point) {
        return (point.distanceToSquared(this.center) <= (this.radius * this.radius))
    }

    distanceToPoint(point) {
        return (point.distanceTo(this.center) - this.radius)
    }

    intersectsSphere(sphere) {
        const radiusSum = this.radius + sphere.radius
        return sphere.center.distanceToSquared(this.center) <= (radiusSum * radiusSum)
    }

    clampPoint(point, optionalTarget) {
        const deltaLengthSq = this.center.distanceToSquared(point)
        const result = optionalTarget || new Vector3()
        result.copy(point)
        if (deltaLengthSq > (this.radius * this.radius)) {
            result.sub(this.center).normalize()
            result.multiplyScalar(this.radius).add(this.center)
        }
        return result
    }

    getBoundingBox(optionalTarget) {
        const box = optionalTarget || new Box3()
        box.set(this.center, this.center)
        box.expandByScalar(this.radius)
        return box
    }

    applyMatrix4(matrix) {
        this.center.applyMatrix4(matrix)
        this.radius = this.radius * matrix.getMaxScaleOnAxis()
        return this
    }

    translate(offset) {
        this.center.add(offset)
        return this
    }

    equals(sphere) {
        return sphere.center.equals(this.center) && (sphere.radius === this.radius)
    }

    clone() {
        return new Sphere().copy(this)
    }
}
