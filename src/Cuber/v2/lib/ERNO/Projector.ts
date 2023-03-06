import { Box3 } from "../THREE/Box3"
import { Matrix4 } from "../THREE/Matrix4"
import { Ray } from "../THREE/Ray"
import { Sphere } from "../THREE/Sphere"
import { Vector3 } from "../THREE/Vector3"

/**
 * Converts mouse coordinates into 3D and detects mouse interaction
 *
 * @author [Mark Lundin](http://www.mark-lundin.com)
 */
export class Projector {

    public cube
    public domElement
    public viewProjectionMatrix
    public inverseMatrix
    public mouse
    public end
    public normal
    public ray
    public box
    public sphere
    public projectionMatrixInverse
    public unitCubeBoundingRadius

    // The Cube Projector is a specialized class that detects mouse interaction.
    // It's designed specifically for cubic geometry, in that it makes assumptions
    // that cannot be applied to other 3D geometry. This makes the performance faster
    // than other more generalized mouse picking techniques.
    constructor(cube, domElement) {
        this.cube = cube
        this.domElement = domElement
        this.viewProjectionMatrix = new Matrix4()
        this.inverseMatrix = new Matrix4()
        this.mouse = new Vector3()
        this.end = new Vector3(1, 1, 1)
        this.normal = new Vector3()
        this.ray = new Ray()
        this.box = new Box3()
        this.sphere = new Sphere()
        this.projectionMatrixInverse = new Matrix4()
        this.unitCubeBoundingRadius = this.mouse.distanceTo(this.end)

        // Configure the bounding sphere and Axis Aligned Bounding Box dimensions.
        this.box.min.set(-cube.size * 0.5, -cube.size * 0.5, -cube.size * 0.5)
        this.box.max.set(cube.size * 0.5, cube.size * 0.5, cube.size * 0.5)
        this.sphere.radius = this.unitCubeBoundingRadius * cube.size * 0.5
    }

    // Utility function that unprojects 2D normalized screen coordinate to 3D.
    // Taken from Three.js Projector class
    public unprojectVector(vector, camera) {
        this.projectionMatrixInverse.getInverse(camera.projectionMatrix)
        this.viewProjectionMatrix.multiplyMatrices(camera.matrixWorld, this.projectionMatrixInverse)
        return vector.applyProjection(this.viewProjectionMatrix)
    }

    // Returns the bounding area of the element
    public getBoundingClientRect(element) {
        const bounds = element !== document ? element.getBoundingClientRect() : {
            left: 0,
            top: 0,
            width: window.innerWidth,
            height: window.innerHeight,
        }
        if (element !== document) {
            const d = element.ownerDocument.documentElement
            bounds.left += window.pageXOffset - d.clientLeft
            bounds.top += window.pageYOffset - d.clientTop
        }
        return bounds
    }

    /**
     * Returns a THREE.Ray instance in cube space!
     */
    public setRay(camera, mouseX, mouseY) {
        // Get the bounding area
        const screen = this.getBoundingClientRect(this.domElement)
        // Convert screen coords into normalized device coordinate space
        this.mouse.x = (mouseX - screen.left) / screen.width * 2 - 1
        this.mouse.y = (mouseY - screen.top) / screen.height * -2 + 1
        this.mouse.z = -1.0
        // set two vectors with opposing z values
        this.end.set(this.mouse.x, this.mouse.y, 1.0)
        // Unproject screen coordinates into 3D
        this.unprojectVector(this.mouse, camera)
        this.unprojectVector(this.end, camera)
        // find direction from vector to end
        this.end.sub(this.mouse).normalize()
        // Configure the ray caster
        this.ray.set(this.mouse, this.end)
        // Apply the world inverse
        this.inverseMatrix.getInverse(this.cube.matrixWorld)
        this.ray.applyMatrix4(this.inverseMatrix)
        return this.ray
    }

    /**
     * Given an intersection point on the surface of the cube,
     *  this returns a vector indicating the normal of the face
     */
    public getFaceNormalForIntersection(intersection, optionalTarget = undefined) {
        const target = optionalTarget || new Vector3()
        target.copy(intersection)
            .set(Math.round(target.x), Math.round(target.y), Math.round(target.z))
            .multiplyScalar(2 / this.cube.size)
            .set(target.x | 0, target.y | 0, target.z | 0)
        return this.normal
    }
}

export class ProjectorApi extends Projector {

    constructor(cube, domElement) {
        super(cube, domElement)
    }

    public getIntersection(camera, mouseX, mouseY, optionalIntersectionTarget, optionalPlaneTarget) {
        const intersection = optionalIntersectionTarget || new Vector3()
        // If we haven't detected any mouse movement, then we've not made interacted!
        if (mouseX === null || mouseY === null) {
            return null
        }
        // Shoot the camera ray into 3D
        this.setRay(camera, mouseX, mouseY)
        // Check ray casting against the bounding sphere first as it's easier to compute,
        // if it passes, then check the Axis Aligned Bounding Box.
        if (this.ray.isIntersectionSphere(this.sphere) &&
            this.ray.intersectBox(this.box, intersection) !== null) {
            if (optionalPlaneTarget) {
                this.getFaceNormalForIntersection(intersection, this.normal)
                optionalPlaneTarget.setFromNormalAndCoplanarPoint(this.normal, intersection)
            }
            return intersection
        }
        return null
    }

    public getIntersectionOnPlane(camera, mouseX, mouseY, plane, optionalTarget) {
        // If we haven't detected any mouse movement, then we've not interacted!
        if (mouseX === null || mouseY === null) return null
        // Shoot the camera ray into 3D
        this.setRay(camera, mouseX, mouseY)
        return this.ray.intersectPlane(plane, optionalTarget)
    }

    // Given
    public getCubeletAtIntersection(intersection: Vector3) {
        const tmp = new Vector3()
        // Translate the world coordinates to a 3D index of the intersected cubelets location.
        tmp.copy(intersection).add(this.box.max)
            .multiplyScalar(3 / this.cube.size)
            .set(Math.min(tmp.x | 0, 2), Math.min(3 - tmp.y | 0, 2), Math.min(3 - tmp.z | 0, 2))
        // Translate the 3D position to an array index
        return this.cube.cubelets[tmp.z * 9 + tmp.y * 3 + tmp.x]
    }

}
