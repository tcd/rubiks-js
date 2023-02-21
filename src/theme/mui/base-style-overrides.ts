import type { CSSObject } from "@mui/material"

import type {
    ITheme as Theme,
} from "../helpers"

// =============================================================================

const _htmlAndBody: CSSObject = {
    height: "100vh",
    width:  "100vw",
    margin: "0px !important",
    padding: "0px !important",
    overflowX: "hidden",
    display: "flex",
}

const html: CSSObject = {
    ..._htmlAndBody,
}

const body = (theme: Theme): CSSObject => ({
    ..._htmlAndBody,
})

// =============================================================================

const root: CSSObject = {
    width: "100%",
    display: "flex",
    justifyContent: "stretch",
    flexFlow: "column nowrap",
}

export const baseStyleOverrides = (theme: Theme): CSSObject => ({
    html: html,
    "body": body(theme),
    "#root": root,
})
