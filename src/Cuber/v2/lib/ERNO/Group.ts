import { Direction } from "./Direction"
import { EventDispatcher } from "../THREE/EventDispatcher"

/**
 * `Group`s are collections of an arbitrary number of Cubelets.
 *
 * They have no concept of Cubelet location or orientation
 * and therefore are not capable of rotation around any axis.
 *
 * @author [Mark Lundin](http://www.mark-lundin.com)
 * @author Stewart Smith
 */
export class Group extends EventDispatcher {

    public cubelets

    constructor(...cubeletsToAdd) {
        super()
        this.cubelets = []
        cubeletsToAdd ||= []
        this.add(...cubeletsToAdd)
    }

    add(...cubeletsToAdd) {
        cubeletsToAdd.forEach((cubelet) => {
            if (cubelet instanceof Group) {
                cubelet = cubelet.cubelets
            }
            if (cubelet instanceof Array) {
                this.add(...cubelet)
            } else {
                this.cubelets.push(cubelet)
            }
        })
        return this
    }

    remove(cubeletToRemove) {
        if (cubeletToRemove instanceof Group) cubeletToRemove = cubeletToRemove.cubelets
        if (cubeletToRemove instanceof Array) {
            cubeletToRemove.forEach((c) => {
                this.remove(c)
            })
        }
        let i = this.cubelets.length
        while (i-- > 0) {
            if (this.cubelets[i] === cubeletToRemove) {
                this.cubelets.splice(i, 1)
            }
        }
        return this
    }

    // Boolean checker.
    // Are any Cubelets in this group tweening?
    // Engaged on the Z axis? Etc.
    isFlagged(property) {
        let count = 0
        this.cubelets.forEach(function(cubelet) {
            count += cubelet[property] ? 1 : 0
        })
        return count
    }

    isTweening() {
        return this.isFlagged("isTweening")
    }

    isEngagedX() {
        return this.isFlagged("isEngagedX")
    }

    isEngagedY() {
        return this.isFlagged("isEngagedY")
    }

    isEngagedZ() {
        return this.isFlagged("isEngagedZ")
    }

    isEngaged() {
        return this.isEngagedX() + this.isEngagedY() + this.isEngagedZ()
    }

    // Search functions.
    // What Cubelets in this Group have a particular color?
    // How about all of these three colors?
    // And index? address? Solver uses these a lot.
    hasProperty(property, value) {
        const
            results = new Group()
        this.cubelets.forEach(function(cubelet) {
            if (cubelet[property] === value) results.add(cubelet)
        })
        return results
    }

    hasId(id) {
        return this.hasProperty("id", id)
    }

    hasAddress(address) {
        return this.hasProperty("address", address)
    }

    hasType(type) {
        return this.hasProperty("type", type)
    }

    hasColor(color) {
        const
            results = new Group()
        this.cubelets.forEach(function(cubelet) {
            if (cubelet.hasColor(color)) results.add(cubelet)
        })
        return results
    }

    // this function implies AND rather than OR, XOR, etc.
    hasColors(...colors) {
        const results = new Group()
        this.cubelets.forEach((cubelet) => {
            // eslint-disable-next-line prefer-spread
            if (cubelet.hasColors.apply(cubelet, colors)) results.add(cubelet)
        })
        return results
    }

    // cube.slices.front.isSolved( 'front' )
    // cube.slices.front.up.isSolved( 'up' )
    isSolved(face) {
        if (face) {
            const faceColors = {}
            let numberOfColors = 0
            if (face instanceof Direction) face = face.name
            this.cubelets.forEach(function(cubelet) {
                const color = cubelet[face].color.name
                if (faceColors[color] === undefined) {
                    faceColors[color] = 1
                    numberOfColors++
                }
                else faceColors[color]++
            })
            return numberOfColors === 1 ? true : false
        }
        else {
            console.warn("A face [String or Controls] argument must be specified when using Group.isSolved().")
            return false
        }
    }

    // Visual switches.
    // Take this group and hide all the stickers,
    // turn on wireframe mode, etc.
    show() {
        this.cubelets.forEach(function(cubelet) { cubelet.show() })
        return this
    }

    hide() {
        this.cubelets.forEach(function(cubelet) { cubelet.hide() })
        return this
    }

    showPlastics() {
        this.cubelets.forEach(function(cubelet) { cubelet.showPlastics() })
        return this
    }

    hidePlastics() {
        this.cubelets.forEach(function(cubelet) { cubelet.hidePlastics() })
        return this
    }

    showExtroverts() {
        this.cubelets.forEach(function(cubelet) { cubelet.showExtroverts() })
        return this
    }

    hideExtroverts() {
        this.cubelets.forEach(function(cubelet) { cubelet.hideExtroverts() })
        return this
    }

    showIntroverts(only, soft) {
        this.cubelets.forEach(function(cubelet) { cubelet.showIntroverts(only, soft) })
        return this
    }

    hideIntroverts(only, soft) {
        this.cubelets.forEach(function(cubelet) { cubelet.hideIntroverts(only, soft) })
        return this
    }

    showStickers() {
        this.cubelets.forEach(function(cubelet) { cubelet.showStickers() })
        return this
    }

    hideStickers() {
        this.cubelets.forEach(function(cubelet) { cubelet.hideStickers() })
        return this
    }

    showWireframes() {
        this.cubelets.forEach(function(cubelet) { cubelet.showWireframes() })
        return this
    }

    hideWireframes() {
        this.cubelets.forEach(function(cubelet) { cubelet.hideWireframes() })
        return this
    }

    showIds() {
        this.cubelets.forEach(function(cubelet) { cubelet.showIds() })
        return this
    }

    hideIds() {
        this.cubelets.forEach(function(cubelet) { cubelet.hideIds() })
        return this
    }

    showTexts() {
        this.cubelets.forEach(function(cubelet) { cubelet.showTexts() })
        return this
    }

    hideTexts() {
        this.cubelets.forEach(function(cubelet) { cubelet.hideTexts() })
        return this
    }

    getOpacity() {
        let avg = 0
        this.cubelets.forEach(function(cubelet) { avg += cubelet.getOpacity() })
        return avg / this.cubelets.length
    }

    setOpacity(opacity, onComplete) {
        this.cubelets.forEach(function(cubelet) { cubelet.setOpacity(opacity, onComplete) })
        return this
    }

    getRadius() {
        let avg = 0
        this.cubelets.forEach(function(cubelet) { avg += cubelet.getRadius() })
        return avg / this.cubelets.length
    }

    setRadius(radius, onComplete) {
        this.cubelets.forEach(function(cubelet) { cubelet.setRadius(radius, onComplete) })
        return this
    }


}
