`#version 4`;

`#name Properties-based joining`;

`#description Joins sectors with the same height in all selected sectors.`;

`#scriptoptions

uflorf	{type = 3; default = true; description = "Floor flat";}
uceilf	{type = 3; default = true; description = "Celing flat";}
uflorh	{type = 3; default = true; description = "Floor height";}
uceilh	{type = 3; default = true; description = "Ceiling height";}
ubrite	{type = 3; default = true; description = "Light level";}
utag	{type = 3; default = true; description = "Tag";}
ueff	{type = 3; default = true; description = "Effect";}
`;

let sectors = UDB.Map.getSelectedSectors();
var 
uflorf = UDB.ScriptOptions.uflorf,
uceilf = UDB.ScriptOptions.uceilf,
uflorh = UDB.ScriptOptions.uflorh,
uceilh = UDB.ScriptOptions.uceilh,
ubrite = UDB.ScriptOptions.ubrite,
utag = UDB.ScriptOptions.utag,
ueff = UDB.ScriptOptions.ueff;

if(sectors.length < 2)
    UDB.die('You have to select at least 2 sectors');
if (!(
uflorf ||
uceilf ||
uflorh ||
uceilh ||
ubrite ||
utag   ||
ueff
	)) UDB.die('You have to select at least 1 properties.');


function toTag(sector) {
	var t = "";
	var sep = ",";
	if (uflorf) t += sector.floorTexture + sep;
	if (uceilf) t += sector.ceilingTexture + sep;
	if (uflorh) t += sector.floorHeight + sep;
	if (uceilh) t += sector.ceilingHeight + sep;
	if (ubrite) t += sector.brightness + sep;
	if (utag  ) t += sector.tag + sep;
	if (ueff  ) t += sector.special;
	return t;
}

var merge_profile = {};

for (var i = 0; i < sectors.length; i++) {
	var tag = toTag(sectors[i]);
	
	if (!merge_profile[tag]) {
		merge_profile[tag] = [sectors[i]];
	} else {
		merge_profile[tag].push( sectors[i] );
	}
}

var log = "";
for (var tag in merge_profile) {
	//UDB.showMessage(log);
	var mergelist = merge_profile[tag];
	//UDB.showMessage(Object.keys(mergelist).toString());
	for (var i = 1; i < mergelist.length; i++) {
		mergelist[i].join(mergelist[0]);
	}
	log += `tagging ${tag}: Merged ${merge_profile[tag].length} sectors.\n`;
}

UDB.showMessage(log);