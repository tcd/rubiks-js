import { Easing } from "./Easing"
import { Interpolation } from "./Interpolation"

export class Tween {

    public _object
    public _valuesStart
    public _valuesEnd
    public _valuesStartRepeat
    public _duration: number
    public _repeat: number
    public _yoyo: boolean
    public _isPlaying: boolean
    public _reversed: boolean
    public _delayTime: number
    public _startTime
    public _easingFunction: number
    public _interpolationFunction
    public _chainedTweens: Tween[]
    public _onStartCallbackFired: boolean
    public _onStartCallback: Function
    public _onUpdateCallback: Function
    public _onCompleteCallback: Function

    constructor(object) {
        this._object = object
        this._valuesStart = {}
        this._valuesEnd = {}
        this._valuesStartRepeat = {}
        this._duration = 1000
        this._repeat = 0
        this._yoyo = false
        this._isPlaying = false
        this._reversed = false
        this._delayTime = 0
        this._startTime = null
        this._easingFunction = Easing.Linear.None
        this._interpolationFunction = Interpolation.Linear
        this._chainedTweens = []
        this._onStartCallback = null
        this._onStartCallbackFired = false
        this._onUpdateCallback = null
        this._onCompleteCallback = null
        // Set all starting values present on the target object
        for (const field in object) {
            this._valuesStart[field] = parseFloat(object[field], 10)
        }
    }

    public to(properties, duration) {
        if (duration !== undefined) {
            this._duration = duration
        }
        this._valuesEnd = properties
        return this
    }

    public start(time) {
        TWEEN.add(this)
        this._isPlaying = true
        this._onStartCallbackFired = false
        this._startTime = time !== undefined ? time : (typeof window !== "undefined" && window.performance !== undefined && window.performance.now !== undefined ? window.performance.now() : Date.now())
        this._startTime += this._delayTime
        for (const property in this._valuesEnd) {
            // check if an Array was provided as property value
            if (this._valuesEnd[property] instanceof Array) {
                if (this._valuesEnd[property].length === 0) {
                    continue
                }
                // create a local copy of the Array with the start value at the front
                this._valuesEnd[property] = [this._object[property]].concat(this._valuesEnd[property])
            }
            this._valuesStart[property] = this._object[property]
            if ((this._valuesStart[property] instanceof Array) === false) {
                this._valuesStart[property] *= 1.0 // Ensures we're using numbers, not strings
            }
            this._valuesStartRepeat[property] = this._valuesStart[property] || 0
        }
        return this
    }


    public stop() {
        if (!this._isPlaying) {
            return this
        }
        TWEEN.remove(this)
        this._isPlaying = false

        this.stopChainedTweens()
        return this
    }

    public stopChainedTweens() {
        for (let i = 0, numChainedTweens = this._chainedTweens.length; i < numChainedTweens; i++) {
            this._chainedTweens[i].stop()
        }
    }

    public delay(amount) {
        this._delayTime = amount
        return this
    }

    public repeat(times: number) {
        this._repeat = times
        return this
    }

    public yoyo(yoyo: boolean) {
        this._yoyo = yoyo
        return this
    }

    public easing(easing: number) {
        this._easingFunction = easing
        return this
    }

    public interpolation(interpolation) {
        this._interpolationFunction = interpolation
        return this
    }

    public chain(...args) {
        this._chainedTweens = args
        return this
    }

    public onStart(callback) {
        this._onStartCallback = callback
        return this
    }

    public onUpdate(callback) {
        this._onUpdateCallback = callback
        return this
    }

    public onComplete(callback) {
        this._onCompleteCallback = callback
        return this
    }

    public update(time) {
        let property
        if (time < this._startTime) {
            return true
        }
        if (this._onStartCallbackFired === false) {
            if (this._onStartCallback !== null) {
                this._onStartCallback.call(this._object)
            }
            this._onStartCallbackFired = true
        }
        let elapsed = (time - this._startTime) / this._duration
        elapsed = elapsed > 1 ? 1 : elapsed
        const value = this._easingFunction(elapsed)
        for (property in this._valuesEnd) {
            const start = this._valuesStart[property] || 0
            let end = this._valuesEnd[property]
            if (end instanceof Array) {
                this._object[property] = this._interpolationFunction(end, value)
            } else {
                // Parses relative end values with start as base (e.g.: +10, -3)
                if (typeof (end) === "string") {
                    end = start + parseFloat(end, 10)
                }
                // protect against non numeric properties.
                if (typeof (end) === "number") {
                    this._object[property] = start + (end - start) * value
                }
            }
        }
        if (this._onUpdateCallback !== null) {
            this._onUpdateCallback.call(this._object, value)
        }
        if (elapsed == 1) {
            if (this._repeat > 0) {
                if (isFinite(this._repeat)) {
                    this._repeat--
                }
                // reassign starting values, restart by making startTime = now
                for (property in this._valuesStartRepeat) {
                    if (typeof (this._valuesEnd[property]) === "string") {
                        this._valuesStartRepeat[property] = this._valuesStartRepeat[property] + parseFloat(this._valuesEnd[property], 10)
                    }
                    if (this._yoyo) {
                        const tmp = this._valuesStartRepeat[property]
                        this._valuesStartRepeat[property] = this._valuesEnd[property]
                        this._valuesEnd[property] = tmp
                        this._reversed = !this._reversed
                    }
                    this._valuesStart[property] = this._valuesStartRepeat[property]
                }
                this._startTime = time + this._delayTime
                return true
            } else {
                if (this._onCompleteCallback !== null) {
                    this._onCompleteCallback.call(this._object)
                }
                for (let i = 0, numChainedTweens = this._chainedTweens.length; i < numChainedTweens; i++) {
                    this._chainedTweens[i].start(time)
                }
                return false
            }
        }
        return true
    }

}
