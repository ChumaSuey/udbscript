`#version 4`;
`#name Select/unselect 0-offset sidedefs`;
`#author taviow`;
`#description From the current line selection, keep a selection based on its x or y offsets.`;
`#scriptoptions

side
{
    description = "Side";
    default = 0;
    type = 11;
    enumvalues {
        0 = "Front";
        1 = "Back";
    }
}

condition
{
    description = "Condition";
    default = 0;
    type = 11;
    enumvalues {
        0 = "Equals zero";
        1 = "Not equals zero";
    }   
}

dimension
{
    description = "Dimension";
    default = 0;
    type = 11;
    enumvalues {
        0 = "x";
        1 = "y";
    }       
}
`;
const linedefs = UDB.Map.getSelectedLinedefs();

if(linedefs.length === 0){
   UDB.die('You need to select at least one line.');
}

for(const line of linedefs){
   let sidedef = UDB.ScriptOptions.side === 0 ? line.front : line.back;
   let offset = UDB.ScriptOptions.dimension === 0 ? sidedef.offsetX : sidedef.offsetY;
   
   if (UDB.ScriptOptions.condition === 0){
      if (offset === 0){
         line.selected = true;
      } else {
         line.selected = false;
      }
   } else {
      if (offset === 0){
         line.selected = false;
      } else {
         line.selected = true;
      }
   }
}

