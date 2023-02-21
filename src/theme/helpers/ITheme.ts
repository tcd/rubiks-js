import type { MUIStyledCommonProps, CSSSelectorObjectOrCssVariables } from "@mui/system"
import type { SxProps } from "@mui/material"
import { createTheme } from "@mui/material"

import { themeOptions } from "@app/theme/mui/theme-options"

const theme = createTheme(themeOptions)
export type ITheme = typeof theme
export type ISxProps = SxProps<ITheme>
// TODO: figure out a return type that satisfies `styled` and also provides intellisense.
export type IStyledFunc = (props: MUIStyledCommonProps<ITheme>) => CSSSelectorObjectOrCssVariables<ITheme>
