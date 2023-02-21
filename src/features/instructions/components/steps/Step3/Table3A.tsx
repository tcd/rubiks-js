import {
    Paper,
    Table, TableBody, TableCell, TableContainer, TableRow,
} from "@mui/material"

export const Table3A = (): JSX.Element => {
    return (
        <TableContainer component={Paper} sx={{ width: 200 }}>
            <Table size="small">
                <TableBody>
                    <TableRow>
                        <TableCell>U</TableCell>
                        <TableCell>R</TableCell>
                        <TableCell>U&apos;</TableCell>
                        <TableCell>R&apos;</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>U&apos;</TableCell>
                        <TableCell>F&apos;</TableCell>
                        <TableCell>U</TableCell>
                        <TableCell>F</TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        </TableContainer>
    )
}
