import { extend } from "lodash"

ERNO.extend(Number.prototype, {
    absolute: function() {
        return Math.abs(this)
    },
    add: function() {
        let sum = this
        Array.prototype.slice.call(arguments).forEach(function(n) {
            sum += n
        })
        return sum
    },
    arcCosine: function() {
        return Math.acos(this)
    },
    arcSine: function() {
        return Math.asin(this)
    },
    arcTangent: function() {
        return Math.atan(this)
    },
    constrain: function(a, b) {
        let higher, lower, c = this
        b = b || 0
        higher = Math.max(a, b)
        lower = Math.min(a, b)
        c = Math.min(c, higher)
        c = Math.max(c, lower)
        return c
    },
    cosine: function() {
        return Math.cos(this)
    },
    degreesToDirection: function() {
        let d = this % 360,
            directions = ['N', 'NNE', 'NE', 'NEE', 'E', 'SEE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'SWW', 'W', 'NWW', 'NW', 'NNW', 'N']
        return directions[this.scale(0, 360, 0, directions.length - 1).round()]
    },
    degreesToRadians: function() {
        return this * Math.PI / 180
    },
    divide: function() {
        let sum = this
        Array.prototype.slice.call(arguments).forEach(function(n) {
            sum /= n
        })
        return sum
    },
    isBetween: function(a, b) {
        let
            min = Math.min(a, b),
            max = Math.max(a, b)
        return (min <= this && this <= max)
    },
    lerp: function(a, b) {
        return a + (b - a) * this
    },
    log: function(base) {
        return Math.log(this) / (base === undefined ? 1 : Math.log(base))
    },
    log10: function() {
        // is this more pragmatic? ---> return ( '' + this.round() ).length;
        return Math.log(this) / Math.LN10
    },
    maximum: function(n) {
        return Math.max(this, n)
    },
    minimum: function(n) {
        return Math.min(this, n)
    },
    modulo: function(n) {
        return ((this % n) + n) % n
    },
    multiply: function() {
        let sum = this
        Array.prototype.slice.call(arguments).forEach(function(n) {
            sum *= n
        })
        return sum
    },
    normalize: function(a, b) {
        if (a == b) return 1.0
        return (this - a) / (b - a)
    },
    raiseTo: function(exponent) {
        return Math.pow(this, exponent)
    },
    radiansToDegrees: function() {
        return this * 180 / Math.PI
    },
    rand: function(n) {
        let min, max
        if (n !== undefined) {
            min = Math.min(this, n)
            max = Math.max(this, n)
            return min + Math.floor(Math.random() * (max - min))
        }
        return Math.floor(Math.random() * this)
    },
    random: function(n) {
        let min, max
        if (n !== undefined) {
            min = Math.min(this, n)
            max = Math.max(this, n)
            return min + Math.random() * (max - min)
        }
        return Math.random() * this
    },
    remainder: function(n) {
        return this % n
    },
    round: function(decimals) {
        let n = this
        decimals = decimals || 0
        n *= Math.pow(10, decimals)
        n = Math.round(n)
        n /= Math.pow(10, decimals)
        return n
    },
    roundDown: function() {
        return Math.floor(this)
    },
    roundUp: function() {
        return Math.ceil(this)
    },
    scale: function(a0, a1, b0, b1) {
        let phase = this.normalize(a0, a1)
        if (b0 == b1) return b1
        return b0 + phase * (b1 - b0)
    },
    sine: function() {
        return Math.sin(this)
    },
    subtract: function() {
        let sum = this
        Array.prototype.slice.call(arguments).forEach(function(n) {
            sum -= n
        })
        return sum
    },
    tangent: function() {
        return Math.tan(this)
    },
    toArray: function() {
        return [this.valueOf()]
    },
    toNumber: function() {
        return this.valueOf()
    },
    toPaddedString: function(padding) {
        return ('0000000000000' + String(this)).slice(-padding)
    },
    toSignedString: function() {
        let stringed = '' + this
        if (this >= 0) stringed = '+' + stringed
        return stringed
    },
    toString: function() {
        return '' + this
    }
})
ERNO.extend(String.prototype, {
    capitalize: function() {
        return this.charAt(0).toUpperCase() + this.slice(1)//.toLowerCase();
    },
    invert: function() {
        let
            s = '',
            i
        for (i = 0; i < this.length; i++) {
            if (this.charAt(i) === this.charAt(i).toUpperCase()) s += this.charAt(i).toLowerCase()
            else s += this.charAt(i).toUpperCase()
        }
        return s
    },
    justifyCenter: function(n) {
        let
            thisLeftLength = Math.round(this.length / 2),
            thisRightLength = this.length - thisLeftLength,
            containerLeftLength = Math.round(n / 2),
            containerRightLength = n - containerLeftLength,
            padLeftLength = containerLeftLength - thisLeftLength,
            padRightLength = containerRightLength - thisRightLength,
            centered = this
        if (padLeftLength > 0) {
            while (padLeftLength--) centered = ' ' + centered
        }
        else if (padLeftLength < 0) {
            centered = centered.substr(padLeftLength * -1)
        }
        if (padRightLength > 0) {
            while (padRightLength--) centered += ' '
        }
        else if (padRightLength < 0) {
            centered = centered.substr(0, centered.length + padRightLength)
        }
        return centered
    },
    justifyLeft: function(n) {
        let justified = this
        while (justified.length < n) justified = justified + ' '
        return justified
    },
    justifyRight: function(n) {
        let justified = this
        while (justified.length < n) justified = ' ' + justified
        return justified
    },
    multiply: function(n) {
        let i, s = ''
        n = _.cascade(n, 2)
        for (i = 0; i < n; i++) {
            s += this
        }
        return s
    },
    reverse: function() {
        let i, s = ''
        for (i = 0; i < this.length; i++) {
            s = this[i] + s
        }
        return s
    },
    size: function() {
        return this.length
    },
    toEntities: function() {
        let i, entities = ''
        for (i = 0; i < this.length; i++) {
            entities += '&#' + this.charCodeAt(i) + ';'
        }
        return entities
    },
    toCamelCase: function() {
        let
            split = this.split(/\W+|_+/),
            joined = split[0],
            i
        for (i = 1; i < split.length; i++)
            joined += split[i].capitalize()
        return joined
    },
    directionToDegrees: function() {
        let
            directions = ['N', 'NNE', 'NE', 'NEE', 'E', 'SEE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'SWW', 'W', 'NWW', 'NW', 'NNW', 'N'],
            i = directions.indexOf(this.toUpperCase())
        return i >= 0 ? i.scale(0, directions.length - 1, 0, 360) : Number.NaN
    },
    toArray: function() {
        return [this]
    },
    toNumber: function() {
        return parseFloat(this)
    },
    toString: function() {
        return this
    },
    toUnderscoreCase: function() {
        let underscored = this.replace(/[A-Z]+/g, function($0) {
            return '_' + $0
        })
        if (underscored.charAt(0) === '_') underscored = underscored.substr(1)
        return underscored.toLowerCase()
    },
    toUnicode: function() {
        let i, u, unicode = ''
        for (i = 0; i < this.length; i++) {
            u = this.charCodeAt(i).toString(16).toUpperCase()
            while (u.length < 4) {
                u = '0' + u
            }
            unicode += '\\u' + u
        }
        return unicode
    }
})
ERNO.extend(Array.prototype, {
    distanceTo: function(target) {
        let i, sum = 0
        if (arguments.length > 0)
            target = Array.prototype.slice.call(arguments)
        if (this.length === target.length) {
            for (i = 0; i < this.length; i++)
                sum += Math.pow(target[i] - this[i], 2)
            return Math.pow(sum, 0.5)
        }
        else return null
    },
    first: function() {
        return this[0]
    },
    last: function() {
        return this[this.length - 1]
    },
    maximum: function() {
        return Math.max.apply(null, this)
    },
    middle: function() {
        return this[Math.round((this.length - 1) / 2)]
    },
    minimum: function() {
        return Math.min.apply(null, this)
    },
    rand: function() {
        return this[Math.floor(Math.random() * this.length)]
    },
    random: function() {// Convenience here. Exactly the same as .rand().
        return this[Math.floor(Math.random() * this.length)]
    },
    // Ran into trouble here with Three.js. Will investigate....
    /*remove: function( from, to ){
        let rest = this.slice(( to || from ) + 1 || this.length )
        this.length = from < 0 ? this.length + from : from
        return this.push.apply( this, rest )
    },*/
    shuffle: function() {
        let
            copy = this,
            i = this.length,
            j,
            tempi,
            tempj
        if (i == 0) return false
        while (--i) {
            j = Math.floor(Math.random() * (i + 1))
            tempi = copy[i]
            tempj = copy[j]
            copy[i] = tempj
            copy[j] = tempi
        }
        return copy
    },
    toArray: function() {
        return this
    },
    toHtml: function() {
        let i, html = '<ul>'
        for (i = 0; i < this.length; i++) {
            if (this[i] instanceof Array)
                html += this[i].toHtml()
            else
                html += '<li>' + this[i] + '</li>'
        }
        html += '</ul>'
        return html
    },
    toText: function(depth) {
        let i, indent, text
        depth = _.cascade(depth, 0)
        indent = '\n' + '\t'.multiply(depth)
        text = ''
        for (i = 0; i < this.length; i++) {
            if (this[i] instanceof Array)
                text += indent + this[i].toText(depth + 1)
            else
                text += indent + this[i]
        }
        return text
    }
})
