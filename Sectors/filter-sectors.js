// You can use this one to select everything that does not equal F_SKY1, for example.

`#version 5`;

`#name Filter sectors`;

`#author taviow`;

`#description Keep a selection of sectors depending on a filtering option.`;

`#scriptoptions

surface
{
    description = "Surface type";
    default = 0;
    type = 11;
    enumvalues {
      0 = "Floor";
      1 = "Ceiling";
    }
}

expression
{
    description = "Filter expression";       
    default = "F_SKY";
    type = 2;
}

type
{
    description = "Filter type";
    default = 1;
    type = 11;   
    enumvalues {
      0 = "Contains";
      1 = "Does not contain";
    }
}
 
}`;
 
const sectors = UDB.Map.getSelectedSectors();

if(sectors.length === 0){
   UDB.die('You need to select at least one line.');
}

let flat;
sectors.forEach(s => {
   if (UDB.ScriptOptions.surface === 0){
      flat = s.floorTexture;
   } else {
      flat = s.ceilingTexture;
   }
   
   if (UDB.ScriptOptions.type === 0){
      if (flat.toLowerCase().includes(UDB.ScriptOptions.expression.toLowerCase())){
         s.selected = true;
      } else {
         s.selected = false;
      }
   } else {
      if (flat.toLowerCase().includes(UDB.ScriptOptions.expression.toLowerCase())){
         s.selected = false;
      } else {
         s.selected = true;
      }
   }
})
