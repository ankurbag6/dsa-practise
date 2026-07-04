/***
 Design and implement an ASCII Canvas drawing engine.
A canvas is a fixed-size 2D grid of characters. Empty cells display as space characters. Users draw on the canvas by issuing commands.
Support these commands:

PUT x y ch — set a single character ch at coordinate (x, y)
LINE x1 y1 x2 y2 ch — draw a straight line from (x1, y1) to (x2, y2) using character ch. Lines are horizontal, vertical, or 45-degree diagonal only. No arbitrary angles.
RECT x1 y1 x2 y2 ch — draw a rectangle OUTLINE (four sides only, not filled) with corners (x1, y1) and (x2, y2) using character ch.
CLEAR — reset the canvas to all spaces.

Also provide:

render() — return the current canvas state as a string. Rows separated by newlines.

Requirements:

Model as classes
Support all commands above
Validate inputs (out-of-bounds coordinates, invalid rectangles, etc.)
Provide a way to inspect canvas state (for tests)

Focus on correctness. Console printing is out of scope. Return strings.
 */