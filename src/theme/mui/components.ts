import type { Components } from "@mui/material"

import { ITheme } from "@app/theme/helpers/ITheme"
import { baseStyleOverrides } from "./base-style-overrides"

export const componentOverrides: Components<ITheme> = {
    MuiCssBaseline: {
        styleOverrides: (theme) => baseStyleOverrides(theme),
    },
    MuiTableCell: {
        styleOverrides: {
            root: {
                textAlign: "center",
                borderRight: "1px solid rgba(224, 224, 224, 1)",
                "&:last-child": { borderRight: 0 },
            },
            // "& .MuiTableCell-root": {
            //     borderLeft: "1px solid rgba(224, 224, 224, 1)"
            // }
        },
    },
}
