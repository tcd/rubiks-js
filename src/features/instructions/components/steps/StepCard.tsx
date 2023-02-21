import { Paper, Typography } from "@mui/material"

export type StepCardProps = {
    title: string
    children: React.ReactNode
}

export const StepCard = (props: StepCardProps): JSX.Element => {

    const {
        title,
        children,
    } = props

    return (
        <Paper>
            <Typography>{title}</Typography>
            <br />
            <>{children && children}</>

        </Paper>
    )
}
