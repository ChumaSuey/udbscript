`#version 5`;
`#author taviow`; 
`#name Add middle texture based on keyword`;

`#description For each line in the selected sectors, checks if upper or lower texture contains a given keyword, and if so, applies midtex to front and back.`;

`#scriptoptions

texture
{
    description = "Texture";
    type = 6;    
}

keyword
{
    description = "Keyword";    
    default = "ROCK";
    type = 2; // String
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

let linedefs = UDB.Map.getSelectedLinedefs();

function applyMidtex(sidedef){
   sidedef.middleTexture = UDB.ScriptOptions.texture;
   sidedef.other.middleTexture = UDB.ScriptOptions.texture;
   sidedef.offsetY = 0;
   sidedef.other.offsetY = 0;
}

if (linedefs.length === 0) {
   UDB.die('You need to select at least one line.');
}

let texture;
for (let line of linedefs){
   if (line.back === null){
      continue;
   }

   let front = line.front;
   let back = line.back;
   
   if (UDB.ScriptOptions.mode === 0){
      if (front.sector.ceilingTexture === "FWATER1" && back.sector.ceilingTexture === "FWATER1"){
         continue;
      }
      front.line.flags['16'] = true;
      frontTexture = front.lowerTexture;
      backTexture = back.lowerTexture;
   } else {
      if (front.sector.ceilingTexture === "F_SKY1" && back.sector.ceilingTexture === "F_SKY1"){
         continue;
      }
      front.line.flags['16'] = false;
      frontTexture = front.upperTexture;
      backTexture = back.upperTexture

   }   
   
   if (front.middleTexture === "-" || back.middleTexture === "-"){
      if (frontTexture.toLowerCase().includes(UDB.ScriptOptions.keyword.toLowerCase())
       || backTexture.toLowerCase().includes(UDB.ScriptOptions.keyword.toLowerCase())){
         
         applyMidtex(front);
      }
   }   
}
