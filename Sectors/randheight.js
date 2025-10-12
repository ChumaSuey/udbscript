`#version 4`;

`#name Random sector heights (real)`;

`#description Set random heights. Additive adds the random value into existing height.`;

`#scriptoptions

hmin	{type = 0; default = -128; description = "[Random min";}
hmax	{type = 0; default = 128; description = "Random max]";}
hadd	{type = 3; default = true; description = "Additive or set";}

targ
{
    description = "Target";
    default = 0;
    type = 11; // Enum
    enumvalues {
        0 = "Floor";
        1 = "Ceil";
    }
}

preserv	{type = 3; default = true; description = "Preserve height difference";}
`;

var hmin	= UDB.ScriptOptions.hmin;
var hmax	= UDB.ScriptOptions.hmax;
var hadd	= UDB.ScriptOptions.hadd;
var targ	= UDB.ScriptOptions.targ;
var preserv	= UDB.ScriptOptions.preserv;

let sectors = UDB.Map.getSelectedSectors();

if(sectors.length < 1)
    UDB.die('You have to select at least a sector');


for (var i = 0; i < sectors.length; i++) {
	var rand1 = hmin + Math.round(Math.random() * (hmax-hmin)); // round so ppl dont have to deal with the upto but not including thing
	var oldh = sectors[i].ceilingHeight - sectors[i].floorHeight;
	//UDB.showMessage(oldh);

	//var rand2
	if (targ == 0) {
		if (hadd)
			sectors[i].floorHeight += rand1;
		else
			sectors[i].floorHeight = rand1;

		if (preserv)
			sectors[i].ceilingHeight = sectors[i].floorHeight + oldh;
	} else {
		if (hadd)
			sectors[i].ceilingHeight += rand1;
		else
			sectors[i].ceilingHeight = rand1;

		if (preserv)
			sectors[i].floorHeight = sectors[i].ceilingHeight - oldh;

	}
}