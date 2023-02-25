import { Camera } from "./Camera"
import { ThreeMath } from "./Math"

/**
 * @author [mrdoob](http://mrdoob.com/)
 * @author [greggman](http://games.greggman.com/)
 * @author [zz85](http://www.lab4games.net/zz85/blog)
 */
export class PerspectiveCamera extends Camera {

    public fov: number
    public aspect: number
    public near: number
    public far: number

    public fullWidth
    public fullHeight
    public x
    public y
    public width
    public height

    constructor(
        fov    = 50,
        aspect = 1,
        near   = 0.1,
        far    = 2_000,
    ) {
        super()
        this.fov = fov
        this.aspect = aspect
        this.near = near
        this.far = far

        this.updateProjectionMatrix()
    }

    /**
     * Uses Focal Length (in mm) to estimate and set FOV
     * 35mm (fullFrame) camera is used if frame size is not specified.
     *
     * Formula based on http://www.bobatkins.com/photography/technical/field_of_view.html
     */
    public setLens(focalLength, frameHeight) {
        if (frameHeight === undefined) frameHeight = 24
        this.fov = 2 * ThreeMath.radToDeg(Math.atan(frameHeight / (focalLength * 2)))
        this.updateProjectionMatrix()
    }

    /**
     * Sets an offset in a larger frustum. This is useful for multi-window or
     * multi-monitor/multi-machine setups.
     *
     * For example, if you have 3x2 monitors and each monitor is 1920x1080 and
     * the monitors are in grid like this
     *
     *   +---+---+---+
     *   | A | B | C |
     *   +---+---+---+
     *   | D | E | F |
     *   +---+---+---+
     *
     * then for each monitor you would call it like this
     *
     *   let w = 1920;
     *   let h = 1080;
     *   let fullWidth = w * 3;
     *   let fullHeight = h * 2;
     *
     *   --A--
     *   camera.setOffset( fullWidth, fullHeight, w * 0, h * 0, w, h );
     *   --B--
     *   camera.setOffset( fullWidth, fullHeight, w * 1, h * 0, w, h );
     *   --C--
     *   camera.setOffset( fullWidth, fullHeight, w * 2, h * 0, w, h );
     *   --D--
     *   camera.setOffset( fullWidth, fullHeight, w * 0, h * 1, w, h );
     *   --E--
     *   camera.setOffset( fullWidth, fullHeight, w * 1, h * 1, w, h );
     *   --F--
     *   camera.setOffset( fullWidth, fullHeight, w * 2, h * 1, w, h );
     *
     *   Note there is no reason monitors have to be the same size or in a grid.
     */
    public setViewOffset(fullWidth, fullHeight, x, y, width, height) {
        this.fullWidth = fullWidth
        this.fullHeight = fullHeight
        this.x = x
        this.y = y
        this.width = width
        this.height = height
        this.updateProjectionMatrix()
    }

    public updateProjectionMatrix() {
        if (this.fullWidth) {
            const aspect = this.fullWidth / this.fullHeight
            const top = Math.tan(ThreeMath.degToRad(this.fov * 0.5)) * this.near
            const bottom = -top
            const left = aspect * bottom
            const right = aspect * top
            const width = Math.abs(right - left)
            const height = Math.abs(top - bottom)
            this.projectionMatrix.makeFrustum(
                left + this.x * width / this.fullWidth,
                left + (this.x + this.width) * width / this.fullWidth,
                top - (this.y + this.height) * height / this.fullHeight,
                top - this.y * height / this.fullHeight,
                this.near,
                this.far,
            )
        } else {
            this.projectionMatrix.makePerspective(this.fov, this.aspect, this.near, this.far)
        }
    }

    public clone() {
        const camera = new PerspectiveCamera()
        super.clone(camera)
        camera.fov = this.fov
        camera.aspect = this.aspect
        camera.near = this.near
        camera.far = this.far
        return camera
    }
}
