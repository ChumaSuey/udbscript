`#version 4`;

`#name Filter by height`;

`#description Filter selected sectors by height of floors, ceilings, and ceiling - floor.`;

`#scriptoptions

fmin	{type = 0; default = -66000  ; description = "[min floor";}
fmax	{type = 0; default = -1000; description = "max floor]";}
cmin	{type = 0; default = -66000  ; description = "[min ceil";}
cmax	{type = 0; default = 66000; description = "max ceil]";}
hmin	{type = 0; default = -66000  ; description = "[min height diff";}
hmax	{type = 0; default = 66000; description = "max height diff]";}

`;

var fmin	= UDB.ScriptOptions.fmin;
var fmax	= UDB.ScriptOptions.fmax;
var hmin	= UDB.ScriptOptions.hmin;
var hmax	= UDB.ScriptOptions.hmax;
var cmin	= UDB.ScriptOptions.cmin;
var cmax	= UDB.ScriptOptions.cmax;

let sectors = UDB.Map.getSelectedSectors();

if(sectors.length < 1)
    UDB.die('You have to select at least a sector');


for (var i = 0; i < sectors.length; i++) {
	const sect = sectors[i];
	const height = sect.ceilingHeight - sect.floorHeight;
	if (!(
		fmin <= sect.floorHeight && sect.floorHeight <= fmax &&
		cmin <= sect.ceilingHeight && sect.ceilingHeight <= cmax &&
		hmin <= height && height <= hmax
	)) {
		sect.selected = false;
	}
}