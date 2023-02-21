import { Typography } from "@mui/material"

import { Page } from "@app/features/shared"

export const NotFoundPage = (): JSX.Element => {
    return (
        <Page
            title="Not Found"
        >
            <Typography>404 - Not Found</Typography>
        </Page>
    )
}
