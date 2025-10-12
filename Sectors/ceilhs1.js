`#version 4`;

`#name Copy property from 1st sector`;

`#description Set property of all selected sectors to that of the 1st sector in selection.`;

`#scriptoptions

propname {
	description = "Property name (in UDBScript)";
	type = 2;
	default = "ceilingHeight";
`;

var propname = UDB.ScriptOptions.propname;

var sectors = UDB.Map.getSelectedSectors();

var propval = sectors[0][propname];

if(sectors.length < 2)
    UDB.die('You have to select at least 2 sectors');


for (var i = 1; i < sectors.length; i++) {
	sectors[i][propname] = propval;
}