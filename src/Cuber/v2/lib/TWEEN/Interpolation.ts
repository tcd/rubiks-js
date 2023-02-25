const Linear = (v, k) => {
    const m = v.length - 1
    const f = m * k
    const i = Math.floor(f)
    if (k < 0) { return Utils.Linear(v[0], v[1], f) }
    if (k > 1) { return Utils.Linear(v[m], v[m - 1], m - f) }
    return Utils.Linear(v[i], v[i + 1 > m ? m : i + 1], f - i)
}

const Bezier = (v, k) => {
    let b = 0
    const n = v.length - 1
    for (let i = 0; i <= n; i++) {
        b += Math.pow(1 - k, n - i) * Math.pow(k, i) * v[i] * Utils.Bernstein(n, i)
    }
    return b
}

const CatmullRom = function (v, k) {
    const m = v.length - 1
    let f = m * k
    let i = Math.floor(f)
    if (v[0] === v[m]) {
        if (k < 0) {
            i = Math.floor(f = m * (1 + k))
        }
        return Utils.CatmullRom(v[(i - 1 + m) % m], v[i], v[(i + 1) % m], v[(i + 2) % m], f - i)
    } else {
        if (k < 0) {
            return v[0] - (Utils.CatmullRom(v[0], v[0], v[1], v[1], -f) - v[0])
        }
        if (k > 1) {
            return v[m] - (Utils.CatmullRom(v[m], v[m], v[m - 1], v[m - 1], f - m) - v[m])
        }
        return Utils.CatmullRom(v[i ? i - 1 : 0], v[i], v[m < i + 1 ? m : i + 1], v[m < i + 2 ? m : i + 2], f - i)
    }
}

const Utils = {
    Linear: (p0, p1, t) => (p1 - p0) * t + p0,
    Bernstein: (n, i) => Utils.Factorial(n) / Utils.Factorial(i) / Utils.Factorial(n - i),
    Factorial: (function () {
        let a = [1]
        return function (n) {
            let s = 1, i
            if (a[n]) return a[n]
            for (i = n; i > 1; i--) s *= i
            return a[n] = s
        }
    })(),
    CatmullRom: function (p0, p1, p2, p3, t) {
        const v0 = (p2 - p0) * 0.5
        const v1 = (p3 - p1) * 0.5
        const t2 = t * t
        const t3 = t * t2
        return (2 * p1 - 2 * p2 + v0 + v1) * t3 + (- 3 * p1 + 3 * p2 - 2 * v0 - v1) * t2 + v0 * t + p1
    },
}

export const Interpolation = {
    Linear,
    Bezier,
    CatmullRom,
    Utils,
}
