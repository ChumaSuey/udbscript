`#version 5`;
`#author taviow`;
`#name Round sector property to nearest multiple of N`;
`#description For each selected sector, round selected property to nearest multiple of N.`;
`#scriptoptions
property
{
	description = "Sector property";
	default = 0;
	type = 11; // Enum
	enumvalues {
		0 = "Ceiling height";
		1 = "Floor height";
		2 = "Brightness";		
	}
}

value
{
	description = "Value";
	default = 16;
	type = 0;
}
`;
let sectors = UDB.Map.getSelectedSectors();

if (sectors.length === 0) {
   UDB.die('You need to select at least one sector.');
}

for (let sector of sectors) {      
   switch(UDB.ScriptOptions.property){
	case 0: //Ceiling height          
		sector.ceilingHeight = Math.round(sector.ceilingHeight / UDB.ScriptOptions.value) * UDB.ScriptOptions.value;
		break;
	case 1: //Floor height          
		sector.floorHeight = Math.round(sector.floorHeight / UDB.ScriptOptions.value) * UDB.ScriptOptions.value;
		break;
	case 2: //Brightness         
		sector.brightness = Math.round(sector.brightness / UDB.ScriptOptions.value) * UDB.ScriptOptions.value;
		break;
	default:
		UDB.die();
}
}