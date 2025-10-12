`#version 4`;

`#name Random sector brightness (real)`;

`#description Set random brightness.`;

`#scriptoptions

hmin	{type = 0; default = 0; description = "[min";}
hmax	{type = 0; default = 80; description = "max]";}
hadd	{type = 3; default = false; description = "Additive (true) or set (false)";}
`;

var hmin	= UDB.ScriptOptions.hmin;
var hmax	= UDB.ScriptOptions.hmax;
var hadd	= UDB.ScriptOptions.hadd;

let sectors = UDB.Map.getSelectedSectors();

if(sectors.length < 1)
    UDB.die('You have to select at least a sector');


for (var i = 0; i < sectors.length; i++) {
	var rand1 = hmin + Math.round(Math.random() * (hmax-hmin));

	if (hadd)
		sectors[i].brightness += rand1;
	else
		sectors[i].brightness = rand1;
}