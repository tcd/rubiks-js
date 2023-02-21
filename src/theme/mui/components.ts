import type { Components } from "@mui/material"

import { ITheme } from "@app/theme/helpers/ITheme"
import { baseStyleOverrides } from "./base-style-overrides"

export const componentOverrides: Components<ITheme> = {
    MuiCssBaseline: {
        styleOverrides: (theme) => baseStyleOverrides(theme),
    },
}
