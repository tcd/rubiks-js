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

    public add(...cubeletsToAdd) {
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

    public remove(cubeletToRemove) {
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
    public isFlagged(property) {
        let count = 0
        this.cubelets.forEach(function(cubelet) {
            count += cubelet[property] ? 1 : 0
        })
        return count
    }

    public isTweening() { return this.isFlagged("isTweening") }
    public isEngagedX() { return this.isFlagged("isEngagedX") }
    public isEngagedY() { return this.isFlagged("isEngagedY") }
    public isEngagedZ() { return this.isFlagged("isEngagedZ") }

    public isEngaged() {
        return this.isEngagedX() + this.isEngagedY() + this.isEngagedZ()
    }

    // Search functions.
    // What Cubelets in this Group have a particular color?
    // How about all of these three colors?
    // And index? address? Solver uses these a lot.
    public hasProperty(property, value) {
        const results = new Group()
        this.cubelets.forEach((cubelet) => {
            if (cubelet[property] === value) {
                results.add(cubelet)
            }
        })
        return results
    }

    public hasId(id) {
        return this.hasProperty("id", id)
    }

    public hasAddress(address) {
        return this.hasProperty("address", address)
    }

    public hasType(type) {
        return this.hasProperty("type", type)
    }

    public hasColor(color) {
        const
            results = new Group()
        this.cubelets.forEach((cubelet) => {
            if (cubelet.hasColor(color)) {
                results.add(cubelet)
            }
        })
        return results
    }

    /**
     * this function implies AND rather than OR, XOR, etc.
     */
    public hasColors(...colors) {
        const results = new Group()
        this.cubelets.forEach((cubelet) => {
            if (cubelet.hasColors(...colors)) {
                results.add(cubelet)
            }
        })
        return results
    }

    // cube.slices.front.isSolved("front")
    // cube.slices.front.up.isSolved("up")
    public isSolved(face = undefined) {
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

    // =========================================================================
    // Visual switches
    //
    // Take this group and hide all the stickers, turn on wireframe mode, etc.
    // =========================================================================

    public show() {
        this.cubelets.forEach((cubelet) => cubelet.show())
        return this
    }

    public hide() {
        this.cubelets.forEach((cubelet) => cubelet.hide())
        return this
    }

    public showPlastics() {
        this.cubelets.forEach((cubelet) => cubelet.showPlastics())
        return this
    }

    public hidePlastics() {
        this.cubelets.forEach((cubelet) => cubelet.hidePlastics())
        return this
    }

    public showExtroverts() {
        this.cubelets.forEach((cubelet) => cubelet.showExtroverts())
        return this
    }

    public hideExtroverts() {
        this.cubelets.forEach((cubelet) => cubelet.hideExtroverts())
        return this
    }

    public showIntroverts(only, soft) {
        this.cubelets.forEach((cubelet) => cubelet.showIntroverts(only, soft))
        return this
    }

    public hideIntroverts(only, soft) {
        this.cubelets.forEach((cubelet) => cubelet.hideIntroverts(only, soft))
        return this
    }

    public showStickers() {
        this.cubelets.forEach((cubelet) => cubelet.showStickers())
        return this
    }

    public hideStickers() {
        this.cubelets.forEach((cubelet) => cubelet.hideStickers())
        return this
    }

    public showWireframes() {
        this.cubelets.forEach((cubelet) => cubelet.showWireframes())
        return this
    }

    public hideWireframes() {
        this.cubelets.forEach((cubelet) => cubelet.hideWireframes())
        return this
    }

    public showIds() {
        this.cubelets.forEach((cubelet) => cubelet.showIds())
        return this
    }

    public hideIds() {
        this.cubelets.forEach((cubelet) => cubelet.hideIds())
        return this
    }

    public showTexts() {
        this.cubelets.forEach((cubelet) => cubelet.showTexts())
        return this
    }

    public hideTexts() {
        this.cubelets.forEach((cubelet) => cubelet.hideTexts())
        return this
    }

    public getOpacity() {
        let avg = 0
        this.cubelets.forEach((cubelet) => avg += cubelet.getOpacity())
        return avg / this.cubelets.length
    }

    public setOpacity(opacity, onComplete) {
        this.cubelets.forEach((cubelet) => cubelet.setOpacity(opacity, onComplete))
        return this
    }

    public getRadius() {
        let avg = 0
        this.cubelets.forEach((cubelet) => avg += cubelet.getRadius())
        return avg / this.cubelets.length
    }

    public setRadius(radius, onComplete) {
        this.cubelets.forEach((cubelet) => cubelet.setRadius(radius, onComplete))
        return this
    }
}
