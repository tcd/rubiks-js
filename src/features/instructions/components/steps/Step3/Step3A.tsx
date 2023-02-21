import {
    Defs,
    Path,
    Marker,
    PathProps,
} from "svg4react"

import { Grid } from "../shared"

export const Step3A = (): JSX.Element => {
    return (
        <>
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
                                ["scale",     [0.55   ]],
                                ["translate", [3, 4.2]],
                            ]}
                            d="M 0,0 L 10,5 0,10 Z"
                            fill="red"
                        />
                    </Marker>
                </Defs>
                <Path {...lineProps} />
            </Grid>
        </>
    )
}

const lineProps: PathProps = {
    fill: "none",
    stroke: "red",
    strokeWidth: "3.5px",
    markerEnd: "url(#arrow)",
    commands: [
        ["M", [[49.5,16.5]]],
        ["Q", [[
            135,-20,
            84,50,
        ]]],
        // ["z", []],
    ],
}
