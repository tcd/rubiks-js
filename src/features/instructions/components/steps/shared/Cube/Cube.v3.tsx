import { Box } from "@mui/material"
import {
    G,
    Path,
    Svg,
} from "svg4react"

import { AppThemeVars } from "@app/theme"

const { CubeColors } = AppThemeVars

import type { CubeProps } from "./types"

export const Cube = (props: CubeProps): JSX.Element => {

    const {
        size = 200,
        colors = {},
    } = props

    const colorCss: any = {}
    for (const [k, v] of Object.entries(colors)) {
        colorCss[`& .${k}`] = {
            fill: v,
        }
    }

    return (
        <Box
            sx={{
                width:  size,
                height: size,
                ...colorCss,
            }}
        >
            <Svg
                size="100%"
                vb={[150, 157]}
            >
                <G className="root">
                    <Path
                        fill="#000"
                        stroke="#000"
                        // d="M 77,1 149,24 146,118 77,156 7,118 1,24 z"
                        strokeLinejoin="round"
                        commands={[
                            ["M", [
                                [ 77,   1],
                                [149,  24],
                                [146, 118],
                                [ 76, 156],
                                [  7, 118],
                                [  1,  24],
                            ]],
                            ["Z", []],
                        ]}
                    />
                    <G
                        className="front"
                        fill={CubeColors.blue}
                    >
                        <Path className="f1" commands={[["M", [[ 3, 27],  [22,  35], [23,  65], [ 5,  56]]]]} />
                        <Path className="f2" commands={[["M", [[25, 36],  [46,  45], [47,  76], [26,  66]]]]} />
                        <Path className="f3" commands={[["M", [[49, 46],  [74,  55], [74,  88], [50,  77]]]]} />
                        <Path className="f4" commands={[["M", [[ 5, 60],  [23,  69], [24,  97], [ 7,  88]]]]} />
                        <Path className="f5" commands={[["M", [[26, 70],  [47,  80], [48, 109], [27,  98]]]]} />
                        <Path className="f6" commands={[["M", [[50, 81],  [74,  92], [74, 122], [51, 110]]]]} />
                        <Path className="f7" commands={[["M", [[ 7, 91],  [24, 101], [25, 126], [ 9, 117]]]]} />
                        <Path className="f8" commands={[["M", [[27, 102], [48, 113], [48, 138], [28, 127]]]]} />
                        <Path className="f9" commands={[["M", [[51, 114], [74, 126], [74, 152], [51, 139]]]]} />
                    </G>
                    <G
                        className="top"
                        fill={CubeColors.white}
                    >
                        <Path className="t1" commands={[["M", [[ 29, 18], [ 48, 24], [ 23, 32], [  4, 25]]]]} />
                        <Path className="t2" commands={[["M", [[ 56, 10], [ 73, 16], [ 51, 23], [ 33, 17]]]]} />
                        <Path className="t3" commands={[["M", [[ 77,  3], [ 95,  9], [ 76, 15], [ 58,  9]]]]} />
                        <Path className="t4" commands={[["M", [[ 50, 25], [ 73, 33], [ 48, 42], [ 25, 33]]]]} />
                        <Path className="t5" commands={[["M", [[ 76, 17], [ 99, 24], [ 76, 32], [ 54, 24]]]]} />
                        <Path className="t6" commands={[["M", [[ 97, 10], [120, 17], [101, 23], [ 79, 16]]]]} />
                        <Path className="t7" commands={[["M", [[ 76, 34], [100, 43], [ 76, 52], [ 51, 43]]]]} />
                        <Path className="t8" commands={[["M", [[101, 25], [126, 33], [103, 42], [ 79, 33]]]]} />
                        <Path className="t9" commands={[["M", [[122, 18], [146, 25], [129, 32], [104, 24]]]]} />
                    </G>
                    <G
                        className="right"
                        fill={CubeColors.red}
                    >
                        <Path className="r1" commands={[["M", [[ 77,  87], [101,  77], [102,  45], [ 77,  55]]]]} />
                        <Path className="r2" commands={[["M", [[126,  36], [125,  66], [104,  76], [105,  45]]]]} />
                        <Path className="r3" commands={[["M", [[147,  27], [146,  56], [128,  65], [129,  35]]]]} />
                        <Path className="r4" commands={[["M", [[ 77, 122], [100, 110], [101,  81], [ 77,  91]]]]} />
                        <Path className="r5" commands={[["M", [[125,  70], [124,  98], [103, 109], [104,  80]]]]} />
                        <Path className="r6" commands={[["M", [[146,  60], [145,  87], [127,  97], [128,  69]]]]} />
                        <Path className="r7" commands={[["M", [[ 77, 153], [ 99, 141], [100, 114], [ 77, 126]]]]} />
                        <Path className="r8" commands={[["M", [[124, 102], [123, 128], [102, 140], [103, 113]]]]} />
                        <Path className="r9" commands={[["M", [[145,  90], [144, 116], [126, 126], [127, 100]]]]} />
                    </G>
                </G>
            </Svg>
        </Box>
    )
}
