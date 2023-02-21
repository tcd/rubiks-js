import { CssBaseline, ThemeProvider } from "@mui/material"

import { AppTheme } from "@app/theme"

export const App = (): JSX.Element => {
    return (
        <ThemeProvider theme={AppTheme}>
            <CssBaseline />
            <>Hello there</>
        </ThemeProvider>
    )
}
