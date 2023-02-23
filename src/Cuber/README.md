[marklundin/cube](https://github.com/marklundin/cube) - The original Google Doodle Rubik's Cube

# CUBER

Cuber is a programmable Rubik's cube of sorts.

Made with love by:

- Mark Lundin 
    - http://mark-lundin.com 
    - @mark_lundin
- Stewart Smith 
    - stewd.io
- Google Creative Lab

## NOTATION

- *UPPERCASE* = Clockwise to next 90 degree peg
- *lowercase* = Anticlockwise to next 90 degree peg

### FACE & SLICE ROTATION COMMANDS

| command |                       description                       |
| ------- | ------------------------------------------------------- |
| `F`     | Front                                                   |
| `S`     | Standing (rotate according to Front Face's orientation) |
| `B`     | Back                                                    |
| `L`     | Left                                                    |
| `M`     | Middle (rotate according to Left Face's orientation)    |
| `R`     | Right                                                   |
| `U`     | Up                                                      |
| `E`     | Equator (rotate according to Up Face's orientation)     |
| `D`     | Down                                                    |

### ENTIRE CUBE ROTATION COMMANDS

| command |                       description                        |
| ------- | -------------------------------------------------------- |
| `X`     | Rotate entire cube according to Right Face's orientation |
| `Y`     | Rotate entire cube according to Up Face's orientation    |
| `Z`     | Rotate entire cube according to Front Face's orientation |

### NOTATION REFERENCES

- http://en.wikipedia.org/wiki/Rubik's_Cube#Move_notation
- http://en.wikibooks.org/wiki/Template:Rubik's_cube_notation

---

## SLICES
Slices are thin layers sliced out of the Cube composed of 9 Cubelets (3x3 grid).

The position of these Cubelets can be mapped as follows:
```
     ----------- ----------- -----------
    |           |           |           |
    | northWest |   north   | northEast |
    |     0     |     1     |     2     |
    |           |           |           |
     ----------- ----------- -----------
    |           |           |           |
    |    west   |   origin  |    east   |
    |     3     |     4     |     5     |
    |           |           |           |
     ----------- ----------- -----------
    |           |           |           |
    | southWest |   south   | southEast |
    |     6     |     7     |     8     |
    |           |           |           |
     ----------- ----------- -----------
```
The `cubelets[]` Array is mapped to names for convenience:

- `0  === this.northWest`
- `1  === this.north`
- `2  === this.northEast`
- `3  === this.west`
- `4  === this.origin`
- `5  === this.east`
- `6  === this.southWest`
- `7  === this.south`
- `8  === this.southEast`

Portions of Slices can be Grouped:

Rows and columns as strips (1x3)
- `this.up`
- `this.equator`
- `this.down`
- `this.left`
- `this.middle`
- `this.right`

Other combinations
- `this.cross`
- `this.edges`
- `this.ex`
- `this.corners`
- `this.ring`
- `this.dexter`
- `this.sinister`

A Slice may be inspected from the browser's JavaScript console with:
- `this.inspect()`

This will reveal the Slice's Cubelets, their Indices, and colors.
A compact inspection mode is also available:
- `this.inspect(true)`

This is most useful for Slices that are also Faces. For Slices that are
not Faces, or for special cases, it may be useful to send a side
argument which is usually by default the Slice's origin's only visible
side if it has one.
- `this.inspect(false, "up")`
- `this.inspect(true, "up")`

### CUBE FACES vs CUBE SLICES

All Cube faces are Slices, but not all Slices are Cube faces.

For example, a Cube has 6 faces: 
- front
- up
- right
- down
- left
- back

But it also has slices that that cut through the center of the Cube itself: 
- equator
- middle
- standing

When a Slice maps itself it inspects the faces of the Cubelet in the origin position of the Slice (the center piece) which can either have a single visible face or no visible face. 

If it has a visible face then the Slice's face and the face's direction is in the direction of that Cubelet's visible face.

This seems redundant from the Cube's perspective:
- `cube.front.face === "front"`

However it becomes valuable from inside a Slice or Fold when a relationship to the Cube's orientation is not immediately clear:

- `if( this.face === 'front' )...`

Therefore a Slice (s) is also a face if `s.face !== undefined`.

---

## FOLDS

Folds are two adjacent Faces joined together, as if one
long 6 x 3 strip has been folding down the center and
three such shapes together wrap the six sides of the Cube.

Currently this is important for text wrapping. 
And in the future? Who knows. 

Characters in a String are mapped thus:

```
           LEFT FACE
                                     RIGHT FACE
   -------- -------- --------
  |        |        |        |-------- -------- --------
  |    0   |    1   |    2   |        |        |        |
  |        |        |        |    3   |    4   |    5   |
   -------- -------- --------         |        |        |
  |        |        |        |-------- -------- --------
  |    6   |    7   |    8   |        |        |        |
  |        |        |        |    9   |   10   |   11   |
   -------- -------- --------         |        |        |
  |        |        |        |-------- -------- --------
  |   12   |   13   |   14   |        |        |        |
  |        |        |        |   15   |   16   |   17   |
   -------- -------- --------         |        |        |
                              -------- -------- --------
                             ^
                             |
                         FOLD LINE
```

Currently Folds are only intended to be created and
heroized after the first Cube mapping. After the Cube
twists things would get rather weird...
