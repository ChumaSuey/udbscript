`#version 5`;
`#author taviow`;
`#name Tag +1 for every N lines/sectors`;
`#description Increment tag by 1 for every N sectors or lines selected.`;
`#scriptoptions

interval
{
    description = "Increment interval";
    default = 1;
    type = 0; //Integer
}

start
{
    description = "Starting tag (0 for new tags)";
    default = 0;
    type = 0; //Integer
}

action
{
    description = "Line action (0 for unchanged)";
    default = 0;
    type = 0; //Integer
}
`;
let sectors = UDB.Map.getSelectedSectors();
let lines = UDB.Map.getSelectedLinedefs();
let tag = 0;
if (sectors.length === 0 && lines.length === 0) {
   UDB.die('You need to select at least one sector or linedef.');
}

if (UDB.ScriptOptions.start === 0){
   tag = UDB.Map.getNewTag();
} else {
   tag = UDB.ScriptOptions.start;
}

let i = -1;
const elements = sectors.length > 0 ? sectors : lines;

elements.forEach(e => {
   i++;
   if (i>=UDB.ScriptOptions.interval){
      if (UDB.ScriptOptions.start === 0){
         tag = UDB.Map.getNewTag();
      } else {
         tag++;
      }      
      if (UDB.ScriptOptions.action != 0){
         e.action = UDB.ScriptOptions.action;
      }
      i = 0;
   }
   e.tag = tag;
})


