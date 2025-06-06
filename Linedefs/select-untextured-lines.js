`#version 4`;
`#name Select untextured lines`;
`#author taviow`;
`#description From the current line selection, maintain selection of untextured lines only.`;
 
const linedefs = UDB.Map.getSelectedLinedefs();

if(linedefs.length === 0){
   UDB.die('You need to select at least one line.');
}

for(const line of linedefs){   

   if (line.back === null){
      line.selected = false;
      continue;
   }
   if (!(line.Front.lowerTexture === "-" 
      && line.Front.middleTexture === "-" 
      && line.Front.upperTexture === "-" 
      && line.Back.lowerTexture === "-" 
      && line.Back.middleTexture === "-" 
      && line.Back.upperTexture === "-"
      && line.Front.Sector.ceilingHeight === line.Back.Sector.ceilingHeight 
      && line.Front.Sector.floorHeight === line.Back.Sector.floorHeight)){ //Keep only textureless lines where front and back sectors are the same
      
         line.selected = false;
   }
}

