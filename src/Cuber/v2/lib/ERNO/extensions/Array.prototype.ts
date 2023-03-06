Array.prototype.distanceTo = function(...target) {
    let sum = 0
    // if (arguments.length > 0) {
    //     target = Array.prototype.slice.call(arguments)
    // }
    if (this.length === target.length) {
        for (let i = 0; i < this.length; i++) {
            sum += Math.pow(target[i] - this[i], 2)
        }
        return Math.pow(sum, 0.5)
    } else {
        return null
    }
}

Array.prototype.first = function() {
    return this[0]
}

Array.prototype.last = function() {
    return this[this.length - 1]
}

Array.prototype.maximum = function() {
    return Math.max.apply(null, this)
}

Array.prototype.middle = function() {
    return this[Math.round((this.length - 1) / 2)]
}

Array.prototype.minimum = function() {
    return Math.min.apply(null, this)
}

Array.prototype.rand = function() {
    return this[Math.floor(Math.random() * this.length)]
}

// Convenience here. Exactly the same as .rand().
Array.prototype.random = function() {
    return this[Math.floor(Math.random() * this.length)]
}

// // Ran into trouble here with Three.js. Will investigate....
// /*remove: function( from, to ){
//     let rest = this.slice(( to || from ) + 1 || this.length )
//     this.length = from < 0 ? this.length + from : from
//     return this.push.apply( this, rest )
// },*/

Array.prototype.shuffle = function() {
    const copy = [...this]
    let i = this.length
    let j
    let tempi
    let tempj
    if (i == 0) {
        return false
    }
    while (--i) {
        j = Math.floor(Math.random() * (i + 1))
        tempi = copy[i]
        tempj = copy[j]
        copy[i] = tempj
        copy[j] = tempi
    }
    return copy
}

Array.prototype.toArray = function() {
    return this
}

Array.prototype.toHtml = function(): string {
    let html = "<ul>"
    for (let i = 0; i < this.length; i++) {
        if (this[i] instanceof Array) {
            html += this[i].toHtml()
        } else {
            html += `<li>${this[i]}</li>`
        }
    }
    html += "</ul>"
    return html
}

Array.prototype.toText = function(depth: number): string {
    const cascade = (...args: any[]) => {
        for (let i = 0; i < args.length; i++) {
            if (args[i] !== undefined) {
                return args[i]
            }
        }
        return false
    }
    depth = cascade(depth, 0)
    const indent = "\n" + "\t".multiply(depth)
    let text = ""
    for (let i = 0; i < this.length; i++) {
        if (this[i] instanceof Array) {
            text += indent + this[i].toText(depth + 1)
        } else {
            text += indent + this[i]
        }
    }
    return text
}
