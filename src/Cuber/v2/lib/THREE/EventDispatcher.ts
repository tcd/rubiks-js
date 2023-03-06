/**
 * https://github.com/mrdoob/eventdispatcher.js/
 */
export class EventDispatcher {

    public _listeners: any

    constructor() { }

    public apply(object) {
        object.addEventListener    = EventDispatcher.prototype.addEventListener
        object.hasEventListener    = EventDispatcher.prototype.hasEventListener
        object.removeEventListener = EventDispatcher.prototype.removeEventListener
        object.dispatchEvent       = EventDispatcher.prototype.dispatchEvent
    }

    public addEventListener(type: string, listener: __<Function>) {
        if (this._listeners === undefined) this._listeners = {}
        const listeners = this._listeners
        if (listeners[type] === undefined) {
            listeners[type] = []
        }
        if (listeners[type].indexOf(listener) === - 1) {
            listeners[type].push(listener)
        }
    }

    public hasEventListener(type: string, listener: __<Function>): boolean {
        if (this._listeners === undefined) { return false }
        const listeners = this._listeners
        if (listeners[type] !== undefined && listeners[type].indexOf(listener) !== - 1) {
            return true
        }
        return false
    }

    public removeEventListener(type: string, listener: __<Function>) {
        if (this._listeners === undefined) { return }
        const listeners = this._listeners
        const listenerArray = listeners[type]
        if (listenerArray !== undefined) {
            const index = listenerArray.indexOf(listener)
            if (index !== - 1) {
                listenerArray.splice(index, 1)
            }
        }
    }

    public dispatchEvent(event) {
        const array = []
        if (this._listeners === undefined) { return }
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
