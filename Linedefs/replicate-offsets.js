`#version 4`;

`#name Replicate offsets`;

`#author taviow`;

`#description For each selected line, copy the values from the front Y offsets into the line's back, or vice-versa.`;

`#scriptoptions

mode
{
    description = "Mode";
    default = 0;
    type = 11;
    enumvalues {
        0 = "Front -> back";
        1 = "Back -> front";        
}`;
 
const linedefs = UDB.Map.getSelectedLinedefs();

if(linedefs.length === 0){
   UDB.die('You need to select at least one line.');
}

for(const line of linedefs){
   if (line.back === null){
      continue;
   }

   if (UDB.ScriptOptions.mode === 0){
      line.back.offsetY = line.front.offsetY
   } else {
      line.front.offsetY = line.back.offsetY
   }
   

}

