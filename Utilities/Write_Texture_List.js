`#version 4`;
`#name Generate texture list`;
`#description Generates a texture list for several different formats.
To use TERRAIN, assign user_footstep with the splash name
To use STEPDEF, assign user_footstep with the step sound nicename.`;
`#scriptoptions
exportFormat
{
	description = "Log format";
	default = 0;
	type = 11;
	enumvalues {
		0 = "Raw";
		1 = "CSV";
		2 = "TERRAIN";
		3 = "STEPDEF";
	}
}
`;

//////////////////////////////////////////////////////////////////////////////////
// INIT

var stepPairs = {};

const sectors = UDB.Map.getSectors();
const lines = UDB.Map.getLinedefs();

if(sectors.length == 0)
	UDB.die('A map needs to exist.');

const WallTextures = [];
const FloorTextures = [];
const CeilingTextures = [];

const sLines = lines.filter(l => l.action == 160);
const sSecs = [];
sLines.forEach(l => { if(l.front) { 
	sSecs.push(l.front.sector);
}});

sectors.forEach(s => s.getSidedefs().forEach(sd => {
	if(sd.lowerTexture != "-") { if(WallTextures.indexOf(sd.lowerTexture) === -1) { WallTextures.push(sd.lowerTexture);  }};
	if(sd.middleTexture != "-") { if(WallTextures.indexOf(sd.middleTexture) === -1) { WallTextures.push(sd.middleTexture);  }};
	if(sd.upperTexture != "-") { if(WallTextures.indexOf(sd.upperTexture) === -1) { WallTextures.push(sd.upperTexture);  }};
}));

sectors.forEach(s => {
	if(sSecs.indexOf(s) == -1) {
		if(FloorTextures.indexOf(s.floorTexture) === -1) { FloorTextures.push(s.floorTexture);  };
		if(CeilingTextures.indexOf(s.ceilingTexture) === -1) { CeilingTextures.push(s.ceilingTexture);  };
		if(UDB.ScriptOptions.exportFormat == 3) {
			if(s.fields['user_footstep'] != null)	{ 
				if(stepPairs[s.fields['user_footstep']] != null) { stepPairs[s.fields['user_footstep']] = stepPairs[s.fields['user_footstep']] + ":" + s.floorTexture }
				else {  stepPairs[s.fields['user_footstep']] = s.floorTexture };
			};
		};
		if(UDB.ScriptOptions.exportFormat == 2)
		{
			if(s.fields['user_footstep'] != null)	{ 
				stepPairs[s.fields['user_footstep']] = s.floorTexture;
			};
		};
	}
	else
	{
		if(FloorTextures.indexOf(s.ceilingTexture) === -1) { FloorTextures.push(s.ceilingTexture);  };
		if(CeilingTextures.indexOf(s.floorTexture) === -1) { CeilingTextures.push(s.floorTexture);  };
		if(UDB.ScriptOptions.exportFormat == 3) {
			if(s.fields['user_footstep'] != null)	{
				if(stepPairs[s.fields['user_footstep']] != null) { stepPairs[s.fields['user_footstep']] = stepPairs[s.fields['user_footstep']] + ":" + s.ceilingTexture }
				else {  stepPairs[s.fields['user_footstep']] = s.ceilingTexture };
			};
		};
	};
	
});

//////////////////////////////////////////////////////////////////////////////////
// EXPORTING

//// Raw
if(UDB.ScriptOptions.exportFormat == 0) {
	UDB.log("Wall textures");
	WallTextures.forEach(wt => UDB.log(wt));
	UDB.log("-----------------------------------------------------");
	UDB.log("\nCeiling textures");
	CeilingTextures.forEach(ct => UDB.log(ct));
	UDB.log("-----------------------------------------------------");
	UDB.log("\nFloor textures");
	FloorTextures.forEach(ft => UDB.log(ft));
UDB.log("-----------------------------------------------------");
};

//// CSV
if(UDB.ScriptOptions.exportFormat == 1) {
	var outStr = "Walls";
	WallTextures.forEach(wt => {outStr = outStr + "," + wt;});
	UDB.log(outStr);
	outStr = "Ceilings";
	CeilingTextures.forEach(ct => {outStr = outStr + "," + ct;});
	UDB.log(outStr);
	outStr = "Floors";
	FloorTextures.forEach(ft => {outStr = outStr + "," + ft;});
	UDB.log(outStr);
}

//// TERRAIN
if(UDB.ScriptOptions.exportFormat == 2) {
	for (const [key, value] of Object.entries(stepPairs)) {
		UDB.log("floor " + value + " " + key);
	};
};


//// STEPDEF
if(UDB.ScriptOptions.exportFormat == 3) {
	for (const [key, value] of Object.entries(stepPairs)) {
		UDB.log(value + " = " + key);
	};
};

