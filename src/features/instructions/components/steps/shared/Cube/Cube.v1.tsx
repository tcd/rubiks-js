import { Box } from "@mui/material"
import { Svg, Rect, RectProps } from "svg4react"

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
                vb={[100, 100]}
            >
                <Rect {...squareProps} />
            </Svg>
        </Box>
    )
}

// =============================================================================

// Simple rectangle
const squareProps: RectProps = {
    width: "100px",
    height: "100px",
    fill: "purple",
}
