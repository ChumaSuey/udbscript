// I need to turn this into a more elaborate script where you can select all sectors with floor or ceiling values higher/lower/different than a given number.
// I find the UDB search function a bit lacking, in how you can't search for not equal, or for higher than and lower than. That's why I wrote this script.

`#version 5`;

`#name Select all sectors higher than`;

`#description For each selected sector, keeps selection of those whose floor is higher than a user specified value.`;

`#scriptoptions

height
{
    description = "Floor height";
    default = 0;
    type = 0;
}`;

let sectors = UDB.Map.getSelectedSectors();

if (sectors.length === 0) {
   UDB.die('You need to select at least one sector.');
}

for (let sector of sectors) {   
   if (sector.floorHeight < UDB.ScriptOptions.height){
      sector.selected = false;
   }	  
}

