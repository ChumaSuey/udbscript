`#version 5`;
`#author taviow`;
`#name Create brightness sine wave over selected sectors`;
`#description Creates brightness sine wave over selected sectors according to value range and interval provided.`;
`#scriptoptions
interval
{
	description = "Interval";
	default = 16;
	type = 0;
}
min
{
	description = "Minimum";
	default = 80;
	type = 0;
}
max
{
	description = "Maximum";
	default = 192;
	type = 0;
}
`;
let sectors = UDB.Map.getSelectedSectors();

if (sectors.length === 0) {
   UDB.die('You need to select at least one sector.');
}

let iteration = 0;
let multiplier = 1;
let currentValue = UDB.ScriptOptions.min
for (let sector of sectors) {
	iteration = iteration + multiplier;
	currentValue = UDB.ScriptOptions.min + iteration*UDB.ScriptOptions.interval;	
	sector.brightness = currentValue;	
	if (currentValue >= UDB.ScriptOptions.max || currentValue <= UDB.ScriptOptions.min){
		multiplier *= -1;		
	}
}