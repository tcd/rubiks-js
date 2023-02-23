export const ERNO = {
    extend: function (obj, source) {
        // ECMAScript5 compatibility based on: http://www.nczonline.net/blog/2012/12/11/are-your-mixins-ecmascript-5-compatible/
        if (Object.keys) {
            let keys = Object.keys(source)
            for (let i = 0, il = keys.length; i < il; i++) {
                let prop = keys[i]
                Object.defineProperty(obj, prop, Object.getOwnPropertyDescriptor(source, prop))
            }
        } else {
            let safeHasOwnProperty = {}.hasOwnProperty
            for (let prop in source) {
                if (safeHasOwnProperty.call(source, prop)) {
                    obj[prop] = source[prop]
                }
            }
        }
        return obj
    },
}
