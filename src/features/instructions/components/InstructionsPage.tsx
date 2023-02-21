import {
    Divider,
    Typography,
} from "@mui/material"

import { Page } from "@app/features/shared"
import { AllSteps } from "./steps"

export const InstructionsPage = (): JSX.Element => {
    return (
        <Page
            title="Instructions"
        >
            <Typography variant="h3">Instructions</Typography>
            <Divider sx={{ mt: 2, mb: 4 }} />
            <AllSteps />
        </Page>
    )
}
