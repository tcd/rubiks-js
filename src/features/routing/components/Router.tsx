import {
    BrowserRouter as ReactRouter,
} from "react-router-dom"

import { Routes } from "./Routes"

export const Router = (_props: unknown): JSX.Element => {
    return (
        <ReactRouter>
            <Routes />
        </ReactRouter>
    )
}
