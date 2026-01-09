`#version 5`;

`#name Create control sectors CH`;
`#author taviow (modified by Chuma)`;
`#description For each selected sector, draw a control sector and then join the sectors together. Swapped positions: Tied sector is now Inferior Right.`;

// Chuma : I just flipped the positions of the control sector and the joined sector.
// The control sector is now the one on the left and the joined sector is on the right.
// Script does the same as the original.

let sectors = UDB.Map.getSelectedSectors();
if (sectors.length === 0) {
    UDB.die("Please select at least one sector.")
}
let tags = [];
let initialPosition = new UDB.Vector2D(Math.round(UDB.Map.mousePosition.x), Math.round(UDB.Map.mousePosition.y));
let incrementX = 0;
let incrementY = 0;
let index = 0;
for (let sector of sectors) {

    if (incrementX === (Math.ceil(sectors.length / 4))) {
        incrementX = 0;
        incrementY++;
    }

    // Logic for the "Control" sector (Untagged/Unjoined) - Base Position
    let p = new Pen([initialPosition.x + incrementX * 32, initialPosition.y - incrementY * 32]);
    p.drawVertex();
    p.moveForward(16);
    p.drawVertex();
    p.turnRight();
    p.moveForward(16)
    p.drawVertex();
    p.finishDrawing(true);
    let drawnControlSector = UDB.Map.getSectors().pop();
    drawnControlSector.tag = 0;
    drawnControlSector.special = 0;

    // Logic for the "Joined" sector (Tied) - Offset Position (Inferior Right)
    p = new Pen([initialPosition.x + incrementX * 32 + 16, initialPosition.y - incrementY * 32 + 16]);
    p.drawVertex();
    p.moveForward(-16);
    p.drawVertex();
    p.turnLeft();
    p.moveForward(16);
    p.drawVertex();
    p.finishDrawing(true);
    let lastCreatedSector = UDB.Map.getSectors().pop();
    lastCreatedSector.join(sector);

    incrementX++;
}

let drawnLines = UDB.Map.getLinedefs().slice(-sectors.length * 5);
for (let line of drawnLines) { //Set all lines as not shown on automap
    line.flags['128'] = true;
}
