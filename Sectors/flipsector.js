`#version 4`;

`#name Vertical flip`;

`#description Flips sectors upside down and flips sidedefs upside down (doesn't touch offset).`;

`#scriptoptions

height {
	description = "Flip heights (*-1) of floor and ceiling";
	type = 3;
	default = true;
}
flat {
	description = "Flip flats";
	type = 3;
	default = true;
}
uplow {
	description = "Flip upper and lower textures";
	type = 3;
	default = true;
}
`;
var so = UDB.ScriptOptions;
var sectors = UDB.Map.getSelectedSectors();
var sides	= UDB.Map.getSidedefsFromSelectedLinedefs();

var fsects_count = 0, fsides_count = 0;

// :Clueless: :xddx:
if (so.height) {
	for (var i = 0; i < sectors.length; i++) {
		var t = sectors[i].floorHeight;
		sectors[i].floorHeight = -sectors[i].ceilingHeight;
		sectors[i].ceilingHeight = -t;
		fsects_count++;
	}
}

if (so.flat) for (var i = 0; i < sectors.length; i++) {
	var t = sectors[i].floorTexture;
	sectors[i].floorTexture = sectors[i].ceilingTexture;
	sectors[i].ceilingTexture = t;
	fsects_count++;
}

if (so.uplow) for (var i = 0; i < sides.length; i++) {
	var t = sides[i].lowerTexture;
	sides[i].lowerTexture = sides[i].upperTexture;
	sides[i].upperTexture = t;
	fsides_count++;
}

UDB.exit(`Flipped ${fsects_count / (so.heights && so.flat ? 2 : 1)} sectors and ${fsides_count} upper/lower textures pairs.`);