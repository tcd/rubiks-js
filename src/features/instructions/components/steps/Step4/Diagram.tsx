import { Stack } from "@mui/material"

import { Cube } from "../shared"
import { CubeColors } from "@app/theme/AppThemeVars"

export const Diagram = (): JSX.Element => {
    return (
        <Stack
            direction="row"
            spacing={2}
        >
            <Cube
                size={150}
                colors={{
                    front: CubeColors.white,
                    right: CubeColors.white,
                    t5: CubeColors.yellow,
                }}
            />
            <Cube
                size={150}
                colors={{
                    front: CubeColors.white,
                    right: CubeColors.white,
                    t2: CubeColors.yellow,
                    t5: CubeColors.yellow,
                    t6: CubeColors.yellow,
                }}
            />
            <Cube
                size={150}
                colors={{
                    front: CubeColors.white,
                    right: CubeColors.white,
                    t2: CubeColors.yellow,
                    t5: CubeColors.yellow,
                    t8: CubeColors.yellow,
                }}
            />
            <Cube
                size={150}
                colors={{
                    front: CubeColors.white,
                    right: CubeColors.white,
                    t2: CubeColors.yellow,
                    t4: CubeColors.yellow,
                    t5: CubeColors.yellow,
                    t6: CubeColors.yellow,
                    t8: CubeColors.yellow,
                }}
            />
        </Stack>
    )
}
