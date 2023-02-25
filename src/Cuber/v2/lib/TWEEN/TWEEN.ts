export class TWEEN {

    public get REVISION(): string { return "12" }

    private _tweens

    constructor() {
        this._tweens = []
    }

    public getAll() {
        return this._tweens
    }

    public removeAll() {
        this._tweens = []
    }

    public add(tween) {
        this._tweens.push(tween)
    }

    public remove(tween) {
        let i = this._tweens.indexOf(tween)
        if (i !== -1) {
            this._tweens.splice(i, 1)
        }
    }

    public update(time) {
        if (this._tweens.length === 0) {
            return false
        }
        let i = 0
        time = time !== undefined ? time : (typeof window !== "undefined" && window.performance !== undefined && window.performance.now !== undefined ? window.performance.now() : Date.now())
        while (i < this._tweens.length) {
            if (this._tweens[i].update(time)) {
                i++
            } else {
                this._tweens.splice(i, 1)
            }
        }
        return true
    }
}
