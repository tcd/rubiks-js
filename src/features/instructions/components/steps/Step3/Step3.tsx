import { StepCard } from "../shared"

import { Cube } from "./Cube"
import { Grid } from "./Grid"

export const Step3 = (): JSX.Element => {
    return (
        <StepCard title="Step #3">
            {/* <Cube /> */}
            <Grid />
        </StepCard>
    )
}
