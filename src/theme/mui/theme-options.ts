import type { ThemeOptions } from "@mui/material"

import { breakpointsOptions } from "./breakpoints"
import { componentOverrides } from "./components"
import { paletteOptions } from "./palette"

// =============================================================================
// Theme
// =============================================================================

export const themeOptions: ThemeOptions = {
    breakpoints: breakpointsOptions,
    components: componentOverrides,
    palette: paletteOptions,
}
