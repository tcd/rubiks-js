import { Outlet } from "react-router-dom"
import { Box } from "@mui/material"

import { AppSx } from "@app/theme"
import { Header } from "./header"
import { Footer } from "./Footer"

export type LayoutProps = {
    children: React.ReactNode
}

export const Layout = (): JSX.Element => {
    return (
        <Box sx={AppSx.Layout.root}>
            <Header />
            <Box sx={AppSx.Layout.main}>
                <Outlet />
            </Box>
            <Footer />
        </Box>
    )
}
