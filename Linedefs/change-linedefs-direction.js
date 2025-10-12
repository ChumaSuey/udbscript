`#version 4`;

`#name Turn linedefs outward or inward`;

`#description For each selected sector, points all linedefs outward or inwards.`;

`#scriptoptions

direction
{
    description = "Linedef orientation";
    default = 0; // Inward
    type = 11; // Enum
    enumvalues {
        0 = "Inward";
        1 = "Outward";        
    }
}`;
 
const sectors = UDB.Map.getSelectedSectors();

if(sectors.length === 0){
   UDB.die('You need to select at least one sector.');
}

for(const sector of sectors){   
   for(const sidedef of sector.getSidedefs()){      
            if (sidedef.line.flags['4'] === true){ //Only flip double sided lines
         if(UDB.ScriptOptions.direction === 0){
            if(sidedef.isFront){
               continue;
            }
            sidedef.line.flip();
            continue;
         }
         if(sidedef.isFront){
         sidedef.line.flip()
         }
      }
   }
}
