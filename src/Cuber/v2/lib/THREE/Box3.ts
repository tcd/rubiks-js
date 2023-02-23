import { Vector3 } from "./Vector3"

/**
 * @author [bhouston](http://exocortex.com)
 * @author [WestLangley}(http://github.com/WestLangley)
 */
export class Box3 {

    public min
    public max

    constructor(min, max) {
        this.min = (min !== undefined) ? min : new Vector3(Infinity, Infinity, Infinity)
        this.max = (max !== undefined) ? max : new Vector3(-Infinity, -Infinity, -Infinity)
    }

    set(min, max) {
        this.min.copy(min)
        this.max.copy(max)
        return this
    }

    addPoint(point) {
        if (point.x < this.min.x) {
            this.min.x = point.x
        } else if (point.x > this.max.x) {
            this.max.x = point.x
        }

        if (point.y < this.min.y) {
            this.min.y = point.y
        } else if (point.y > this.max.y) {
            this.max.y = point.y
        }

        if (point.z < this.min.z) {
            this.min.z = point.z
        } else if (point.z > this.max.z) {
            this.max.z = point.z
        }
    }

    setFromPoints(points) {
        if (points.length > 0) {
            const point = points[0]
            this.min.copy(point)
            this.max.copy(point)
            for (let i = 1, il = points.length; i < il; i++) {
                this.addPoint(points[i])
            }
        } else {
            this.makeEmpty()
        }
        return this
    }

    setFromCenterAndSize(center, size) {
        const v1 = new Vector3()
        const halfSize = v1.copy(size).multiplyScalar(0.5)
        this.min.copy(center).sub(halfSize)
        this.max.copy(center).add(halfSize)
        return this
    }

    // Computes the world-axis-aligned bounding box of an object (including its children),
    // accounting for both the object's (and childrens') world transforms
    setFromObject(object) {
        const v1 = new Vector3()
        object.updateMatrixWorld(true)
        this.makeEmpty()
        object.traverse((node) => {
            if (node.geometry !== undefined && node.geometry.vertices !== undefined) {
                const vertices = node.geometry.vertices
                for (let i = 0, il = vertices.length; i < il; i++) {
                    v1.copy(vertices[i])
                    v1.applyMatrix4(node.matrixWorld)
                    this.expandByPoint(v1)
                }
            }
        })
        return this
    }

    copy(box) {
        this.min.copy(box.min)
        this.max.copy(box.max)
        return this
    }

    makeEmpty() {
        this.min.x = this.min.y = this.min.z = Infinity
        this.max.x = this.max.y = this.max.z = -Infinity
        return this
    }

    empty() {
        // this is a more robust check for empty than ( volume <= 0 ) because volume can get positive with two negative axes
        return (this.max.x < this.min.x) || (this.max.y < this.min.y) || (this.max.z < this.min.z)
    }

    center(optionalTarget = undefined) {
        const result = optionalTarget || new Vector3()
        return result.addVectors(this.min, this.max).multiplyScalar(0.5)
    }

    size(optionalTarget) {
        const result = optionalTarget || new Vector3()
        return result.subVectors(this.max, this.min)
    }

    expandByPoint(point) {
        this.min.min(point)
        this.max.max(point)
        return this
    }

    expandByVector(vector) {
        this.min.sub(vector)
        this.max.add(vector)
        return this
    }

    expandByScalar(scalar) {
        this.min.addScalar(-scalar)
        this.max.addScalar(scalar)
        return this
    }

    containsPoint(point) {
        if (point.x < this.min.x || point.x > this.max.x ||
            point.y < this.min.y || point.y > this.max.y ||
            point.z < this.min.z || point.z > this.max.z) {
            return false
        }
        return true
    }

    containsBox(box) {
        if ((this.min.x <= box.min.x) && (box.max.x <= this.max.x) &&
            (this.min.y <= box.min.y) && (box.max.y <= this.max.y) &&
            (this.min.z <= box.min.z) && (box.max.z <= this.max.z)) {
            return true
        }
        return false
    }

    getParameter(point, optionalTarget) {
        // This can potentially have a divide by zero if the box
        // has a size dimension of 0.
        const result = optionalTarget || new Vector3()
        return result.set(
            (point.x - this.min.x) / (this.max.x - this.min.x),
            (point.y - this.min.y) / (this.max.y - this.min.y),
            (point.z - this.min.z) / (this.max.z - this.min.z),
        )
    }

    isIntersectionBox(box) {
        // using 6 splitting planes to rule out intersections.
        if (box.max.x < this.min.x || box.min.x > this.max.x ||
            box.max.y < this.min.y || box.min.y > this.max.y ||
            box.max.z < this.min.z || box.min.z > this.max.z) {
            return false
        }
        return true
    }

    clampPoint(point, optionalTarget) {
        const result = optionalTarget || new Vector3()
        return result.copy(point).clamp(this.min, this.max)
    }

    distanceToPoint(point) {
        const v1 = new Vector3()
        const clampedPoint = v1.copy(point).clamp(this.min, this.max)
        return clampedPoint.sub(point).length()
    }

    getBoundingSphere(optionalTarget) {
        const v1 = new Vector3()
        const result = optionalTarget || new THREE.Sphere()
        result.center = this.center()
        result.radius = this.size(v1).length() * 0.5
        return result
    }

    intersect(box) {
        this.min.max(box.min)
        this.max.min(box.max)
        return this
    }

    union(box) {
        this.min.min(box.min)
        this.max.max(box.max)
        return this
    }

    applyMatrix4(matrix) {
        const points = [
            new Vector3(),
            new Vector3(),
            new Vector3(),
            new Vector3(),
            new Vector3(),
            new Vector3(),
            new Vector3(),
            new Vector3(),
        ]
        // NOTE: I am using a binary pattern to specify all 2^3 combinations below
        points[0].set(this.min.x, this.min.y, this.min.z).applyMatrix4(matrix) // 000
        points[1].set(this.min.x, this.min.y, this.max.z).applyMatrix4(matrix) // 001
        points[2].set(this.min.x, this.max.y, this.min.z).applyMatrix4(matrix) // 010
        points[3].set(this.min.x, this.max.y, this.max.z).applyMatrix4(matrix) // 011
        points[4].set(this.max.x, this.min.y, this.min.z).applyMatrix4(matrix) // 100
        points[5].set(this.max.x, this.min.y, this.max.z).applyMatrix4(matrix) // 101
        points[6].set(this.max.x, this.max.y, this.min.z).applyMatrix4(matrix) // 110
        points[7].set(this.max.x, this.max.y, this.max.z).applyMatrix4(matrix)  // 111
        this.makeEmpty()
        this.setFromPoints(points)
        return this
    }

    translate(offset) {
        this.min.add(offset)
        this.max.add(offset)
        return this
    }

    equals(box) {
        return box.min.equals(this.min) && box.max.equals(this.max)
    }

    clone() {
        return new THREE.Box3().copy(this)
    }

}
