import { Stack } from "@mui/material"
import {
    Step1,
    Step2,
    Step3,
    Step4,
} from "."

export const AllSteps = (): JSX.Element => {
    return (
        <Stack
            direction="column"
            spacing={4}
        >
            {/* <Step1 /> */}
            {/* <Step2 /> */}
            <Step3 />
            <Step4 />
        </Stack>
    )
}
