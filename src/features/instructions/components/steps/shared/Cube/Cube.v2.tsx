import { Box } from "@mui/material"
import {
    G,
    Path,
    Svg,
} from "svg4react"

import { AppThemeVars } from "@app/theme"

const { CubeColors } = AppThemeVars

type Face = "t" | "f" | "r"
type SquareNumber = "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9"
type CubeSquare = `${Face}${SquareNumber}`

export type CubeProps = {
    size?: number
    colors?: Partial<Record<CubeSquare | "top" | "front" | "right", string>>
}

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
                                [77,1],
                                [149, 24],
                                [146, 118],
                                [76,156],
                                [7,118],
                                [1,24],
                            ]],
                            ["Z", []],
                        ]}
                    />
                    <G
                        className="front"
                        fill={CubeColors.blue}
                    >
                        <path className="f1" d="M  3,27  22, 35 23, 65  5, 56" />
                        <path className="f2" d="M 25,36  46, 45 47, 76 26, 66" />
                        <path className="f3" d="M 49,46  74, 55 74, 88 50, 77" />
                        <path className="f4" d="M  5,60  23, 69 24, 97  7, 88" />
                        <path className="f5" d="M 26,70  47, 80 48,109 27, 98" />
                        <path className="f6" d="M 50,81  74, 92 74,122 51,110" />
                        <path className="f7" d="M  7,91  24,101 25,126  9,117" />
                        <path className="f8" d="M 27,102 48,113 48,138 28,127" />
                        <path className="f9" d="M 51,114 74,126 74,152 51,139" />
                    </G>
                    <G
                        className="top"
                        fill={CubeColors.white}
                    >
                        <path className="t1" d="M 29,18 48,24 23,32 4,25" />
                        <path className="t2" d="M 56,10 73,16 51,23 33,17" />
                        <path className="t3" d="M 77,3 95,9 76,15 58,9" />
                        <path className="t4" d="M 50,25 73,33 48,42 25,33" />
                        <path className="t5" d="M 76,17 99,24 76,32 54,24" />
                        <path className="t6" d="M 97,10 120,17 101,23 79,16" />
                        <path className="t7" d="M 76,34 100,43 76,52 51,43" />
                        <path className="t8" d="M 101,25 126,33 103,42 79,33" />
                        <path className="t9" d="M 122,18 146,25 129,32 104,24" />
                    </G>
                    <G
                        className="right"
                        fill={CubeColors.red}
                    >
                        <path className="r1" d="M 77,87 101,77 102,45 77,55" />
                        <path className="r2" d="M 126,36 125,66 104,76 105,45" />
                        <path className="r3" d="M 147,27 146,56 128,65 129,35" />
                        <path className="r4" d="M 77,122 100,110 101,81 77,91" />
                        <path className="r5" d="M 125,70 124,98 103,109 104,80" />
                        <path className="r6" d="M 146,60 145,87 127,97 128,69" />
                        <path className="r7" d="M 77,153 99,141 100,114 77,126" />
                        <path className="r8" d="M 124,102 123,128 102,140 103,113" />
                        <path className="r9" d="M 145,90 144,116 126,126 127,100" />
                    </G>
                </G>
            </Svg>
        </Box>
    )
}
