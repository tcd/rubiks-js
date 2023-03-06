String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1)//.toLowerCase();
}

String.prototype.invert = function() {
    let s = ""
    for (let i = 0; i < this.length; i++) {
        if (this.charAt(i) === this.charAt(i).toUpperCase()) {
            s += this.charAt(i).toLowerCase()
        } else {
            s += this.charAt(i).toUpperCase()
        }
    }
    return s
}

String.prototype.justifyCenter = function(n: number) {
    const thisLeftLength = Math.round(this.length / 2)
    const thisRightLength = this.length - thisLeftLength
    const containerLeftLength = Math.round(n / 2)
    const containerRightLength = n - containerLeftLength
    let padLeftLength = containerLeftLength - thisLeftLength
    let padRightLength = containerRightLength - thisRightLength
    let centered = `${this}`
    if (padLeftLength > 0) {
        while (padLeftLength--) { centered = " " + centered }
    }
    else if (padLeftLength < 0) {
        centered = centered.substr(padLeftLength * -1)
    }
    if (padRightLength > 0) {
        while (padRightLength--) { centered += " " }
    }
    else if (padRightLength < 0) {
        centered = centered.substr(0, centered.length + padRightLength)
    }
    return centered
}

String.prototype.justifyLeft = function(n) {
    let justified = `${this}`
    while (justified.length < n) {
        justified = justified + " "
    }
    return justified
}

String.prototype.justifyRight = function(n) {
    let justified = `${this}`
    while (justified.length < n) { justified = " " + justified }
    return justified
}

String.prototype.multiply = function(n) {
    let s = ""
    n = _.cascade(n, 2)
    for (let i = 0; i < n; i++) {
        s += this
    }
    return s
}

String.prototype.reverse = function() {
    let s = ""
    for (let i = 0; i < this.length; i++) {
        s = this[i] + s
    }
    return s
}

String.prototype.size = function() {
    return this.length
}

String.prototype.toEntities = function() {
    let entities = ""
    for (let i = 0; i < this.length; i++) {
        entities += "&#" + this.charCodeAt(i) + ";"
    }
    return entities
}

String.prototype.toCamelCase = function() {
    const split = this.split(/\W+|_+/)
    let joined = split[0]
    for (let i = 1; i < split.length; i++) {
        joined += split[i].capitalize()
    }
    return joined
}

String.prototype.directionToDegrees = function() {
    const directions = ["N", "NNE", "NE", "NEE", "E", "SEE", "SE", "SSE", "S", "SSW", "SW", "SWW", "W", "NWW", "NW", "NNW", "N"]
    const i = directions.indexOf(this.toUpperCase())
    return i >= 0 ? i.scale(0, directions.length - 1, 0, 360) : NaN
}

String.prototype.toArray = function() {
    return [this]
}

String.prototype.toNumber = function() {
    return parseFloat(this)
}

String.prototype.toString = function() {
    return this
}

String.prototype.toUnderscoreCase = function() {
    let underscored = `${this}`.replace(/[A-Z]+/g, function($0) {
        return "_" + $0
    })
    if (underscored.charAt(0) === "_") {
        underscored = underscored.substr(1)
    }
    return underscored.toLowerCase()
}

String.prototype.toUnicode = function() {
    let u
    let unicode = ""
    for (let i = 0; i < this.length; i++) {
        u = this.charCodeAt(i).toString(16).toUpperCase()
        while (u.length < 4) {
            u = `0${u}`
        }
        unicode += `\\u${u}`
    }
    return unicode
}
