`#version 4`;
`#name Apply action and tags to selected lines`;
`#author taviow`;
`#description For each selected line, applies a given action and tag. Number of selected lines must be equal to number of tags provided.`;
`#scriptoptions
action
{
    description = "Action";    
    default = "0";
    type = 2; // String
}
tags
{
    description = "Tags (separated by ';')";    
    default = "0";
    type = 2; // String
}
}`;
 
const lines = UDB.Map.getSelectedLinedefs();

if(lines.length === 0){
   UDB.die('You need to select at least one sector.');
}

let tags = UDB.ScriptOptions.tags.split(";");
if(lines.length != tags.length){
   UDB.die('Number of selected lines must be equal to number of tags provided.');
}

let index = 0;
for(const line of lines){   
   line.action = UDB.ScriptOptions.action;
   line.tag = tags[index];
   index++;
}
