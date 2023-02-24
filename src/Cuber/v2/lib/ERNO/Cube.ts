/**
 * # CUBES
 *
 * A Cube is composed of 27 Cubelets (3x3x3 grid) numbered 0 through 26.
 * Cubelets are numbered beginning from the top-left-forward corner of the
 * Cube and proceeding left to right, top to bottom, forward to back:
 *
 * ```
 *          -----------------------
 *        /   18      19      20  /|
 *       /                       / |
 *      /   9      10       11  / 20
 *     /                       /   |
 *    /   0       1       2   / 11 |
 *    -----------------------     23
 *   |                       |2    |
 *   |   0       1       2   |  14 |
 *   |                       |    26
 *   |                       |5    |
 *   |   3       4       5   |  17 /
 *   |                       |    /
 *   |                       |8  /
 *   |   6       7       8   |  /
 *   |                       | /
 *    -----------------------
 * ```
 *
 * Portions of the Cube are grouped (Groups):
 * - this.core
 * - this.centers
 * - this.edges
 * - this.corners
 * - this.crosses
 *
 * Portions of the Cube are grouped and rotatable (Slices):
 *
 * Rotatable around the Z axis:
 *
 * - this.front
 * - this.standing
 * - this.back
 *
 * Rotatable around the X axis:
 * - this.left
 * - this.middle
 * - this.right
 *
 * Rotatable around the Y axis:
 * - this.up
 * - this.equator
 * - this.down
 *
 * A Cube may be inspected through its Faces (see Slices for more
 * information on Faces vs Slices). From the browser's JavaScript console:
 * ```
 * this.inspect()
 * ```
 *
 * This will reveal each Face's Cubelet indexes and colors using the Face's
 * compact inspection mode. The non-compact mode may be accessed by passing
 * a non-false value as an argument:
 * ```
 * this.inspect(true)
 * ```
 *
 * @author Mark Lundin - http://www.mark-lundin.com
 * @author Stewart Smith
 */
export class Cube {
    cubeletSize: number
    object3D: any

    constructor() {
    }

}
