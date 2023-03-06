/**
 * ## COLORS
 *
 * Here's a little bootstrapping to create our Color constants.
 *
 * At first it seemed like overkill, but then as the solvers and inspectors
 * moved forward having these objects available became highly desirable.
 *
 * ~~Sure, ES5 doesn't really have constants but the all-caps alerts you
 * to the fact that them than let-ables ought not to be messed with.~~
 *
 * @author [Mark Lundin](http://www.mark-lundin.com)
 * @author Stewart Smith
 */
export class Color {

    public name: string
    public initial: string
    public hex: string
    /** Foreground */
    public styleF: string
    /** Background */
    public styleB: string

    constructor(name: string, initial: string, hex: string, styleF: string, styleB: string) {
        this.name = name
        this.initial = initial
        this.hex = hex
        this.styleF = styleF
        this.styleB = styleB
    }
}

const _fgWhite = "rgba( 255, 255, 255, 0.9 )"
const _fgBlack = "rgba( 0, 0, 0, 0.5 )"

const WHITE = new Color(
    "white",
    "W",
    "#FFF",
    "font-weight: bold; color: #888",
    `background-color: #F3F3F3; color: ${_fgBlack}`,
)

const ORANGE = new Color(
    "orange",
    "O",
    "#F60",
    "font-weight: bold; color: #F60",
    `background-color: #F60; color: ${_fgWhite}`,
)

const BLUE = new Color(
    "blue",
    "B",
    "#00D",
    "font-weight: bold; color: #00D",
    `background-color: #00D; color: ${_fgWhite}`,
)

const RED = new Color(
    "red",
    "R",
    "#F00",
    "font-weight: bold; color: #F00",
    `background-color: #F00; color: ${_fgWhite}`,
)

const GREEN = new Color(
    "green",
    "G",
    "#0A0",
    "font-weight: bold; color: #0A0",
    `background-color: #0A0; color: ${_fgWhite}`,
)

const YELLOW = new Color(
    "yellow",
    "Y",
    "#FE0",
    "font-weight: bold; color: #ED0",
    `background-color: #FE0; color: ${_fgBlack}`,
)

const COLORLESS = new Color(
    "NA",
    "X",
    "#DDD",
    "color: #EEE",
    "color: #DDD",
)

export const COLORS = {
    WHITE,
    ORANGE,
    BLUE,
    RED,
    GREEN,
    YELLOW,
    COLORLESS,
}
