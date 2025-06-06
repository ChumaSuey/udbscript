`#version 5`;

`#name Create 242 control sectors`;

`#author taviow`;

`#description For each selected sector, draw a 242 control sector starting from the mouse position and assign new tags. Also marks drawn lines as unmarked.`;

let sectors = UDB.Map.getSelectedSectors();
if (sectors.length === 0){
    UDB.die("Please select at least one sector.")
}
let tags = [];
let initialPosition = UDB.Map.mousePosition;
let incrementX = 0;
let incrementY = 0;

for (let sector of sectors){
    if(incrementX > (Math.ceil(sectors.length/4))){
        incrementX = 0;
        incrementY++;        
    }

    let p = new Pen([initialPosition.x+incrementX*32,initialPosition.y-incrementY*32]);    
    
    incrementX++;
    p.drawVertex();
    p.moveForward(16);
    p.drawVertex();
    p.turnRight();
    p.moveForward(16)
    p.drawVertex();
    p.finishDrawing(true);
    
    let lastCreatedSector = UDB.Map.getSectors().pop();        
    labelPosition = lastCreatedSector.getLabelPositions()[0];    
    lastCreatedSector.join(sector); 

    p = new Pen(labelPosition)
    p.drawVertex();
    p.moveForward(1);
    p.drawVertex();
    p.finishDrawing()
    UDB.Map.nearestLinedef(labelPosition).delete()

    let lastDrawnLine = UDB.Map.getLinedefs().pop();
    lastDrawnLine.action = 242;

    if (sector.tag === 0){
        let newTag = UDB.Map.getNewTag()
        lastDrawnLine.tag = newTag;
        sector.tag = newTag;
    } else {
        lastDrawnLine.tag = sector.tag;
    }
}

let drawnLines = UDB.Map.getLinedefs().slice(-sectors.length*3);
for (let line of drawnLines){
    line.flags['128'] = true;
}

let drawnSectors = UDB.Map.getSectors().slice(-sectors.length);
let index = 0;
for (let sector of drawnSectors){        
    sector.selected = false;
    sector.tag = 0;
    sector.special = 0;
    index++;
}
