import {
    Box,
    AppBar,
    IconButton,
    Toolbar,
    Typography,
} from "@mui/material"
import MenuIcon from "@mui/icons-material/Menu"

import { DesktopLinks } from "./DesktopLinks"

export const Header = (): JSX.Element => {
    return (
        <Box>
            <Toolbar />
            <AppBar enableColorOnDark>
                <Toolbar>
                    {/* <IconButton
                        size="large"
                        edge="start"
                        color="inherit"
                        sx={{ mr: 2 }}
                    >
                        <MenuIcon />
                    </IconButton> */}
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        Rubik&apos;s JS
                    </Typography>
                    <Box>
                        <DesktopLinks />
                    </Box>
                </Toolbar>
            </AppBar>
        </Box>
    )
}
