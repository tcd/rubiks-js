import { Box } from "@mui/material"
import {
    Svg,
    Line,
    LineCoordinates,
    Rect,
    RectProps,
} from "svg4react"

import type { ISxProps as SxProps } from "@app/theme"

export type GridProps = {
    size?: number
    color?: string
}

export const Grid = (props: GridProps): JSX.Element => {

    const {
        size = 125,
        color = "black",
    } = props

    const rootSx: SxProps = {
        width:  size,
        height: size,
        overflow: "visible",
    }

    const $lines = LINE_COORDS.map((coordinates, index) => (
        <Line
            key={index}
            stroke={color}
            strokeWidth="2.5"
            coordinates={coordinates.map(x => x as number + 10) as LineCoordinates}
        />
    ))

    const rectProps: RectProps = {
        stroke: color,
        fill: "none",
        strokeWidth: "2.5",
        points: [10],
        width: "82.5%",
        height: "82.5%",
    }

    return (
        <Box sx={rootSx}>
            <Svg
                size="100%"
                vb={[120]}
                style={{ overflow: "visible" }}
            >
                {$lines}
                <Rect {...rectProps} />
            </Svg>
        </Box>
    )
}

// =============================================================================

const LINE_COORDS: LineCoordinates[] = [
    [
        0,   33,
        100, 33,
    ],
    [
        0,   66,
        100, 66,
    ],
    [
        33, 0,
        33, 100,
    ],
    [
        66, 0,
        66, 100,
    ],

]
