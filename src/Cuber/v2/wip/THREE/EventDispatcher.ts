/**
 * https://github.com/mrdoob/eventdispatcher.js/
 */
export class EventDispatcher {

    public _listeners: any

    constructor() { }

    public apply(object) {
        object.addEventListener = THREE.EventDispatcher.prototype.addEventListener
        object.hasEventListener = THREE.EventDispatcher.prototype.hasEventListener
        object.removeEventListener = THREE.EventDispatcher.prototype.removeEventListener
        object.dispatchEvent = THREE.EventDispatcher.prototype.dispatchEvent
    }

    public addEventListener(type, listener) {
        if (this._listeners === undefined) this._listeners = {}
        const listeners = this._listeners
        if (listeners[type] === undefined) {
            listeners[type] = []
        }
        if (listeners[type].indexOf(listener) === - 1) {
            listeners[type].push(listener)
        }
    }

    public hasEventListener(type, listener) {
        if (this._listeners === undefined) return false
        const listeners = this._listeners
        if (listeners[type] !== undefined && listeners[type].indexOf(listener) !== - 1) {
            return true
        }
        return false
    }

    public removeEventListener(type, listener) {
        if (this._listeners === undefined) return
        const listeners = this._listeners
        const listenerArray = listeners[type]
        if (listenerArray !== undefined) {
            const index = listenerArray.indexOf(listener)
            if (index !== - 1) {
                listenerArray.splice(index, 1)
            }
        }
    }

    // FIXME: IIFE
    public dispatchEvent() {
        const array = []
        return function(event) {
            if (this._listeners === undefined) return
            const listeners = this._listeners
            const listenerArray = listeners[event.type]
            if (listenerArray !== undefined) {
                event.target = this
                const length = listenerArray.length
                for (let i = 0; i < length; i++) {
                    array[i] = listenerArray[i]
                }
                for (let i = 0; i < length; i++) {
                    array[i].call(this, event)
                }
            }
        }
    }

}
