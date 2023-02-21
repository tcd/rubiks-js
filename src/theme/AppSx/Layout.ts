import type {
    ISxProps as SxProps,
} from "@app/theme/helpers"

const root: SxProps = {
    flexGrow: 1,
    display: "flex",
    flexFlow: "column nowrap",
    justifyContent: "stretch",
    alignItems: "stretch",
}

const main: SxProps = {
    flexGrow: 1,
    p: 2,
}

const footer: SxProps = {
    height: "45px",
    backgroundColor: "royalblue",
    textAlign:"center",
    display:"flex",
    justifyContent:"center",
    alignItems:"center",
}

export const Layout = {
    root,
    main,
    footer,
}
