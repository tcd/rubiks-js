import {
    BrowserRouter as ReactRouter,
} from "react-router-dom"

import { Routes } from "./Routes"

export const Router = (): JSX.Element => {
    return (
        <ReactRouter>
            <Routes />
        </ReactRouter>
    )
}
