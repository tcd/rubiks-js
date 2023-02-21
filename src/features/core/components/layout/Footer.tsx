import { Box } from "@mui/material"

import { CONFIG } from "@app/util"
import { AppSx } from "@app/theme"

export const Footer = (): JSX.Element => {
    return (
        <Box
            component="footer"
            sx={AppSx.Layout.footer}
        >
            v{CONFIG.APP_VERSION}
        </Box>
    )
}
