import { Object3D } from "./Object3D"

/**
 * This is slightly modified CSS Renderer that sets the object transform as individual translate, scale and rotate.
 *
 * The reason for this is that the transformation using matrix3d does not scale correctly under browser zoom.
 *
 * Based on http://www.emagix.net/academic/mscs-project/item/camera-sync-with-css3-and-webgl-threejs
 *
 * @author [mrdoob](http://mrdoob.com/)
 * @author [mark lundin](http://mark-lundin.com)
 */
export class CSS3DObject extends Object3D {

    public element: HTMLElement
    public done: boolean

    constructor(element: HTMLElement) {
        super()
        this.element = element
        this.done = false
        this.element.style.position = "absolute"
        this.addEventListener("removed", function(event) {
            if (this.element.parentNode !== null) {
                this.element.parentNode.removeChild(this.element)
                for (let i = 0, l = this.children.length; i < l; i++) {
                    this.children[i].dispatchEvent(event)
                }
            }
        })
    }
}
