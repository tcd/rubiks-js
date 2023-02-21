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
        <Paper
            sx={{ p: 2 }}
            elevation={3}
        >
            <Typography variant="h4">{title}</Typography>
            <br />
            <>{children && children}</>
        </Paper>
    )
}
