import { EventDispatcher } from "../THREE/EventDispatcher"
import { Plane } from "../THREE/Plane"
import { Vector2 } from "../THREE/Vector2"
import { Vector3 } from "../THREE/Vector3"
import { ProjectorApi } from "./Projector"
import { Twist } from "./Twist"

/**
 * This function provides a way to *snap* a vector to it's closest axis.
 *
 * This is used to find a probable axis of rotation when a user performs a drag
 */
export const snapVectorToBasis = (vector: Vector3) => {
    const max = Math.max(Math.abs(vector.x), Math.abs(vector.y), Math.abs(vector.z))
    vector.x = (vector.x / max) | 0
    vector.y = vector.x === 1 ? 0 : (vector.y / max) | 0
    vector.z = vector.x === 1 || vector.y === 1 ? 0 : (vector.z / max) | 0
    return vector
}

/**
 * ## INTERACTION
 *
 * This module handles all the user interactions with the cube.
 *
 * It figures out what slice to rotate and in what direction
 *
 * @author [Mark Lundin](http://www.mark-lundin.com)
 * @author Stewart Smith
 */
export class Interaction {

    public cube
    public camera
    public domElement
    public dragSpeed: number
    public multiDrag: boolean

    /**
     * A utility class for calculating mouse intersection on a cubic surface.
     */
    public projector: ProjectorApi

    public intersected
    public points
    public intersection: Vector3
    public cubelet
    public possibleSlices
    public slice
    public mouseX
    public mouseY
    public pointOnPlane: Vector3
    public axisDefined: boolean
    public plane: Plane
    public direction: Vector3
    public cross: Vector3
    public current: Vector2
    public basis: Vector3
    public axis: Vector3
    public angle: number
    public time: number

    public api: InteractionApi

    public ax
    public ay

    constructor(cube, camera, domElement, dragSpeed: number = 1.3, multiDrag: boolean = false) {
        this.projector = new ProjectorApi(cube, domElement)

        this.cube = cube
        this.camera = camera
        this.domElement = domElement
        this.dragSpeed = dragSpeed || 1.3
        this.multiDrag = !!multiDrag

        // this.intersected
        this.points = []
        this.intersection = new Vector3()
        // this.cubelet
        // this.possibleSlices
        // this.slice
        // this.mouseX
        // this.mouseY
        this.pointOnPlane = new Vector3()
        this.axisDefined = false
        this.plane = new Plane()
        this.direction = new Vector3()
        this.cross = new Vector3()
        this.basis = new Vector3()
        this.axis = new Vector3()
        this.angle = 0
        this.time = 0

        this.current = new Vector2()
        this.current.x = undefined
        this.current.y = undefined

        this.api = new InteractionApi(this.dragSpeed, this.multiDrag)

        document.addEventListener("mousedown", this.onInteractStart)
        document.addEventListener("touchstart", this.onInteractStart)

        domElement.addEventListener("mousedown", this.handleMousedown)
        domElement.addEventListener("mouseup", this.handleMouseup)
        domElement.addEventListener("touchstart", this.handleTouchstart)
        domElement.addEventListener("touchend", this.handleTouchend)

        // return this.api
    }

    public onInteractUpdate(event) {
        if (this.api.active) {
            this.current.x = (event.touches && event.touches[0] || event).clientX
            this.current.y = (event.touches && event.touches[0] || event).clientY
        }
        // Prevent the default system dragging behavior.
        // (Things like IOS move the viewport)
        if (this.api.enabled) {
            event.preventDefault()
            event.stopImmediatePropagation()
        }
    }

    public onInteractStart(event) {
        if (event.touches != null) event.preventDefault()
        if (this.api.enabled && event.button !== 2) {
            this.mouseX = (event.touches && event.touches[0] || event).clientX
            this.mouseY = (event.touches && event.touches[0] || event).clientY
            // console.log( mouseX, mouseY );
            // Here we find out if the mouse is hovering over the cube,
            // If it is, then `intersection` is populated with the 3D local coordinates of where
            // the intersection occurred. `plane` is also configured to represent the face of the cube
            // where the intersection occurred. This is used later to determine the direction
            // of the drag.
            //
            // NOTE: although a plane is conceptually similar to a cube's face, the plane is a mathematical representation
            if (this.intersected = this.projector.getIntersection(this.camera, this.mouseX, this.mouseY, this.intersection, this.plane)) {
                // If a interaction happens within the cube we should prevent the event bubbling.
                // event.stopImmediatePropagation();
                if (this.cube.isTweening() === 0) {
                    this.time = (typeof window !== "undefined" && window.performance !== undefined && window.performance.now !== undefined ? window.performance.now() : Date.now())
                    this.api.active = true
                    // Now we know the point of intersection,
                    // we can figure out what the associated cubelet is
                    // and the possible slices that might be rotated.
                    this.cubelet = this.projector.getCubeletAtIntersection(this.intersection)
                    // Remember, we can only figure out the exact slice once a drag happens.
                    this.possibleSlices = [
                        this.cube.slices[this.cubelet.addressX + 1],
                        this.cube.slices[this.cubelet.addressY + 4],
                        this.cube.slices[this.cubelet.addressZ + 7],
                    ]
                    // Add a listener for interaction in the entire document.
                    document.addEventListener("mousemove", this.onInteractUpdate)
                    document.addEventListener("touchmove", this.onInteractUpdate)
                    // Add a lister to detect the end of interaction, remember this could happen outside the domElement, but still within the document
                    document.addEventListener("mouseup",     this.onInteractEnd)
                    document.addEventListener("touchcancel", this.onInteractEnd)
                    document.addEventListener("touchend",    this.onInteractEnd)
                    // Whilst interacting we can temporarily remove the listeners detecting the start of interaction
                    document.removeEventListener("mousedown",  this.onInteractStart)
                    document.removeEventListener("touchstart", this.onInteractStart)
                }
            }
        }
    }

    public onInteractEnd(event) {
        const x = (event.touches && event.touches[0] || event).clientX
        const y = (event.touches && event.touches[0] || event).clientY
        this.api.active = false
        // When a user has finished interacting, we need to finish off any rotation.
        // We basically snap to the nearest face and issue a rotation command
        if (this.api.enabled && (x !== this.mouseY || y !== this.mouseY) && this.axisDefined) {
            // event.stopImmediatePropagation();
            // Now we can get the direction of rotation and the associated command.
            const command = this.slice.name[0].toUpperCase()
            //  We then find the nearest rotation to snap to and calculate how long the rotation should take
            // based on the distance between our current rotation and the target rotation
            let targetAngle = Math.round(this.angle / Math.PI * 0.5 * 4.0) * Math.PI * 0.5
            const velocityOfInteraction = this.direction.length() / ((typeof window !== "undefined" && window.performance !== undefined && window.performance.now !== undefined ? window.performance.now() : Date.now()) - this.time)
            if (velocityOfInteraction > 0.3) {
                targetAngle = Math.floor(this.angle / Math.PI * 0.5 * 4.0) * Math.PI * 0.5
                targetAngle += this.cross.dot(this.direction.normalize()) > 0 ? Math.PI * 0.5 : 0
            }
            // If this is a partial rotation that results in the same configuration of cubelets
            // then it doesn't really count as a move, and we don't need to add it to the history
            this.cube.twist(new Twist(command, targetAngle.radiansToDegrees()))
            // Delete the reference to our slice
        }
        this.time = 0
        this.current.x = undefined
        this.current.y = undefined
        this.axisDefined = false
        this.slice = null

        document.removeEventListener("mousemove", this.onInteractUpdate)
        document.removeEventListener("touchmove", this.onInteractUpdate)

        document.removeEventListener("mouseup",     this.onInteractEnd)
        document.removeEventListener("touchend",    this.onInteractEnd)
        document.removeEventListener("touchcancel", this.onInteractEnd)

        document.addEventListener("mousedown",  this.onInteractStart)
        document.addEventListener("touchstart", this.onInteractStart)
    }

    // =========================================================================
    // Mouse Events
    // =========================================================================

    public handleMousedown(event) {
        this.ax = event.clientX
        this.ay = event.clientY
    }

    public handleMouseup(event) {
        const bx = event.clientX
        const by = event.clientY
        if (Math.abs(Math.sqrt(((bx - this.ax) * (bx - this.ax)) + ((by - this.ay) * (by - this.ay)))) < 10 * (window.devicePixelRatio || 1)) {
            this.api__detectInteraction(this.ax, this.ay)
        }
    }

    public handleTouchstart(event) {
        event.preventDefault()
        this.ax = event.touches[0].clientX
        this.ay = event.touches[0].clientY
    }

    public handleTouchend(event) {
        const bx = event.changedTouches[0].clientX
        const by = event.changedTouches[0].clientY
        if (Math.abs(Math.sqrt(((bx - this.ax) * (bx - this.ax)) + ((by - this.ay) * (by - this.ay)))) < 10 * (window.devicePixelRatio || 1)) {
            this.api__detectInteraction(this.ax, this.ay)
        }
    }

    // =========================================================================
    // Api
    // =========================================================================

    public api__detectInteraction(x, y) {
        const intersection = this.api__getIntersectionAt(x, y)
        if (intersection) {
            this.api.dispatchEvent(new CustomEvent("click", { detail: intersection }))
        }
    }

    public api__getIntersectionAt(x, y) {
        return this.api.getIntersectionAt(x, y, this.projector, this.camera)
    }

    public api__update() {
        const x = this.current.x
        const y = this.current.y
        if (this.api.enabled && this.api.active && x !== undefined && y != undefined && (this.mouseX !== x || this.mouseY !== y)) {
            // As we already know what plane, or face, the interaction began on,
            // we can then find the point on the plane where the interaction continues.
            this.projector.getIntersectionOnPlane(this.camera, x, y, this.plane, this.pointOnPlane)
            this.direction.subVectors(this.pointOnPlane, this.intersection)
            if (!this.axisDefined && this.direction.length() > 5) {
                // If we've already been rotating a slice but we want to change direction,
                // for example if multiDrag is enabled, then we want to reset the original slice
                if (this.slice) {
                    this.slice.rotation = 0
                }
                this.axisDefined = true
                // Once we have a plane, we can figure out what direction the user dragged
                // and lock into an axis of rotation
                this.axis.crossVectors(this.plane.normal, this.direction)
                // Of course, it's never a perfect gesture, so we should figure
                // out the intended direction by snapping to the nearest axis.
                snapVectorToBasis(this.axis)
                // From the axis aligned vector, we can isolate the correct slice
                // to rotate, by determining the index from the possible slices.
                this.slice = this.possibleSlices[Math.abs(this.axis.z * 3 + this.axis.y * 2 + this.axis.x) - 1]
                // Determine the cross vector, or the direction relative to the axis we're rotating
                this.cross.crossVectors(this.slice.axis, this.plane.normal).normalize()
            }
            if (this.axisDefined) {
                // By now, we already know what axis to rotate on,
                // we just need to figure out by how much.
                this.direction.subVectors(this.pointOnPlane, this.intersection)
                const dot = this.cross.dot(this.direction)
                this.angle = dot / this.cube.size * this.api.dragSpeed
            }
            if (this.slice) {
                this.slice.rotation = this.angle
            }
        }
    }
}

export interface IInteractionApi {
    /** Indicates when the user is interacting */
    active: boolean
    /** Turns on/off the api */
    enabled: boolean
    /** A flag that, when enabled, allows the user to drag a slice on its other axis */
    multiDrag: boolean
    /** This sets the default drag speed */
    dragSpeed: number
    /** ??? */
    multiDragSnapArea: number
}

export class InteractionApi extends EventDispatcher implements IInteractionApi {
    public active: boolean
    public enabled: boolean
    public multiDrag: boolean
    public dragSpeed: number
    public multiDragSnapArea: number

    constructor(dragSpeed: number, multiDrag: boolean = undefined) {
        super()
        this.active = false
        this.enabled = true
        this.multiDrag = multiDrag || false
        this.multiDragSnapArea = 100.0
        this.dragSpeed = dragSpeed || 1.3
    }

    public getIntersectionAt(x, y, projector: ProjectorApi, camera) {
        const intersection3D = new Vector3()
        const plane3D = new Plane()
        if (projector.getIntersection(camera, x, y, intersection3D, plane3D) === null) return null
        return {
            cubelet: projector.getCubeletAtIntersection(intersection3D),
            face: plane3D.normal.x === 1 ? "RIGHT" :
                plane3D.normal.x === -1 ? "LEFT" :
                    plane3D.normal.y === 1 ? "UP" :
                        plane3D.normal.y === -1 ? "DOWN" :
                            plane3D.normal.z === 1 ? "FRONT" :
                                "BACK",
        }
    }
}
