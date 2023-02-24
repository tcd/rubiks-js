/**
 * # CUBELETS
 *
 * Faces are mapped in a clockwise spiral from Front to Back:
 *
 * ```
 *               Back
 *                5
 *           -----------
 *         /    Up     /|
 *        /     1     / |
 *        -----------  Right
 *       |           |  2
 * Left  |   Front   |  .
 *  4    |     0     | /
 *       |           |/
 *        -----------
 *            Down
 *             3
 * ```
 *
 * The `faces[]` Array is mapped to names for convenience:
 *
 * - `this.faces[0] === this.front`
 * - `this.faces[1] === this.up`
 * - `this.faces[2] === this.right`
 * - `this.faces[3] === this.down`
 * - `this.faces[4] === this.left`
 * - `this.faces[5] === this.back`
 *
 * Each Cubelet has an Index which is assigned during Cube creation
 * and an Address which changes as the Cubelet changes location.
 *
 * Additionally an AddressX, AddressY, and AddressZ are calculated
 * from the Address and represent the Cubelet's location relative
 * to the Cube's core with integer values ranging from -1 to +1.
 *
 * For an overview of the Cubelet's data from the browser's console:
 *
 * ```
 * this.inspect()
 * ```
 *
 * @author [Mark Lundin](http://www.mark-lundin.com)
 * @author Stewart Smith
 */
export class Cubelet {

}
