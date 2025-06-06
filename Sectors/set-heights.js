`#version 5`;

`#name Set floor/ceiling heights`;

`#author taviow`;

`#description For each selected sector, makes the floor meet the ceiling or the ceiling meet the floor.`;

`#scriptoptions

mode
{
    description = "Raise or lower sectors";
    default = 0; // Inward
    type = 11; // Enum
    enumvalues {
        0 = "Floor meets ceiling";
        1 = "Ceiling meets floor";
        2 = "Flip ceiling/floor";        
    }
}`;

let sectors = UDB.Map.getSelectedSectors();

if (sectors.length === 0) {
   UDB.die('You need to select at least one sector.');
}

for (let sector of sectors) {   
   if (UDB.ScriptOptions.mode === 0){
      sector.floorHeight = sector.ceilingHeight;
   } else if (UDB.ScriptOptions.mode === 1){
      sector.ceilingHeight = sector.floorHeight;
   } else if (UDB.ScriptOptions.mode === 2){
      let aux = sector.ceilingHeight
      sector.ceilingHeight = sector.floorHeight;
      sector.floorHeight = aux;
   }   
}

