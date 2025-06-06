// I find the UDB search function a bit lacking, in how you can't search for NOT equal. That's why I wrote this script.

`#version 5`;

`#name Filter sectors by tag`;

`#author taviow`;

`#description Keep a selection of sectors depending on a filtering option.`;

`#scriptoptions

tag
{
    description = "Sector tag";
    default = 0;
    type = 0;    
}

type
{
    description = "Filter type";
    default = 1;
    type = 11;   
    enumvalues {
      0 = "Equals";
      1 = "Does not equal";
    }
}
}`;
 
const sectors = UDB.Map.getSelectedSectors();

if(sectors.length === 0){
   UDB.die('You need to select at least one line.');
}

sectors.forEach(s => {   
   if (UDB.ScriptOptions.type === 0){
      if (s.tag === UDB.ScriptOptions.tag){
         s.selected = true;
      } else {
         s.selected = false;
      }
   } else {
      if (s.tag === UDB.ScriptOptions.tag){
         s.selected = false;
      } else {
         s.selected = true;
      }
   }
})
