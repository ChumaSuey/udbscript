`#version 5`;

`#name Draw pit`;

`#author taviow`;

`#description For each selected thing, draw a monster pit around it. Also marks lines drawn an unmarked.`;

`#scriptoptions

tag
{
    description = "Sector tag (-1 new tag, -2 new tag for each pit)";
    default = 0;
    type = 0; // Integer 
}

height
{
    description = "Floor height (99999 for unchanged)";
    default = -1024;
    type = 0; // Integer 
}

size
{
    description = "Pit size";
    default = 8;
    type = 0; // Integer 
}

shape
{
	description = "Shape";
	default = 0;
	type = 11; // Enum
	enumvalues {
		0 = "Diamond";
		1 = "Triangle";
		2 = "Square";		
	}
}

`;

let things = UDB.Map.getSelectedThings();
let size = UDB.ScriptOptions.size;

if (things.length === 0) {
   UDB.die('You need to select at least one Thing.');
}

for (let thing of things) {
    p = new Pen(thing.position);    
    switch(UDB.ScriptOptions.shape){
        case 0: //Diamond          
            p.moveTo([thing.position.x,thing.position.y+size]);
            p.drawVertex();
            p.moveTo([thing.position.x+size,thing.position.y]);
            p.drawVertex();
            p.moveTo([thing.position.x,thing.position.y-size]);
            p.drawVertex();
            p.moveTo([thing.position.x-size,thing.position.y]);
            p.drawVertex();
            p.finishDrawing(close=true);
            break;
        case 1: //Triangle          
            p.moveTo([thing.position.x,thing.position.y+size]);
            p.drawVertex();   
            p.moveTo([thing.position.x+size,thing.position.y-size]);
            p.drawVertex();
            p.moveTo([thing.position.x-size,thing.position.y-size]);
            p.drawVertex();
            p.finishDrawing(close=true);
            break;
        case 2: //Square         
            p.moveTo([thing.position.x-size,thing.position.y+size]);
            p.drawVertex();   
            p.moveTo([thing.position.x+size,thing.position.y+size]);
            p.drawVertex();
            p.moveTo([thing.position.x+size,thing.position.y-size]);
            p.drawVertex();
            p.moveTo([thing.position.x-size,thing.position.y-size]);
            p.drawVertex();
            p.finishDrawing(close=true);
            break;
        default:
            UDB.die();
    }
    
}

let drawnSectors = UDB.Map.getSectors().slice(-things.length);
let drawnLines = UDB.Map.getLinedefs().slice(-things.length*4);

let newTag;
if (UDB.ScriptOptions.tag === -1){
    newTag = UDB.Map.getNewTag();
}

for (let sector of drawnSectors){

    if (UDB.ScriptOptions.height != 99999)
        sector.floorHeight = UDB.ScriptOptions.height;
    
    if (UDB.ScriptOptions.tag === -1){
        sector.tag = newTag;
    } else if (UDB.ScriptOptions.tag === -2){
        sector.tag = UDB.Map.getNewTag();
    } else {
        sector.tag = UDB.ScriptOptions.tag;
    }
}

for (let line of drawnLines){ //Set not shown on automap
    line.flags['128'] = true;
 }
