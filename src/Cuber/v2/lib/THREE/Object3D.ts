import { Euler } from "./Euler"
import { ThreeMath } from "./Math"
import { Matrix4 } from "./Matrix4"
import { Quaternion } from "./Quaternion"
import { Scene } from "./Scene"
import { THREE } from "./THREE"
import { Vector3 } from "./Vector3"

/**
 * @author [mrdoob](http://mrdoob.com/)
 * @author [mikael emtinger](http://gomo.se/)
 * @author [alteredq](http://alteredqualia.com/)
 * @author [WestLangley](http://github.com/WestLangley)
 */
export class Object3D {

    public id: number
    public uuid: string
    public name: string
    public parent
    public children: any[]
    public up: Vector3
    public position: Vector3
    public _rotation: Euler
    public _quaternion: Quaternion
    public scale: Vector3
    public renderDepth
    public rotationAutoUpdate: boolean
    public matrix: Matrix4
    public matrixWorld: Matrix4
    public matrixAutoUpdate: boolean
    public matrixWorldNeedsUpdate: boolean
    public visible: boolean
    public castShadow: boolean
    public receiveShadow: boolean
    public frustumCulled: boolean
    public userData: any

    constructor() {
        this.id = THREE.Object3DIdCount++
        this.uuid = ThreeMath.generateUUID()
        this.name = ""
        this.parent = undefined
        this.children = []
        this.up = new Vector3(0, 1, 0)
        this.position = new Vector3()
        this._rotation = new Euler()
        this._quaternion = new Quaternion()
        this.scale = new Vector3(1, 1, 1)
        // keep rotation and quaternion in sync
        this._rotation._quaternion = this.quaternion
        this._quaternion._euler = this.rotation
        this.renderDepth = null
        this.rotationAutoUpdate = true
        this.matrix = new Matrix4()
        this.matrixWorld = new Matrix4()
        this.matrixAutoUpdate = true
        this.matrixWorldNeedsUpdate = true
        this.visible = true
        this.castShadow = false
        this.receiveShadow = false
        this.frustumCulled = true
        this.userData = {}
    }

    public get rotation() {
        return this._rotation
    }

    set rotation(value) {
        this._rotation = value
        this._rotation._quaternion = this._quaternion
        this._quaternion._euler = this._rotation
        this._rotation._updateQuaternion()
    }

    get quaternion() {
        return this._quaternion
    }

    set quaternion(value) {
        this._quaternion = value
        this._quaternion._euler = this._rotation
        this._rotation._quaternion = this._quaternion
        this._quaternion._updateEuler()
    }

    get eulerOrder() {
        console.warn("DEPRECATED: Object3D's .eulerOrder has been moved to Object3D's .rotation.order.")
        return this.rotation.order
    }

    set eulerOrder(value) {
        console.warn("DEPRECATED: Object3D's .eulerOrder has been moved to Object3D's .rotation.order.")
        this.rotation.order = value
    }

    get useQuaternion() {
        console.warn("DEPRECATED: Object3D's .useQuaternion has been removed. The library now uses quaternions by default.")
        return undefined
    }

    set useQuaternion(value) {
        console.warn("DEPRECATED: Object3D's .useQuaternion has been removed. The library now uses quaternions by default.")
    }

    applyMatrix(matrix) {
        this.matrix.multiplyMatrices(matrix, this.matrix)
        this.matrix.decompose(this.position, this.quaternion, this.scale)
    }

    setRotationFromAxisAngle(axis, angle) {
        // assumes axis is normalized
        this.quaternion.setFromAxisAngle(axis, angle)
    }

    setRotationFromEuler(euler) {
        this.quaternion.setFromEuler(euler, true)
    }

    setRotationFromMatrix(m) {
        // assumes the upper 3x3 of m is a pure rotation matrix (i.e, unscaled)
        this.quaternion.setFromRotationMatrix(m)
    }

    setRotationFromQuaternion(q) {
        // assumes q is normalized
        this.quaternion.copy(q)
    }

    rotateOnAxis(axis, angle) {
        // rotate object on axis in object space
        // axis is assumed to be normalized
        const q1 = new Quaternion()
        q1.setFromAxisAngle(axis, angle)
        this.quaternion.multiply(q1)
        return this
    }

    rotateX(angle) {
        const v1 = new Vector3(1, 0, 0)
        return this.rotateOnAxis(v1, angle)
    }

    rotateY(angle) {
        const v1 = new Vector3(0, 1, 0)
        return this.rotateOnAxis(v1, angle)
    }

    rotateZ(angle) {
        const v1 = new Vector3(0, 0, 1)
        return this.rotateOnAxis(v1, angle)
    }

    translateOnAxis(axis, distance) {
        // translate object by distance along axis in object space
        // axis is assumed to be normalized
        const v1 = new Vector3()
        v1.copy(axis)
        v1.applyQuaternion(this.quaternion)
        this.position.add(v1.multiplyScalar(distance))
        return this
    }

    translate(distance, axis) {
        console.warn("DEPRECATED: Object3D's .translate() has been removed. Use .translateOnAxis( axis, distance ) instead. Note args have been changed.")
        return this.translateOnAxis(axis, distance)
    }

    translateX(distance) {
        const v1 = new Vector3(1, 0, 0)
        return this.translateOnAxis(v1, distance)
    }

    translateY(distance) {
        const v1 = new Vector3(0, 1, 0)
        return this.translateOnAxis(v1, distance)
    }

    translateZ(distance) {
        const v1 = new Vector3(0, 0, 1)
        return this.translateOnAxis(v1, distance)
    }

    localToWorld(vector) {
        return vector.applyMatrix4(this.matrixWorld)
    }

    worldToLocal(vector) {
        const m1 = new Matrix4()
        return vector.applyMatrix4(m1.getInverse(this.matrixWorld))
    }

    // This routine does not support objects with rotated and/or translated parent(s)
    lookAt(vector) {
        const m1 = new Matrix4()
        m1.lookAt(vector, this.position, this.up)
        this.quaternion.setFromRotationMatrix(m1)
    }

    add(object) {
        if (object === this) {
            console.warn("THREE.Object3D.add: An object can't be added as a child of itself.")
            return
        }
        if (object instanceof Object3D) {
            if (object.parent !== undefined) {
                object.parent.remove(object)
            }
            object.parent = this
            object.dispatchEvent({ type: "added" })
            this.children.push(object)
            // add to scene
            let scene = this
            while (scene.parent !== undefined) {
                scene = scene.parent
            }
            if (scene !== undefined && scene instanceof Scene) {
                scene.__addObject(object)
            }
        }
    }

    remove(object) {
        const index = this.children.indexOf(object)
        if (index !== - 1) {
            object.parent = undefined
            object.dispatchEvent({ type: "removed" })
            this.children.splice(index, 1)
            // remove from scene
            let scene = this
            while (scene.parent !== undefined) {
                scene = scene.parent
            }
            if (scene !== undefined && scene instanceof Scene) {
                scene.__removeObject(object)
            }
        }
    }

    traverse(callback) {
        callback(this)
        for (let i = 0, l = this.children.length; i < l; i++) {
            this.children[i].traverse(callback)
        }
    }

    getObjectById(id, recursive) {
        for (let i = 0, l = this.children.length; i < l; i++) {
            let child = this.children[i]
            if (child.id === id) {
                return child
            }
            if (recursive === true) {
                child = child.getObjectById(id, recursive)
                if (child !== undefined) {
                    return child
                }
            }
        }
        return undefined
    }

    getObjectByName(name, recursive) {
        for (let i = 0, l = this.children.length; i < l; i++) {
            let child = this.children[i]
            if (child.name === name) {
                return child
            }
            if (recursive === true) {
                child = child.getObjectByName(name, recursive)
                if (child !== undefined) {
                    return child
                }
            }
        }
        return undefined
    }

    getChildByName(name, recursive) {
        console.warn("DEPRECATED: Object3D's .getChildByName() has been renamed to .getObjectByName().")
        return this.getObjectByName(name, recursive)
    }

    getDescendants(array) {
        if (array === undefined) array = []
        Array.prototype.push.apply(array, this.children)
        for (let i = 0, l = this.children.length; i < l; i++) {
            this.children[i].getDescendants(array)
        }
        return array
    }

    updateMatrix() {
        this.matrix.compose(this.position, this.quaternion, this.scale)
        this.matrixWorldNeedsUpdate = true
    }

    updateMatrixWorld(force) {
        if (this.matrixAutoUpdate === true) this.updateMatrix()
        if (this.matrixWorldNeedsUpdate === true || force === true) {
            if (this.parent === undefined) {
                this.matrixWorld.copy(this.matrix)
            } else {
                this.matrixWorld.multiplyMatrices(this.parent.matrixWorld, this.matrix)
            }
            this.matrixWorldNeedsUpdate = false
            force = true
        }
        // update children
        for (let i = 0, l = this.children.length; i < l; i++) {
            this.children[i].updateMatrixWorld(force)
        }
    }

    clone(object, recursive = undefined) {
        if (object === undefined) object = new Object3D()
        if (recursive === undefined) recursive = true
        object.name = this.name
        object.up.copy(this.up)
        object.position.copy(this.position)
        object.quaternion.copy(this.quaternion)
        object.scale.copy(this.scale)
        object.renderDepth = this.renderDepth
        object.rotationAutoUpdate = this.rotationAutoUpdate
        object.matrix.copy(this.matrix)
        object.matrixWorld.copy(this.matrixWorld)
        object.matrixAutoUpdate = this.matrixAutoUpdate
        object.matrixWorldNeedsUpdate = this.matrixWorldNeedsUpdate
        object.visible = this.visible
        object.castShadow = this.castShadow
        object.receiveShadow = this.receiveShadow
        object.frustumCulled = this.frustumCulled
        object.userData = JSON.parse(JSON.stringify(this.userData))
        if (recursive === true) {
            for (let i = 0; i < this.children.length; i++) {
                const child = this.children[i]
                object.add(child.clone())
            }
        }
        return object
    }


}
