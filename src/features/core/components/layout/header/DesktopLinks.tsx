import {
    useLocation,
    Link as RouterLink,
} from "react-router-dom"
import { Button } from "@mui/material"

import {
    APP_LINKS,
    AppLinkProps,
} from "@app/util"

export const DesktopLinks = (): JSX.Element => {
    const $links = APP_LINKS.map((link, index) => <DesktopLink key={index} {...link} />)
    return <>{$links}</>
}

// =============================================================================

const DesktopLink = (props: AppLinkProps): JSX.Element => {

    const { pathname } = useLocation()

    const {
        title,
        to,
    } = props

    return (
        <Button
            component={RouterLink}
            to={to}
            sx={{
                color: (pathname == to) ? "lime" : "white",
            }}
        >
            {title}
        </Button>
    )
}
