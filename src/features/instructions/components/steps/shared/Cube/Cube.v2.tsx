import { Box } from "@mui/material"
import {
    G,
    Svg,
} from "svg4react"

import { AppThemeVars } from "@app/theme"

const { CubeColors } = AppThemeVars

export type CubeProps = {
    size?: number
}

export const Cube = (props: CubeProps): JSX.Element => {

    const {
        size = 100,
    } = props

    return (
        <Box
            sx={{
                width:  size,
                height: size,
            }}
        >
            <Svg
                size="100%"
                vb={[150, 157]}
            >
                <G className="root">
                    <path fill="#000" d="M 77,1 149,24 146,118 77,156 7,118 1,24 z" />
                    <G
                        className="front"
                        fill={CubeColors.blue}
                    >
                        <path d="M  3,27  22, 35 23, 65  5, 56" />
                        <path d="M 25,36  46, 45 47, 76 26, 66" />
                        <path d="M 49,46  74, 55 74, 88 50, 77" />
                        <path d="M  5,60  23, 69 24, 97  7, 88" />
                        <path d="M 26,70  47, 80 48,109 27, 98" />
                        <path d="M 50,81  74, 92 74,122 51,110" />
                        <path d="M  7,91  24,101 25,126  9,117" />
                        <path d="M 27,102 48,113 48,138 28,127" />
                        <path d="M 51,114 74,126 74,152 51,139" />
                    </G>
                    <G
                        className="top"
                        fill={CubeColors.white}
                    >
                        <path d="M 29,18 48,24 23,32 4,25" />
                        <path d="M 56,10 73,16 51,23 33,17" />
                        <path d="M 77,3 95,9 76,15 58,9" />
                        <path d="M 50,25 73,33 48,42 25,33" />
                        <path d="M 76,17 99,24 76,32 54,24" />
                        <path d="M 97,10 120,17 101,23 79,16" />
                        <path d="M 76,34 100,43 76,52 51,43" />
                        <path d="M 101,25 126,33 103,42 79,33" />
                        <path d="M 122,18 146,25 129,32 104,24" />
                    </G>
                    <G
                        className="top"
                        fill={CubeColors.red}
                    >
                        <path d="M 77,87 101,77 102,45 77,55" />
                        <path d="M 126,36 125,66 104,76 105,45" />
                        <path d="M 147,27 146,56 128,65 129,35" />
                        <path d="M 77,122 100,110 101,81 77,91" />
                        <path d="M 125,70 124,98 103,109 104,80" />
                        <path d="M 146,60 145,87 127,97 128,69" />
                        <path d="M 77,153 99,141 100,114 77,126" />
                        <path d="M 124,102 123,128 102,140 103,113" />
                        <path d="M 145,90 144,116 126,126 127,100" />
                    </G>
                </G>
            </Svg>
        </Box>
    )
}
