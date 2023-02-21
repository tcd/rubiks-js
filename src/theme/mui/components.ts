import type { Components } from "@mui/material"

import { ITheme } from "@app/theme/helpers/ITheme"
import { baseStyleOverrides } from "./base-style-overrides"
import { AppThemeVars } from ".."

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
    // -------------------------------------------------------------------------
    // Typography
    // -------------------------------------------------------------------------
    MuiTypography: {
        defaultProps: {
            variantMapping: {
                h1: "h1",
                h2: "h2",
                h3: "h3",
                h4: "h4",
                h5: "h5",
                h6: "h6",
                subtitle1: "span",
                subtitle2: "span",
                body1: "span",
                body2: "span",
                inherit: "span",
                caption: "span",
                overline: "span",
                // custom
                code: "code",
            },
        },
        variants: [
            {
                props: { variant: "code" },
                style: {
                    fontFamily: AppThemeVars.Typography.fontFamily.monospace,
                    display: "inline",
                    whiteSpace: "pre",
                    // fontSize: "85%",
                    // fontOpticalSizing: "auto",
                    // fontStyle: "normal",
                    // fontStretch: "normal",
                    // lineHeight: "initial",
                    // padding: "0.2em 0.4em",
                    // margin: 0,
                    // borderRadius: "6px",
                    // // backgroundColor: theme => theme.palette.mode === "dark" ? "white" : "black",
                    // background: "var(--color-neutral-muted)",
                },
            },
        ],
    },
}
