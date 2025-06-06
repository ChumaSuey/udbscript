`#version 5`;
`#name Add middle texture to untextured lines`;
`#author taviow`;
`#description For each line in the selected sectors, checks if the line has no textures and then applies a given midtexture to it.`;
`#scriptoptions
texture
{
    description = "Texture";
    type = 6;    
}

borders
{
   description = "Include sector borders";
   type = 3;
   default = false;
}

mode
{
    description = "Ground or ceiling";
    default = 0;
    type = 11; // Enum
    enumvalues {
        0 = "Ground";
        1 = "Ceiling";        
}

}`;

let linedefs = UDB.Map.getSelectedLinedefs().filter(l => l.back != null);

if (linedefs.length === 0) {
   UDB.die('You need to select at least one line.');
}

if (!UDB.ScriptOptions.borders){
   linedefs = linedefs.filter(l => l.front.sector.index === l.back.sector.index);
}

for (line of linedefs){   
   if ((line.front.middleTexture === "-" && line.front.lowerTexture === "-" && line.front.upperTexture === "-")
      && (line.back.middleTexture === "-" && line.back.lowerTexture === "-" && line.back.upperTexture === "-")){
      
      sidedef = line.front;
      sidedef.middleTexture = UDB.ScriptOptions.texture;
      sidedef.other.middleTexture = UDB.ScriptOptions.texture;

      if (UDB.ScriptOptions.mode === 0){
         sidedef.line.flags['16'] = true;
      } else {
         sidedef.line.flags['16'] = false;
      }
   }
}