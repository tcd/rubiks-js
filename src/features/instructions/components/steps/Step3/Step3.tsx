import { Stack } from "@mui/material"
import { StepCard, VR } from "../shared"

import { Step3A } from "./Step3A"
import { Step3B } from "./Step3B"

export const Step3 = (): JSX.Element => {
    return (
        <StepCard title="Step #3">
            <Stack
                direction="row"
                spacing={5}
                alignItems="stretch"
            >
                <Step3A />
                <VR />
                <Step3B />
            </Stack>
        </StepCard>
    )
}
