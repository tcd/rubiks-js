import { CssBaseline, ThemeProvider } from "@mui/material"

import { AppTheme } from "@app/theme"
import { Router } from "@app/features/routing"

export const App = (): JSX.Element => {
    return (
        <ThemeProvider theme={AppTheme}>
            <CssBaseline />
            <Router />
        </ThemeProvider>
    )
}
