`#version 5`;
`#author taviow`;
`#name Remove lines with middle textures`;

`#description For each selected sector, checks for lines without an upper AND lower texture. Removes those lines.`;

let sectors = UDB.Map.getSelectedSectors();

if (sectors.length === 0) {
   UDB.die('You need to select at least one sector.');
}

const toBeDeleted = new Set();
for (let sector of sectors) {   
   let sidedefs = sector.getSidedefs();   
   
   for (let sidedef of sidedefs){            
      if (sidedef.middleTexture !== "-" && sidedef.lowerTexture === "-" && sidedef.upperTexture === "-" && sidedef.other != null){         
         if (sidedef.sector === sidedef.other.sector){
            toBeDeleted.add(sidedef.line);
         }
      }      
   }
}


for (let line of toBeDeleted){
   line.delete();
}

