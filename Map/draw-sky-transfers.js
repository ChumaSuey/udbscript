`#version 5`;

`#name Draw sky transfers at mouse position`;

`#author taviow`;

`#description Draw sky transfers sector starting from the current mouse position.`;

`#scriptoptions

action
{
    description = "Sky Transfer Action";
    default = 271;
    type = 11;
    enumvalues {
        271 = "271 - Normal";
        272 = "272 - Flipped";        
    }    
}

texture
{
    description = "Sky Texture";    
    type = 6;    
}

mode
{
    description = "Do only selected sectors";
    default = "False";
    type = 3;    
}`;

let sectors;
if (UDB.ScriptOptions.mode){    
    sectors = UDB.Map.getSelectedSectors();
}else{    
    sectors = UDB.Map.getSectors();
}

let tags = [];
let initialPosition = UDB.Map.mousePosition;

for (let sector of sectors){ //Identify which sectors need sky transfers
   if (sector.floorTexture === "F_SKY1" || sector.ceilingTexture === "F_SKY1"){
        if(tags.indexOf(sector.tag) === -1){
            tags.push(sector.tag);
        }
    }
}

let p = new Pen(initialPosition);
let index = 0;

if (tags.length < 3){
	UDB.die('Script only supports 3 tags or more.');
}

for (let tag of tags){ //Draw shape
    index++;
    if(index === (Math.ceil(tags.length/4))){
        index = 0;
        p.turnRight();
    }   
    p.drawVertex();
    p.moveForward(8);    
    
}
p.finishDrawing(close = true);
let drawnLines = UDB.Map.getLinedefs().slice(-tags.length);

for (let i = 0; i < drawnLines.length; i++){
    const line = drawnLines[i];
    line.action = UDB.ScriptOptions.action;    
    line.front.upperTexture = UDB.ScriptOptions.texture;
    line.flags['128'] = true;
    line.addTag(tags[i]);
}