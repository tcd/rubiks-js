import { Group } from "./Group"

/**
 * SLICES
 * Slices are thin layers sliced out of the Cube
 * composed of 9 Cubelets (3x3 grid).
 * The position of these Cubelets can be mapped as follows:
 *
 * ```
 *    ----------- ----------- -----------
 *   |           |           |           |
 *   | northWest |   north   | northEast |
 *   |     0     |     1     |     2     |
 *   |           |           |           |
 *    ----------- ----------- -----------
 *   |           |           |           |
 *   |    west   |   origin  |    east   |
 *   |     3     |     4     |     5     |
 *   |           |           |           |
 *    ----------- ----------- -----------
 *   |           |           |           |
 *   | southWest |   south   | southEast |
 *   |     6     |     7     |     8     |
 *   |           |           |           |
 *    ----------- ----------- -----------
 * ```
 *
 * The cubelets[] Array is mapped to names for convenience:
 * - `0  === this.northWest`
 * - `1  === this.north`
 * - `2  === this.northEast`
 * - `3  === this.west`
 * - `4  === this.origin`
 * - `5  === this.east`
 * - `6  === this.southWest`
 * - `7  === this.south`
 * - `8  === this.southEast`
 *
 * Portions of Slices can be Grouped:
 *
 * Rows and columns as strips (1x3)
 * - `this.up`
 * - `this.equator`
 * - `this.down`
 * - `this.left`
 * - `this.middle`
 * - `this.right`
 *
 * Other combinations
 * - `this.cross`
 * - `this.edges`
 * - `this.ex`
 * - `this.corners`
 * - `this.ring`
 * - `this.dexter`
 * - `this.sinister`
 *
 * A Slice may be inspected from the browser's JavaScript console with:
 * ```
 * this.inspect()
 * ```
 * This will reveal the Slice's Cubelets, their Indices, and colors.
 * A compact inspection mode is also available:
 * ```
 * this.inspect(true)
 * ```
 * This is most useful for Slices that are also Faces. For Slices that are
 * not Faces, or for special cases, it may be useful to send a side
 * argument which is usually by default the Slice's origin's only visible
 * side if it has one.
 * ```
 * this.inspect(false, "up")
 * this.inspect(true, "up")
 * ```
 *
 * ## CUBE FACES vs CUBE SLICES
 *
 * All Cube faces are Slices, but not all Slices are Cube faces.
 *
 * For example, a Cube has 6 faces:
 * - front
 * - up
 * - right
 * - down
 * - left
 * - back
 *
 * But it also has slices that that cut through the center of the Cube itself:
 * - equator
 * - middle
 * - standing
 *
 * When a Slice maps itself it
 * inspects the faces of the Cubelet in the origin position of the Slice (the center piece)
 * which can either have a single visible face or no visible face.
 * If it has a visible face then the Slice's face and the
 * face's direction is in the direction of that Cubelet's visible face.
 * This seems redundant from the Cube's perspective:
 * ```
 * cube.front.face === "front"
 * ```
 * However it becomes valuable from inside a Slice or Fold when a
 * relationship to the Cube's orientation is not immediately clear:
 * ```
 * if(this.face === "front") { ... }
 * ```
 * Therefore a Slice (s) is also a face if `s.face !== undefined`.
 */
export class Slice extends Group {

    constructor(indices, cube) {
        super()
    }

}
