type Face = "t" | "f" | "r"
type SquareNumber = "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9"
type CubeSquare = `${Face}${SquareNumber}`

export type CubeColors = Partial<Record<CubeSquare | "top" | "front" | "right", string>>

export type CubeProps = {
    size?: number
    colors?: CubeColors
}
