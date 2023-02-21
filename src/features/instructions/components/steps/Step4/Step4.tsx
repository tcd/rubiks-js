import { Stack } from "@mui/material"
import { StepCard, StepTable, VR } from "../shared"

import { Diagram } from "./Diagram"

export const Step4 = (): JSX.Element => {
    return (
        <StepCard title="Step #4">
            <Stack
                direction="row"
                spacing={5}
                alignItems="center"
            >
                <StepTable
                    steps={[
                        [`F`,  `R`,  `U`],
                        [`R'`, `U'`, `F'`],
                    ]}
                />
                <VR />
                <Diagram />
            </Stack>
        </StepCard>
    )
}
