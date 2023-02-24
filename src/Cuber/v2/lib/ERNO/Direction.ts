import { Vector3 } from "../THREE/Vector3"

/**
 * # DIRECTIONS
 *
 * We have six Directions which we map in a spiral around a cube: front, up,
 * right, down, left, and back.
 *
 * That's nice on its own but what's important is the relationships between faces.
 * For example, What's to the left of the Front face?
 * Well that depends on what the Front face considers "up" to be.
 *
 * The `ERNO.Controls` class handles these relationships and
 * calculates clock-wise and anticlockwise relationships.
 *
 * ```
 *                  -------------
 *                 |             |
 *                 |      0      |   opposite
 *                 |             |
 *                 |    getUp()  |
 *                 |             |
 *    ------------- ------------- -------------
 *   |             |             |             |
 *   |      3      |             |      1      |
 *   |             |             |             |
 *   |  getLeft()  |    this     |  getRight() |
 *   |             |             |             |
 *    ------------- ------------- -------------
 *                 |             |
 *                 |      2      |
 *                 |             |
 *                 |  getDown()  |
 *                 |             |
 *                  -------------
 * ```
 *
 * The following equalities demonstrate how Directions operate:
 *
 * - FRONT.getOpposite().name === 'back'
 * - FRONT.getUp().name === 'up'
 * - FRONT.getUp( LEFT ).name === 'left'
 * - FRONT.getRight().name === 'right'
 * - FRONT.getRight( DOWN ).name === 'left'
 * - FRONT.getClockwise().name === 'right'
 * - FRONT.getClockwise( RIGHT ).name === 'down'
 * - RIGHT.getOpposite().name === 'left'
 * - RIGHT.getUp().name === 'up'
 * - RIGHT.getUp( FRONT ).name === 'front'
 * - RIGHT.getRight().name === 'back'
 * - RIGHT.getRight( DOWN ).name === 'front'
 * - RIGHT.getClockwise().name === 'back'
 * - RIGHT.getClockwise( FRONT ).name === 'up'
 *
 * Keep in mind that a direction cannot use itself or its opposite as the
 * normalized up vector when seeking a direction!
 *
 * - RIGHT.getUp( RIGHT ) === null
 * - RIGHT.getUp( LEFT  ) === null
 *
 * @author Mark Lundin - http://www.mark-lundin.com
 * @author Stewart Smith
 */
export class Direction {

    public id
    public name
    public normal
    public initial
    public neighbors
    public opposite

    constructor(id, name, normal) {
        this.id = id
        this.name = name.toLowerCase()
        this.normal = normal
        this.initial = name.substr(0, 1).toUpperCase()
        this.neighbors = []
        this.opposite = null
    }

    // =========================================================================
    // Static
    // =========================================================================

    public static getNameById(id: string) {
        return [
            "front",
            "up",
            "right",
            "down",
            "left",
            "back",
        ][id]
    }

    public static getIdByName(name: number) {
        return {
            front: 0,
            up:    1,
            right: 2,
            down:  3,
            left:  4,
            back:  5,
        }[name]
    }

    public static getDirectionById(id: number): Direction {
        return [
            DIRECTIONS.FRONT,
            DIRECTIONS.UP,
            DIRECTIONS.RIGHT,
            DIRECTIONS.DOWN,
            DIRECTIONS.LEFT,
            DIRECTIONS.BACK,
        ][id]
    }

    public static getDirectionByInitial(initial: string): Direction {
        return {
            F: DIRECTIONS.FRONT,
            U: DIRECTIONS.UP,
            R: DIRECTIONS.RIGHT,
            D: DIRECTIONS.DOWN,
            L: DIRECTIONS.LEFT,
            B: DIRECTIONS.BACK,
        }[initial.toUpperCase()]
    }

    public static getDirectionByName(name: string): Direction {
        return {
            front: DIRECTIONS.FRONT,
            up:    DIRECTIONS.UP,
            right: DIRECTIONS.RIGHT,
            down:  DIRECTIONS.DOWN,
            left:  DIRECTIONS.LEFT,
            back:  DIRECTIONS.BACK,
        }[name.toLowerCase()]
    }

    public static getDirectionByNormal(normal) {
        const vector = new Vector3()
        //	Flatten out any floating point roundingerrors ...
        vector.x = Math.round(normal.x)
        vector.y = Math.round(normal.y)
        vector.z = Math.round(normal.z)
        return vector.equals(DIRECTIONS.FRONT.normal) ? DIRECTIONS.FRONT :
            vector.equals(DIRECTIONS.BACK.normal) ? DIRECTIONS.BACK :
                vector.equals(DIRECTIONS.UP.normal) ? DIRECTIONS.UP :
                    vector.equals(DIRECTIONS.DOWN.normal) ? DIRECTIONS.DOWN :
                        vector.equals(DIRECTIONS.LEFT.normal) ? DIRECTIONS.LEFT :
                            vector.equals(DIRECTIONS.RIGHT.normal) ? DIRECTIONS.RIGHT :
                                null
    }

    // =========================================================================
    // Instance
    // =========================================================================

    public setRelationships(up, right, down, left, opposite) {
        this.neighbors = [up, right, down, left]
        this.opposite = opposite
    }

    /**
     * If we're looking at a particular face
     * and we designate an adjacent side as up
     * then we can calculate what adjacent side would appear to be up
     * if we rotated clockwise or anticlockwise.
     */
    public getRotation(vector, from, steps) {
        if (from === undefined) {
            from = this.neighbors[0]
        }
        if (from === this || from === this.opposite) {
            return null
        }
        steps = steps === undefined ? 1 : steps.modulo(4)
        let i
        for (i = 0; i < 5; i++) {
            if (this.neighbors[i] === from) break
        }
        return this.neighbors[i.add(steps * vector).modulo(4)]
    }

    public getClockwise(from, steps) {
        return this.getRotation(+1, from, steps)
    }

    public getAnticlockwise(from, steps) {
        return this.getRotation(-1, from, steps)
    }

    // Similar to above,
    // if we're looking at a particular face
    // and we designate an adjacent side as up
    // we can state what sides appear to be to the up, right, down, and left
    // of this face.

    public getDirection(direction, up) {
        return this.getRotation(1, up, direction.id - 1)
    }
    public getUp(up) {
        return this.getDirection(DIRECTIONS.UP, up)
    }
    public getRight(up) {
        return this.getDirection(DIRECTIONS.RIGHT, up)
    }
    public getDown(up) {
        return this.getDirection(DIRECTIONS.DOWN, up)
    }
    public getLeft(up) {
        return this.getDirection(DIRECTIONS.LEFT, up)
    }

    /**
     * A convenience method that mimics the verbiage
     * of the `getRotation()` and `getDirection()` methods.
     */
    public getOpposite() {
        return this.opposite
    }
}

/**
 * Create facing directions as global constants this way we can access from
 * anywhere in any scope without big long names full of dots and stuff.
 */
export const DIRECTIONS = {
    FRONT:  new Direction(0, "front", new Vector3(0, 0, 1)),
    UP:     new Direction(1, "up",    new Vector3(0, 1, 0)),
    RIGHT:  new Direction(2, "right", new Vector3(1, 0, 0)),
    DOWN:   new Direction(3, "down",  new Vector3(0, -1, 0)),
    LEFT:   new Direction(4, "left",  new Vector3(-1, 0, 0)),
    BACK:   new Direction(5, "back",  new Vector3(0, 0, -1)),
}

// Now that they all exist we can
// establish their relationships to one another.
DIRECTIONS.FRONT.setRelationships(DIRECTIONS.UP, DIRECTIONS.RIGHT, DIRECTIONS.DOWN, DIRECTIONS.LEFT, DIRECTIONS.BACK)
DIRECTIONS.UP.setRelationships(DIRECTIONS.BACK, DIRECTIONS.RIGHT, DIRECTIONS.FRONT, DIRECTIONS.LEFT, DIRECTIONS.DOWN)
DIRECTIONS.RIGHT.setRelationships(DIRECTIONS.UP, DIRECTIONS.BACK, DIRECTIONS.DOWN, DIRECTIONS.FRONT, DIRECTIONS.LEFT)
DIRECTIONS.DOWN.setRelationships(DIRECTIONS.FRONT, DIRECTIONS.RIGHT, DIRECTIONS.BACK, DIRECTIONS.LEFT, DIRECTIONS.UP)
DIRECTIONS.LEFT.setRelationships(DIRECTIONS.UP, DIRECTIONS.FRONT, DIRECTIONS.DOWN, DIRECTIONS.BACK, DIRECTIONS.RIGHT)
DIRECTIONS.BACK.setRelationships(DIRECTIONS.UP, DIRECTIONS.LEFT, DIRECTIONS.DOWN, DIRECTIONS.RIGHT, DIRECTIONS.FRONT)
