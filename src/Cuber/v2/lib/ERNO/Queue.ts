/**
 * Queues are glorified Arrays and rather useful for things like our
 * `cube.twistQueue`, `cube.taskQueue`, etc.
 *
 * @author Mark Lundin - http://www.mark-lundin.com
 * @author Stewart Smith
 */
export class Queue {

    public history: any[]
    public useHistory: boolean
    public future: any[]
    public isReady: boolean
    public isLooping: boolean

    public validate

    constructor(validation) {
        // Do we want to run a validation routine on objects being stored in
        // this ERNO.Queue?
        // If so you can send the function as an argument to the
        // constructor or create this property later on your own.
        if (validation !== undefined && validation instanceof Function) {
            this.validate = validation
        }
        // The rest is vanilla.
        this.history = []
        this.useHistory = true
        this.future = []
        this.isReady = true
        this.isLooping = false
    }

    // The idea here with .add() is that .validate() will always return an Array.
    // The reason for this is that the validator may decide it needs to add more
    // than one element to the ERNO.Queue. This allows it to do so.
    public add(...elements) {
        if (this.validate !== undefined && this.validate instanceof Function) elements = this.validate(elements)
        if (elements instanceof Array) {
            elements.forEach(function(element) {
                this.future.push(element)
            }.bind(this))
        }
        return this.future
    }

    public remove(...elements) {
        if (elements instanceof Array) {
            elements.forEach(function(element) {
                this.future = this.future.filter(function(futureElement) {
                    return futureElement != element
                })
            }.bind(this))
        }
        return this.future
    }

    public purge(...elements) {
        if (elements instanceof Array) {
            elements.forEach(function(element) {
                this.history = this.history.filter(function(historyElement) {
                    return historyElement != element
                })
            }.bind(this))
        }
        return this.history
    }

    public empty(emptyHistory) {
        this.future = []
        if (emptyHistory) {
            this.history = []
        }
    }

    public do() {
        if (this.future.length) {
            const element = this.future.shift()
            if (this.useHistory) {
                this.history.push(element)
            }
            return element
        } else if (this.isLooping) {
            this.future = this.history.slice()
            this.history = []
        }
    }

    public undo() {
        if (this.history.length) {
            const element = this.history.pop()
            this.future.unshift(element)
            return element
        }
    }

    public redo() {
        return this.do()
    }
}
