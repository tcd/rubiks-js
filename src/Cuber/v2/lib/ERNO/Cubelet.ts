import { Matrix4 } from "../THREE/Matrix4"
import { Object3D } from "../THREE/Object3D"
import { Cube } from "./Cube"
import { ERNO } from "./ERNO"

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
export class Cubelet extends Object3D {

    public id: number
    public cube: Cube
    public size: number
    public matrixSlice
    public faces
    addressX: number
    addressY: number
    addressZ: number
    type: string
    front: any
    right: any
    down: any
    left: any
    back: any
    colors: any
    isStickerCubelet: boolean
    isTweening: boolean
    isEngagedX: boolean
    isEngagedY: boolean
    isEngagedZ: boolean
    opacity: number
    radius: number

    constructor(cube: Cube, id = 0, colors) {
        super()
        // Our Cube can directly address its Cubelet children,
        // only fair the Cubelet can address their parent Cube!
        this.cube = cube
        // Our Cubelet's ID is its unique number on the Cube.
        // Each Cube has Cubletes numbered 0 through 26.
        // Even if we're debugging (and not attached to an actual Cube)
        // we need an ID number for later below
        // when we derive positions and rotations for the Cubelet faces.
        this.id = id || 0
        // Our Cubelet's address is its current location on the Cube.
        // When the Cubelet is initialized its ID and address are the same.
        // This method will also set the X, Y, and Z components of the
        // Cubelet's address on the Cube.
        this.setAddress(this.id)
        // We're going to build Cubelets that are 140 pixels square.
        // Yup. This size is hardwired in Cube.
        // It is also hard-wired into the CSS, but we can't simply
        // grab the style.getBoundingClientRect() value because
        // that's a 2D measurement -- doesn't account for pos and rot.
        this.size = cube.cubeletSize || 140
        // Now we can find our Cubelet's X, Y, and Z position in space.
        // We only need this momentarily to create our Object3D so
        // there's no need to attach these properties to our Cubelet object.
        const epsilon = 0.1
        const x = this.addressX * (this.size + epsilon)
        const y = this.addressY * (this.size + epsilon)
        const z = this.addressZ * (this.size + epsilon)
        this.position.set(x, y, z)
        this.matrixSlice = new Matrix4().makeTranslation(x, y, z)
        this.updateMatrix()
        // // Add the cubelet to the cube object
        this.cube.object3D.add(this)
        // let domElement = document.createElement( 'div' );
        // domElement.classList.add( 'cubelet' );
        // domElement.classList.add( 'cubeletId-'+ this.id );
        // this.css3DObject = new THREE.CSS3DObject( domElement );
        // this.css3DObject.name = 'css3DObject-' + this.id;
        // this.add( this.css3DObject );
        // We're about to loop through our colors[] Array
        // to build the six faces of our Cubelet.
        // Here's our overhead for that:
        let extrovertedFaces = 0
        if (colors === undefined) colors = [W, O, , , G]
        this.faces = []
        // Now let's map one color per side based on colors[].
        // Undefined values are allowed (and anticipated).
        // We need to loop through the colors[] Array "manually"
        // because Array.forEach() would skip the undefined entries.
        for (let i = 0; i < 6; i++) {
            // Before we create our face's THREE object
            // we need to know where it should be positioned and rotated.
            // (This is based on our above positions and rotations map.)
            const color = colors[i] || ERNO.COLORLESS
            // Each face is an object and keeps track of its original ID number
            // (which is important because its address will change with each rotation)
            // its current color, and so on.
            this.faces[i] = {}
            this.faces[i].id = i
            this.faces[i].color = color
            // We're going to keep track of what face was what at the moment of initialization,
            // mostly for solving purposes.
            // This is particularly useful for Striegel's solver
            // which requires an UP normal.
            this.faces[i].normal = ERNO.Direction.getNameById(i)
            //  // FACE CONTAINER.
            //  // This face of our Cubelet needs a DOM element for all the
            //  // related DOM elements to be attached to.
            //  let faceElement = document.createElement( 'div' );
            //  faceElement.classList.add( 'face' );
            //  faceElement.classList.add( 'face'+ ERNO.Direction.getNameById( i ).capitalize() );
            //  this.css3DObject.element.appendChild( faceElement );
            //  this.faces[i].element = faceElement;
            //  // WIREFRAME.
            //  let wireframeElement = document.createElement( 'div' );
            //  wireframeElement.classList.add( 'wireframe' );
            //  faceElement.appendChild( wireframeElement );
            //  // CUBELET ID.
            //  // For debugging we want the ability to display this Cubelet's ID number
            //  // with an underline (to make numbers like 6 and 9 legible upside-down).
            //  let idElement = document.createElement( 'div' );
            //  idElement.classList.add( 'id' );
            //  faceElement.appendChild( idElement );
            //  let underlineElement = document.createElement( 'span' );
            //  underlineElement.classList.add( 'underline' );
            //  underlineElement.innerText = this.id;
            //  idElement.appendChild( underlineElement );
            // INTROVERTED FACES.
            // If this face has no color sticker then it must be interior to the Cube.
            // That means in a normal state (no twisting happening) it is entirely hidden.
            this.faces[i].isIntrovert = color === ERNO.COLORLESS
            if (color === ERNO.COLORLESS) {
                //   faceElement.classList.add( 'faceIntroverted' );
            }
            // EXTROVERTED FACES.
            // But if this face does have a color then we need to
            // create a sticker with that color
            // and also allow text to be placed on it.
            else {
                // We're going to use the number of exposed sides
                // to determine below what 'type' of Cubelet this is:
                // Core, Center, Edge, or Corner.
                extrovertedFaces++
                //   faceElement.classList.add( 'faceExtroverted' );
                //   // STICKER.
                //   // You know, the color part that makes the Cube
                //   // the most frustrating toy ever.
                //   let stickerElement = document.createElement( 'div' );
                //   stickerElement.classList.add( 'sticker' );
                //   stickerElement.classList.add( color.name );
                //   faceElement.appendChild( stickerElement );
                //   // TEXT.
                //   // One character per face, mostly for our branding.
                //   let textElement = document.createElement( 'div' );
                //   textElement.classList.add( 'text' );
                //   textElement.innerText = i;
                //   this.faces[ i ].text = textElement;
                //   faceElement.appendChild( textElement );
            }
        }
        // Now that we've run through our colors[] Array
        // and counted the number of extroverted sides
        // we can determine what 'type' of Cubelet this is.
        this.type = [
            "core",
            "center",
            "edge",
            "corner",
        ][extrovertedFaces]
        // Convience accessors for the Cubelet's faces.
        // What color is the left face? this.left() !!
        this.front = this.faces[0]
        this.up = this.faces[1]
        this.right = this.faces[2]
        this.down = this.faces[3]
        this.left = this.faces[4]
        this.back = this.faces[5]
        this.colors =
            (this.faces[0].color ? this.faces[0].color.initial : "-") +
            (this.faces[1].color ? this.faces[1].color.initial : "-") +
            (this.faces[2].color ? this.faces[2].color.initial : "-") +
            (this.faces[3].color ? this.faces[3].color.initial : "-") +
            (this.faces[4].color ? this.faces[4].color.initial : "-") +
            (this.faces[5].color ? this.faces[5].color.initial : "-")
        // this.front.element.style.transform = "rotateX(   0deg ) translateZ( "+faceSpacing+"px ) rotateZ(   0deg )";
        // this.up.element.style.transform =   "rotateX(  90deg ) translateZ( "+faceSpacing+"px ) rotateZ(   0deg )";
        // this.right.element.style.transform =  "rotateY(  90deg ) translateZ( "+faceSpacing+"px ) rotateZ(   0deg )";
        // this.down.element.style.transform =  "rotateX( -90deg ) translateZ( "+faceSpacing+"px ) rotateZ(  90deg )";
        // this.left.element.style.transform =  "rotateY( -90deg ) translateZ( "+faceSpacing+"px ) rotateZ( -90deg )";
        // this.back.element.style.transform =  "rotateY( 180deg ) translateZ( "+faceSpacing+"px ) rotateZ( -90deg )";
        // this.front.element.style.OTransform = this.front.element.style.MozTransform =  this.front.element.style.WebkitTransform  = this.front.element.style.transform;
        // this.up.element.style.OTransform  = this.up.element.style.MozTransform =   this.up.element.style.WebkitTransform   = this.up.element.style.transform;
        // this.right.element.style.OTransform = this.right.element.style.MozTransform = this.right.element.style.WebkitTransform  = this.right.element.style.transform;
        // this.down.element.style.OTransform  = this.down.element.style.MozTransform =  this.down.element.style.WebkitTransform  = this.down.element.style.transform;
        // this.left.element.style.OTransform  = this.left.element.style.MozTransform =  this.left.element.style.WebkitTransform  = this.left.element.style.transform;
        // this.back.element.style.OTransform  = this.back.element.style.MozTransform =  this.back.element.style.WebkitTransform  = this.back.element.style.transform;
        // If this happens to be our logo-bearing Cubelet
        // we had better attach the logo to it!
        this.isStickerCubelet = this.front.color && this.front.color.name === "white" && this.type === "center"
        // We need to know if we're "engaged" on an axis
        // which at first seems identical to isTweening,
        // until you consider partial rotations.
        this.isTweening = true
        this.isEngagedX = false
        this.isEngagedY = false
        this.isEngagedZ = false
        // // These will perform their actions, of course,
        // // but also setup their own boolean toggles.
        // this.show();
        // this.showIntroverts();
        // this.showPlastics();
        // this.showStickers();
        // this.hideIds();
        // this.hideTexts();
        // this.hideWireframes();
        // During a rotation animation this Cubelet marks itself as
        // this.isTweening = true.
        // Very useful. Let's try it out.
        this.isTweening = false
        // Some fun tweenable properties.
        this.opacity = 1
        this.radius = 0
    }
    setAddress(id: any) {
        throw new Error("Method not implemented.")
    }

}
