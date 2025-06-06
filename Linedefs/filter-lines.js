// I find the UDB search function a bit lacking, in how you can't search for not equal, or for higher than and lower than. That's why I wrote this script.

`#version 4`;

`#name Filter lines by length`;

`#author taviow`;

`#description Keep a selection of lines depending on a filtering option.`;

`#scriptoptions

length
{
    description = "Line length";
    default = 16;
    type = 0;    
}

filter
{
    description = "Filter type";
    default = 0;
    type = 11;
    enumvalues {
        0 = "<";
        1 = ">";
        2 = "===";        
}

doublesided
{
    description = "Only double sided";
    default = "False";
    type = 3; // Boolean
}`;
 
const linedefs = UDB.Map.getSelectedLinedefs();

if(linedefs.length === 0){
   UDB.die('You need to select at least one line.');
}

for(const line of linedefs){
   if (UDB.ScriptOptions.doublesided){
      if (line.back === null){
         continue;
      }
   }
   
   switch(UDB.ScriptOptions.filter){
      case 0:
         if (line.length < UDB.ScriptOptions.length){
            continue;
         } else {
            line.selected = false;
         }
      case 1:
         if (line.length > UDB.ScriptOptions.length){
            continue;
         } else {
            line.selected = false;
         }
      case 2:
         if (line.length === UDB.ScriptOptions.length){
            continue;
         } else {
            line.selected = false;
         }
   } 
   
}

