`#version 5`;

`#name Create control sectors`;
`#author taviow`;
`#description For each selected sector, draw a control sector and then join the sectors together. Also marks drawn lines as unmarked.`;

let sectors = UDB.Map.getSelectedSectors();
if (sectors.length === 0){
    UDB.die("Please select at least one sector.")
}
let tags = [];
let initialPosition = new UDB.Vector2D(Math.round(UDB.Map.mousePosition.x),Math.round(UDB.Map.mousePosition.y));
let incrementX = 0;
let incrementY = 0;
let index = 0;
for (let sector of sectors){
    
    if(incrementX === (Math.ceil(sectors.length/4))){
        incrementX = 0;
        incrementY++;        
    }

    let p = new Pen([initialPosition.x+incrementX*32,initialPosition.y-incrementY*32]);               
    p.drawVertex();
    p.moveForward(16);
    p.drawVertex();
    p.turnRight();
    p.moveForward(16)
    p.drawVertex();
    p.finishDrawing(true);    
    let lastCreatedSector = UDB.Map.getSectors().pop();
    lastCreatedSector.join(sector);

    p = new Pen([initialPosition.x+incrementX*32+16,initialPosition.y-incrementY*32+16]);             
    p.drawVertex();
    p.moveForward(-16);
    p.drawVertex();
    p.turnLeft();
    p.moveForward(16);
    p.drawVertex();
    p.finishDrawing(true);
    let drawnControlSector = UDB.Map.getSectors().pop();
    drawnControlSector.tag = 0; //Remove unwanted tag from control sectors
    drawnControlSector.special = 0; //Also remove unwanted special from control sectors.
    incrementX++;        
}

let drawnLines = UDB.Map.getLinedefs().slice(-sectors.length*5);
for (let line of drawnLines){ //Set all lines as not shown on automap
    line.flags['128'] = true;
 }
