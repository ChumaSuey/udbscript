`#version 5`;
`#author taviow`; 
`#name Apply damaging floors`;

`#description Check each sector in the map for a specified floor flat, and applies a damaging effect to that sector if one is not already applied.`;
`#scriptoptions

effect
{
    description = "Damaging effect";
    default = 16;
    type = 5;    
}

floorFlat
{
    description = "Floor flat";    
    type = 7;    
}`;

let sectors = UDB.Map.getSectors();

for (let sector of sectors){ //Identify which sectors have the damaging floor flat    
    if (sector.floorTexture === UDB.ScriptOptions.floorFlat && sector.special === 0){
        sector.special = UDB.ScriptOptions.effect;
    }
}
