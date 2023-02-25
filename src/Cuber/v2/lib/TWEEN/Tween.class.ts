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
    public _chainedTweens: unknown[]
    public _onStartCallback
    public _onStartCallbackFired: boolean
    public _onUpdateCallback
    public _onCompleteCallback

    constructor(object) {
        let _object = object
        let _valuesStart = {}
        let _valuesEnd = {}
        let _valuesStartRepeat = {}
        let _duration = 1000
        let _repeat = 0
        let _yoyo = false
        let _isPlaying = false
        let _reversed = false
        let _delayTime = 0
        let _startTime = null
        let _easingFunction = Easing.Linear.None
        let _interpolationFunction = Interpolation.Linear
        let _chainedTweens = []
        let _onStartCallback = null
        let _onStartCallbackFired = false
        let _onUpdateCallback = null
        let _onCompleteCallback = null
        // Set all starting values present on the target object
        for (let field in object) {
            _valuesStart[field] = parseFloat(object[field], 10)
        }
        this.to = function(properties, duration) {
            if (duration !== undefined) {
                _duration = duration
            }
            _valuesEnd = properties
            return this
        }
        this.start = function(time) {
            TWEEN.add(this)
            _isPlaying = true
            _onStartCallbackFired = false
            _startTime = time !== undefined ? time : (typeof window !== "undefined" && window.performance !== undefined && window.performance.now !== undefined ? window.performance.now() : Date.now())
            _startTime += _delayTime
            for (let property in _valuesEnd) {
                // check if an Array was provided as property value
                if (_valuesEnd[property] instanceof Array) {
                    if (_valuesEnd[property].length === 0) {
                        continue
                    }
                    // create a local copy of the Array with the start value at the front
                    _valuesEnd[property] = [_object[property]].concat(_valuesEnd[property])
                }
                _valuesStart[property] = _object[property]
                if ((_valuesStart[property] instanceof Array) === false) {
                    _valuesStart[property] *= 1.0 // Ensures we're using numbers, not strings
                }
                _valuesStartRepeat[property] = _valuesStart[property] || 0
            }
            return this
        }
        this.stop = function() {
            if (!_isPlaying) {
                return this
            }
            TWEEN.remove(this)
            _isPlaying = false
            this.stopChainedTweens()
            return this
        }
        this.stopChainedTweens = function() {
            for (let i = 0, numChainedTweens = _chainedTweens.length; i < numChainedTweens; i++) {
                _chainedTweens[i].stop()
            }
        }
        this.delay = function(amount) {
            _delayTime = amount
            return this
        }
        this.repeat = function(times) {
            _repeat = times
            return this
        }
        this.yoyo = function(yoyo) {
            _yoyo = yoyo
            return this
        }
        this.easing = function(easing) {
            _easingFunction = easing
            return this
        }
        this.interpolation = function(interpolation) {
            _interpolationFunction = interpolation
            return this
        }
        this.chain = function() {
            _chainedTweens = arguments
            return this
        }
        this.onStart = function(callback) {
            _onStartCallback = callback
            return this
        }
        this.onUpdate = function(callback) {
            _onUpdateCallback = callback
            return this
        }
        this.onComplete = function(callback) {
            _onCompleteCallback = callback
            return this
        }
        this.update = function(time) {
            let property
            if (time < _startTime) {
                return true
            }
            if (_onStartCallbackFired === false) {
                if (_onStartCallback !== null) {
                    _onStartCallback.call(_object)
                }
                _onStartCallbackFired = true
            }
            let elapsed = (time - _startTime) / _duration
            elapsed = elapsed > 1 ? 1 : elapsed
            let value = _easingFunction(elapsed)
            for (property in _valuesEnd) {
                let start = _valuesStart[property] || 0
                let end = _valuesEnd[property]
                if (end instanceof Array) {
                    _object[property] = _interpolationFunction(end, value)
                } else {
                    // Parses relative end values with start as base (e.g.: +10, -3)
                    if (typeof (end) === "string") {
                        end = start + parseFloat(end, 10)
                    }
                    // protect against non numeric properties.
                    if (typeof (end) === "number") {
                        _object[property] = start + (end - start) * value
                    }
                }
            }
            if (_onUpdateCallback !== null) {
                _onUpdateCallback.call(_object, value)
            }
            if (elapsed == 1) {
                if (_repeat > 0) {
                    if (isFinite(_repeat)) {
                        _repeat--
                    }
                    // reassign starting values, restart by making startTime = now
                    for (property in _valuesStartRepeat) {
                        if (typeof (_valuesEnd[property]) === "string") {
                            _valuesStartRepeat[property] = _valuesStartRepeat[property] + parseFloat(_valuesEnd[property], 10)
                        }
                        if (_yoyo) {
                            let tmp = _valuesStartRepeat[property]
                            _valuesStartRepeat[property] = _valuesEnd[property]
                            _valuesEnd[property] = tmp
                            _reversed = !_reversed
                        }
                        _valuesStart[property] = _valuesStartRepeat[property]
                    }
                    _startTime = time + _delayTime
                    return true
                } else {
                    if (_onCompleteCallback !== null) {
                        _onCompleteCallback.call(_object)
                    }
                    for (let i = 0, numChainedTweens = _chainedTweens.length; i < numChainedTweens; i++) {
                        _chainedTweens[i].start(time)
                    }
                    return false
                }
            }
            return true
        }
    }

}
