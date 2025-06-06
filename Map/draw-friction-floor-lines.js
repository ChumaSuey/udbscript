`#version 5`;

`#name Draw friction floor lines at mouse position`;

`#author taviow`;

`#description For each sector with a given floor flat, draw friction floor lines starting from the current mouse position.`;

`#scriptoptions

length
{
    description = "Line length";
    default = 80;
    type = 0;    
}

flat
{
    description = "Floor flat that needs friction floor applied";    
    type = 7;    
}`;

let sectors = UDB.Map.getSectors();
let tags = [];
let initialPosition = UDB.Map.mousePosition;

sectors.filter(s => s.floorTexture === UDB.ScriptOptions.flat).forEach(sector => { //Identify which sectors need friction floors applied
    if(tags.indexOf(sector.tag) === -1){
        tags.push(sector.tag);
    }
    sector.special = 256;
})

let increment = -4;

for (let tag of tags){
    increment += 4;
    UDB.Map.drawLines([
        [ initialPosition.x+increment, initialPosition.y ],
        [ initialPosition.x+increment, initialPosition.y-UDB.ScriptOptions.length ],
    ]);
}
let drawnLines = UDB.Map.getLinedefs().slice(-tags.length);

for (let i = 0; i < drawnLines.length; i++){
    const line = drawnLines[i];    
    line.flags['128'] = true;
    line.action = 223;
    line.tag = tags[i];
}