import { Euler } from "../THREE/Euler"
import { Matrix4 } from "../THREE/Matrix4"
import { Object3D } from "../THREE/Object3D"
import { PerspectiveCamera } from "../THREE/PerspectiveCamera"
import { Quaternion } from "../THREE/Quaternion"
import { Vector3 } from "../THREE/Vector3"
import { Group } from "./Group"
import { Queue } from "./Queue"
import { Twist } from "./Twist"
import { COLORS, Color } from "./Color"
import { Cubelet } from "./Cubelet"
import { Slice } from "./Slice"

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
export class Cube extends Group {

    public renderFactory
    public finalShuffle

    public paused: boolean
    public autoRotate: boolean
    public keyboardControlsEnabled: boolean
    public mouseControlsEnabled: boolean

    public isShuffling: boolean
    public isReady: boolean
    public isSolving: boolean
    public undoing: boolean
    public render: boolean
    public hideInvisibleFaces: boolean

    /** The amount of time we've been running */
    public time: number
    /**
     * We'll keep an record of the number of moves we've made.
     *
     * Useful for keeping scores.
     */
    public moveCounter: number
    /**
     * Every fire of `this.loop()` will attempt to complete our tasks
     * which can only be run if `this.isReady === true`.
     */
    public taskQueue: Queue
    /**
     * We need the ability to gang up twist commands.
     *
     * Every fire of this.loop() will attempt to empty it.
     */
    public twistQueue: Queue
    /**
     * Although we have a queue containing all our twists
     * we also need a way to collect any undo requests into a similar queue
     */
    public historyQueue: Queue
    /** How long should a `Cube.twist()` take? */
    public twistDuration: number
    /** If we shuffle, how shall we do it? */
    public shuffleMethod
    /** Size matters? Cubelets will attempt to read these values. */
    public size: number
    /** Size matters? Cubelets will attempt to read these values. */
    public cubeletSize: number

    public camera: PerspectiveCamera
    public object3D: Object3D
    public autoRotateObj3D: Object3D
    public rotation: Euler
    public quaternion: Quaternion
    public position: Vector3
    public matrix: Matrix4
    public matrixWorld: Matrix4
    public rotationDelta: Euler

    public core: Group
    public centers: Group
    public edges: Group
    public corners: Group
    public crosses: Group

    public left: Slice
    public middle: Slice
    public right: Slice
    public up: Slice
    public equator: Slice
    public down: Slice
    public front: Slice
    public standing: Slice
    public back: Slice

    public faces: Slice[]
    public slices: Slice[]

    public slicesDictionary

    constructor(parameters: ICubeParams) {
        super()

        parameters = {
            ...DEFAULT_PARAMETERS,
            ...parameters,
        }

        this.paused = parameters.paused
        this.autoRotate = parameters.autoRotate
        this.keyboardControlsEnabled = parameters.keyboardControlsEnabled
        this.mouseControlsEnabled = parameters.mouseControlsEnabled
        this.hideInvisibleFaces = parameters.hideInvisibleFaces
        this.twistDuration = parameters.twistDuration
        this.size = parameters.textureSize * 3
        this.cubeletSize = this.size / 3

        this.renderFactory = parameters.renderer

        this.isShuffling = false
        this.isReady = true
        this.isSolving = false
        this.undoing = false
        this.render = true
        this.finalShuffle = null

        this.time = 0
        this.moveCounter = 0
        this.taskQueue = new Queue()
        this.twistQueue = new Queue(Twist.validate)
        this.historyQueue = new Queue(Twist.validate)
        this.shuffleMethod = this.PRESERVE_LOGO

        // To display our cube, we'll need some 3D specific attributes, like a camera
        const FIELD_OF_VIEW = 35
        const WIDTH = window.innerWidth
        const HEIGHT = window.innerHeight
        const ASPECT_RATIO = WIDTH / HEIGHT
        const NEAR = 1
        const FAR = 6000

        this.camera = new PerspectiveCamera(FIELD_OF_VIEW, ASPECT_RATIO, NEAR, FAR)
        this.camera.position.z = this.size * 4

        // To do all the things normally associated with a 3D object,
        // we'll need to borrow a few properties from Three.js.
        // Things like position, rotation, and orientation.
        this.object3D = new Object3D()
        this.autoRotateObj3D = new Object3D()
        this.rotation = this.object3D.rotation
        this.quaternion = this.object3D.quaternion
        this.position = this.object3D.position
        this.matrix = this.object3D.matrix
        this.matrixWorld = this.object3D.matrixWorld
        this.rotation.set(
            25 * Math.PI / 180,
            -30 * Math.PI / 180,
            0,
        )

        // If we enable Auto-Rotate then the cube will spin (not twist!) in space
        // by adding the following values to the Three object on each frame.
        this.rotationDelta = new Euler(
            0.1 * Math.PI / 180,
            0.15 * Math.PI / 180,
            0,
        )

        // Here's the first big map we've come across in the program so far.
        // Imagine you're looking at the Cube straight on so you only see the front face.
        // We're going to map that front face from left to right (3), and top to bottom (3):
        // that's 3 x 3 = 9 Cubelets.
        // But then behind the Front slice we also have a Standing slice (9) and Back slice (9),
        // so that's going to be 27 Cubelets in total to create a Cube.
        this.cubelets = []
        initialCubeletsArray().forEach((cubeletColorMap, cubeletId) => {
            this.cubelets.push(new Cubelet(this, cubeletId, cubeletColorMap))
        })

        // Mapping the Cube creates all the convenience shortcuts
        // that we will need later. (Demonstrated immediately below!)
        // A Rubik's Cube is composed of 27 cubelets arranged 3 x 3 x 3.
        // We need a map that relates these 27 locations to the 27 cubelets
        // such that we can ask questions like:
        // What colors are on the Front face of the cube? Etc.
        let i

        // Groups are simple collections of Cubelets.
        // Their position and rotation is irrelevant.
        this.core    = new Group()
        this.centers = new Group()
        this.edges   = new Group()
        this.corners = new Group()
        this.crosses = new Group()

        this.cubelets.forEach((cubelet) => {
            if (cubelet.type === "core")   this.core.add(cubelet)
            if (cubelet.type === "center") this.centers.add(cubelet)
            if (cubelet.type === "edge")   this.edges.add(cubelet)
            if (cubelet.type === "corner") this.corners.add(cubelet)
            if (cubelet.type === "center" || cubelet.type === "edge") this.crosses.add(cubelet)
        })

        this.initSlices()

        // Faces .... special kind of Slice!
        this.faces  = [this.front, this.up, this.right, this.down, this.left, this.back]
        this.slices = [this.left, this.middle, this.right, this.down, this.equator, this.up, this.back, this.standing, this.front]

        // We also probably want a handle on any update events that occur, for example, when a slice is rotated
        const onSliceRotated = (event) => {
            this.dispatchEvent(new CustomEvent("onTwistComplete", { detail: { slice: event.target } }))
        }
        this.slices.forEach((slice) => {
            slice.addEventListener("change", onSliceRotated)
        })

        // Dictionary to lookup slice
        const allIndices = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26]
        this.slicesDictionary = {
            "f": this.front,
            "s": this.standing,
            "b": this.back,
            "u": this.up,
            "e": this.equator,
            "d": this.down,
            "r": this.right,
            "m": this.middle,
            "l": this.left,
            // Here we defined some arbitrary groups.
            // Technically they're not really slices in the usual sense,
            // there are however a few things about slices that we need,
            // like the ability to rotate about an axis, therefore for all
            // intents and purposes, we'll call them a slice
            "x": new Slice(allIndices, this),
            "y": new Slice(allIndices, this),
            "z": new Slice(allIndices, this),
        }

        // Internally we have the ability to hide any invisible faces,
        // When a slice is rotated we determine what faces should be visible
        // so the cube doesn't look broken. This happened every time a slice is rotated.
        // Rotating certain slices, such as the group slices never show internal faces.
        this.slicesDictionary.x.ableToHideInternalFaces = false
        this.slicesDictionary.y.ableToHideInternalFaces = false
        this.slicesDictionary.z.ableToHideInternalFaces = false

        // For the x, y, and z groups we've defined above,
        // we'll need to manually set an axis since once can't be automatically computed
        this.slicesDictionary.x.axis.set(-1, 0, 0)
        this.slicesDictionary.y.axis.set(0, -1, 0)
        this.slicesDictionary.z.axis.set(0, 0, -1)
    }

    // Now we'll create some slices. A slice represents a 3x3 grid of cubelets.
    // Slices are Groups with purpose; they are rotate-able!
    // Slices that can rotate about the X-axis:
    private initSlices() {
        this.left = new Slice([
            24, 21, 18,
            15, 12,  9,
            6,   3,  0,
        ], this)
        // this.left.name = "left"
        this.middle = new Slice([
            25, 22, 19,
            16, 13, 10,
            7, 4, 1,
        ], this)
        // this.middle.name = "middle"
        this.right = new Slice([
            2, 11, 20,
            5, 14, 23,
            8, 17, 26,
        ], this)
        // this.right.name = "right"
        this.right.neighbour = this.middle
        this.left.neighbour = this.middle
        // Slices that can rotate about the Y-axis:
        this.up = new Slice([
            18, 19, 20,
            9, 10, 11,
            0, 1, 2], this,
        )
        // this.up.name = "up"
        this.equator = new Slice([
            21, 22, 23,
            12, 13, 14,
            3, 4, 5,
        ], this)
        // this.equator.name = "equator"
        this.down = new Slice([
            8, 17, 26,
            7, 16, 25,
            6, 15, 24,
        ], this)
        // this.down.name = "down"
        this.down.neighbour = this.equator
        this.up.neighbour = this.equator
        // These are Slices that can rotate about the Z-axis:
        this.front = new Slice([
            0, 1, 2,
            3, 4, 5,
            6, 7, 8,
        ], this)
        // this.front.name = "front"
        this.standing = new Slice([
            9, 10, 11,
            12, 13, 14,
            15, 16, 17,
        ], this)
        // this.standing.name = "standing"
        this.back = new Slice([
            26, 23, 20,
            25, 22, 19,
            24, 21, 18,
        ], this)
        // this.back.name = "back"
        this.back.neighbour = this.standing
        this.front.neighbour = this.standing
    }
}

export interface ICubeParams {
    paused?: boolean
    autoRotate?: boolean
    keyboardControlsEnabled?: boolean
    mouseControlsEnabled?: boolean
    renderer?: __<any>
    hideInvisibleFaces?: boolean
    twistDuration
    // The textureSize sets the physical size of the cubelets in pixels.
    // This is useful for rendering purposes as browsers don't downsample textures very well, nor is upsamlping
    // pretty either. In general, it's best to set the texture size to roughly the same size they'll appear on screen.
    textureSize?: number
}

const DEFAULT_PARAMETERS: ICubeParams = {
    paused: false,
    autoRotate: false,
    keyboardControlsEnabled: true,
    mouseControlsEnabled: true,
    renderer: ERNO.renderers.CSS3D,
    textureSize: 120,
    hideInvisibleFaces: false,
    twistDuration: 500,
}

// =============================================================================
// Initial Cubelets
// =============================================================================

const initialCubeletsArray = (): Color[][] => {
    const {
        WHITE:  W,
        ORANGE: O,
        BLUE:   B,
        RED:    R,
        GREEN:  G,
        YELLOW: Y,
    } = COLORS

    const _ = undefined

    const values = [
        // Front slice
        [W, O, _, _, G], [W, O, _, _, _], [W, O, B, _, _], //  0,  1,  2
        [W, _, _, _, G], [W, _, _, _, _], [W, _, B, _, _], //  3,  4,  5
        [W, _, _, R, G], [W, _, _, R, _], [W, _, B, R, _], //  6,  7,  8
        // Standing slice
        [_, O, _, _, G], [_, O, _, _, _], [_, O, B, _, _], //  9, 10, 11
        [_, _, _, _, G], [_, _, _, _, _], [_, _, B, _, _], // 12, XX, 14
        [_, _, _, R, G], [_, _, _, R, _], [_, _, B, R, _], // 15, 16, 17
        // Back slice
        [_, O, _, _, G, Y], [_, O, _, _, _, Y], [_, O, B, _, _, Y], // 18, 19, 20
        [_, _, _, _, G, Y], [_, _, _, _, _, Y], [_, _, B, _, _, Y], // 21, 22, 23
        [_, _, _, R, G, Y], [_, _, _, R, _, Y], [_, _, B, R, _, Y], // 24, 25, 26
    ]

    return values
}
