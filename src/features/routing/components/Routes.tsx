import { RouteObject, useRoutes } from "react-router-dom"

import { Layout, NotFoundPage } from "@app/features/core"
import { HomePage } from "@app/features/home"

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
            ],
        },
        { path: "/*", element: <NotFoundPage /> },
    ]
}
