import { Box } from "@mui/material"
import {
    Svg,
    Rect,
    Line,
    LineProps,
    LineCoordinates,
} from "svg4react"

import type { ISxProps as SxProps } from "@app/theme"

export type GridProps = {
    size?: number
    color?: string
    children?: React.ReactNode
}

export const Grid = (props: GridProps): JSX.Element => {

    const {
        size = 100,
        color = "black",
        children = undefined,
    } = props

    const rootSx: SxProps = {
        width:  size,
        height: size,
        overflow: "visible",
    }

    const lineProps: Partial<LineProps> = {
        stroke: color,
        strokeWidth: "2.5",
    }

    const $lines = LINE_COORDS.map((coordinates, index) => (
        <Line
            key={index}
            {...lineProps}
            coordinates={coordinates}
        />
    ))

    return (
        <Box sx={rootSx}>
            <Svg
                size="100%"
                vb={[100]}
                style={{ overflow: "visible" }}
            >
                {$lines}
                <Rect
                    stroke={color}
                    fill="none"
                    strokeWidth="2.5"
                    width="100%"
                    height="100%"
                />
                <>
                    {children && children}
                </>
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
