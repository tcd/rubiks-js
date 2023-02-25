import { Matrix4 } from "./Matrix4"
import { Object3D } from "./Object3D"

/**
 * @author [mrdoob](http://mrdoob.com/)
 * @author [mikael emtinger](http://gomo.se/)
 * @author [WestLangley](http://github.com/WestLangley)
 */
export class Camera extends Object3D {

    public matrixWorldInverse
    public projectionMatrix

    constructor() {
        super()
        this.matrixWorldInverse = new Matrix4()
        this.projectionMatrix = new Matrix4()
    }

    public lookAt(vector) {
        const m1 = new Matrix4()
        m1.lookAt(this.position, vector, this.up)
        this.quaternion.setFromRotationMatrix(m1)
    }

    public clone(camera: Camera = undefined) {
        camera ||= new Camera()
        super.clone(camera)
        camera.matrixWorldInverse.copy(this.matrixWorldInverse)
        camera.projectionMatrix.copy(this.projectionMatrix)
        return camera
    }
}
