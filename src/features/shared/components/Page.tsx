export type PageProps = {
    title: string
    children: React.ReactNode
}

export const Page = (props: PageProps): JSX.Element => {

    const {
        // title,
        children,
    } = props

    return (
        <>
            {children && children}
        </>
    )
}
