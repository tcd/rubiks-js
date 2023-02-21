import {
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableRow,
    Typography,
} from "@mui/material"

export type StepTableProps = {
    steps: string[][]
}

export const StepTable = (props: StepTableProps): JSX.Element => {

    const {
        steps = [],
    } = props

    const $rows = steps.map((row, i) => (
        <TableRow key={i}>
            {row.map((step, j) => <StepCell key={j} content={step} />)}
        </TableRow>
    ))

    return (
        <TableContainer component={Paper} sx={{ width: 200 }}>
            <Table size="small">
                <TableBody>
                    <>
                        {$rows}
                    </>
                </TableBody>
            </Table>
        </TableContainer>
    )
}

// =============================================================================
// StepCell
// =============================================================================

type StepCellProps = {
    content: string
}

const StepCell = ({ content }: StepCellProps): JSX.Element => {

    const prime = content.endsWith(`'`)

    return (
        <TableCell>
            <Typography
                variant="code"
                sx={{
                    fontWeight: "bold",
                    fontStyle: prime ? "italic" : undefined,
                }}
            >
                {content}
                {!prime && <>&nbsp;</>}
            </Typography>
        </TableCell>
    )
}
