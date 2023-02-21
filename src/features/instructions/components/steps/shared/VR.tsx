import { Box } from "@mui/material"

import { Empty } from "@app/features/shared"

export const VR = (): JSX.Element => {
    return (
        <Box
            sx={{
                width: "2px",
                height: "190px",
                borderRight: "2px solid rgba(200, 200, 200, 1)",
            }}
        >
            <Empty />
        </Box>
    )
}
