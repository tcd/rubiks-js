import { Stack } from "@mui/material"
import { StepCard } from "../shared"

import { Step3A } from "./Step3A"
import { Step3B } from "./Step3B"

export const Step3 = (): JSX.Element => {
    return (
        <StepCard title="Step #3">
            <Stack
                direction="row"
                spacing={3}
            >
                <Step3A />
                <Step3B />
            </Stack>
        </StepCard>
    )
}
