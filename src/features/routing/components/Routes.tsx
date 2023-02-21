import { RouteObject, useRoutes } from "react-router-dom"

import { Layout, NotFoundPage } from "@app/features/core"
import { HomePage } from "@app/features/home"
import { InstructionsPage } from "@app/features/instructions"

export const Routes = (_props: unknown): JSX.Element => {
    return useRoutes(routes())
}

const routes = (): RouteObject[] => {
    return [
        {
            path: "/",
            element: <Layout />,
            children: [
                { index: true, element: <HomePage /> },
                { path: "instructions", element: <InstructionsPage /> },
            ],
        },
        { path: "/*", element: <NotFoundPage /> },
    ]
}
