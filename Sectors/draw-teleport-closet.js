`#version 5`;

`#name Draw monster teleport closet`;

`#author taviow`;

`#description For each selected sector, draw a teleport closet at mouse position targeting that sector with a monster inside. Also marks lines drawn an unmarked.`;

`#scriptoptions

radius
{
    description = "Monster radius";
    default = 64;
    type = 0; // Integer 
}

type
{
    description = "Type of thing to be placed";
    type = 18;
}`;

let sectors = UDB.Map.getSelectedSectors();

if (sectors.length === 0) {
   UDB.die('You need to select at least one sector.');
}

let radius = UDB.ScriptOptions.radius;
let startingPosition = new UDB.Vector2D(Math.round(UDB.Map.mousePosition.x),Math.round(UDB.Map.mousePosition.y));
let p = new Pen(startingPosition);
let t = new Pen(startingPosition);

let index = 0;
let currentPosition = new UDB.Vector2D(startingPosition.x,startingPosition.y);

let tags = [];
let newTag = 0;
for (let sector of sectors) {
   destination = UDB.Map.getThings().filter(t => t.getSector() === sector).filter(tp => tp.type === 14);
   
   if (destination.length === 0){
      UDB.Map.CreateThing(sector.getLabelPositions()[0],14);
   }

   if (sector.tag === 0){
      newTag = UDB.Map.getNewTag();
      sector.tag = newTag
      tags.push(newTag);      
   } else {
      tags.push(sector.tag);
   }

   if(index === (Math.ceil(sectors.length/4))){
      index = 0;      
      currentPosition.x = startingPosition.x;
      currentPosition.y = currentPosition.y + 2*UDB.ScriptOptions.radius;
  }
   
   p.moveTo([currentPosition.x - UDB.ScriptOptions.radius/2 - UDB.ScriptOptions.radius/3, currentPosition.y + UDB.ScriptOptions.radius/2 + UDB.ScriptOptions.radius/3]); //Top right
   p.drawVertex();
   p.moveTo([currentPosition.x + UDB.ScriptOptions.radius/2 + UDB.ScriptOptions.radius/3, currentPosition.y + UDB.ScriptOptions.radius/2 + UDB.ScriptOptions.radius/3]) // Top left
   p.drawVertex();
   p.moveTo([currentPosition.x + UDB.ScriptOptions.radius/2 + UDB.ScriptOptions.radius/3, currentPosition.y - UDB.ScriptOptions.radius/2 - UDB.ScriptOptions.radius/3]) // Bottom left
   p.drawVertex();
   p.moveTo([currentPosition.x - UDB.ScriptOptions.radius/2 - UDB.ScriptOptions.radius/3, currentPosition.y - UDB.ScriptOptions.radius/2 - UDB.ScriptOptions.radius/3]) // Bottom right
   p.drawVertex();
   p.finishDrawing(true);
   UDB.Map.CreateThing(currentPosition,UDB.ScriptOptions.type);
   
   t.moveTo([currentPosition.x, currentPosition.y + UDB.ScriptOptions.radius/2]);
   t.drawVertex();
   t.moveTo([currentPosition.x, currentPosition.y - UDB.ScriptOptions.radius/2]);
   t.drawVertex();
   t.finishDrawing(false);
   
   currentPosition.x = currentPosition.x + 2*UDB.ScriptOptions.radius;
   index++;
}

let drawnSectors = UDB.Map.getSectors().slice(-sectors.length);
let drawnLines = UDB.Map.getLinedefs().slice(-sectors.length*5);

let i = 0;

UDB.Map.stitchGeometry(1);
drawnLines.forEach(l => l.flags['128'] = true);
drawnLines.filter(l => l.back != null).forEach(ts => {
   ts.action = 126;
   ts.tag = tags[i];
   i++;
});
