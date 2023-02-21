import { Box } from "@mui/material"
import {
    Defs,
    Path,
    Marker,
    PathProps,
} from "svg4react"

import { Grid } from "../shared"

import { Table3A } from "./Table3A"

export const Step3A = (): JSX.Element => {

    const color = "indianred"

    const lineProps: PathProps = {
        fill: "none",
        stroke: color,
        strokeWidth: "5px",
        markerEnd: "url(#arrow)",
        commands: [
            ["M", [[49.5,16.5]]],
            ["Q", [[
                137,-50,
                85,45,
            ]]],
            // ["z", []],
        ],
    }

    return (
        <>
            <Box sx={{
                width: "200px",
                display: "flex",
                justifyContent: "center",
            }}>
                <Grid>
                    <Defs>
                        <Marker
                            id="arrow"
                            viewBox="-0.1 -5 10 10"
                            refXY={[5]}
                            size={[10]}
                            orient="auto-start-reverse"
                        >
                            <Path
                                transform={[
                                    ["scale",     [0.50]],
                                    ["translate", [4, 5]],
                                ]}
                                d="M 0,0 L 10,5 0,10 Z"
                                fill={color}
                            />
                        </Marker>
                    </Defs>
                    <Path {...lineProps} />
                </Grid>
            </Box>
            <br />
            <Table3A />
        </>
    )
}

