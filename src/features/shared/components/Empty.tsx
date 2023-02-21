import { Box } from "@mui/material"

import { ISxProps as SxProps } from "@app/theme/index"

/**
 * Returns a div with no content that will take up space.
 *
 * See [Zero-width space](https://en.wikipedia.org/wiki/Zero-width_space)
 */
export const Empty = (_props: unknown): JSX.Element => <Box sx={sx} />

const sx: SxProps = {
    "&::after": {
        content: `"\\200b"`,
        visibility: "hidden",
    },
}
