`#version 5`;
`#author taviow`
`#name Create sinking island (cl9)`;

`#description For each selected sector, applies W1 lower to lowest floor + change texture and effect (27776) to all linedefs.`;

let sectors = UDB.Map.getSelectedSectors();

if (sectors.length === 0) {
   UDB.die('You need to select at least one sector.');
}

for (let sector of sectors) {   
   let sidedefs = sector.getSidedefs();   
   sector.tag = UDB.Map.getNewTag();
   for (let sidedef of sidedefs){
      if (sidedef.isFront){
         sidedef.line.flip();         
      }
      sidedef.line.action = 27776;
      sidedef.line.tag = sector.tag;
   }

}

